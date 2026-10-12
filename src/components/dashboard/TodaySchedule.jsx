import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export default function TodaySchedule() {
  const { schedule, toggleScheduleItem } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Today's Schedule & Timeline
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Click item to toggle status
        </span>
      </div>

      <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto">
        {schedule.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isInProgress = item.status === 'in-progress';
          const isUpcoming = item.status === 'upcoming';

          return (
            <div
              key={item.id}
              onClick={() => toggleScheduleItem(item.id)}
              className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isInProgress
                  ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/20'
                  : isCompleted
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 opacity-80'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80'
              }`}
            >
              {/* Status indicator icon */}
              <div className="mt-0.5 shrink-0">
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                {isInProgress && (
                  <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                )}
                {isUpcoming && (
                  <Circle className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>

              {/* Time & Title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isInProgress
                        ? 'text-blue-700 dark:text-blue-400'
                        : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.time}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : isInProgress
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4
                  className={`text-xs font-bold mt-0.5 ${
                    isCompleted
                      ? 'text-slate-600 dark:text-slate-400 line-through'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
