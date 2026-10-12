import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../common/StatusBadge';
import {
  User,
  Phone,
  Mail,
  Clock,
  Tag,
  CheckCircle2,
  Calendar,
  PhoneCall,
  Save,
  Building
} from 'lucide-react';

export default function CallDetailsPanel({ isOpen, onClose, call, onScheduleCallbackForCall }) {
  const { updateCall, startSimulatedCall, customers } = useApp();

  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [outcome, setOutcome] = useState('Resolved');

  useEffect(() => {
    if (call) {
      setNotes(call.notes || '');
      setStatus(call.status || 'Pending');
      setPriority(call.priority || 'Medium');
      setOutcome(call.outcome || 'Resolved');
    }
  }, [call]);

  if (!call) return null;

  const linkedCustomer = customers.find((c) => c.id === call.customerId);

  const handleSave = (e) => {
    e.preventDefault();
    updateCall(call.id, {
      notes,
      status,
      priority,
      outcome
    });
    onClose();
  };

  const handleStartCall = () => {
    onClose();
    startSimulatedCall(call);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Call Record Details #${call.id}`}
      subtitle={`Scheduled for ${call.scheduledTime} with ${call.customerName}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSave} className="space-y-5">
        {/* Customer Information Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {call.customerName?.charAt(0) || 'C'}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {call.customerName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {linkedCustomer?.company || 'Enterprise Account'} • {call.callType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartCall}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleCallbackForCall(call);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Callback</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{call.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{call.customerEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Duration: {call.duration || '00m 00s'}</span>
            </div>
          </div>
        </div>

        {/* Status, Priority & Outcome controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Call Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Callback Required">Callback Required</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Resolution Outcome
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Resolved">Resolved</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Callback Needed">Callback Needed</option>
              <option value="Escalated Tier 3">Escalated Tier 3</option>
              <option value="Left Voicemail">Left Voicemail</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Previous notes and editing */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Agent Call Notes & History Log
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document caller issue, steps performed, customer feedback, and followup instructions..."
            className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Meta summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Assigned Staff: <strong className="text-slate-700 dark:text-slate-300">{call.assignedStaff}</strong></span>
          <span>Logged Time: {call.scheduledTime}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
