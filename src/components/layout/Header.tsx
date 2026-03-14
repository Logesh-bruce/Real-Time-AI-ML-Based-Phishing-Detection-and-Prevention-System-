import React from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const formatTabName = (tab: string) => {
    return tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="h-[52px] bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-[14px]">
        <span className="text-[var(--color-text-muted)] font-medium">PhishGuard</span>
        <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span className="font-semibold text-[var(--color-text-primary)]">{formatTabName(activeTab)}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="claude-input pl-9 pr-3 py-1.5 text-[13px] w-64 placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)]"
          />
        </div>
        
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-accent-red)] rounded-full border border-[var(--color-bg-primary)]"></span>
        </button>

        <div className="w-7 h-7 rounded-full bg-[var(--color-border-active)] flex items-center justify-center text-[12px] font-medium text-[var(--color-text-primary)] cursor-pointer">
          JD
        </div>
      </div>
    </header>
  );
};
