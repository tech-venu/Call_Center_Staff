import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  PhoneCall,
  ChevronDown,
  RotateCcw,
  User,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle2,
  Clock,
  CircleDot
} from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

export default function Topbar() {
  const {
    staffProfile,
    metrics,
    setIsSidebarOpen,
    setIsGlobalSearchModalOpen,
    setAvailability,
    toggleTheme,
    startSimulatedCall,
    resetDemoData
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAvailabilityMenuOpen, setIsAvailabilityMenuOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const availabilityMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (availabilityMenuRef.current && !availabilityMenuRef.current.contains(e.target)) {
        setIsAvailabilityMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format current date: e.g. "Monday, Oct 12, 2026"
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Page titles and breadcrumbs based on pathname
  const routeTitles = {
    '/': { title: 'Dashboard Overview', breadcrumb: 'Overview' },
    '/calls': { title: 'Call Management', breadcrumb: 'My Calls' },
    '/customers': { title: 'Customer Directory', breadcrumb: 'Customers' },
    '/callbacks': { title: 'Callback Schedule', breadcrumb: 'Callbacks' },
    '/performance': { title: 'Agent Performance', breadcrumb: 'Performance' },
    '/notifications': { title: 'Notifications & Alerts', breadcrumb: 'Notifications' },
    '/settings': { title: 'Staff Settings & Preferences', breadcrumb: 'Settings' },
    '/help': { title: 'Help & Knowledge Center', breadcrumb: 'Help & Support' }
  };

  const currentRoute = routeTitles[location.pathname] || {
    title: 'CallFlow Workspace',
    breadcrumb: 'Workspace'
  };

  const availabilityOptions = [
    { label: 'Available', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
    { label: 'On Break', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
    { label: 'Offline', dot: 'bg-slate-400', text: 'text-slate-700 dark:text-slate-400' }
  ];

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
        {/* Left Section: Mobile toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">CallFlow</span>
              <span>/</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {currentRoute.breadcrumb}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {currentRoute.title}
            </h1>
          </div>
        </div>

        {/* Right Section: Actions, Search, Status, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Bar (Trigger) */}
          <button
            onClick={() => setIsGlobalSearchModalOpen(true)}
            className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all w-56 xl:w-64"
            title="Search anything (⌘K)"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="flex-1 text-left truncate">Search callers or logs...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Quick Start Call Button */}
          <button
            onClick={() =>
              startSimulatedCall({
                name: 'Simulated Inbound Caller',
                phone: '+1 (555) 782-9014',
                callType: 'Inbound'
              })
            }
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            title="Launch demo call simulator"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start Call</span>
          </button>

          {/* Availability Status Selector */}
          <div className="relative" ref={availabilityMenuRef}>
            <button
              onClick={() => setIsAvailabilityMenuOpen(!isAvailabilityMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
              title="Change availability status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  staffProfile.availability === 'Available'
                    ? 'bg-emerald-500'
                    : staffProfile.availability === 'On Break'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="hidden sm:inline">{staffProfile.availability}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isAvailabilityMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Set Availability
                </div>
                {availabilityOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setAvailability(opt.label);
                      setIsAvailabilityMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                      staffProfile.availability === opt.label
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={staffProfile.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {staffProfile.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {metrics.unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {metrics.unreadNotifications}
              </span>
            )}
          </button>

          {/* Date Label (Desktop) */}
          <div className="hidden xl:flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>{todayFormatted}</span>
          </div>

          {/* Staff Avatar & Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open profile menu"
            >
              <img
                src={staffProfile.avatar}
                alt={staffProfile.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in-0 zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {staffProfile.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {staffProfile.email}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    ID: {staffProfile.employeeId}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsResetConfirmOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setAvailability('Offline');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (Go Offline)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset All Demo Data?"
        message="This will reset all customer records, call history, callbacks, and notifications back to the initial sample dataset. Any recent additions will be restored."
        confirmText="Yes, Reset Data"
        isDestructive={false}
      />
    </>
  );
}
