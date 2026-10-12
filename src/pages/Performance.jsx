import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import {
  weeklyChartData,
  monthlyPerformanceData,
  outcomeDistribution
} from '../data/sampleData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  PhoneCall,
  CheckCircle,
  Clock,
  Award,
  Smile,
  Target,
  Calendar,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export default function Performance() {
  const { metrics, staffProfile, calls } = useApp();
  const [period, setPeriod] = useState('week'); // 'today' | 'week' | 'month' | 'quarter'

  // Period multiplier to simulate dynamic data changes
  const periodMultipliers = {
    today: { factor: 1, calls: metrics.totalCalls, successful: metrics.completedCalls, csat: 94, fcr: 88, duration: '04m 12s' },
    week: { factor: 5, calls: 214, successful: 198, csat: 95, fcr: 89, duration: '03m 58s' },
    month: { factor: 22, calls: 894, successful: 832, csat: 94, fcr: 87, duration: '04m 05s' },
    quarter: { factor: 65, calls: 2640, successful: 2470, csat: 93, fcr: 86, duration: '04m 15s' }
  };

  const currentStats = periodMultipliers[period];

  const targetMetrics = [
    { name: 'Daily Call Quota', actual: metrics.completedCalls, target: staffProfile.dailyCallTarget || 45, unit: 'calls', color: 'bg-blue-600' },
    { name: 'First-Call Resolution (FCR)', actual: currentStats.fcr, target: 85, unit: '%', color: 'bg-teal-600' },
    { name: 'Customer Satisfaction (CSAT)', actual: currentStats.csat, target: 90, unit: '%', color: 'bg-purple-600' },
    { name: 'Average Handling Time (AHT)', actual: 238, target: 240, unit: 'sec', inverse: true, color: 'bg-amber-600' },
    { name: 'Service Level Agreement (SLA)', actual: 98.4, target: 95, unit: '%', color: 'bg-emerald-600' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
          <p className="font-bold text-slate-200 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.stroke }}
              />
              <span className="text-slate-300 capitalize">{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header and Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Staff Performance & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Operational telemetry for {staffProfile.name} • {staffProfile.designation}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'quarter', label: 'Quarter' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                period === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300">
        <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span>
          <strong>Demonstration Data:</strong> Analytics benchmarks are simulated representations of call centre operations.
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Calls Handled */}
        <StatCard
          title="Total Handled"
          value={currentStats.calls}
          subtitle="Queued volume"
          change="+8.4%"
          changeType="positive"
          icon={PhoneCall}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
        />

        {/* Successful Calls */}
        <StatCard
          title="Successful"
          value={currentStats.successful}
          subtitle="Resolved contacts"
          change="92.5% rate"
          changeType="positive"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
        />

        {/* Average Duration */}
        <StatCard
          title="Avg Duration"
          value={currentStats.duration}
          subtitle="Target: ≤04:00"
          change="-14s pacing"
          changeType="positive"
          icon={Clock}
          iconColor="text-teal-600"
          iconBg="bg-teal-50 dark:bg-teal-950/50"
        />

        {/* First-Call Resolution */}
        <StatCard
          title="FCR Rate"
          value={`${currentStats.fcr}%`}
          subtitle="Target: ≥85%"
          change="+3.0% SLA"
          changeType="positive"
          icon={Award}
          iconColor="text-purple-600"
          iconBg="bg-purple-50 dark:bg-purple-950/50"
        />

        {/* Customer Satisfaction */}
        <StatCard
          title="CSAT Rating"
          value={`${currentStats.csat}%`}
          subtitle="Post-call rating"
          change="+1.5% high"
          changeType="positive"
          icon={Smile}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
        />

        {/* Target Completion */}
        <StatCard
          title="Daily Quota"
          value={`${Math.round((metrics.completedCalls / (staffProfile.dailyCallTarget || 45)) * 100)}%`}
          subtitle={`${metrics.completedCalls} / ${staffProfile.dailyCallTarget || 45}`}
          change="On track"
          changeType="positive"
          icon={Target}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 dark:bg-rose-950/50"
        />
      </div>

      {/* Target Progress Bars Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
          Performance Target Benchmarks vs Actuals
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Tracking against customer service key performance indicators (KPIs)
        </p>

        <div className="space-y-4">
          {targetMetrics.map((item) => {
            const pct = Math.min(
              100,
              Math.round((item.actual / item.target) * 100)
            );
            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">
                      Actual: <strong className="text-slate-900 dark:text-white">{item.actual}{item.unit}</strong> / Target: {item.target}{item.unit}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ({pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Volume */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Monthly Call Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total resolved interactions over last 6 months
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full">
              H2 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="calls" name="Calls" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FCR & CSAT Quality Curve */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                FCR & CSAT Quality Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Resolution and satisfaction rates by month
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-full">
              Target: 85%+
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[75, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                <Line type="monotone" dataKey="csat" name="CSAT %" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fcr" name="FCR %" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
