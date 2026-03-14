import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';
import { Activity, ShieldAlert, Zap, Clock, ShieldCheck, Globe, Mail, MessageSquare, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSocket } from '../contexts/SocketContext';

const generateData = () => {
  return Array.from({ length: 30 }).map((_, i) => ({
    time: `${i}:00`,
    threats: Math.floor(Math.random() * 50) + 10,
    scans: Math.floor(Math.random() * 500) + 200,
  }));
};

const initialDetections = [
  { id: 'DET-9942', type: 'URL', target: 'paypal-secure-login.tk', confidence: 98, status: 'BLOCKED', time: '10:42:15' },
  { id: 'DET-9941', type: 'EMAIL', target: 'Account Verification Required', confidence: 92, status: 'QUARANTINED', time: '10:41:02' },
  { id: 'DET-9940', type: 'SMS', target: 'USPS: Package delivery failed...', confidence: 85, status: 'BLOCKED', time: '10:38:45' },
  { id: 'DET-9939', type: 'URL', target: 'netflix-update-billing.com', confidence: 99, status: 'BLOCKED', time: '10:35:12' },
  { id: 'DET-9938', type: 'URL', target: 'google.com', confidence: 2, status: 'SAFE', time: '10:30:00' },
  { id: 'DET-9937', type: 'EMAIL', target: 'Invoice #49201 Attached', confidence: 88, status: 'QUARANTINED', time: '10:28:15' },
  { id: 'DET-9936', type: 'URL', target: 'microsoft-office-365-login.net', confidence: 95, status: 'BLOCKED', time: '10:25:40' },
  { id: 'DET-9935', type: 'SMS', target: 'Bank Alert: Suspicious Activity', confidence: 91, status: 'BLOCKED', time: '10:20:11' },
  { id: 'DET-9934', type: 'URL', target: 'github.com', confidence: 1, status: 'SAFE', time: '10:15:05' },
  { id: 'DET-9933', type: 'EMAIL', target: 'Urgent: Wire Transfer Request', confidence: 97, status: 'QUARANTINED', time: '10:10:22' },
];

const activeIncidents = [
  { id: 'INC-102', severity: 'CRITICAL', message: 'Coordinated phishing campaign targeting Finance dept', time: '2m ago' },
  { id: 'INC-101', severity: 'HIGH', message: 'Multiple credential harvesting URLs detected from IP 192.168.1.50', time: '15m ago' },
  { id: 'INC-100', severity: 'MEDIUM', message: 'Unusual volume of SMS phishing attempts in US region', time: '1h ago' },
  { id: 'INC-099', severity: 'HIGH', message: 'New zero-day phishing kit identified (Fin7 variant)', time: '2h ago' },
  { id: 'INC-098', severity: 'LOW', message: 'Routine endpoint agent update completed', time: '4h ago' },
];

