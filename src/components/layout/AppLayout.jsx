import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../common/ToastContainer';
import GlobalSearchModal from '../common/GlobalSearchModal';
import SimulatedCallModal from '../calls/SimulatedCallModal';
import { useApp } from '../../context/AppContext';

export default function AppLayout() {
  const { isGlobalSearchModalOpen, setIsGlobalSearchModalOpen } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Utility Bar */}
        <Topbar />

        {/* Dynamic Route Pages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <GlobalSearchModal
        isOpen={isGlobalSearchModalOpen}
        onClose={() => setIsGlobalSearchModalOpen(false)}
      />
      <SimulatedCallModal />
    </div>
  );
}
