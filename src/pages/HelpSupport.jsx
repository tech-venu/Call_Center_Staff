import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Calendar,
  Keyboard,
  Send,
  CheckCircle2,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function HelpSupport() {
  const { showToast } = useApp();

  const [expandedFaq, setExpandedFaq] = useState(0);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Technical Inquiry',
    message: ''
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I start a simulated telephone call?',
      answer:
        'You can start a simulated softphone call from multiple places: the "Start Call" button in the top navigation bar, the "Start a Call" quick action on the Dashboard, the phone icon next to any call row in My Calls, or the "Call Customer" button in any customer profile dossier.'
    },
    {
      question: 'How does call wrap-up and post-call recording work?',
      answer:
        'When you click "End Call" on the active softphone console, the interface transitions to wrap-up mode. Here you can choose a call resolution outcome (Resolved, Follow-up Required, Callback Needed, Escalated, or Voicemail), record shift notes, and optionally book a scheduled callback directly.'
    },
    {
      question: 'Where is customer and call data stored?',
      answer:
        'All application state is saved directly in your web browser using HTML5 LocalStorage. No server, database, or external API is required. You can refresh or revisit the page anytime without losing data, or use "Reset Demo Data" in Settings to restore the original sample records.'
    },
    {
      question: 'What do the callback statuses (Overdue, Today, Upcoming) mean?',
      answer:
        'Overdue callbacks are appointments whose scheduled date or time has passed without being marked completed. Today\'s callbacks require action during your current shift. Upcoming callbacks are booked for future dates.'
    },
    {
      question: 'How do I toggle between Dark Mode and Light Mode?',
      answer:
        'You can toggle between Dark Mode and Light Mode anytime by clicking the Sun/Moon icon in the top navigation bar, or by choosing your preferred theme in Settings > Visual Appearance.'
    }
  ];

  const keyboardShortcuts = [
    { keys: ['⌘', 'K'], description: 'Open Global Command Spotlight Search across calls and customers' },
    { keys: ['Esc'], description: 'Close any active modal dialog, drawer, or softphone console' },
    { keys: ['Alt', 'C'], description: 'Jump to My Calls queue' },
    { keys: ['Alt', 'D'], description: 'Jump to Overview Dashboard' }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      showToast('Please fill in both subject and description.', 'warning');
      return;
    }

    setTicketSubmitted(true);
    showToast('Demo support inquiry submitted successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Help Centre & Operational Guidance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Standard operating procedures, telephony best practices, and internal support.
        </p>
      </div>

      {/* Quick Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 w-fit mb-3">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Call Handling Standard
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Aim for First-Call Resolution (FCR) under 4 minutes. Verify customer identity before disclosing account specifics.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400 w-fit mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Callback Protocol
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Always confirm customer availability timezones. Call within 5 minutes of scheduled appointment time.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="p-2.5 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400 w-fit mb-3">
            <Keyboard className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Keyboard Productivity
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono text-[10px]">⌘K</kbd> anywhere to search records or callers instantaneously.
          </p>
        </div>
      </div>

      {/* Keyboard Shortcuts Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-blue-600" />
          <span>Recommended Keyboard Shortcuts</span>
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {keyboardShortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {sc.description}
              </span>
              <div className="flex items-center gap-1">
                {sc.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-800/50 pt-2.5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal Support Inquiry Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Contact Team Lead / IT Support</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Submit equipment issues, PTO requests, or queue configuration feedback (Demonstration ticket simulator).
        </p>

        {ticketSubmitted ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Demo Inquiry Submitted
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Your inquiry has been simulated and logged. No real email or ticket has been sent.
            </p>
            <button
              onClick={() => {
                setTicketSubmitted(false);
                setTicketForm({ subject: '', category: 'Technical Inquiry', message: '' });
              }}
              className="mt-2 text-xs font-bold text-emerald-800 underline"
            >
              Submit another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. SIP audio lag during outbound calls"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Inquiry Category
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Technical Inquiry">Technical & Audio Troubleshooting</option>
                  <option value="Schedule & Shift">Shift Schedule / PTO Request</option>
                  <option value="Queue Escalation">Tier 3 Escalation Request</option>
                  <option value="Policy & SLA">Policy & Compliance Question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Detailed Message *
              </label>
              <textarea
                rows={3}
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                placeholder="Describe your request or issue with relevant timestamps..."
                className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Demo Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
