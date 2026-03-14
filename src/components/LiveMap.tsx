import React, { useEffect, useState } from 'react';
import { Map as MapIcon, Activity, Globe2, Crosshair } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

export default function LiveMap() {
  const [attacks, setAttacks] = useState<{ id: number; x: number; y: number; tx: number; ty: number }[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewThreat = () => {
      setAttacks(prev => {
        const newAttack = {
          id: Date.now(),
          x: Math.random() * 80 + 10, // Source X %
          y: Math.random() * 60 + 20, // Source Y %
          tx: Math.random() * 80 + 10, // Target X %
          ty: Math.random() * 60 + 20, // Target Y %
        };
        return [...prev.slice(-15), newAttack]; // Keep last 15
      });
    };

    socket.on('threat.detected', handleNewThreat);

    return () => {
      socket.off('threat.detected', handleNewThreat);
    };
  }, [socket]);

  return (
    <div className="p-8 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Globe2 className="w-6 h-6 text-[var(--color-accent-blue)]" />
          Global Threat Telemetry
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Real-time visualization of phishing campaigns and attack vectors.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Map Area */}
        <div className="lg:col-span-3 glass-card relative overflow-hidden border border-[var(--color-border-subtle)] rounded-xl bg-[var(--color-bg-main)]">
          {/* Stylized Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--color-border-subtle) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3 }} />
          
          {/* Simulated World Map SVG (Abstracted for effect) */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M150,100 Q200,50 300,120 T450,150 T600,100 T750,180 T900,120 L950,400 L50,400 Z" fill="var(--color-accent-blue)" />
            <path d="M50,200 Q100,150 200,220 T350,250 T500,200 T650,280 T800,220 L850,450 L100,450 Z" fill="var(--color-accent-blue)" opacity="0.5" />
          </svg>

          {/* Animated Attacks */}
          {attacks.map(attack => (
            <React.Fragment key={attack.id}>
              {/* Source Dot */}
              <div 
                className="absolute w-3 h-3 bg-[var(--color-accent-red)] rounded-full shadow-[0_0_15px_var(--color-accent-red)] animate-ping"
                style={{ left: `${attack.x}%`, top: `${attack.y}%`, transform: 'translate(-50%, -50%)' }}
              />
              {/* Target Dot */}
              <div 
                className="absolute w-2 h-2 bg-[var(--color-accent-blue)] rounded-full shadow-[0_0_10px_var(--color-accent-blue)]"
                style={{ left: `${attack.tx}%`, top: `${attack.ty}%`, transform: 'translate(-50%, -50%)' }}
              />
              {/* Connecting Line (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line 
                  x1={`${attack.x}%`} y1={`${attack.y}%`} 
                  x2={`${attack.tx}%`} y2={`${attack.ty}%`} 
                  stroke="var(--color-accent-red)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                  className="animate-[dash_1s_linear_infinite]"
                  opacity="0.5"
                />
              </svg>
            </React.Fragment>
          ))}

          {/* Overlay Stats */}
          <div className="absolute bottom-6 left-6 bg-[var(--color-bg-card)]/80 backdrop-blur-md border border-[var(--color-border-subtle)] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-red)] animate-pulse" />
              <span className="text-xs font-mono text-white uppercase tracking-widest">Active Vectors</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-accent-red)] mono-data">{attacks.length * 142}</p>
          </div>
        </div>

        {/* Right Panel Stats */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Top Origins
            </h3>
            <div className="space-y-4">
              {[
                { country: 'Russia', count: '45,211', pct: 85 },
                { country: 'China', count: '32,104', pct: 65 },
                { country: 'Brazil', count: '18,492', pct: 45 },
                { country: 'Unknown', count: '12,001', pct: 30 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-mono mb-1 text-white">
                    <span>{item.country}</span>
                    <span className="text-[var(--color-accent-red)]">{item.count}</span>
                  </div>
                  <div className="w-full h-1 bg-[var(--color-bg-main)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-accent-red)]" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-4 flex items-center gap-2">
              <Crosshair className="w-4 h-4" /> Top Targets
            </h3>
            <div className="space-y-4">
              {[
                { sector: 'Financial', count: '89,122', pct: 92 },
                { sector: 'Healthcare', count: '54,230', pct: 70 },
                { sector: 'Government', count: '41,900', pct: 55 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-mono mb-1 text-white">
                    <span>{item.sector}</span>
                    <span className="text-[var(--color-accent-blue)]">{item.count}</span>
                  </div>
                  <div className="w-full h-1 bg-[var(--color-bg-main)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-accent-blue)]" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
      `}} />
    </div>
  );
}
