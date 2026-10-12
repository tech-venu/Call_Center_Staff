import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Users, PhoneCall, CalendarClock, ArrowRight, X, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const { customers, calls, callbacks, setViewingCustomer, setViewingCall, startSimulatedCall } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingCustomers = trimmed
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.email.toLowerCase().includes(trimmed) ||
          c.phone.includes(trimmed) ||
          c.company.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : customers.slice(0, 3);

  const matchingCalls = trimmed
    ? calls.filter(
        (c) =>
          c.id.toLowerCase().includes(trimmed) ||
          c.customerName.toLowerCase().includes(trimmed) ||
          c.customerPhone.includes(trimmed) ||
          c.callType.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : calls.slice(0, 3);

  const matchingCallbacks = trimmed
    ? callbacks.filter(
        (cb) =>
          cb.customerName.toLowerCase().includes(trimmed) ||
          cb.reason.toLowerCase().includes(trimmed) ||
          cb.customerPhone.includes(trimmed)
      ).slice(0, 3)
    : [];

  const handleSelectCustomer = (customer) => {
    setViewingCustomer(customer);
    onClose();
    navigate('/customers');
  };

  const handleSelectCall = (call) => {
    setViewingCall(call);
    onClose();
    navigate('/calls');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden transform transition-all animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, calls, callbacks, or phone numbers... (Press Esc to exit)"
            className="w-full text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results section */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-5">
          {/* Customers Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Customers
              </span>
              <span>{matchingCustomers.length} results</span>
            </div>
            <div className="space-y-1">
              {matchingCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCustomer(c)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {c.company} • {c.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.category} type="category" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        startSimulatedCall(c);
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                      title="Quick Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calls Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Call Logs
              </span>
              <span>{matchingCalls.length} results</span>
            </div>
            <div className="space-y-1">
              {matchingCalls.map((call) => (
                <div
                  key={call.id}
                  onClick={() => handleSelectCall(call)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {call.id}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {call.customerName}
                      </span>
                      <StatusBadge status={call.status} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {call.callType} • {call.scheduledTime}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Callbacks Section */}
          {matchingCallbacks.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" /> Callbacks
                </span>
                <span>{matchingCallbacks.length} results</span>
              </div>
              <div className="space-y-1">
                {matchingCallbacks.map((cb) => (
                  <div
                    key={cb.id}
                    onClick={() => {
                      onClose();
                      navigate('/callbacks');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {cb.customerName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
                        {cb.reason}
                      </p>
                    </div>
                    <StatusBadge status={cb.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border rounded font-mono">⌘K</kbd> anywhere to search</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border rounded font-mono">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
