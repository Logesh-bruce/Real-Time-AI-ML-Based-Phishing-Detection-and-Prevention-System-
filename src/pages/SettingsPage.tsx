import React, { useState } from 'react';
import { User, Key, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'api' | 'notifications' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto py-8 px-6">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a] mb-1">
          Settings
        </h1>
        <p className="text-[13px] text-[#6b6b6b]">
          Manage your account, API keys, and system preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SETTINGS SIDEBAR */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activeSection === 'profile'
                  ? 'bg-[#f5f4ef] text-[#1a1a1a]'
                  : 'text-[#6b6b6b] hover:bg-[#fafaf8] hover:text-[#1a1a1a]'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('api')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activeSection === 'api'
                  ? 'bg-[#f5f4ef] text-[#1a1a1a]'
                  : 'text-[#6b6b6b] hover:bg-[#fafaf8] hover:text-[#1a1a1a]'
              }`}
            >
              <Key className="w-4 h-4" />
              API Keys
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activeSection === 'notifications'
                  ? 'bg-[#f5f4ef] text-[#1a1a1a]'
                  : 'text-[#6b6b6b] hover:bg-[#fafaf8] hover:text-[#1a1a1a]'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activeSection === 'security'
                  ? 'bg-[#f5f4ef] text-[#1a1a1a]'
                  : 'text-[#6b6b6b] hover:bg-[#fafaf8] hover:text-[#1a1a1a]'
              }`}
            >
              <Shield className="w-4 h-4" />
              Security & Privacy
            </button>
          </nav>
        </div>

        {/* SETTINGS CONTENT */}
        <div className="flex-1">
          <div className="bg-white border border-[#e5e5e3] rounded-xl p-6">
            <form onSubmit={handleSave}>
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#1a1a1a] mb-4">Profile Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Full Name</label>
                        <input type="text" defaultValue="Admin User" className="claude-input w-full px-3 py-2 text-[14px]" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Email Address</label>
                        <input type="email" defaultValue="admin@phishguard.local" className="claude-input w-full px-3 py-2 text-[14px]" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Role</label>
                        <input type="text" defaultValue="System Administrator" disabled className="claude-input w-full px-3 py-2 text-[14px] bg-[#fafaf8] text-[#6b6b6b] cursor-not-allowed" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'api' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#1a1a1a] mb-4">API Integrations</h2>
                    <p className="text-[13px] text-[#6b6b6b] mb-4">Configure external threat intelligence and analysis APIs.</p>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">VirusTotal API Key</label>
                        <input type="password" defaultValue="••••••••••••••••••••••••" className="claude-input w-full px-3 py-2 text-[14px] font-mono" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">OpenAI API Key (for LLM Analysis)</label>
                        <input type="password" defaultValue="sk-••••••••••••••••••••••••" className="claude-input w-full px-3 py-2 text-[14px] font-mono" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">AbuseIPDB API Key</label>
                        <input type="password" placeholder="Enter API Key" className="claude-input w-full px-3 py-2 text-[14px] font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#1a1a1a] mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Email alerts for Critical threats</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Email alerts for High threats</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Weekly summary reports</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Slack/Teams webhook notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#1a1a1a] mb-4">Security & Privacy</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Require Two-Factor Authentication (2FA)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Anonymize submitted data before external API checks</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#e5e5e3] text-[#1a1a1a] focus:ring-[#1a1a1a]" />
                        <span className="text-[13px] text-[#1a1a1a]">Auto-remediate known malicious URLs (Block at DNS)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-[#e5e5e3] flex items-center gap-4">
                <button
                  type="submit"
                  className="claude-button-primary px-4 py-2 text-[13px] font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                {saved && (
                  <span className="text-[13px] text-[#059669] flex items-center gap-1.5 animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4" />
                    Settings saved successfully
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
