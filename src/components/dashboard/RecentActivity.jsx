import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, PhoneCall, CheckCircle, Calendar, Star, UserPlus } from 'lucide-react';

export default function RecentActivity() {
  const { recentActivity } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'callback_completed':
      case 'call_completed':
        return { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' };
      case 'call_resolved':
        return { icon: PhoneCall, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' };
      case 'callback_scheduled':
        return { icon: Calendar, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' };
      case 'feedback_received':
        return { icon: Star, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' };
      default:
        return { icon: UserPlus, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Recent Activity & Audit Trail
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Live stream</span>
      </div>

      <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
        {recentActivity.slice(0, 6).map((item) => {
          const { icon: ItemIcon, color } = getIcon(item.type);

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className={`p-2 rounded-xl shrink-0 ${color}`}>
                <ItemIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>

              {item.badge && (
                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
