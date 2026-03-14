"use client";
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Lock, Globe, Mail, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl font-bold">PhishGuard OS</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
            <Activity className="w-4 h-4" /> System Online
          </span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Scans (24h)</h3>
          <p className="text-3xl font-bold">124,592</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Threats Blocked</h3>
          <p className="text-3xl font-bold text-rose-500">3,841</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">ML Accuracy</h3>
          <p className="text-3xl font-bold text-emerald-500">99.4%</p>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-96 flex items-center justify-center">
        <p className="text-slate-500">Run the full system locally to see real-time WebSocket data.</p>
      </div>
    </div>
  );
}
