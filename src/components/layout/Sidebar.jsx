import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  CalendarClock,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PhoneForwarded,
  X
} from 'lucide-react';

export default function Sidebar() {
  const {
    staffProfile,
    metrics,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    setAvailability,
    showToast
  } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', to: '/', icon: LayoutDashboard },
    { name: 'My Calls', to: '/calls', icon: PhoneCall, badge: metrics.pendingCalls > 0 ? metrics.pendingCalls : null },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Callback Schedule', to: '/callbacks', icon: CalendarClock, badge: metrics.pendingCallbacks > 0 ? metrics.pendingCallbacks : null, badgeColor: 'bg-amber-500' },
    { name: 'Performance', to: '/performance', icon: BarChart3 },
    { name: 'Notifications', to: '/notifications', icon: Bell, badge: metrics.unreadNotifications > 0 ? metrics.unreadNotifications : null, badgeColor: 'bg-rose-500' },
    { name: 'Settings', to: '/settings', icon: Settings },
    { name: 'Help & Support', to: '/help', icon: HelpCircle }
  ];

  const handleLogout = () => {
    showToast('Demo session logged out. Status changed to Offline.', 'info');
    setAvailability('Offline');
  };

  const availabilityColors = {
    Available: 'bg-emerald-500',
    'On Break': 'bg-amber-500',
    Offline: 'bg-slate-400'
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#14213D] text-slate-200 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <div
          onClick={() => {
            navigate('/');
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <PhoneForwarded className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  CallFlow
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">
                  Staff
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Omnichannel Workspace</p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="flex-1 truncate">{item.name}</span>
              )}
              {!isSidebarCollapsed && item.badge && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full text-white ${
                    item.badgeColor || 'bg-blue-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {isSidebarCollapsed && item.badge && (
                <span className="w-2 h-2 rounded-full bg-blue-400 absolute top-2 right-2" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Staff Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#0e172a]">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 ${
            isSidebarCollapsed ? 'justify-center p-1.5' : ''
          }`}
        >
          <div className="relative shrink-0">
            <img
              src={staffProfile.avatar}
              alt={staffProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-600"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#14213D] ${
                availabilityColors[staffProfile.availability] || 'bg-emerald-500'
              }`}
              title={staffProfile.availability}
            />
          </div>

          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {staffProfile.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {staffProfile.designation}
              </p>
            </div>
          )}

          {!isSidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Sign Out / Change to Offline"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 w-inherit z-30 transition-all duration-300">
          <div className={`h-full ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
            {sidebarContent}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
