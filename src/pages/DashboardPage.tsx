import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ScanEntry {
  id: string;
  timestamp: string;
  type: "url" | "email" | "text";
  input: string;
  score: number;
  is_phishing: boolean;
  risk_level: "critical" | "high" | "medium" | "low";
  confidence: number;
  indicators: string[];
  processing_time_ms: number;
}

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("phishguard_scan_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    } catch (e) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats calculations
  const totalScans = history.length;
  const threatsDetected = history.filter((x) => x.is_phishing).length;
  const detectionRate =
    totalScans > 0 ? ((threatsDetected / totalScans) * 100).toFixed(1) + "%" : "--";
  const avgResponseTime =
    totalScans > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + curr.processing_time_ms, 0) /
            totalScans
        ) + "ms"
      : "--";

  // Chart 1: Threat Activity Line Chart (Last 7 Days)
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateStr: d.toISOString().split("T")[0],
        name: d.toLocaleDateString("en-US", { weekday: "short" }),
        total: 0,
        threats: 0,
      });
    }

    history.forEach((entry) => {
      const entryDate = entry.timestamp.split("T")[0];
      const day = days.find((d) => d.dateStr === entryDate);
      if (day) {
        day.total += 1;
        if (entry.is_phishing) {
          day.threats += 1;
        }
      }
    });

    return days;
  };

  const lineChartData = getLast7DaysData();
  const hasLineChartData = lineChartData.some((d) => d.total > 0);

  // Chart 2: Risk Distribution Donut
  const getRiskDistribution = () => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    history.forEach((entry) => {
      if (entry.is_phishing && counts[entry.risk_level] !== undefined) {
        counts[entry.risk_level]++;
      }
    });
    return [
      { name: "Critical", value: counts.critical, color: "#dc2626" },
      { name: "High", value: counts.high, color: "#f97316" },
      { name: "Medium", value: counts.medium, color: "#eab308" },
      { name: "Low", value: counts.low, color: "#16a34a" },
    ].filter((item) => item.value > 0);
  };

  const pieChartData = getRiskDistribution();
  const hasPieChartData = pieChartData.length > 0;

  // Table: Recent Detections
  const recentDetections = [...history]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-[#fef2f2] text-[#dc2626]";
      case "high":
        return "bg-[#fff7ed] text-[#c2410c]";
      case "medium":
        return "bg-[#fffbeb] text-[#d97706]";
      case "low":
        return "bg-[#f0fdf4] text-[#16a34a]";
      default:
        return "bg-[#f5f4ef] text-[#6b6b6b]";
    }
  };

  const getScoreColor = (score: number) => {
    const s = score * 100;
    if (s > 55) return "#dc2626";
    if (s >= 35) return "#d97706";
    return "#16a34a";
  };

  // Top Threat Indicators
  const getTopIndicators = () => {
    const counts: Record<string, number> = {};
    history
      .filter((x) => x.is_phishing)
      .forEach((entry) => {
        entry.indicators.forEach((ind) => {
          counts[ind] = (counts[ind] || 0) + 1;
        });
      });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
    const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

    return sorted.map(([name, count], index) => {
      let color = "#eab308"; // 5-7
      if (index < 2) color = "#dc2626"; // 1-2
      else if (index < 4) color = "#f97316"; // 3-4

      return { name, count, maxCount, color };
    });
  };

  const topIndicators = getTopIndicators();

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto py-8 px-6 animate-pulse">
        <div className="h-8 bg-[#f5f4ef] w-48 mb-2 rounded"></div>
        <div className="h-4 bg-[#f5f4ef] w-64 mb-8 rounded"></div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#f5f4ef] rounded-xl border border-[#e5e5e3]"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-6 mb-6">
          <div className="col-span-3 h-64 bg-[#f5f4ef] rounded-xl border border-[#e5e5e3]"></div>
          <div className="col-span-2 h-64 bg-[#f5f4ef] rounded-xl border border-[#e5e5e3]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto py-8 px-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1a1a1a] mb-1">
            Dashboard
          </h1>
          <p className="text-[13px] text-[#6b6b6b]">
            Overview of your phishing detection activity
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-white border border-[#e5e5e3] text-[#1a1a1a] rounded-md text-[13px] font-medium hover:bg-[#f9f9f8] transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* SECTION 1 — 4 STAT CARDS */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {/* Card 1 */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-[16px_18px]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#2563eb]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">
            {totalScans > 0 ? totalScans : "--"}
          </div>
          <div className="text-[12px] text-[#6b6b6b]">All time</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-[16px_18px]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-full bg-[#fef2f2] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#dc2626]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div
            className={`text-2xl font-semibold mb-1 ${
              threatsDetected > 0 ? "text-[#dc2626]" : "text-[#1a1a1a]"
            }`}
          >
            {totalScans > 0 ? threatsDetected : "--"}
          </div>
          <div className="text-[12px] text-[#6b6b6b]">
            {totalScans > 0
              ? `${((threatsDetected / totalScans) * 100).toFixed(
                  1
                )}% of total scans`
              : "0% of total scans"}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-[16px_18px]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#16a34a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">
            {detectionRate}
          </div>
          <div className="text-[12px] text-[#6b6b6b]">Based on your scans</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#e5e5e3] rounded-xl p-[16px_18px]">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-full bg-[#fffbeb] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#d97706]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">
            {avgResponseTime}
          </div>
          <div className="text-[12px] text-[#6b6b6b]">Per analysis</div>
        </div>
      </div>

      {totalScans === 0 && (
        <div className="mb-6 p-8 bg-[#f9f9f8] border border-[#e5e5e3] rounded-xl text-center">
          <p className="text-[14px] text-[#6b6b6b] mb-4">
            No scan data yet. Run your first analysis.
          </p>
          <button
            onClick={() => setActiveTab('detection')}
            className="inline-block px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-[13px] font-medium hover:bg-[#333333] transition-colors"
          >
            Go to Detection →
          </button>
        </div>
      )}

      {/* SECTION 2 — CHARTS ROW */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* Left — Threat Activity Line Chart */}
        <div className="col-span-3 bg-white border border-[#e5e5e3] rounded-xl p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#1a1a1a] mb-4">
            Threat Activity
          </h3>
          <div className="flex-1 min-h-[200px] relative flex flex-col">
            {!hasLineChartData ? (
              <div className="absolute inset-0 flex items-center justify-center text-[13px] text-[#9b9b9b]">
                No activity in last 7 days
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineChartData}
                      margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b6b6b" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b6b6b" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e5e3",
                          borderRadius: "8px",
                          fontSize: "12px",
                          boxShadow: "none",
                        }}
                        itemStyle={{ color: "#1a1a1a" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Scans"
                        stroke="#1a1a1a"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="threats"
                        name="Threats"
                        stroke="#dc2626"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#1a1a1a] rounded-full"></div>
                    <span className="text-[12px] text-[#6b6b6b]">
                      Total Scans
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-1 bg-[#dc2626] rounded-full"
                      style={{ borderStyle: "dashed" }}
                    ></div>
                    <span className="text-[12px] text-[#6b6b6b]">Threats</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right — Risk Distribution Donut */}
        <div className="col-span-2 bg-white border border-[#e5e5e3] rounded-xl p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#1a1a1a] mb-4">
            Risk Distribution
          </h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
            {!hasPieChartData ? (
              <div className="text-[13px] text-[#9b9b9b]">
                No threats detected
              </div>
            ) : (
              <>
                <div className="w-1/2 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e5e3",
                          borderRadius: "8px",
                          fontSize: "12px",
                          boxShadow: "none",
                        }}
                        itemStyle={{ color: "#1a1a1a" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[20px] font-semibold text-[#1a1a1a]">
                      {threatsDetected}
                    </span>
                  </div>
                </div>
                <div className="w-1/2 pl-4 flex flex-col justify-center gap-3">
                  {pieChartData.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-[12px] text-[#6b6b6b]">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-[12px] font-medium text-[#1a1a1a]">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3 — BOTTOM ROW */}
      <div className="grid grid-cols-11 gap-6">
        {/* Left — Recent Detections Table */}
        <div className="col-span-6 bg-white border border-[#e5e5e3] rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-[#1a1a1a] mb-4">
            Recent Detections
          </h3>
          {recentDetections.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#9b9b9b]">
              No scans yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-3 text-[10px] uppercase text-[#9b9b9b] font-medium border-b border-[#e5e5e3]">
                      Input
                    </th>
                    <th className="pb-3 text-[10px] uppercase text-[#9b9b9b] font-medium border-b border-[#e5e5e3]">
                      Type
                    </th>
                    <th className="pb-3 text-[10px] uppercase text-[#9b9b9b] font-medium border-b border-[#e5e5e3]">
                      Risk
                    </th>
                    <th className="pb-3 text-[10px] uppercase text-[#9b9b9b] font-medium border-b border-[#e5e5e3]">
                      Score
                    </th>
                    <th className="pb-3 text-[10px] uppercase text-[#9b9b9b] font-medium border-b border-[#e5e5e3]">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDetections.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#fafaf8] transition-colors group"
                    >
                      <td className="py-3 border-b border-[#e5e5e3] max-w-[150px]">
                        <div
                          className="font-mono text-[11px] text-[#1a1a1a] truncate"
                          title={item.input}
                        >
                          {item.input.length > 30
                            ? item.input.substring(0, 30) + "..."
                            : item.input}
                        </div>
                      </td>
                      <td className="py-3 border-b border-[#e5e5e3]">
                        <span className="px-2 py-0.5 bg-[#f5f4ef] text-[#6b6b6b] rounded text-[10px] font-medium uppercase">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 border-b border-[#e5e5e3]">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${getRiskBadgeStyle(
                            item.risk_level
                          )}`}
                        >
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="py-3 border-b border-[#e5e5e3]">
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: getScoreColor(item.score) }}
                        >
                          {(item.score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3 border-b border-[#e5e5e3]">
                        <span className="text-[11px] text-[#6b6b6b]">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right — Top Threat Indicators */}
        <div className="col-span-5 bg-white border border-[#e5e5e3] rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-[#1a1a1a] mb-4">
            Top Threat Indicators
          </h3>
          {topIndicators.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#9b9b9b]">
              No threat indicators yet.
            </div>
          ) : (
            <div className="space-y-4">
              {topIndicators.map((ind, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[12px] text-[#6b6b6b] truncate pr-4">
                      {ind.name}
                    </span>
                    <span className="text-[12px] font-medium text-[#1a1a1a]">
                      {ind.count}
                    </span>
                  </div>
                  <div className="w-full h-[5px] bg-[#f5f4ef] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(ind.count / ind.maxCount) * 100}%`,
                        backgroundColor: ind.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
