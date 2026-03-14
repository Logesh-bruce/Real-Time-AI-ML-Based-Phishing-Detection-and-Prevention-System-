import React, { useState } from 'react';
import { Search, Image as ImageIcon, ShieldCheck, AlertTriangle, Eye, Globe } from 'lucide-react';

export default function BrandProtection() {
  const [brand, setBrand] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;
    
    setIsSearching(true);
    setResults([]);
    
    setTimeout(() => {
      setResults([
        { id: 1, domain: `login-${brand.toLowerCase()}-secure.tk`, similarity: 98, status: 'Active Threat', image: 'https://picsum.photos/seed/phish1/400/300' },
        { id: 2, domain: `update-${brand.toLowerCase()}-account.com`, similarity: 92, status: 'Active Threat', image: 'https://picsum.photos/seed/phish2/400/300' },
        { id: 3, domain: `verify-${brand.toLowerCase()}.net`, similarity: 85, status: 'Takedown Pending', image: 'https://picsum.photos/seed/phish3/400/300' },
      ]);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[var(--color-accent-green)]" />
          Brand Protection & Takedown
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Monitor the web for visual impersonations of your brand using CNNs.</p>
      </header>

      <div className="glass-card p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold mb-2 block">
              Target Brand Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--color-text-secondary)]" />
              </div>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., PayPal, Microsoft, Apple..."
                className="block w-full pl-10 pr-3 py-3 border border-[var(--color-border-subtle)] rounded-xl bg-[var(--color-bg-main)] text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-blue)]/50 focus:ring-1 focus:ring-[var(--color-accent-blue)]/50 transition-all sm:text-sm font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching || !brand}
            className="py-3 px-8 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-accent-blue)] text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] h-[46px]"
          >
            {isSearching ? 'SCANNING WEB...' : 'SEARCH'}
          </button>
        </form>
      </div>

      {isSearching && (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-secondary)]">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-blue)]/20 border-t-[var(--color-accent-blue)] rounded-full animate-spin mb-4 shadow-[0_0_15px_var(--color-accent-blue)]" />
          <p className="font-mono text-sm uppercase tracking-widest animate-pulse">Analyzing Visual Signatures...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500">
          {results.map((result) => (
            <div key={result.id} className="glass-card overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-red)]/50 transition-all group">
              <div className="relative h-48 bg-[var(--color-bg-main)] border-b border-[var(--color-border-subtle)]">
                <img 
                  src={result.image} 
                  alt="Screenshot" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-[var(--color-bg-card)]/90 backdrop-blur px-3 py-1 rounded-full border border-[var(--color-border-subtle)] flex items-center gap-2">
                  <ImageIcon className="w-3 h-3 text-[var(--color-text-secondary)]" />
                  <span className="text-xs font-mono text-white">{result.similarity}% Match</span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 truncate pr-4">
                    <h3 className="text-sm font-bold text-white font-mono truncate flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0" />
                      {result.domain}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border shrink-0 ${
                    result.status === 'Active Threat' 
                      ? 'bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] border-[var(--color-accent-red)]/30' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}>
                    {result.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-accent-blue)]/50 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Takedown
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
