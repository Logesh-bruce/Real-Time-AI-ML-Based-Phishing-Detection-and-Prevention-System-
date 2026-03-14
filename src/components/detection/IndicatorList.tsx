import React from 'react';

interface IndicatorListProps {
  indicators: string[];
}

export const IndicatorList: React.FC<IndicatorListProps> = ({ indicators }) => {
  const getIndicatorColor = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('suspicious') || lower.includes('invalid') || lower.includes('spoof') || lower.includes('phishing')) {
      return 'border-l-[var(--color-accent-red)]';
    }
    if (lower.includes('age') || lower.includes('mismatch')) {
      return 'border-l-[var(--color-accent-orange)]';
    }
    return 'border-l-[var(--color-accent-green)]';
  };

  const getDotColor = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('suspicious') || lower.includes('invalid') || lower.includes('spoof') || lower.includes('phishing')) {
      return 'bg-[var(--color-accent-red)]';
    }
    if (lower.includes('age') || lower.includes('mismatch')) {
      return 'bg-[var(--color-accent-orange)]';
    }
    return 'bg-[var(--color-accent-green)]';
  };

  return (
    <div className="claude-card p-6">
      <h3 className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
        Detection Indicators
      </h3>
      <div className="space-y-3">
        {indicators.map((indicator, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 p-3 border-l-4 rounded-r-md bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] ${getIndicatorColor(indicator)}`}
          >
            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${getDotColor(indicator)}`} />
            <span className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">
              {indicator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
