import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTimeOfDayGreeting } from '../utils/helpers';
import StatCard from '../components/common/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import RecentActivity from '../components/dashboard/RecentActivity';
import CustomerModal from '../components/customers/CustomerModal';
import CallbackModal from '../components/callbacks/CallbackModal';

import { PhoneCall, CheckCircle2, CalendarClock, Smile, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { staffProfile, metrics } = useApp();
  const navigate = useNavigate();

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddCallbackOpen, setIsAddCallbackOpen] = useState(false);

  const greeting = getTimeOfDayGreeting();
  const firstName = staffProfile.name.split(' ')[0] || 'Alex';

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate completion percentage against daily target
  const dailyTarget = staffProfile.dailyCallTarget || 45;
  const completionPercentage = Math.round((metrics.completedCalls / dailyTarget) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1e3a8a] to-[#0D9488] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-200 border border-white/15 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>{todayDateString}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {firstName}! Ready to make today a great one?
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 mt-1 max-w-2xl">
              You are assigned to Tier 2 priority queues. 5 scheduled callbacks pending today with 94% customer satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/15 text-center">
              <p className="text-xs uppercase tracking-wider text-teal-200 font-bold">
                Shift Target
              </p>
              <p className="text-xl sm:text-2xl font-black mt-0.5">
                {metrics.completedCalls} / {dailyTarget}
              </p>
              <p className="text-[11px] text-white/80">Calls Handled</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Calls */}
        <StatCard
          title="Total Calls"
          value={metrics.totalCalls}
          subtitle="Assigned queue load"
          change="+12% vs yesterday"
          changeType="positive"
          icon={PhoneCall}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
          onClick={() => navigate('/calls')}
        />

        {/* 2. Calls Completed */}
        <StatCard
          title="Calls Completed"
          value={metrics.completedCalls}
          subtitle={`${completionPercentage}% of daily goal (${dailyTarget})`}
          change="+4 calls ahead of pace"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          progressPercent={completionPercentage}
          onClick={() => navigate('/calls')}
        />

        {/* 3. Pending Callbacks */}
        <StatCard
          title="Pending Callbacks"
          value={metrics.pendingCallbacks}
          subtitle={
            metrics.overdueCallbacks > 0
              ? `${metrics.overdueCallbacks} overdue priority item`
              : 'All callbacks on schedule'
          }
          change={metrics.overdueCallbacks > 0 ? 'Requires attention' : 'Optimal'}
          changeType={metrics.overdueCallbacks > 0 ? 'negative' : 'positive'}
          icon={CalendarClock}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          onClick={() => navigate('/callbacks')}
        />

        {/* 4. Customer Satisfaction */}
        <StatCard
          title="Customer CSAT"
          value={`${metrics.averageSatisfaction}%`}
          subtitle="Based on 42 surveys this week"
          change="+2.4% vs team average"
          changeType="positive"
          icon={Smile}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-50 dark:bg-teal-950/50"
          onClick={() => navigate('/performance')}
        />
      </div>

      {/* Quick Actions Row */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Operational Actions
        </h3>
        <QuickActions
          onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
          onOpenAddCallback={() => setIsAddCallbackOpen(true)}
        />
      </div>

      {/* Operational Charts */}
      <DashboardCharts />

      {/* Today's Schedule and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySchedule />
        <RecentActivity />
      </div>

      {/* Modal Dialogs */}
      <CustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      />
      <CallbackModal
        isOpen={isAddCallbackOpen}
        onClose={() => setIsAddCallbackOpen(false)}
      />
    </div>
  );
}
