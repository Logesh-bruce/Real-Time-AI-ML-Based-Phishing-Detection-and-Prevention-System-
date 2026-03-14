import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';
import { ShieldAlert, CheckCircle2, Clock, XCircle, AlertTriangle, Play, Pause, RefreshCw, ShieldCheck } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const initialRemediationQueue = [
  { id: 'REM-4092', detectionId: 'DET-9941', target: 'user@company.com', action: 'QUARANTINE_EMAIL', status: 'COMPLETED', time: '10:41:05', duration: '450ms' },
  { id: 'REM-4091', detectionId: 'DET-9939', target: 'netflix-update-billing.com', action: 'BLOCK_URL', status: 'COMPLETED', time: '10:35:14', duration: '320ms' },
  { id: 'REM-4090', detectionId: 'DET-9937', target: 'finance@company.com', action: 'QUARANTINE_EMAIL', status: 'PENDING', time: '10:28:15', duration: '-' },
  { id: 'REM-4089', detectionId: 'DET-9936', target: 'microsoft-office-365-login.net', action: 'BLOCK_URL', status: 'FAILED', time: '10:25:40', duration: '5000ms' },
];

const initialAuditLogs = [
  { id: 'AUD-1004', action: 'RELEASE_QUARANTINE', target: 'user@company.com / Invoice_492.pdf', user: 'Admin User', time: '2026-03-13 09:15:22', reason: 'False positive confirmed by user' },
  { id: 'AUD-1003', action: 'AUTO_QUARANTINE', target: 'hr@company.com / Urgent_Update.exe', user: 'SYSTEM', time: '2026-03-13 08:42:10', reason: 'Malware signature match' },
  { id: 'AUD-1002', action: 'AUTO_BLOCK', target: 'secure-login-portal.tk', user: 'SYSTEM', time: '2026-03-13 07:15:05', reason: 'Known phishing domain' },
];

