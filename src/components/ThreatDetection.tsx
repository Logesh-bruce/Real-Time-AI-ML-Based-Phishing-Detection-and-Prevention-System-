import React, { useState } from 'react';
import { API_BASE } from '../lib/api';
import { Shield, ShieldAlert, ShieldCheck, Activity, Search, AlertTriangle, FileJson, CheckCircle2, XCircle, ChevronRight, Globe, Mail, MessageSquare, Layers } from 'lucide-react';

export default function ThreatDetection() {
  const [activeTab, setActiveTab] = useState('URL');
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);

  const handleAnalyze = async () => {
    if (!input) return;
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: input, type: activeTab })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Analysis failed');
      }
    } catch (error) {
      console.error('Error calling analysis API:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-100px)] flex gap-6">
      
      {/* Left Panel: Input */}
      <div className="w-[40%] enterprise-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--color-accent-primary)]" />
            Payload Analysis
          </h2>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {['URL', 'EMAIL', 'TEXT', 'BULK'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[11px] font-bold tracking-widest rounded-sm transition-colors border ${
                  activeTab === tab 
                    ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/30' 
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-white hover:bg-[var(--color-bg-elevated)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            <label className="section-label mb-2">INPUT PAYLOAD</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${activeTab.toLowerCase()} to analyze...`}
              className="flex-1 w-full bg-[#03060a] border border-[var(--color-border-subtle)] rounded-sm p-4 text-[13px] text-white focus:outline-none focus:border-[var(--color-accent-primary)] mono-data resize-none"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="deep" className="w-4 h-4 rounded-sm border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]" defaultChecked />
              <label htmlFor="deep" className="text-[12px] text-[var(--color-text-secondary)]">Enable Deep Visual Analysis (Headless Browser)</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="sandbox" className="w-4 h-4 rounded-sm border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]" defaultChecked />
              <label htmlFor="sandbox" className="text-[12px] text-[var(--color-text-secondary)]">Execute in Isolated Sandbox</label>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!input || isAnalyzing}
            className={`mt-6 w-full py-3 rounded-sm text-[12px] font-bold tracking-widest transition-all flex items-center justify-center gap-2 ${
              !input ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed' :
              isAnalyzing ? 'bg-[var(--color-accent-primary)]/50 text-white cursor-wait' :
              'bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary)]/90'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                ANALYZING PAYLOAD...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                INITIATE ANALYSIS
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="w-[60%] enterprise-card flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-accent-primary)]" />
            Analysis Results
          </h2>
          {result && (
            <button 
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              <FileJson className="w-4 h-4" />
              {showJson ? 'HIDE JSON' : 'VIEW RAW JSON'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!result && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
              <Layers className="w-12 h-12 mb-4 opacity-20" />
              <p className="mono-data text-[14px] tracking-widest">AWAITING PAYLOAD</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border-subtle)]" />
                <div className="absolute inset-0 rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent animate-spin" />
                <Activity className="absolute inset-0 m-auto w-8 h-8 text-[var(--color-accent-primary)] animate-pulse" />
              </div>
              <p className="mono-data text-[14px] tracking-widest text-[var(--color-accent-primary)] animate-pulse">PROCESSING ML MODELS...</p>
            </div>
          )}

          {result && !showJson && (
            <div className="animate-in fade-in duration-500 space-y-6">
              {/* Verdict Banner */}
              <div className={`p-6 rounded-sm border-l-4 flex items-center justify-between ${
                result.verdict === 'THREAT CONFIRMED' 
                  ? 'bg-[var(--color-accent-red)]/10 border-[var(--color-accent-red)]' 
                  : 'bg-[var(--color-accent-green)]/10 border-[var(--color-accent-green)]'
              }`}>
                <div className="flex items-center gap-4">
                  {result.verdict === 'THREAT CONFIRMED' ? (
                    <ShieldAlert className="w-10 h-10 text-[var(--color-accent-red)]" />
                  ) : (
                    <ShieldCheck className="w-10 h-10 text-[var(--color-accent-green)]" />
                  )}
                  <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${result.verdict === 'THREAT CONFIRMED' ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-accent-green)]'}`}>
                      {result.verdict}
                    </h1>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                      Confidence Score: <span className="text-white font-bold mono-data">{result.confidence}%</span>
                    </p>
                  </div>
                </div>
                {result.verdict === 'THREAT CONFIRMED' && (
                  <button className="bg-[var(--color-accent-red)] text-white px-4 py-2 rounded-sm text-[11px] font-bold tracking-widest hover:bg-[var(--color-accent-red)]/90 transition-colors">
                    QUARANTINE NOW
                  </button>
                )}
              </div>

              {/* ML Breakdown */}
              <div>
                <h3 className="section-label mb-4">ML Engine Breakdown</h3>
                <div className="space-y-4 bg-[var(--color-bg-secondary)] p-5 rounded-sm border border-[var(--color-border-subtle)]">
                  {[
                    { label: 'NLP Engine (DistilBERT)', score: result.scores.nlp },
                    { label: 'URL Heuristics', score: result.scores.url },
                    { label: 'Visual Similarity (CV)', score: result.scores.visual },
                    { campaign: 'DNA Fingerprint', score: result.scores.dna }
                  ].map((engine, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-[var(--color-text-secondary)] font-bold uppercase tracking-widest">{engine.label || engine.campaign}</span>
                        <span className="mono-data text-white">{engine.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${engine.score > 80 ? 'bg-[var(--color-accent-red)]' : engine.score > 40 ? 'bg-[var(--color-accent-orange)]' : 'bg-[var(--color-accent-green)]'}`}
                          style={{ width: `${engine.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IOCs */}
              {result.iocs.length > 0 && (
                <div>
                  <h3 className="section-label mb-4">Extracted Indicators of Compromise (IOCs)</h3>
                  <table className="w-full enterprise-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Confidence</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.iocs.map((ioc: any, i: number) => (
                        <tr key={i} className="group">
                          <td className="text-[10px] font-bold text-[var(--color-text-secondary)]">{ioc.type}</td>
                          <td className="mono-data text-[12px] text-white">{ioc.value}</td>
                          <td className="mono-data text-[12px] text-[var(--color-accent-red)]">{ioc.confidence}%</td>
                          <td className="text-right">
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[var(--color-accent-primary)] hover:text-white border border-[var(--color-accent-primary)]/30 hover:bg-[var(--color-accent-primary)]/20 px-2 py-1 rounded-sm">
                              BLOCK
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {result && showJson && (
            <div className="animate-in fade-in duration-500 h-full flex flex-col">
              <div className="bg-[#03060a] p-4 rounded-sm border border-[var(--color-border-subtle)] flex-1 overflow-y-auto">
                <pre className="text-[11px] text-[var(--color-accent-green)] font-mono leading-relaxed">
                  {JSON.stringify(result.rawJson, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
