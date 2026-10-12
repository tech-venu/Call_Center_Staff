import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  PhoneCall,
  CalendarPlus,
  Edit2,
  Trash2,
  Star,
  Clock,
  History
} from 'lucide-react';

export default function CustomerDrawer({
  isOpen,
  onClose,
  customer,
  onEditCustomer,
  onDeleteCustomer,
  onScheduleCallback
}) {
  const { calls, startSimulatedCall } = useApp();

  if (!customer) return null;

  // Filter previous calls for this customer
  const customerCalls = calls.filter(
    (c) => c.customerId === customer.id || c.customerName === customer.name
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Profile & Telephony Dossier"
      subtitle={`Account ID: ${customer.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Customer Header Dossier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {customer.name}
                </h3>
                <StatusBadge status={customer.status} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {customer.company || 'Enterprise Account'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={customer.category} type="category" />
                <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {customer.satisfactionScore || 96}% CSAT
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                startSimulatedCall(customer);
              }}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onScheduleCallback(customer);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Callback</span>
            </button>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Direct Phone</p>
              <p className="font-semibold text-slate-900 dark:text-white">{customer.phone}</p>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold text-slate-400">Corporate Email</p>
              <p className="font-semibold text-slate-900 dark:text-white truncate">{customer.email}</p>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold text-slate-400">Headquarters</p>
              <p className="font-semibold text-slate-900 dark:text-white truncate">{customer.address || 'Global Headquarters'}</p>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Last Touchpoint</p>
              <p className="font-semibold text-slate-900 dark:text-white">{customer.lastContact || 'Recent'}</p>
            </div>
          </div>
        </div>

        {/* Customer Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Account Notes & SLA Requirements
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
            {customer.notes || 'No custom notes provided for this account.'}
          </p>
        </div>

        {/* Previous Calls History Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Call History ({customerCalls.length})
            </h4>
          </div>

          {customerCalls.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl text-center">
              No previous call sessions recorded for this customer yet.
            </p>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Scheduled</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {customerCalls.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-slate-600 dark:text-slate-400">
                        {c.id}
                      </td>
                      <td className="p-2.5">{c.callType}</td>
                      <td className="p-2.5 text-slate-500">{c.scheduledTime}</td>
                      <td className="p-2.5 font-mono">{c.duration || '—'}</td>
                      <td className="p-2.5">
                        <StatusBadge status={c.outcome || c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onDeleteCustomer(customer);
            }}
            className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEditCustomer(customer);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