export default function Dashboard() {
  const [data, setData] = useState(generateData());
  const [recentDetections, setRecentDetections] = useState<any[]>(initialDetections);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/detections`);
        const data = await res.json();
        if (data.detections && data.detections.length > 0) {
          setRecentDetections(data.detections.map((d: any) => ({
            id: d.id,
            type: d.type,
            target: d.target,
            confidence: d.confidence,
            status: d.status,
            time: new Date(d.timestamp).toLocaleTimeString()
          })));
        }
      } catch (e) {
        console.error('Failed to fetch detections', e);
      }
    };
    fetchDetections();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewThreat = (threat: any) => {
      setRecentDetections(prev => [threat, ...prev].slice(0, 10));
      setData(prev => {
        const newData = [...prev];
        const lastPoint = { ...newData[newData.length - 1] };
        lastPoint.threats += 1;
        newData[newData.length - 1] = lastPoint;
        return newData;
      });
    };

    socket.on('threat.detected', handleNewThreat);

    return () => {
      socket.off('threat.detected', handleNewThreat);
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          threats: Math.floor(Math.random() * 50) + 10,
          scans: Math.floor(Math.random() * 500) + 200,
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-6">
      
      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'TOTAL SCANS (24H)', value: '1,245,921', trend: '+12.3%', trendUp: true, color: 'var(--color-accent-primary)' },
          { label: 'THREATS BLOCKED', value: '45,231', trend: '+5.1%', trendUp: true, color: 'var(--color-accent-red)' },
          { label: 'ACTIVE CAMPAIGNS', value: '14', trend: '-2.4%', trendUp: false, color: 'var(--color-accent-orange)' },
          { label: 'AVG RESPONSE TIME', value: '12ms', trend: '-1.2%', trendUp: false, color: 'var(--color-accent-green)' },
          { label: 'CORRELATION HITS', value: '8,402', trend: '+18.9%', trendUp: true, color: 'var(--color-accent-purple)' },
        ].map((stat, i) => (
          <div key={i} className="enterprise-card p-4 relative overflow-hidden flex flex-col justify-between h-[100px]" style={{ borderLeft: `3px solid ${stat.color}` }}>
            <div className="flex justify-between items-start">
              <p className="section-label text-[10px]">{stat.label}</p>
              <div className={`flex items-center text-[10px] font-bold ${stat.trendUp ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-accent-green)]'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {stat.trend}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-semibold text-white mono-data tracking-tight">{stat.value}</h3>
              {/* Fake sparkline */}
              <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-50">
                <polyline points="0,20 10,15 20,18 30,5 40,10" fill="none" stroke={stat.color} strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Live Threat Telemetry */}
        <div className="lg:col-span-3 enterprise-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-accent-primary)]" />
              Live Threat Telemetry
            </h2>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-muted)" fontSize={10} tickMargin={10} />
                <YAxis yAxisId="left" stroke="var(--color-text-muted)" fontSize={10} tickFormatter={(val) => `${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-text-muted)" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-subtle)', borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="scans" name="Total Scans" stroke="var(--color-accent-primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="threats" name="Threats Blocked" stroke="var(--color-accent-red)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Incidents Feed */}
        <div className="lg:col-span-1 enterprise-card p-0 flex flex-col h-[350px]">
          <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--color-accent-orange)]" />
              Active Incidents
            </h2>
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-red)] animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activeIncidents.map((inc, i) => (
              <div key={i} className="p-3 mb-2 bg-[var(--color-bg-secondary)] border-l-2 border-[var(--color-accent-red)] rounded-r-sm hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-[var(--color-accent-red)] mono-data">{inc.id}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{inc.time}</span>
                </div>
                <p className="text-[12px] text-[var(--color-text-primary)] leading-snug">{inc.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post-Delivery Stats Row */}
      <div className="flex gap-4 items-center p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-sm">
        <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Post-Delivery Shield:</span>
        <div className="flex gap-6 ml-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Emails Quarantined</span>
            <span className="text-[13px] font-bold text-white mono-data">1,204</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase">URLs Auto-Blocked</span>
            <span className="text-[13px] font-bold text-white mono-data">8,492</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Avg Remediation Time</span>
            <span className="text-[13px] font-bold text-[var(--color-accent-green)] mono-data">450ms</span>
          </div>
        </div>
      </div>

      {/* Detections Table */}
      <div className="enterprise-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest">Recent Detections</h2>
          <span className="text-[11px] text-[var(--color-text-secondary)]">Showing 1-10 of 8,432 events</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full enterprise-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Time</th>
                <th>Type</th>
                <th>Target / Payload</th>
                <th>Confidence</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentDetections.map((det, i) => (
                <tr key={i} className="group">
                  <td className="mono-data text-[var(--color-accent-primary)]">{det.id}</td>
                  <td className="mono-data text-[var(--color-text-muted)]">{det.time}</td>
                  <td>
                    <span className="text-[10px] font-bold bg-[var(--color-bg-elevated)] px-2 py-1 rounded-sm text-[var(--color-text-secondary)]">
                      {det.type}
                    </span>
                  </td>
                  <td className="mono-data text-white truncate max-w-[200px]">{det.target}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${det.confidence > 90 ? 'bg-[var(--color-accent-red)]' : det.confidence > 50 ? 'bg-[var(--color-accent-orange)]' : 'bg-[var(--color-accent-green)]'}`}
                          style={{ width: `${det.confidence}%` }}
                        />
                      </div>
                      <span className="mono-data text-[11px]">{det.confidence}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-sm border ${
                      det.status === 'BLOCKED' || det.status === 'QUARANTINED' 
                        ? 'bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] border-[var(--color-accent-red)]/30' 
                        : 'bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)] border-[var(--color-accent-green)]/30'
                    }`}>
                      {det.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[var(--color-accent-primary)] hover:text-white border border-[var(--color-accent-primary)]/30 hover:bg-[var(--color-accent-primary)]/20 px-2 py-1 rounded-sm">
                      INVESTIGATE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
