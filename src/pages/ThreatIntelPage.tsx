import React, { useState } from 'react';
import { Search, Database, ShieldAlert, Globe, Crosshair, AlertTriangle } from 'lucide-react';

// Mock Data
const MOCK_CAMPAIGNS = [
  {
    id: 'CAM-2026-001',
    name: 'Operation FakeInvoice',
    actor: 'FIN7',
    target: 'Finance, Retail',
    severity: 'Critical',
    lastActive: '2 hours ago',
    description: 'Large-scale phishing campaign distributing Emotet payload via malicious PDF attachments disguised as overdue invoices.'
  },
  {
    id: 'CAM-2026-002',
    name: 'Credential Harvester Alpha',
    actor: 'Unknown',
    target: 'Healthcare',
    severity: 'High',
    lastActive: '5 hours ago',
    description: 'Targeted credential harvesting targeting hospital staff using spoofed Microsoft 365 login pages.'
  },
  {
    id: 'CAM-2026-003',
    name: 'Smishing Wave X',
    actor: 'Scattered Spider',
    target: 'Telecommunications',
    severity: 'High',
    lastActive: '1 day ago',
    description: 'SMS phishing campaign claiming account suspension, leading to fake 2FA capture portals.'
  }
];

const MOCK_IOCS = [
  { value: '192.168.45.211', type: 'IP', confidence: 99, firstSeen: '1 hour ago' },
  { value: 'secure-login-update.com', type: 'Domain', confidence: 95, firstSeen: '3 hours ago' },
  { value: '8a9b5c...f1e2d3', type: 'SHA256', confidence: 100, firstSeen: '5 hours ago' },
  { value: 'support@apple-verify-id.com', type: 'Email', confidence: 98, firstSeen: '12 hours ago' },
  { value: '10.0.55.12', type: 'IP', confidence: 85, firstSeen: '1 day ago' },
];

export const ThreatIntelPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1000px] mx-auto py-8 px-6">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-[#1a1a1a] mb-1 flex items-center gap-2">
          Threat Intelligence
        </h1>
        <p className="text-[13px] text-[#6b6b6b]">
          Global threat landscape, active campaigns, and indicators of compromise (IOCs).
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#9b9b9b]" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#e5e5e3] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#e5e5e3] focus:border-[#1a1a1a] transition-all"
          placeholder="Search for IP addresses, domains, file hashes, or campaign names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-4 h-4 text-[#6b6b6b]" />
            <h3 className="text-[13px] font-medium text-[#6b6b6b]">Active Campaigns</h3>
          </div>
          <p className="text-[24px] font-semibold text-[#1a1a1a]">14</p>
          <p className="text-[11px] text-[#059669] mt-1 flex items-center gap-1">
            ↑ 2 from last week
          </p>
        </div>
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#6b6b6b]" />
            <h3 className="text-[13px] font-medium text-[#6b6b6b]">Tracked Domains</h3>
          </div>
          <p className="text-[24px] font-semibold text-[#1a1a1a]">12,405</p>
          <p className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1">
            ↑ 843 in last 24h
          </p>
        </div>
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-[#6b6b6b]" />
            <h3 className="text-[13px] font-medium text-[#6b6b6b]">Known IOCs</h3>
          </div>
          <p className="text-[24px] font-semibold text-[#1a1a1a]">1.2M</p>
          <p className="text-[11px] text-[#6b6b6b] mt-1 flex items-center gap-1">
            Updated 5 mins ago
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <div className="lg:col-span-2 bg-white border border-[#e5e5e3] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#1a1a1a]" />
              <h3 className="text-[14px] font-semibold text-[#1a1a1a]">Latest Threat Campaigns</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            {MOCK_CAMPAIGNS.map((campaign) => (
              <div key={campaign.id} className="p-4 border border-[#e5e5e3] rounded-lg hover:bg-[#fafaf8] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-[14px] font-medium text-[#1a1a1a]">{campaign.name}</h4>
                    <span className="text-[11px] text-[#6b6b6b]">{campaign.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                    campaign.severity === 'Critical' ? 'bg-[#fef2f2] text-[#dc2626]' : 'bg-[#fffbeb] text-[#d97706]'
                  }`}>
                    {campaign.severity}
                  </span>
                </div>
                <p className="text-[13px] text-[#4a4a4a] mb-4 leading-relaxed">
                  {campaign.description}
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-[#6b6b6b]">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-[#1a1a1a]">Actor:</span> {campaign.actor}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-[#1a1a1a]">Target:</span> {campaign.target}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-[#1a1a1a]">Last Active:</span> {campaign.lastActive}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent IOCs */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#1a1a1a]" />
            <h3 className="text-[14px] font-semibold text-[#1a1a1a]">Recent IOCs</h3>
          </div>
          
          <div className="space-y-3">
            {MOCK_IOCS.map((ioc, idx) => (
              <div key={idx} className="p-3 border border-[#e5e5e3] rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-[#f5f4ef] text-[#6b6b6b] rounded text-[10px] font-medium uppercase">
                    {ioc.type}
                  </span>
                  <span className="text-[10px] text-[#6b6b6b]">{ioc.firstSeen}</span>
                </div>
                <div className="font-mono text-[12px] text-[#1a1a1a] truncate" title={ioc.value}>
                  {ioc.value}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#f5f4ef] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${ioc.confidence > 90 ? 'bg-[#dc2626]' : 'bg-[#d97706]'}`}
                      style={{ width: `${ioc.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#6b6b6b] w-8 text-right">
                    {ioc.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
