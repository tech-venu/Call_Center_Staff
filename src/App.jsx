import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import Customers from './pages/Customers';
import Callbacks from './pages/Callbacks';
import Performance from './pages/Performance';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="calls" element={<Calls />} />
            <Route path="customers" element={<Customers />} />
            <Route path="callbacks" element={<Callbacks />} />
            <Route path="performance" element={<Performance />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpSupport />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
