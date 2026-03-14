import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DetectionPage } from './pages/DetectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage setActiveTab={setActiveTab} />;
      case 'detection': return <DetectionPage />;
      case 'monitoring': return <MonitoringPage />;
      case 'threat-intel': return <ThreatIntelPage />;
      case 'settings': return <SettingsPage />;
      default: return (
        <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
          <div className="text-center mt-32">
            <h2 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">Coming Soon</h2>
            <p>This module is currently under development.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg-primary)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
