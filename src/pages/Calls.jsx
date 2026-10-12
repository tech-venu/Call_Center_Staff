import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CallDetailsPanel from '../components/calls/CallDetailsPanel';
import CallbackModal from '../components/callbacks/CallbackModal';

import {
  PhoneCall,
  Phone,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  Trash2,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpDown,
  LayoutGrid,
  List
} from 'lucide-react';

export default function Calls() {
  const {
    calls,
    deleteCall,
    markCallStatus,
    startSimulatedCall,
    viewingCall,
    setViewingCall,
    staffProfile
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [callToDelete, setCallToDelete] = useState(null);
  const [callbackPrefillCall, setCallbackPrefillCall] = useState(null);

  // Filter and sort calls
  const filteredCalls = useMemo(() => {
    let result = [...calls];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.customerPhone.includes(q) ||
          c.customerEmail.toLowerCase().includes(q) ||
          (c.notes && c.notes.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (priorityFilter !== 'All') {
      result = result.filter((c) => c.priority.toLowerCase() === priorityFilter.toLowerCase());
    }

    if (typeFilter !== 'All') {
      result = result.filter((c) => c.callType.toLowerCase() === typeFilter.toLowerCase());
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.customerName.localeCompare(b.customerName));
    }

    return result;
  }, [calls, search, statusFilter, priorityFilter, typeFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCalls.length / pageSize) || 1;
  const paginatedCalls = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCalls.slice(start, start + pageSize);
  }, [filteredCalls, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Call Management & Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage assigned customer interactions, launch live call simulations, and record wrap-up notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Table / Card view toggle */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() =>
              startSimulatedCall({
                name: 'Direct Softphone Dial',
                phone: '+1 (555) 349-8800',
                callType: 'Outbound'
              })
            }
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Outbound Call</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Call ID, customer name, phone, or notes..."
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Statuses ({calls.length})</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Callback Required">Callback Required</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Call Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Call Types</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
              <option value="Support">Support</option>
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Customer Name</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(statusFilter !== 'All' || priorityFilter !== 'All' || typeFilter !== 'All' || search) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Filtered by:</span>
            {search && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-md">
                Search: "{search}"
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-md">
                Status: {statusFilter}
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-md">
                Priority: {priorityFilter}
              </span>
            )}
            {typeFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-md">
                Type: {typeFilter}
              </span>
            )}
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setPriorityFilter('All');
                setTypeFilter('All');
              }}
              className="text-xs text-blue-600 hover:underline font-semibold ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Table or Cards */}
      {filteredCalls.length === 0 ? (
        <EmptyState
          icon={PhoneCall}
          title="No calls match your criteria"
          description="Try relaxing your status or priority filter, or search with different keywords."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('All');
            setPriorityFilter('All');
            setTypeFilter('All');
          }}
        />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Call ID</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Call Type</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Scheduled Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Outcome</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setViewingCall(call)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {call.id}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{call.customerName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {call.customerPhone}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {call.callType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={call.priority} type="priority" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {call.scheduledTime}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={call.status} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {call.outcome || '—'}
                    </td>

                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {/* Start Call Simulation */}
                        <button
                          type="button"
                          onClick={() => startSimulatedCall(call)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                          title="Start Call Simulation"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewingCall(call)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                          title="View Call Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Mark Completed */}
                        {call.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => markCallStatus(call.id, 'Completed')}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Mark Missed */}
                        {call.status !== 'Completed' && call.status !== 'Missed' && (
                          <button
                            type="button"
                            onClick={() => markCallStatus(call.id, 'Missed', 'No Answer')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Mark as Missed"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Schedule Callback */}
                        <button
                          type="button"
                          onClick={() => setCallbackPrefillCall(call)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                          title="Schedule Callback"
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </button>

                        {/* Delete Call */}
                        <button
                          type="button"
                          onClick={() => setCallToDelete(call)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Call Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedCalls.map((call) => (
            <div
              key={call.id}
              onClick={() => setViewingCall(call)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {call.id}
                  </span>
                  <StatusBadge status={call.status} />
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {call.customerName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {call.customerPhone}
                </p>

                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    {call.callType}
                  </span>
                  <StatusBadge status={call.priority} type="priority" />
                </div>

                {call.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    "{call.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {call.scheduledTime}
                </span>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => startSimulatedCall(call)}
                    className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                    title="Start Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingCall(call)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                    title="Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCallToDelete(call)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {filteredCalls.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredCalls.length)}</strong> of{' '}
            <strong>{filteredCalls.length}</strong> total records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 font-semibold"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Call Details Drawer/Modal */}
      <CallDetailsPanel
        isOpen={Boolean(viewingCall)}
        onClose={() => setViewingCall(null)}
        call={viewingCall}
        onScheduleCallbackForCall={(call) => setCallbackPrefillCall(call)}
      />

      {/* Callback Modal for this call */}
      <CallbackModal
        isOpen={Boolean(callbackPrefillCall)}
        onClose={() => setCallbackPrefillCall(null)}
        prefillCustomer={callbackPrefillCall}
      />

      {/* Delete Call Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(callToDelete)}
        onClose={() => setCallToDelete(null)}
        onConfirm={() => callToDelete && deleteCall(callToDelete.id)}
        title="Delete Call Record?"
        message={`Are you sure you want to delete call record #${callToDelete?.id} for ${callToDelete?.customerName}? This will remove it from the active queue.`}
        confirmText="Yes, Delete Call"
        isDestructive={true}
      />
    </div>
  );
}
