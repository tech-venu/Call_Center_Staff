import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CallbackModal from '../components/callbacks/CallbackModal';
import CustomerDrawer from '../components/customers/CustomerDrawer';

import {
  CalendarClock,
  CalendarPlus,
  Phone,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
  User,
  Calendar,
  Building,
  CheckCircle
} from 'lucide-react';

export default function Callbacks() {
  const {
    callbacks,
    completeCallback,
    deleteCallback,
    startSimulatedCall,
    customers,
    viewingCustomer,
    setViewingCustomer
  } = useApp();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Today' | 'Overdue' | 'Upcoming' | 'Completed'
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [callbackToEdit, setCallbackToEdit] = useState(null);
  const [callbackToDelete, setCallbackToDelete] = useState(null);

  const todayDateStr = new Date().toISOString().split('T')[0];

  // Counts for tabs
  const overdueCount = callbacks.filter((cb) => cb.status === 'Overdue').length;
  const todayCount = callbacks.filter((cb) => cb.date === todayDateStr && cb.status === 'Pending').length;
  const upcomingCount = callbacks.filter((cb) => cb.status === 'Upcoming').length;
  const completedCount = callbacks.filter((cb) => cb.status === 'Completed').length;

  // Filter callbacks
  const filteredCallbacks = useMemo(() => {
    let result = [...callbacks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (cb) =>
          cb.customerName.toLowerCase().includes(q) ||
          cb.customerPhone.includes(q) ||
          cb.reason.toLowerCase().includes(q) ||
          (cb.company && cb.company.toLowerCase().includes(q))
      );
    }

    if (activeTab === 'Today') {
      result = result.filter((cb) => cb.date === todayDateStr && cb.status !== 'Completed');
    } else if (activeTab === 'Overdue') {
      result = result.filter((cb) => cb.status === 'Overdue');
    } else if (activeTab === 'Upcoming') {
      result = result.filter((cb) => cb.status === 'Upcoming');
    } else if (activeTab === 'Completed') {
      result = result.filter((cb) => cb.status === 'Completed');
    }

    if (priorityFilter !== 'All') {
      result = result.filter((cb) => cb.priority.toLowerCase() === priorityFilter.toLowerCase());
    }

    // Sort: Overdue first, then by date and time
    result.sort((a, b) => {
      if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
      if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
      return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
    });

    return result;
  }, [callbacks, search, activeTab, priorityFilter, todayDateStr]);

  const handleOpenCustomer = (cb) => {
    const cust = customers.find((c) => c.id === cb.customerId || c.name === cb.customerName);
    if (cust) {
      setViewingCustomer(cust);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Customer Callback Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize scheduled phone appointments, overdue follow-ups, and customer re-engagement pipelines.
          </p>
        </div>

        <button
          onClick={() => {
            setCallbackToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Schedule Callback</span>
        </button>
      </div>

      {/* Tabs and KPI counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('All')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'All'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>All Callbacks</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">
            {callbacks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Today')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'Today'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Today's Callbacks</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300">
            {todayCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Overdue')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'Overdue'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Overdue</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white">
            {overdueCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'Upcoming'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Upcoming</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {upcomingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Completed')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'Completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Completed</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            {completedCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by customer, phone, company, or agenda..."
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Callbacks List / Cards */}
      {filteredCallbacks.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No callbacks match your criteria"
          description="You are caught up on this queue. Schedule a new customer callback when required."
          actionLabel="Schedule Callback"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCallbacks.map((cb) => {
            const isOverdue = cb.status === 'Overdue';
            const isCompleted = cb.status === 'Completed';

            return (
              <div
                key={cb.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isOverdue
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/40 opacity-80'
                    : 'border-slate-200/80 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500">
                      <span>{cb.id}</span>
                      <span>•</span>
                      <StatusBadge status={cb.priority} type="priority" />
                    </div>
                    <StatusBadge status={cb.status} />
                  </div>

                  {/* Customer Info */}
                  <div
                    onClick={() => handleOpenCustomer(cb)}
                    className="cursor-pointer group inline-block"
                  >
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cb.customerName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 shrink-0" />
                      <span>{cb.company || 'Enterprise Account'}</span>
                    </p>
                  </div>

                  {/* Date and Time Schedule */}
                  <div className="flex items-center gap-3 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>{cb.date}</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{cb.time}</span>
                    </div>
                  </div>

                  {/* Agenda/Reason */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {cb.reason}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {/* Launch Call Simulation */}
                    <button
                      type="button"
                      onClick={() =>
                        startSimulatedCall({
                          name: cb.customerName,
                          phone: cb.customerPhone,
                          company: cb.company,
                          callType: 'Outbound'
                        })
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      title="Call this customer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </button>

                    {/* Complete Callback */}
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => completeCallback(cb.id)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors"
                        title="Mark as Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reschedule / Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setCallbackToEdit(cb);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
                      title="Reschedule / Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete / Cancel */}
                    <button
                      type="button"
                      onClick={() => setCallbackToDelete(cb)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                      title="Cancel Callback"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Callback Modal */}
      <CallbackModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCallbackToEdit(null);
        }}
        callbackToEdit={callbackToEdit}
      />

      {/* Customer Drawer if clicked */}
      <CustomerDrawer
        isOpen={Boolean(viewingCustomer)}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
        onEditCustomer={() => {}}
        onDeleteCustomer={() => {}}
        onScheduleCallback={() => {}}
      />

      {/* Cancel Callback Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(callbackToDelete)}
        onClose={() => setCallbackToDelete(null)}
        onConfirm={() => callbackToDelete && deleteCallback(callbackToDelete.id)}
        title="Cancel Scheduled Callback?"
        message={`Are you sure you want to cancel the callback for ${callbackToDelete?.customerName} (${callbackToDelete?.time})?`}
        confirmText="Yes, Cancel Callback"
        isDestructive={true}
      />
    </div>
  );
}
