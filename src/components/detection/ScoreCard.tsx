import React from 'react';

interface ScoreCardProps {
  score: number;
  riskLevel: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, riskLevel }) => {
  const getScoreColor = () => {
    if (score > 80) return 'var(--color-accent-red)';
    if (score > 15) return 'var(--color-accent-orange)';
    return 'var(--color-accent-green)';
  };

  const getBadgeColor = () => {
    if (riskLevel.toLowerCase() === 'critical') return 'bg-[var(--color-accent-red)] text-white';
    if (riskLevel.toLowerCase() === 'high') return 'bg-[var(--color-accent-red)] text-white';
    if (riskLevel.toLowerCase() === 'medium') return 'bg-[var(--color-accent-orange)] text-white';
    return 'bg-[var(--color-accent-green)] text-white';
  };

  return (
    <div className="claude-card p-6 flex flex-col items-center justify-center text-center">
      <h3 className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
        Phishing Score
      </h3>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        {/* Simple SVG Circle Progress */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle 
            className="text-[var(--color-border-subtle)] stroke-current" 
            strokeWidth="6" 
            cx="50" cy="50" r="44" 
            fill="transparent" 
          />
          <circle 
            className="stroke-current transition-all duration-1000 ease-out" 
            strokeWidth="6" 
            strokeLinecap="round" 
            cx="50" cy="50" r="44" 
            fill="transparent" 
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - score / 100)}`}
            style={{ color: getScoreColor(), transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold" style={{ color: getScoreColor() }}>
            {score}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] font-medium">/ 100</span>
        </div>
      </div>

      <div className={`px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide ${getBadgeColor()}`}>
        {riskLevel.toUpperCase()} RISK
      </div>
    </div>
  );
};
