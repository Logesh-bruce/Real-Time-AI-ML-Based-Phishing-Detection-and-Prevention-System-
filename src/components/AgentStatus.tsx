import React, { useState, useEffect } from 'react';
import { Monitor, Shield, Power, Activity, HardDrive, Cpu, Network, CheckCircle2, XCircle, List } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

export default function AgentStatus() {
  const [isActive, setIsActive] = useState(true);
  const [threatsBlocked, setThreatsBlocked] = useState(142);
  const [urlsScanned, setUrlsScanned] = useState(8492);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewThreat = (threat: any) => {
      setUrlsScanned(prev => prev + 1);
      if (threat.status === 'BLOCKED' || threat.status === 'QUARANTINED') {
        setThreatsBlocked(prev => prev + 1);
      }
    };

    socket.on('threat.detected', handleNewThreat);

    return () => {
      socket.off('threat.detected', handleNewThreat);
    };
  }, [socket]);

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Monitor className="w-6 h-6 text-[var(--color-accent-blue)]" />
          Endpoint Agent Status
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Manage local desktop protection and network filtering.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Panel */}
        <div className="lg:col-span-2 glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className={`absolute inset-0 ${isActive ? 'bg-[var(--color-accent-green)]/5' : 'bg-[var(--color-accent-red)]/5'} transition-colors duration-1000`} />
          
          <div className="relative z-10 mb-8">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              isActive 
                ? 'border-[var(--color-accent-green)]/30 shadow-[0_0_50px_rgba(0,255,136,0.2)]' 
                : 'border-[var(--color-accent-red)]/30 shadow-[0_0_50px_rgba(255,51,102,0.2)]'
            }`}>
              <div className={`absolute inset-0 rounded-full border-t-4 animate-spin ${
                isActive ? 'border-[var(--color-accent-green)]' : 'border-[var(--color-accent-red)]'
              }`} style={{ animationDuration: isActive ? '3s' : '10s' }} />
              <Shield className={`w-12 h-12 ${isActive ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isActive ? 'Protection Active' : 'Protection Disabled'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
            {isActive 
              ? 'Your device is actively monitored. Web traffic, emails, and downloads are being analyzed in real-time.' 
              : 'Warning: Real-time protection is currently disabled. Your device is vulnerable to phishing attacks.'}
          </p>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-full font-bold text-sm tracking-wider uppercase flex items-center gap-3 transition-all ${
              isActive 
                ? 'bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-accent-red)]/50' 
                : 'bg-[var(--color-accent-green)] text-[var(--color-bg-main)] hover:bg-[#00e67a] shadow-[0_0_20px_rgba(0,255,136,0.4)]'
            }`}
          >
            <Power className="w-5 h-5" />
            {isActive ? 'Disable Protection' : 'Enable Protection'}
          </button>
        </div>

        {/* Right Panel: Stats & Whitelist */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Today's Activity
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3 text-sm text-white">
                  <Shield className="w-4 h-4 text-[var(--color-accent-green)]" /> Threats Blocked
                </div>
                <span className="font-mono font-bold text-[var(--color-accent-green)]">{threatsBlocked.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3 text-sm text-white">
                  <Network className="w-4 h-4 text-[var(--color-accent-blue)]" /> URLs Scanned
                </div>
                <span className="font-mono font-bold text-white">{urlsScanned.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3 text-sm text-white">
                  <Cpu className="w-4 h-4 text-purple-400" /> CPU Usage
                </div>
                <span className="font-mono font-bold text-white">1.2%</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border-subtle)] pb-4">
              <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold flex items-center gap-2">
                <List className="w-4 h-4" /> Whitelisted Domains
              </h3>
              <button className="text-xs text-[var(--color-accent-blue)] hover:text-blue-400 font-medium transition-colors">Manage</button>
            </div>
            
            <ul className="space-y-2 flex-1 overflow-y-auto">
              {['github.com', 'google.com', 'internal.corp.net', 'aws.amazon.com', 'slack.com'].map((domain, i) => (
                <li key={i} className="flex items-center justify-between text-sm text-slate-300 font-mono py-2 border-b border-[var(--color-border-subtle)]/50 last:border-0">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[var(--color-accent-green)]" /> {domain}
                  </span>
                  <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
