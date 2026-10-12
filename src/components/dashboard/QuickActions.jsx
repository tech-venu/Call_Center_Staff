import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PhoneCall, UserPlus, CalendarPlus, TrendingUp } from 'lucide-react';

export default function QuickActions({ onOpenAddCustomer, onOpenAddCallback }) {
  const { startSimulatedCall } = useApp();
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start a Call',
      description: 'Simulate softphone inbound/outbound call',
      icon: PhoneCall,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'Live Simulator',
      onClick: () =>
        startSimulatedCall({
          name: 'Eleanor Vance',
          phone: '+1 (555) 482-9012',
          callType: 'Support'
        })
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer account',
      icon: UserPlus,
      color: 'bg-teal-600 hover:bg-teal-700 text-white',
      badge: 'Directory',
      onClick: onOpenAddCustomer
    },
    {
      title: 'Schedule Callback',
      description: 'Book a customer phone appointment',
      icon: CalendarPlus,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'Calendar',
      onClick: onOpenAddCallback
    },
    {
      title: 'View Performance',
      description: 'Inspect metrics, CSAT & call duration',
      icon: TrendingUp,
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
      badge: 'Analytics',
      onClick: () => navigate('/performance')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.title}
            type="button"
            onClick={act.onClick}
            className={`p-4 rounded-2xl shadow-xs hover:shadow-md transition-all text-left flex items-start justify-between group ${act.color}`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white/90 px-2 py-0.5 rounded-full inline-block mb-2">
                {act.badge}
              </span>
              <h4 className="text-base font-bold text-white group-hover:translate-x-0.5 transition-transform">
                {act.title}
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                {act.description}
              </p>
            </div>
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0 ml-2 group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
