import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  initialStaffProfile,
  initialCustomers,
  initialCalls,
  initialCallbacks,
  initialNotifications,
  initialRecentActivity,
  initialSchedule
} from '../data/sampleData';
import { generateId, formatDuration } from '../utils/helpers';

const LOCAL_STORAGE_KEY = 'callflow_enterprise_state_v1';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Load initial state with safe fallback
  const loadState = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (err) {
      console.error(`Error loading ${key} from localStorage:`, err);
      return fallback;
    }
  };

  const [staffProfile, setStaffProfile] = useState(() => loadState('staffProfile', initialStaffProfile));
  const [customers, setCustomers] = useState(() => loadState('customers', initialCustomers));
  const [calls, setCalls] = useState(() => loadState('calls', initialCalls));
  const [callbacks, setCallbacks] = useState(() => loadState('callbacks', initialCallbacks));
  const [notifications, setNotifications] = useState(() => loadState('notifications', initialNotifications));
  const [schedule, setSchedule] = useState(() => loadState('schedule', initialSchedule));
  const [recentActivity, setRecentActivity] = useState(() => loadState('recentActivity', initialRecentActivity));

  // Ephemeral UI states
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop compact mode
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isGlobalSearchModalOpen, setIsGlobalSearchModalOpen] = useState(false);

  // Active Call Simulation State
  const [activeCall, setActiveCall] = useState(null);
  // activeCall structure:
  // {
  //   id, customerId, customerName, customerPhone, customerEmail,
  //   callType, status: 'connecting' | 'active' | 'wrapup',
  //   seconds: 0, isMuted: false, isOnHold: false,
  //   originalCallId: null
  // }
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const callTimerRef = useRef(null);

  // Inspect modals / drawers
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [viewingCall, setViewingCall] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_staffProfile`, JSON.stringify(staffProfile));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_calls`, JSON.stringify(calls));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_callbacks`, JSON.stringify(callbacks));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_schedule`, JSON.stringify(schedule));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_recentActivity`, JSON.stringify(recentActivity));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }, [staffProfile, customers, calls, callbacks, notifications, schedule, recentActivity]);

  // Sync Dark/Light theme to DOM
  useEffect(() => {
    if (staffProfile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [staffProfile.theme]);

  // Call simulation interval timer
  useEffect(() => {
    if (activeCall && activeCall.status === 'active' && !activeCall.isOnHold) {
      callTimerRef.current = setInterval(() => {
        setActiveCall((prev) => {
          if (!prev) return null;
          return { ...prev, seconds: prev.seconds + 1 };
        });
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeCall?.status, activeCall?.isOnHold]);

  // Toast notification system
  const showToast = (message, type = 'info') => {
    const id = generateId('TOAST');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Staff Profile Actions
  const updateStaffProfile = (updates) => {
    setStaffProfile((prev) => ({ ...prev, ...updates }));
    showToast('Staff profile preferences updated successfully', 'success');
  };

  const setAvailability = (status) => {
    setStaffProfile((prev) => ({ ...prev, availability: status }));
    showToast(`Staff status updated to: ${status}`, status === 'Available' ? 'success' : 'info');
  };

  const toggleTheme = () => {
    const nextTheme = staffProfile.theme === 'dark' ? 'light' : 'dark';
    setStaffProfile((prev) => ({ ...prev, theme: nextTheme }));
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Activity Logger
  const logActivity = (type, title, description, badge = 'New') => {
    const newAct = {
      id: generateId('ACT'),
      type,
      title,
      description,
      time: 'Just now',
      badge
    };
    setRecentActivity((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: generateId('CUST'),
      lastContact: new Date().toISOString().split('T')[0],
      totalCalls: 0,
      satisfactionScore: 100,
      assignedStaff: staffProfile.name,
      avatar: customerData.avatar || `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=256`
    };
    setCustomers((prev) => [newCust, ...prev]);
    logActivity('customer_created', 'New customer added', `Registered ${newCust.name} (${newCust.company || 'Private'})`, 'Customer');
    showToast(`Customer "${newCust.name}" added successfully`, 'success');
    return newCust;
  };

  const updateCustomer = (id, updates) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Customer record updated', 'success');
  };

  const deleteCustomer = (id) => {
    const target = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast(`Customer "${target?.name || id}" removed`, 'warning');
  };

  // Call Management
  const addCall = (callData) => {
    const newCall = {
      ...callData,
      id: generateId('CALL'),
      assignedStaff: staffProfile.name,
      timestamp: new Date().toISOString()
    };
    setCalls((prev) => [newCall, ...prev]);
    showToast(`Call #${newCall.id} scheduled`, 'success');
    return newCall;
  };

  const updateCall = (id, updates) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast(`Call #${id} updated`, 'success');
  };

  const deleteCall = (id) => {
    setCalls((prev) => prev.filter((c) => c.id !== id));
    showToast(`Call record #${id} deleted`, 'warning');
  };

  const markCallStatus = (id, status, outcome = null) => {
    setCalls((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status,
            outcome: outcome || (status === 'Completed' ? 'Resolved' : c.outcome)
          };
        }
        return c;
      })
    );
    showToast(`Call #${id} marked as ${status}`, 'success');
    logActivity('call_status', `Call #${id} marked as ${status}`, `Status changed by ${staffProfile.name}`, status);
  };

  // Callback Management
  const addCallback = (callbackData) => {
    const newCb = {
      ...callbackData,
      id: generateId('CB'),
      assignedStaff: staffProfile.name,
      status: callbackData.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    setCallbacks((prev) => [newCb, ...prev]);
    logActivity('callback_scheduled', 'New callback scheduled', `Booked with ${newCb.customerName} on ${newCb.date} at ${newCb.time}`, 'Scheduled');
    showToast(`Callback for "${newCb.customerName}" scheduled`, 'success');
    return newCb;
  };

  const updateCallback = (id, updates) => {
    setCallbacks((prev) =>
      prev.map((cb) => (cb.id === id ? { ...cb, ...updates } : cb))
    );
    showToast('Callback updated successfully', 'success');
  };

  const deleteCallback = (id) => {
    const target = callbacks.find((c) => c.id === id);
    setCallbacks((prev) => prev.filter((c) => c.id !== id));
    showToast(`Callback for "${target?.customerName || id}" cancelled`, 'warning');
  };

  const completeCallback = (id) => {
    const target = callbacks.find((c) => c.id === id);
    setCallbacks((prev) =>
      prev.map((cb) => (cb.id === id ? { ...cb, status: 'Completed' } : cb))
    );
    logActivity('callback_completed', 'Callback completed', `Follow-up concluded with ${target?.customerName}`, 'Completed');
    showToast(`Callback #${id} marked as completed`, 'success');
  };

  // Notification Management
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Schedule timeline toggle
  const toggleScheduleItem = (id) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'completed' ? 'in-progress' : item.status === 'in-progress' ? 'upcoming' : 'completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Simulated Telephony Controls
  const startSimulatedCall = (contactOrCall) => {
    const isExistingCall = Boolean(contactOrCall?.id && contactOrCall.id.startsWith('CALL'));
    const customerObj = customers.find((c) => c.id === contactOrCall?.customerId || c.id === contactOrCall?.id);

    const callPayload = {
      id: generateId('CALL-SIM'),
      originalCallId: isExistingCall ? contactOrCall.id : null,
      customerId: customerObj?.id || contactOrCall?.customerId || contactOrCall?.id || 'CUST-GUEST',
      customerName: contactOrCall?.customerName || contactOrCall?.name || 'Customer',
      customerPhone: contactOrCall?.customerPhone || contactOrCall?.phone || '+1 (555) 000-0000',
      customerEmail: contactOrCall?.customerEmail || contactOrCall?.email || 'customer@example.com',
      company: customerObj?.company || contactOrCall?.company || 'Enterprise Client',
      callType: contactOrCall?.callType || 'Support',
      status: 'connecting',
      seconds: 0,
      isMuted: false,
      isOnHold: false,
      notes: ''
    };

    setActiveCall(callPayload);
    setIsCallModalOpen(true);

    // Simulate ring connecting after 1.5 seconds
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'active' } : null));
      showToast(`Call connected with ${callPayload.customerName}`, 'info');
    }, 1500);
  };

  const toggleMute = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const nextMuted = !prev.isMuted;
      showToast(nextMuted ? 'Microphone muted' : 'Microphone unmuted', 'info');
      return { ...prev, isMuted: nextMuted };
    });
  };

  const toggleHold = () => {
    setActiveCall((prev) => {
      if (!prev) return null;
      const nextHold = !prev.isOnHold;
      showToast(nextHold ? 'Call placed on hold' : 'Call resumed', 'info');
      return { ...prev, isOnHold: nextHold };
    });
  };

  const endSimulatedCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setActiveCall((prev) => (prev ? { ...prev, status: 'wrapup' } : null));
    showToast('Call ended. Enter wrap-up notes and outcome.', 'info');
  };

  const completeAndSaveCall = (outcome, callNotes, scheduleCallbackData = null) => {
    if (!activeCall) return;

    const formattedDur = formatDuration(activeCall.seconds);

    if (activeCall.originalCallId) {
      // Update existing call
      setCalls((prev) =>
        prev.map((c) => {
          if (c.id === activeCall.originalCallId) {
            return {
              ...c,
              status: 'Completed',
              outcome: outcome || 'Resolved',
              duration: formattedDur,
              notes: callNotes ? `${c.notes ? c.notes + ' | ' : ''}${callNotes}` : c.notes
            };
          }
          return c;
        })
      );
    } else {
      // Create new call record
      const newCall = {
        id: generateId('CALL'),
        customerId: activeCall.customerId,
        customerName: activeCall.customerName,
        customerPhone: activeCall.customerPhone,
        customerEmail: activeCall.customerEmail,
        callType: activeCall.callType || 'Support',
        priority: 'Medium',
        assignedStaff: staffProfile.name,
        scheduledTime: 'Today, Just Now',
        duration: formattedDur,
        status: 'Completed',
        outcome: outcome || 'Resolved',
        notes: callNotes || 'Simulated call completed successfully.',
        timestamp: new Date().toISOString()
      };
      setCalls((prev) => [newCall, ...prev]);
    }

    // Update customer's totalCalls and lastContact
    if (activeCall.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === activeCall.customerId
            ? {
                ...c,
                totalCalls: (c.totalCalls || 0) + 1,
                lastContact: new Date().toISOString().split('T')[0]
              }
            : c
        )
      );
    }

    // If a follow-up callback was requested during wrap-up
    if (scheduleCallbackData) {
      addCallback({
        customerId: activeCall.customerId,
        customerName: activeCall.customerName,
        customerPhone: activeCall.customerPhone,
        company: activeCall.company,
        date: scheduleCallbackData.date,
        time: scheduleCallbackData.time,
        reason: scheduleCallbackData.reason || `Follow-up after ${outcome} call`,
        priority: scheduleCallbackData.priority || 'Medium',
        status: 'Pending'
      });
    }

    logActivity(
      'call_completed',
      'Call completed and recorded',
      `Spoke with ${activeCall.customerName} (${formattedDur}) - Outcome: ${outcome}`,
      'Completed'
    );

    showToast(`Call record saved (${formattedDur}) - Outcome: ${outcome}`, 'success');

    // Clean up
    setActiveCall(null);
    setIsCallModalOpen(false);
  };

  const closeCallModal = () => {
    if (activeCall && activeCall.status === 'active') {
      if (confirm('Are you sure you want to discard the active call session?')) {
        setActiveCall(null);
        setIsCallModalOpen(false);
      }
    } else {
      setActiveCall(null);
      setIsCallModalOpen(false);
    }
  };

  // Reset Demo Data
  const resetDemoData = () => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_staffProfile`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_customers`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_calls`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_callbacks`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_notifications`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_schedule`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_recentActivity`);

      setStaffProfile(initialStaffProfile);
      setCustomers(initialCustomers);
      setCalls(initialCalls);
      setCallbacks(initialCallbacks);
      setNotifications(initialNotifications);
      setSchedule(initialSchedule);
      setRecentActivity(initialRecentActivity);

      document.documentElement.classList.remove('dark');
      showToast('All application data reset to original seed state!', 'success');
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Computed metrics for dashboard and performance
  const metrics = {
    totalCalls: calls.length,
    completedCalls: calls.filter((c) => c.status === 'Completed').length,
    pendingCalls: calls.filter((c) => c.status === 'Pending' || c.status === 'In Progress').length,
    missedCalls: calls.filter((c) => c.status === 'Missed').length,
    pendingCallbacks: callbacks.filter((cb) => cb.status === 'Pending' || cb.status === 'Overdue').length,
    overdueCallbacks: callbacks.filter((cb) => cb.status === 'Overdue').length,
    completedCallbacks: callbacks.filter((cb) => cb.status === 'Completed').length,
    unreadNotifications: notifications.filter((n) => !n.read).length,
    averageSatisfaction: 94,
    firstCallResolutionRate: 88,
    averageHandleDuration: '04m 12s'
  };

  return (
    <AppContext.Provider
      value={{
        staffProfile,
        updateStaffProfile,
        setAvailability,
        toggleTheme,

        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,

        calls,
        addCall,
        updateCall,
        deleteCall,
        markCallStatus,

        callbacks,
        addCallback,
        updateCallback,
        deleteCallback,
        completeCallback,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,

        schedule,
        toggleScheduleItem,

        recentActivity,
        logActivity,

        toasts,
        showToast,
        removeToast,

        isSidebarOpen,
        setIsSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,

        globalSearchTerm,
        setGlobalSearchTerm,
        isGlobalSearchModalOpen,
        setIsGlobalSearchModalOpen,

        viewingCustomer,
        setViewingCustomer,
        viewingCall,
        setViewingCall,

        activeCall,
        isCallModalOpen,
        setIsCallModalOpen,
        startSimulatedCall,
        toggleMute,
        toggleHold,
        endSimulatedCall,
        completeAndSaveCall,
        closeCallModal,

        resetDemoData,
        metrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
