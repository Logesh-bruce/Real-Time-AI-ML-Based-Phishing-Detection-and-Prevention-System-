import React from 'react';
import { Fingerprint, Network, GitBranch, ShieldAlert, FileCode2, Link as LinkIcon, Server } from 'lucide-react';

export default function DNAFingerprint() {
  const clusters = [
    { id: 'APT-29', name: 'Cozy Bear Phishing', confidence: 98, active: true, targets: 'Government', nodes: 142 },
    { id: 'FIN-7', name: 'Carbanak Financial', confidence: 92, active: true, targets: 'Banks', nodes: 89 },
    { id: 'UNC-1151', name: 'Ghostwriter', confidence: 85, active: false, targets: 'Media', nodes: 45 },
  ];

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Fingerprint className="w-6 h-6 text-[var(--color-accent-blue)]" />
          DNA Fingerprint Analysis
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Identify attacker groups by clustering infrastructure, code, and behavioral patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Clusters List */}
        <div className="glass-card p-6 flex flex-col gap-4 h-[calc(100vh-200px)] overflow-y-auto">
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-2 flex items-center gap-2">
            <Network className="w-4 h-4" /> Identified Campaigns
          </h2>
          
          {clusters.map((cluster, i) => (
            <div key={i} className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-[var(--color-accent-blue)]/10 border-[var(--color-accent-blue)]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[var(--color-bg-main)] border-[var(--color-border-subtle)] hover:border-[var(--color-accent-blue)]/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-white font-mono">{cluster.id}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${cluster.active ? 'bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] border-[var(--color-accent-red)]/30' : 'bg-[var(--color-text-secondary)]/10 text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]'}`}>
                  {cluster.active ? 'ACTIVE' : 'DORMANT'}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4">{cluster.name}</p>
              
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--color-accent-blue)]">{cluster.nodes} Nodes</span>
                <span className="text-white">{cluster.confidence}% Match</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel: Fingerprint Details */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
                APT-29 <span className="text-sm font-sans text-[var(--color-text-secondary)] font-normal">Cozy Bear Phishing</span>
              </h2>
              <p className="text-sm text-[var(--color-accent-red)] mt-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> High Severity Threat Actor
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] block mb-1">Similarity Score</span>
              <span className="text-3xl font-bold text-[var(--color-accent-blue)] mono-data">98.4%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] p-5 rounded-xl">
              <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-4 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-400" /> HTML/JS Signatures
              </h3>
              <ul className="space-y-3 font-mono text-xs text-slate-300">
                <li className="flex justify-between border-b border-[var(--color-border-subtle)] pb-2">
                  <span>Obfuscation Pattern</span> <span className="text-[var(--color-accent-red)]">Match (Base64)</span>
                </li>
                <li className="flex justify-between border-b border-[var(--color-border-subtle)] pb-2">
                  <span>DOM Structure Hash</span> <span className="text-[var(--color-accent-red)]">a8f9...2b1c</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Exfiltration Script</span> <span className="text-[var(--color-accent-red)]">Match (Telegram API)</span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] p-5 rounded-xl">
              <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" /> Infrastructure
              </h3>
              <ul className="space-y-3 font-mono text-xs text-slate-300">
                <li className="flex justify-between border-b border-[var(--color-border-subtle)] pb-2">
                  <span>Hosting Provider</span> <span className="text-[var(--color-accent-red)]">Bulletproof Hosting X</span>
                </li>
                <li className="flex justify-between border-b border-[var(--color-border-subtle)] pb-2">
                  <span>SSL Issuer</span> <span className="text-[var(--color-accent-red)]">Let's Encrypt (Automated)</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Registrar Pattern</span> <span className="text-[var(--color-accent-red)]">Namecheap + Privacy</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-6 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[var(--color-accent-blue)]" /> Campaign Timeline
            </h3>
            
            <div className="relative border-l-2 border-[var(--color-border-subtle)] ml-4 space-y-8">
              {[
                { date: 'Today, 14:30', event: 'New domain registered: secure-login-portal.tk', type: 'Infrastructure' },
                { date: 'Yesterday', event: 'Mass email campaign targeting US Government', type: 'Delivery' },
                { date: '3 Days Ago', event: 'Payload updated to evade detection', type: 'Weaponization' },
              ].map((item, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--color-bg-main)] border-2 border-[var(--color-accent-blue)]" />
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] block mb-1">{item.date}</span>
                  <p className="text-sm text-white">{item.event}</p>
                  <span className="text-xs text-[var(--color-accent-blue)] font-mono mt-1 block">[{item.type}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