export default function PostDeliveryShield() {
  const [shieldActive, setShieldActive] = useState(true);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedRemediation, setSelectedRemediation] = useState<any>(null);
  const [remediationQueue, setRemediationQueue] = useState<any[]>(initialRemediationQueue);
  const [auditLogs, setAuditLogs] = useState<any[]>(initialAuditLogs);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [remRes, audRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/remediations`),
          fetch(`${API_BASE}/api/v1/audit_logs`)
        ]);
        const remData = await remRes.json();
        const audData = await audRes.json();
        
        if (remData.remediations && remData.remediations.length > 0) {
          setRemediationQueue(remData.remediations.map((r: any) => ({
            id: r.id,
            detectionId: r.detection_id,
            target: r.target,
            action: r.action,
            status: r.status,
            time: new Date(r.timestamp).toLocaleTimeString(),
            duration: r.duration
          })));
        }
        
        if (audData.auditLogs && audData.auditLogs.length > 0) {
          setAuditLogs(audData.auditLogs.map((a: any) => ({
            id: a.id,
            action: a.action,
            target: a.target,
            user: a.user,
            time: new Date(a.timestamp).toISOString().replace('T', ' ').substring(0, 19),
            reason: a.reason
          })));
        }
      } catch (e) {
        console.error('Failed to fetch data', e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleRemediation = (data: any) => {
      setRemediationQueue(prev => {
        const index = prev.findIndex(r => r.id === data.id);
        if (index >= 0) {
          const newQueue = [...prev];
          newQueue[index] = { ...newQueue[index], status: data.status };
          return newQueue;
        }
        return [{
          id: data.id || `REM-${Math.floor(Math.random() * 10000)}`,
          detectionId: data.detectionId || 'DET-XXXX',
          target: data.target || 'unknown',
          action: data.action || 'UNKNOWN_ACTION',
          status: data.status || 'COMPLETED',
          time: data.timestamp || new Date().toLocaleTimeString(),
          duration: data.duration || '0ms'
        }, ...prev].slice(0, 10);
      });
    };

    socket.on('threat.remediated', handleRemediation);

    return () => {
      socket.off('threat.remediated', handleRemediation);
    };
  }, [socket]);

  const handleRelease = (rem: any) => {
    setSelectedRemediation(rem);
    setShowReleaseModal(true);
  };

  const confirmRelease = async () => {
    if (!selectedRemediation) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/remediation/quarantine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedRemediation.id, action: 'RELEASE' })
      });
      
      if (response.ok) {
        setAuditLogs(prev => [{
          id: `AUD-${Math.floor(Math.random() * 10000)}`,
          action: 'RELEASE_QUARANTINE',
          target: selectedRemediation.target,
          user: 'Admin User',
          time: new Date().toISOString().replace('T', ' ').substring(0, 19),
          reason: 'Manual release via dashboard'
        }, ...prev].slice(0, 10));
      }
    } catch (e) {
      console.error('Failed to release quarantine', e);
    }

    setShowReleaseModal(false);
    setSelectedRemediation(null);
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-6">
      
      {/* Status Banner */}
      <div className={`enterprise-card p-6 flex items-center justify-between ${shieldActive ? 'border-l-4 border-l-[var(--color-accent-green)]' : 'border-l-4 border-l-[var(--color-accent-red)]'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${shieldActive ? 'bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)]' : 'bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)]'}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {shieldActive ? 'SHIELD ACTIVE' : 'SHIELD DISABLED'}
            </h2>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
              {shieldActive ? 'Automated post-delivery remediation is currently active.' : 'Automated remediation is paused. Manual action required.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShieldActive(!shieldActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[12px] font-bold tracking-wide transition-colors ${
            shieldActive 
              ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]' 
              : 'bg-[var(--color-accent-green)] text-white hover:bg-[var(--color-accent-green)]/90'
          }`}
        >
          {shieldActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {shieldActive ? 'PAUSE SHIELD' : 'ACTIVATE SHIELD'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Remediation Queue */}
        <div className="lg:col-span-2 enterprise-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--color-accent-primary)]" />
              Remediation Queue
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full enterprise-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Detection</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th className="text-right">Manage</th>
                </tr>
              </thead>
              <tbody>
                {remediationQueue.map((rem, i) => (
                  <tr key={i} className="group">
                    <td className="mono-data text-[var(--color-accent-primary)]">{rem.id}</td>
                    <td className="mono-data text-[var(--color-text-muted)]">{rem.detectionId}</td>
                    <td>
                      <span className="text-[10px] font-bold bg-[var(--color-bg-elevated)] px-2 py-1 rounded-sm text-[var(--color-text-secondary)]">
                        {rem.action}
                      </span>
                    </td>
                    <td className="mono-data text-white truncate max-w-[150px]">{rem.target}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {rem.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-[var(--color-accent-green)]" />}
                        {rem.status === 'PENDING' && <Clock className="w-3 h-3 text-[var(--color-accent-orange)]" />}
                        {rem.status === 'FAILED' && <XCircle className="w-3 h-3 text-[var(--color-accent-red)]" />}
                        <span className={`text-[10px] font-bold ${
                          rem.status === 'COMPLETED' ? 'text-[var(--color-accent-green)]' :
                          rem.status === 'PENDING' ? 'text-[var(--color-accent-orange)]' :
                          'text-[var(--color-accent-red)]'
                        }`}>
                          {rem.status}
                        </span>
                      </div>
                    </td>
                    <td className="mono-data text-[var(--color-text-muted)]">{rem.time}</td>
                    <td className="text-right">
                      {rem.status === 'COMPLETED' && rem.action.includes('QUARANTINE') && (
                        <button 
                          onClick={() => handleRelease(rem)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[var(--color-accent-orange)] hover:text-white border border-[var(--color-accent-orange)]/30 hover:bg-[var(--color-accent-orange)]/20 px-2 py-1 rounded-sm"
                        >
                          RELEASE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-1 enterprise-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-accent-purple)]" />
              Attack Lifecycle
            </h2>
          </div>
          <div className="flex-1 p-6">
            <div className="relative border-l border-[var(--color-border-subtle)] ml-2 space-y-6 pb-4">
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-text-muted)]" />
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] mb-1">T-0ms</p>
                <p className="text-[13px] text-white">Payload Delivered</p>
                <p className="text-[11px] text-[var(--color-text-muted)] mono-data mt-1">user@company.com</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-accent-orange)]" />
                <p className="text-[10px] font-bold text-[var(--color-accent-orange)] mb-1">T+120ms</p>
                <p className="text-[13px] text-white">Threat Detected</p>
                <p className="text-[11px] text-[var(--color-text-muted)] mono-data mt-1">DET-9941 (92% Conf)</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-accent-green)]" />
                <p className="text-[10px] font-bold text-[var(--color-accent-green)] mb-1">T+450ms</p>
                <p className="text-[13px] text-white">Auto-Quarantined</p>
                <p className="text-[11px] text-[var(--color-text-muted)] mono-data mt-1">REM-4092</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-sm">
              <p className="text-[11px] text-[var(--color-text-secondary)] text-center">
                Average detection-to-remediation time: <span className="text-[var(--color-accent-green)] font-bold mono-data">450ms</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="enterprise-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
            Remediation Audit Log
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full enterprise-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Time</th>
                <th>Action</th>
                <th>Target</th>
                <th>User / System</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i}>
                  <td className="mono-data text-[var(--color-text-muted)]">{log.id}</td>
                  <td className="mono-data text-[var(--color-text-muted)]">{log.time}</td>
                  <td>
                    <span className="text-[10px] font-bold bg-[var(--color-bg-elevated)] px-2 py-1 rounded-sm text-[var(--color-text-secondary)]">
                      {log.action}
                    </span>
                  </td>
                  <td className="mono-data text-white truncate max-w-[200px]">{log.target}</td>
                  <td className="text-[12px] text-[var(--color-text-primary)]">{log.user}</td>
                  <td className="text-[12px] text-[var(--color-text-secondary)]">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Release Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card w-full max-w-md bg-[var(--color-bg-primary)] flex flex-col overflow-hidden border-[var(--color-accent-orange)]/50">
            <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-accent-orange)]/10 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-accent-orange)]" />
              <h2 className="text-[14px] font-bold text-white uppercase tracking-widest">Confirm Release</h2>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-[var(--color-text-secondary)] mb-4">
                You are about to release a quarantined item. This action will restore the item to the user's inbox and cannot be undone.
              </p>
              <div className="bg-[var(--color-bg-secondary)] p-3 rounded-sm border border-[var(--color-border-subtle)] mb-6">
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase mb-1">Target</p>
                <p className="text-[13px] text-white mono-data">{selectedRemediation?.target}</p>
                <p className="text-[11px] text-[var(--color-text-muted)] uppercase mt-3 mb-1">Detection ID</p>
                <p className="text-[13px] text-[var(--color-accent-primary)] mono-data">{selectedRemediation?.detectionId}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 rounded-sm text-[12px] font-bold tracking-wide text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={confirmRelease}
                  className="px-4 py-2 rounded-sm text-[12px] font-bold tracking-wide bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange)]/90 transition-colors"
                >
                  RELEASE ITEM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
