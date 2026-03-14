import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Activity, ShieldAlert, Zap } from 'lucide-react';

interface Detection {
  id: string;
  type: string;
  target: string;
  confidence: number;
  status: string;
  timestamp: string;
}

interface Correlation {
  id: string;
  score: number;
  channels: string[];
  description: string;
  timestamp: string;
}

export const MonitoringPage: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const [detRes, corrRes] = await Promise.all([
          fetch('/api/v1/detections').then(res => res.json()),
          fetch('/api/v1/correlation/active').then(res => res.json())
        ]);

        if (detRes.detections) {
          setDetections(detRes.detections);
        }
        if (corrRes.correlations) {
          setCorrelations(corrRes.correlations);
        }
      } catch (err) {
        console.error('Failed to fetch initial monitoring data:', err);
      }
    };

    fetchInitialData();

    // Connect to WebSocket
    const socket: Socket = io();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('threat.detected', (data: any) => {
      setDetections(prev => {
        const newDetection: Detection = {
          id: data.id,
          type: data.type,
          target: data.target,
          confidence: data.confidence,
          status: data.status,
          timestamp: new Date().toISOString()
        };
        return [newDetection, ...prev].slice(0, 50); // Keep last 50
      });
    });

    socket.on('correlation.new', (data: any) => {
      setCorrelations(prev => {
        const newCorrelation: Correlation = {
          id: data.id,
          score: data.score,
          channels: data.channels,
          description: data.description,
          timestamp: data.timestamp
        };
        return [newCorrelation, ...prev].slice(0, 50); // Keep last 50
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'just now';
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-[1000px] mx-auto py-8 px-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a] mb-1 flex items-center gap-2">
            Live Monitoring
            {isConnected ? (
              <span className="flex h-2 w-2 relative ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            ) : (
              <span className="flex h-2 w-2 relative ml-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </h1>
          <p className="text-[13px] text-[#6b6b6b]">
            Real-time threat detection and correlation events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Detections Feed */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-5 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#1a1a1a]" />
            <h3 className="text-[14px] font-semibold text-[#1a1a1a]">Live Detections Feed</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {detections.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[13px] text-[#9b9b9b]">
                Waiting for detections...
              </div>
            ) : (
              <div className="space-y-3">
                {detections.map((det, idx) => (
                  <div key={`${det.id}-${idx}`} className="p-3 border border-[#e5e5e3] rounded-lg hover:bg-[#fafaf8] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#fef2f2] text-[#dc2626] rounded text-[10px] font-semibold uppercase tracking-wide">
                          {det.type}
                        </span>
                        <span className="text-[12px] font-medium text-[#1a1a1a]">{det.id}</span>
                      </div>
                      <span className="text-[11px] text-[#6b6b6b]">{formatTimeAgo(det.timestamp)}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#1a1a1a] truncate mb-2" title={det.target}>
                      {det.target}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#6b6b6b]">
                        Confidence: <span className="font-medium text-[#1a1a1a]">{det.confidence}%</span>
                      </span>
                      <span className="text-[11px] font-medium text-[#dc2626]">
                        {det.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Correlations */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-5 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#d97706]" />
            <h3 className="text-[14px] font-semibold text-[#1a1a1a]">Active Correlations</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {correlations.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[13px] text-[#9b9b9b]">
                No active correlations.
              </div>
            ) : (
              <div className="space-y-3">
                {correlations.map((corr, idx) => (
                  <div key={`${corr.id}-${idx}`} className="p-4 border border-[#e5e5e3] rounded-lg bg-[#fffbeb]/30 hover:bg-[#fffbeb]/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#d97706]" />
                        <span className="text-[12px] font-medium text-[#1a1a1a]">{corr.id}</span>
                      </div>
                      <span className="text-[11px] text-[#6b6b6b]">{formatTimeAgo(corr.timestamp)}</span>
                    </div>
                    <p className="text-[13px] text-[#1a1a1a] mb-3 leading-relaxed">
                      {corr.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {corr.channels.map(ch => (
                          <span key={ch} className="px-2 py-0.5 bg-[#f5f4ef] text-[#6b6b6b] rounded text-[10px] font-medium uppercase">
                            {ch}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] text-[#6b6b6b]">
                        Risk Score: <span className="font-medium text-[#d97706]">{corr.score}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
