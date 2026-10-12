import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, Phone, AlertCircle, FileText } from 'lucide-react';

export default function CallbackModal({ isOpen, onClose, callbackToEdit = null, prefillCustomer = null }) {
  const { customers, addCallback, updateCallback } = useApp();

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    company: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    reason: '',
    priority: 'Medium',
    status: 'Pending'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (callbackToEdit) {
      setFormData({
        customerId: callbackToEdit.customerId || '',
        customerName: callbackToEdit.customerName || '',
        customerPhone: callbackToEdit.customerPhone || '',
        company: callbackToEdit.company || '',
        date: callbackToEdit.date || new Date().toISOString().split('T')[0],
        time: callbackToEdit.time || '11:00 AM',
        reason: callbackToEdit.reason || '',
        priority: callbackToEdit.priority || 'Medium',
        status: callbackToEdit.status || 'Pending'
      });
    } else if (prefillCustomer) {
      setFormData({
        customerId: prefillCustomer.id || '',
        customerName: prefillCustomer.name || '',
        customerPhone: prefillCustomer.phone || '',
        company: prefillCustomer.company || '',
        date: new Date().toISOString().split('T')[0],
        time: '02:00 PM',
        reason: '',
        priority: 'Medium',
        status: 'Pending'
      });
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        customerPhone: '',
        company: '',
        date: new Date().toISOString().split('T')[0],
        time: '11:00 AM',
        reason: '',
        priority: 'Medium',
        status: 'Pending'
      });
    }
    setErrors({});
  }, [callbackToEdit, prefillCustomer, isOpen]);

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    if (!custId) {
      setFormData((prev) => ({
        ...prev,
        customerId: '',
        customerName: '',
        customerPhone: '',
        company: ''
      }));
      return;
    }
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        customerId: found.id,
        customerName: found.name,
        customerPhone: found.phone,
        company: found.company
      }));
      if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required.';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required.';
    }

    if (!formData.date) {
      newErrors.date = 'Callback date is required.';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Callback time is required.';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason or agenda for the callback.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (callbackToEdit) {
      updateCallback(callbackToEdit.id, formData);
    } else {
      addCallback(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={callbackToEdit ? 'Edit Scheduled Callback' : 'Schedule Customer Callback'}
      subtitle="Configure reminder and follow-up details for customer appointment"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Existing Customer selector */}
        {!callbackToEdit && !prefillCustomer && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Quick Select Existing Customer (Optional)
            </label>
            <select
              value={formData.customerId}
              onChange={handleCustomerSelect}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Or type manually below --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company || 'Private'}) — {c.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
            Customer Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="e.g. David Chen"
              className={`w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.customerName
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.customerName && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customerName}</p>
          )}
        </div>

        {/* Customer Phone & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Contact Phone *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.customerPhone
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.customerPhone && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customerPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Scheduled Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.date
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.date && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Time Slot *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 02:30 PM"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  errors.time
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.time && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Reason / Agenda */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
            Reason for Callback & Agenda *
          </label>
          <textarea
            name="reason"
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe what needs to be discussed, ticket references, or questions..."
            className={`w-full p-3 text-sm bg-white dark:bg-slate-900 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.reason
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
            }`}
          />
          {errors.reason && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.reason}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            {callbackToEdit ? 'Update Callback' : 'Confirm Callback'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
