import React from 'react';
import { Shield, Activity, Map, Fingerprint, Search, Monitor, Settings, LogOut, Network, ShieldAlert, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: Activity },
        { id: 'detection', label: 'Threat Analysis', icon: Shield },
        { id: 'correlation', label: 'Correlation Engine', icon: Network, isNew: true },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'map', label: 'Live Threat Map', icon: Map },
        { id: 'dna', label: 'DNA Fingerprinting', icon: Fingerprint },
        { id: 'campaigns', label: 'Campaign Tracker', icon: Search },
      ]
    },
    {
      title: 'PROTECTION',
      items: [
        { id: 'shield', label: 'Post-Delivery Shield', icon: ShieldAlert, isNew: true },
        { id: 'brand', label: 'Brand Monitor', icon: Search },
        { id: 'agent', label: 'Endpoint Agent', icon: Monitor },
      ]
    },
    {
      title: 'INTEGRATIONS',
      items: [
        { id: 'siem', label: 'SIEM/SOAR Hub', icon: Database, isNew: true },
        { id: 'api', label: 'API Gateway', icon: Network },
      ]
    }
  ];

  return (
    <div className="w-[240px] h-screen bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-subtle)] flex flex-col fixed left-0 top-0 z-50">
      <div className="h-[56px] flex items-center px-4 border-b border-[var(--color-border-subtle)]">
        <div className="w-6 h-6 rounded-sm bg-[var(--color-accent-primary)]/20 flex items-center justify-center border border-[var(--color-accent-primary)]/50 mr-3">
          <Shield className="w-4 h-4 text-[var(--color-accent-primary)]" />
        </div>
        <div>
          <h1 className="text-[13px] font-bold text-white tracking-tight leading-none">PHISHGUARD OS</h1>
          <p className="text-[10px] text-[var(--color-text-secondary)] font-mono mt-1">ENTERPRISE v2.1.0</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        {menuGroups.map((group, i) => (
          <div key={i}>
            <p className="section-label mb-2 px-3">── {group.title} ──</p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 text-[13px] font-medium ${
                      isActive 
                        ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30' 
                        : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] border border-transparent'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-secondary)]'}`} />
                    {item.label}
                    {item.isNew && (
                      <span className="ml-auto text-[9px] font-bold bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)] px-1.5 py-0.5 rounded-sm">NEW</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[var(--color-border-subtle)]">
        <p className="section-label mb-2 px-3">── SYSTEM ──</p>
        <div className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-white cursor-pointer transition-colors rounded-sm hover:bg-[var(--color-bg-elevated)]">
          <Settings className="w-4 h-4" /> Configuration
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-white cursor-pointer transition-colors rounded-sm hover:bg-[var(--color-bg-elevated)]">
          <LogOut className="w-4 h-4" /> Sign Out
        </div>
      </div>
    </div>
  );
}
