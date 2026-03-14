import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';
import { Database, Activity, Settings, RefreshCw, CheckCircle2, XCircle, Play, Server, Webhook } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const integrations = [
  {
    id: 'splunk',
    name: 'Splunk Enterprise (HEC)',
    icon: Server,
    status: 'CONNECTED',
    lastPush: 'Just now',
    eventsToday: '12,492',
    color: 'var(--color-accent-green)',
    endpoint: 'https://splunk.internal:8088/services/collector'
  },
  {
    id: 'elastic',
    name: 'Elasticsearch (ECS)',
    icon: Database,
    status: 'CONNECTED',
    lastPush: '2 mins ago',
    eventsToday: '12,492',
    color: 'var(--color-accent-green)',
    endpoint: 'https://es-cluster.internal:9200/phishguard-events/_doc'
  },
  {
    id: 'webhook',
    name: 'Generic Webhook',
    icon: Webhook,
    status: 'FAILED',
    lastPush: '1 hour ago',
    eventsToday: '1,024',
    color: 'var(--color-accent-red)',
    endpoint: 'https://soar.internal/api/webhook/phishguard'
  }
];

const initialEventStream = [
  { id: 'EVT-9942', time: '10:42:15', type: 'DETECTION', payload: '{"id":"DET-9942","type":"URL","target":"paypal-secure-login.tk","confidence":98,"action":"BLOCKED"}' },
  { id: 'EVT-9941', time: '10:41:05', type: 'REMEDIATION', payload: '{"id":"REM-4092","detection_id":"DET-9941","action":"QUARANTINE_EMAIL","status":"COMPLETED"}' },
  { id: 'EVT-9940', time: '10:41:02', type: 'DETECTION', payload: '{"id":"DET-9941","type":"EMAIL","target":"Account Verification Required","confidence":92,"action":"QUARANTINED"}' },
  { id: 'EVT-9939', time: '10:38:45', type: 'DETECTION', payload: '{"id":"DET-9940","type":"SMS","target":"USPS: Package delivery failed...","confidence":85,"action":"BLOCKED"}' },
  { id: 'EVT-9938', time: '10:35:14', type: 'REMEDIATION', payload: '{"id":"REM-4091","detection_id":"DET-9939","action":"BLOCK_URL","status":"COMPLETED"}' },
  { id: 'EVT-9937', time: '10:35:12', type: 'DETECTION', payload: '{"id":"DET-9939","type":"URL","target":"netflix-update-billing.com","confidence":99,"action":"BLOCKED"}' },
];

const retryQueue = [
  { id: 'EVT-9801', provider: 'Generic Webhook', time: '09:15:22', retries: 3, nextRetry: 'In 5 mins' },
  { id: 'EVT-9800', provider: 'Generic Webhook', time: '09:15:20', retries: 3, nextRetry: 'In 5 mins' },
  { id: 'EVT-9799', provider: 'Generic Webhook', time: '09:15:18', retries: 3, nextRetry: 'In 5 mins' },
];

