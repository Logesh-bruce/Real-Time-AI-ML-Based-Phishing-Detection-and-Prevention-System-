import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';
import { Network, Mail, Globe, MessageSquare, ArrowRight, ShieldAlert, Database, Clock } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const initialCorrelations = [
  {
    id: 'CORR-8921',
    campaign: 'Fin7 Credential Harvesting',
    score: 98,
    channels: ['EMAIL', 'WEB'],
    iocCount: 14,
    firstSeen: '2026-03-12 08:14:22',
    lastSeen: '2026-03-13 10:42:15',
    status: 'ACTIVE',
  },
  {
    id: 'CORR-8920',
    campaign: 'APT29 Spearphishing',
    score: 94,
    channels: ['EMAIL', 'WEB', 'SMS'],
    iocCount: 28,
    firstSeen: '2026-03-10 14:22:10',
    lastSeen: '2026-03-13 09:15:44',
    status: 'ACTIVE',
  },
  {
    id: 'CORR-8919',
    campaign: 'Generic Crypto Scam',
    score: 75,
    channels: ['SMS', 'WEB'],
    iocCount: 6,
    firstSeen: '2026-03-13 01:05:00',
    lastSeen: '2026-03-13 08:30:12',
    status: 'MONITORING',
  },
];

const selectedDetail = {
  id: 'CORR-8921',
  campaign: 'Fin7 Credential Harvesting',
  description: 'Correlated attack pattern targeting finance department employees with fake invoice lures leading to credential harvesting pages hosted on compromised WordPress sites.',
  score: 98,
  timeline: [
    { time: '2026-03-12 08:14:22', event: 'Initial email payload detected', channel: 'EMAIL', ioc: 'invoice_492.pdf' },
    { time: '2026-03-12 08:15:05', event: 'User clicked link in email', channel: 'WEB', ioc: 'secure-billing-portal.com' },
    { time: '2026-03-12 08:15:10', event: 'Credential harvesting page blocked', channel: 'WEB', ioc: '192.168.1.50' },
    { time: '2026-03-13 10:42:15', event: 'Similar payload detected targeting CEO', channel: 'EMAIL', ioc: 'urgent_wire_transfer.pdf' },
  ],
  iocs: [
    { type: 'DOMAIN', value: 'secure-billing-portal.com', confidence: 99 },
    { type: 'IP', value: '192.168.1.50', confidence: 95 },
    { type: 'FILE_HASH', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', confidence: 100 },
    { type: 'EMAIL_SENDER', value: 'billing@secure-billing-portal.com', confidence: 98 },
  ]
};

export default function CorrelationEngine() {
  const [correlations, setCorrelations] = useState(initialCorrelations);
  const [selectedCorr, setSelectedCorr] = useState(initialCorrelations[0]);
  const { socket } = useSocket();

  useEffect(() => {
    // Fetch initial correlations
    fetch(`${API_BASE}/api/v1/correlation/active`)
      .then(res => res.json())
      .then(data => {
        if (data.correlations && data.correlations.length > 0) {
          // Merge with initial for demo purposes
          setCorrelations(prev => {
            const newIds = new Set(data.correlations.map((c: any) => c.id));
            return [...data.correlations, ...prev.filter(c => !newIds.has(c.id))];
          });
        }
      })
      .catch(err => console.error('Failed to fetch correlations', err));
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewCorrelation = (data: any) => {
      setCorrelations(prev => [data, ...prev].slice(0, 10));
    };

    socket.on('correlation.new', handleNewCorrelation);

    return () => {
      socket.off('correlation.new', handleNewCorrelation);
    };
  }, [socket]);

  const [toast, setToast] = useState<string | null>(null);

  const handlePushToSiem = () => {
    setToast(`Pushed ${selectedCorr.id} to SIEM successfully.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-6 relative">
      {toast && (
        <div className="absolute top-0 right-0 bg-[var(--color-accent-green)] text-white px-4 py-2 rounded-sm text-[12px] font-bold z-50 animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="enterprise-card p-4 flex flex-col justify-between h-[100px]" style={{ borderLeft: '3px solid var(--color-accent-purple)' }}>
          <p className="section-label text-[10px]">ACTIVE CORRELATIONS</p>
          <h3 className="text-2xl font-semibold text-white mono-data">24</h3>
        </div>
        <div className="enterprise-card p-4 flex flex-col justify-between h-[100px]" style={{ borderLeft: '3px solid var(--color-accent-primary)' }}>
          <p className="section-label text-[10px]">AVG CORRELATION SCORE</p>
          <h3 className="text-2xl font-semibold text-white mono-data">86%</h3>
        </div>
        <div className="enterprise-card p-4 flex flex-col justify-between h-[100px]" style={{ borderLeft: '3px solid var(--color-accent-green)' }}>
          <p className="section-label text-[10px]">CHANNELS MONITORED</p>
          <div className="flex gap-2">
            <span className="bg-[var(--color-bg-elevated)] px-2 py-1 rounded-sm text-[10px] font-bold text-[var(--color-text-secondary)]">EMAIL</span>
            <span className="bg-[var(--color-bg-elevated)] px-2 py-1 rounded-sm text-[10px] font-bold text-[var(--color-text-secondary)]">WEB</span>
            <span className="bg-[var(--color-bg-elevated)] px-2 py-1 rounded-sm text-[10px] font-bold text-[var(--color-text-secondary)]">SMS</span>
          </div>
        </div>
        <div className="enterprise-card p-4 flex flex-col justify-between h-[100px] border-dashed border-[var(--color-border-subtle)] bg-transparent">
          <p className="section-label text-[10px] text-[var(--color-text-muted)]">FUTURE INTEGRATION</p>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[var(--color-text-muted)]">Audio / Vishing</span>
            <span className="text-[9px] font-bold bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded-sm">COMING SOON</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Left List */}
        <div className="lg:col-span-1 enterprise-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <Network className="w-4 h-4 text-[var(--color-accent-purple)]" />
              Active Correlations
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {correlations.map((corr) => (
              <div 
                key={corr.id} 
                onClick={() => setSelectedCorr(corr)}
                className={`p-3 mb-2 rounded-sm cursor-pointer border transition-colors ${
                  selectedCorr.id === corr.id 
                    ? 'bg-[var(--color-bg-elevated)] border-[var(--color-border-active)]' 
                    : 'bg-transparent border-transparent hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-[var(--color-accent-primary)] mono-data">{corr.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${
                    corr.score > 90 ? 'bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] border-[var(--color-accent-red)]/30' : 
                    'bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] border-[var(--color-accent-orange)]/30'
                  }`}>
                    {corr.score}% MATCH
                  </span>
                </div>
                <h4 className="text-[13px] font-medium text-white mb-2">{corr.campaign}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {corr.channels.map(ch => (
                      <span key={ch} className="text-[9px] font-bold bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded-sm">
                        {ch}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] mono-data">{corr.iocCount} IOCs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail */}
        <div className="lg:col-span-2 enterprise-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[var(--color-accent-primary)] mono-data">{selectedDetail.id}</span>
              <span className="text-[13px] font-medium text-white">{selectedDetail.campaign}</span>
            </div>
            <button 
              onClick={handlePushToSiem}
              className="flex items-center gap-2 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/90 text-white px-3 py-1.5 rounded-sm text-[11px] font-bold tracking-wide transition-colors"
            >
              <Database className="w-3 h-3" />
              PUSH TO SIEM
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <div className="p-4 bg-[var(--color-accent-purple)]/5 border border-[var(--color-accent-purple)]/20 rounded-sm">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[var(--color-accent-purple)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[12px] font-bold text-white uppercase tracking-widest mb-1">Correlation Alert</h4>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                    {selectedDetail.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="section-label mb-3">Attack Progression</h4>
                <div className="relative border-l border-[var(--color-border-subtle)] ml-2 space-y-4 pb-4">
                  {selectedDetail.timeline.map((event, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-accent-primary)]" />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-[var(--color-text-muted)] mono-data">{event.time}</span>
                        <span className="text-[9px] font-bold bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded-sm">{event.channel}</span>
                      </div>
                      <p className="text-[12px] text-white mb-1">{event.event}</p>
                      <p className="text-[11px] text-[var(--color-accent-red)] mono-data">{event.ioc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="section-label mb-3">Related IOCs</h4>
                <table className="w-full enterprise-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                      <th>Conf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetail.iocs.map((ioc, i) => (
                      <tr key={i}>
                        <td className="text-[10px] font-bold text-[var(--color-text-secondary)]">{ioc.type}</td>
                        <td className="mono-data text-[11px] text-white truncate max-w-[150px]" title={ioc.value}>{ioc.value}</td>
                        <td className="mono-data text-[11px] text-[var(--color-accent-red)]">{ioc.confidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
