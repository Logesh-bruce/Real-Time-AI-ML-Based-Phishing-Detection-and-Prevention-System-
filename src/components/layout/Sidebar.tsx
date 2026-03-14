import React from 'react';
import { Shield, LayoutDashboard, Search, Activity, Database, Settings, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navGroups = [
    {
      label: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'detection', label: 'Detection', icon: Search },
        { id: 'monitoring', label: 'Monitoring', icon: Activity },
      ]
    },
    {
      label: 'Intelligence',
      items: [
        { id: 'threat-intel', label: 'Threat Intel', icon: Database },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-[260px] h-screen bg-[var(--color-bg-sidebar)] flex flex-col border-r border-[var(--color-border-subtle)] shrink-0">
      {/* Logo Area */}
      <div className="h-[52px] flex items-center px-4 gap-2 border-b border-[var(--color-border-subtle)]">
        <Shield className="w-5 h-5 text-[var(--color-accent-primary)]" />
        <span className="font-semibold text-[15px] tracking-tight">PhishGuard</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 px-2">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                      isActive 
                        ? 'bg-[var(--color-bg-sidebar-active)] text-[var(--color-text-primary)] font-medium' 
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sidebar-active)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Area */}
      <div className="p-3 border-t border-[var(--color-border-subtle)]">
        <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-[var(--color-bg-sidebar-active)] transition-colors text-left">
          <div className="w-6 h-6 rounded-full bg-[var(--color-border-active)] flex items-center justify-center text-[11px] font-medium text-[var(--color-text-primary)]">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">John Doe</div>
            <div className="text-[11px] text-[var(--color-text-muted)] truncate">Admin</div>
          </div>
        </button>
      </div>
    </div>
  );
};