export default function SiemHub() {
  const [integrationsState, setIntegrationsState] = useState(integrations);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [eventStream, setEventStream] = useState(initialEventStream);
  const [toast, setToast] = useState<string | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/siem/configs`);
        const data = await res.json();
        if (data.configs && data.configs.length > 0) {
          setIntegrationsState(prev => prev.map(int => {
            const config = data.configs.find((c: any) => c.type === int.id);
            if (config) {
              return { ...int, endpoint: config.endpoint, status: config.enabled ? 'CONNECTED' : 'DISABLED' };
            }
            return int;
          }));
        }
      } catch (e) {
        console.error('Failed to fetch SIEM configs', e);
      }
    };
    fetchConfigs();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewThreat = (threat: any) => {
      setEventStream(prev => [{
        id: `EVT-${Math.floor(Math.random() * 10000)}`,
        time: new Date().toLocaleTimeString(),
        type: 'DETECTION',
        payload: JSON.stringify(threat)
      }, ...prev].slice(0, 20));
    };

    const handleRemediation = (data: any) => {
      setEventStream(prev => [{
        id: `EVT-${Math.floor(Math.random() * 10000)}`,
        time: new Date().toLocaleTimeString(),
        type: 'REMEDIATION',
        payload: JSON.stringify(data)
      }, ...prev].slice(0, 20));
    };

    socket.on('threat.detected', handleNewThreat);
    socket.on('threat.remediated', handleRemediation);

    return () => {
      socket.off('threat.detected', handleNewThreat);
      socket.off('threat.remediated', handleRemediation);
    };
  }, [socket]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const endpoint = (form.elements.namedItem('endpoint') as HTMLInputElement).value;
    const token = (form.elements.namedItem('token') as HTMLInputElement).value;
    const enabled = (form.elements.namedItem('enable') as HTMLInputElement).checked;

    try {
      const response = await fetch(`${API_BASE}/api/v1/siem/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedConfig, endpoint, token, enabled })
      });
      
      if (response.ok) {
        setIntegrationsState(prev => prev.map(int => 
          int.id === selectedConfig ? { ...int, endpoint, status: enabled ? 'CONNECTED' : 'DISABLED' } : int
        ));
        setToast(`Configuration for ${selectedConfig} saved successfully.`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {
      console.error('Failed to save SIEM config', e);
    }
    setSelectedConfig(null);
  };

  const handleTest = (id: string) => {
    setToast(`Test payload sent to ${id}.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-6 relative">
      {toast && (
        <div className="absolute top-0 right-0 bg-[var(--color-accent-green)] text-white px-4 py-2 rounded-sm text-[12px] font-bold z-50 animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}
      
      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrationsState.map((integration) => (
          <div key={integration.id} className="enterprise-card p-6 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <integration.icon className="w-24 h-24 text-white" />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center">
                  <integration.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white tracking-tight">{integration.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: integration.color }} />
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: integration.color }}>
                      {integration.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 relative z-10">
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Endpoint</p>
                <p className="text-[11px] text-[var(--color-text-secondary)] mono-data truncate" title={integration.endpoint}>
                  {integration.endpoint}
                </p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Events Today</p>
                  <p className="text-[16px] font-bold text-white mono-data">{integration.eventsToday}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Last Push</p>
                  <p className="text-[12px] text-[var(--color-text-secondary)] mono-data mt-1.5">{integration.lastPush}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-auto relative z-10">
              <button 
                onClick={() => setSelectedConfig(integration.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-subtle)] text-white px-3 py-2 rounded-sm text-[11px] font-bold tracking-wide transition-colors border border-[var(--color-border-subtle)]"
              >
                <Settings className="w-3.5 h-3.5" />
                CONFIGURE
              </button>
              <button 
                onClick={() => handleTest(integration.id)}
                className="flex items-center justify-center gap-2 bg-[var(--color-accent-primary)]/10 hover:bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] px-3 py-2 rounded-sm text-[11px] font-bold tracking-wide transition-colors border border-[var(--color-accent-primary)]/30"
              >
                <Play className="w-3.5 h-3.5" />
                TEST
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-340px)] min-h-[400px]">
        {/* Event Stream Preview */}
        <div className="lg:col-span-2 enterprise-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-accent-primary)]" />
              Live Event Stream Preview
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
              <span className="text-[10px] font-bold text-[var(--color-accent-green)] uppercase tracking-widest">Streaming</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#03060a] p-4 font-mono text-[11px] leading-relaxed">
            {eventStream.map((evt, i) => (
              <div key={i} className="mb-3 border-b border-[var(--color-border-subtle)]/30 pb-3 last:border-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[var(--color-text-muted)]">{evt.time}</span>
                  <span className={`font-bold ${evt.type === 'DETECTION' ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-accent-orange)]'}`}>
                    [{evt.type}]
                  </span>
                  <span className="text-[var(--color-accent-primary)]">{evt.id}</span>
                </div>
                <div className="text-[var(--color-text-secondary)] pl-16 break-all">
                  {evt.payload}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retry Queue */}
        <div className="lg:col-span-1 enterprise-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--color-accent-orange)]" />
              Failed Push Retry Queue
            </h2>
            <span className="bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)] px-2 py-0.5 rounded-sm text-[10px] font-bold">
              {retryQueue.length} PENDING
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {retryQueue.map((item, i) => (
              <div key={i} className="p-3 mb-2 bg-[var(--color-bg-secondary)] border-l-2 border-[var(--color-accent-orange)] rounded-r-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-white mono-data">{item.id}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{item.time}</span>
                </div>
                <p className="text-[12px] text-[var(--color-text-secondary)] mb-2">Destination: <span className="text-white">{item.provider}</span></p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-[var(--color-bg-elevated)] text-[var(--color-accent-orange)] px-1.5 py-0.5 rounded-sm">
                    Retry {item.retries}/5
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{item.nextRetry}</span>
                </div>
              </div>
            ))}
            {retryQueue.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-[12px]">Queue is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Config Modal */}
      {selectedConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveConfig} className="enterprise-card w-full max-w-lg bg-[var(--color-bg-primary)] flex flex-col overflow-hidden border-[var(--color-border-active)]">
            <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-4 h-4 text-[var(--color-accent-primary)]" />
                Configure Integration
              </h2>
              <button type="button" onClick={() => setSelectedConfig(null)} className="text-[var(--color-text-muted)] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">Endpoint URL</label>
                <input 
                  type="text" 
                  name="endpoint"
                  className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-sm px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[var(--color-accent-primary)] mono-data"
                  defaultValue={integrationsState.find(i => i.id === selectedConfig)?.endpoint}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">Authentication Token / API Key</label>
                <input 
                  type="password" 
                  name="token"
                  className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-sm px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[var(--color-accent-primary)] mono-data"
                  defaultValue="************************"
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" id="enable" name="enable" className="w-4 h-4 rounded-sm border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]" defaultChecked />
                <label htmlFor="enable" className="text-[13px] text-white">Enable this integration</label>
              </div>
            </div>
            <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setSelectedConfig(null)}
                className="px-4 py-2 rounded-sm text-[12px] font-bold tracking-wide text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] transition-colors"
              >
                CANCEL
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-sm text-[12px] font-bold tracking-wide bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary)]/90 transition-colors"
              >
                SAVE CONFIGURATION
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
