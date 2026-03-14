import React, { useState } from 'react';
import { ScoreCard } from '../components/detection/ScoreCard';
import { IndicatorList } from '../components/detection/IndicatorList';
import { Shield, Mail, FileText, AlertTriangle } from 'lucide-react';

interface DetectionResult {
  score: number;
  is_phishing: boolean;
  risk_level: string;
  indicators: string[];
  confidence: number;
}

export const DetectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'url' | 'email' | 'text'>('url');
  const [input, setInput] = useState('');
  const [legitimateDomain, setLegitimateDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // Clear input when switching tabs
  const handleTabChange = (tab: 'url' | 'email' | 'text') => {
    setActiveTab(tab);
    setInput('');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();

    try {
      const res = await fetch('/api/v1/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, input, legitimate_domain: legitimateDomain })
      });

      if (!res.ok) {
        throw new Error('Unable to reach server');
      }

      const data = await res.json();
      setResult(data);

      // Save to localStorage for dashboard
      const processingTime = Date.now() - startTime;
      const historyEntry = {
        id: `THR-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        type: activeTab,
        input: input,
        score: data.score,
        is_phishing: data.is_phishing,
        risk_level: data.risk_level,
        confidence: data.confidence,
        indicators: data.indicators,
        processing_time_ms: processingTime
      };

      const stored = localStorage.getItem("phishguard_scan_history");
      const history = stored ? JSON.parse(stored) : [];
      history.push(historyEntry);
      localStorage.setItem("phishguard_scan_history", JSON.stringify(history));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getInputPlaceholder = () => {
    switch (activeTab) {
      case 'url': return 'https://example.com/login';
      case 'email': return 'Paste email headers or raw content here...';
      case 'text': return 'Paste SMS or message text here...';
    }
  };

  const getInputLabel = () => {
    switch (activeTab) {
      case 'url': return 'Target URL';
      case 'email': return 'Email Content';
      case 'text': return 'Message Text';
    }
  };

  return (
    <div className="max-w-[900px] mx-auto py-8 px-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">Threat Detection</h1>
        <p className="text-[var(--color-text-secondary)]">Analyze URLs, emails, and text for phishing indicators using AI/ML models.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-[var(--color-bg-surface)] p-1 rounded-lg w-fit border border-[var(--color-border-subtle)]">
        <button
          onClick={() => handleTabChange('url')}
          className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'url' ? 'bg-white shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Shield className="w-4 h-4" /> URL Analysis
        </button>
        <button
          onClick={() => handleTabChange('email')}
          className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'email' ? 'bg-white shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Mail className="w-4 h-4" /> Email Analysis
        </button>
        <button
          onClick={() => handleTabChange('text')}
          className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'text' ? 'bg-white shadow-sm text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <FileText className="w-4 h-4" /> Text Analysis
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-[14px] font-medium">{error}</span>
        </div>
      )}

      {/* Input Form */}
      <div className="claude-card p-6 mb-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block mb-2 text-[var(--color-text-primary)]">{getInputLabel()}</label>
            {activeTab === 'url' ? (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="claude-input w-full px-4 py-2.5 text-[14px] mono-data"
                required
              />
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="claude-input w-full px-4 py-3 text-[14px] mono-data min-h-[120px] resize-y"
                required
              />
            )}
          </div>
          
          <div>
            <label className="block mb-2 text-[var(--color-text-primary)]">Legitimate Domain (Optional)</label>
            <input
              type="text"
              value={legitimateDomain}
              onChange={(e) => setLegitimateDomain(e.target.value)}
              placeholder="example.com"
              className="claude-input w-full px-4 py-2.5 text-[14px] mono-data"
            />
            <p className="mt-2 text-[12px] text-[var(--color-text-muted)]">Provide the expected domain to check for spoofing attempts.</p>
          </div>

          <button
            type="submit"
            disabled={loading || !input}
            className="claude-button-primary w-full py-2.5 text-[14px] font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              `Analyze ${activeTab === 'url' ? 'URL' : activeTab === 'email' ? 'Email' : 'Text'}`
            )}
          </button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="md:col-span-1 claude-card h-64 bg-[var(--color-bg-surface)]"></div>
          <div className="md:col-span-2 claude-card h-64 bg-[var(--color-bg-surface)]"></div>
        </div>
      )}

      {/* Results Section */}
      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-1">
            <ScoreCard score={result.score} riskLevel={result.risk_level} />
            <div className="mt-4 claude-card p-4 text-center">
              <h4 className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Confidence</h4>
              <span className="text-[24px] font-semibold text-[var(--color-text-primary)]">{result.confidence}%</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <IndicatorList indicators={result.indicators} />
          </div>
        </div>
      )}
    </div>
  );
};
