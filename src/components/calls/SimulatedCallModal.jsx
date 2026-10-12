import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../utils/helpers';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Grid,
  FileText,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';

export default function SimulatedCallModal() {
  const {
    activeCall,
    isCallModalOpen,
    toggleMute,
    toggleHold,
    endSimulatedCall,
    completeAndSaveCall,
    closeCallModal
  } = useApp();

  const [callNotes, setCallNotes] = useState('');
  const [outcome, setOutcome] = useState('Resolved');
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');
  const [scheduleFollowup, setScheduleFollowup] = useState(false);
  const [callbackDate, setCallbackDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [callbackTime, setCallbackTime] = useState('11:00 AM');
  const [callbackReason, setCallbackReason] = useState('');

  if (!isCallModalOpen || !activeCall) return null;

  const isWrapup = activeCall.status === 'wrapup';
  const isConnecting = activeCall.status === 'connecting';
  const isActive = activeCall.status === 'active';

  const outcomesList = [
    { id: 'Resolved', label: 'Resolved (First-Call)', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
    { id: 'Follow-up Required', label: 'Follow-up Required', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
    { id: 'Callback Needed', label: 'Callback Needed', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
    { id: 'Escalated Tier 3', label: 'Escalated to Tier 3', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
    { id: 'Left Voicemail', label: 'Left Voicemail / No Answer', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200' }
  ];

  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const handleDigitPress = (digit) => {
    setDialedDigits((prev) => prev + digit);
  };

  const handleSave = () => {
    let cbData = null;
    if (scheduleFollowup || outcome === 'Callback Needed') {
      cbData = {
        date: callbackDate,
        time: callbackTime,
        reason: callbackReason || `Scheduled follow-up after ${outcome} call`
      };
    }
    completeAndSaveCall(outcome, callNotes, cbData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={closeCallModal}
      />

      {/* Main Console */}
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner info */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-lg">
              <Phone className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                CallFlow Softphone Console
              </h3>
              <p className="text-[11px] text-blue-100">
                WebRTC Telephony Simulation
              </p>
            </div>
          </div>
          <button
            onClick={closeCallModal}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Minimize or close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Call or Wrapup Body */}
        <div className="p-6">
          {!isWrapup ? (
            /* ACTIVE / CONNECTING CALL VIEW */
            <div className="flex flex-col items-center text-center">
              {/* Avatar & Pulse Indicator */}
              <div className="relative my-4">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-tr from-blue-600 to-teal-500 shadow-xl ${
                    isConnecting ? 'calling-ring animate-pulse' : ''
                  }`}
                >
                  <User className="w-12 h-12" />
                </div>
                {isActive && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>

              {/* Caller Meta */}
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeCall.customerName}
              </h4>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {activeCall.customerPhone}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeCall.company || 'Enterprise Account'} • {activeCall.callType || 'Support'}
              </p>

              {/* Status and Timer */}
              <div className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                  {isConnecting ? 'Connecting...' : formatDuration(activeCall.seconds)}
                </span>
                {activeCall.isOnHold && (
                  <span className="text-xs font-bold text-amber-500 uppercase px-1.5 py-0.5 bg-amber-500/10 rounded">
                    On Hold
                  </span>
                )}
                {activeCall.isMuted && (
                  <span className="text-xs font-bold text-rose-500 uppercase px-1.5 py-0.5 bg-rose-500/10 rounded">
                    Muted
                  </span>
                )}
              </div>

              {/* Audio Wave Simulation (when active and not hold) */}
              {isActive && !activeCall.isOnHold && (
                <div className="flex items-center gap-1.5 my-6 h-8">
                  {[40, 70, 90, 45, 80, 100, 60, 85, 30, 95, 50, 75, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${(i % 5) * 150}ms`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* DTMF Dialpad overlay if toggled */}
              {showKeypad && (
                <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-64 animate-in fade-in-0">
                  <div className="h-8 text-center text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                    {dialedDigits || 'DTMF Keypad'}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {keypadKeys.map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handleDigitPress(k)}
                        className="py-2 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 shadow-2xs transition-colors"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Softphone Control Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {/* Mute */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    activeCall.isMuted
                      ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Hold */}
                <button
                  type="button"
                  onClick={toggleHold}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    activeCall.isOnHold
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={activeCall.isOnHold ? 'Resume call' : 'Place on hold'}
                >
                  {activeCall.isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>

                {/* Keypad */}
                <button
                  type="button"
                  onClick={() => setShowKeypad(!showKeypad)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    showKeypad
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Toggle DTMF dialpad"
                >
                  <Grid className="w-5 h-5" />
                </button>

                {/* End Call */}
                <button
                  type="button"
                  onClick={endSimulatedCall}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
                  title="End current call session"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          ) : (
            /* POST-CALL WRAP-UP VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Wrap-up Call Record
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Caller: {activeCall.customerName} ({activeCall.customerPhone})
                  </p>
                </div>
                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  Duration: {formatDuration(activeCall.seconds)}
                </div>
              </div>

              {/* Call Outcome Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Call Outcome *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {outcomesList.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOutcome(opt.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        outcome === opt.id
                          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {outcome === opt.id && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Call Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Resolution Notes & Shift Summary
                </label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record summary of customer inquiry, troubleshooting steps taken, and agreed next steps..."
                  className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Schedule Followup Callback Option */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={scheduleFollowup || outcome === 'Callback Needed'}
                    onChange={(e) => setScheduleFollowup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Schedule follow-up callback for this customer</span>
                </label>

                {(scheduleFollowup || outcome === 'Callback Needed') && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Callback Date
                      </label>
                      <input
                        type="date"
                        value={callbackDate}
                        onChange={(e) => setCallbackDate(e.target.value)}
                        className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Callback Time
                      </label>
                      <input
                        type="text"
                        value={callbackTime}
                        onChange={(e) => setCallbackTime(e.target.value)}
                        placeholder="e.g. 02:00 PM"
                        className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save & Finish Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCallModal}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Call Record</span>
                </button>
              </div>
            </div>
          )}

          {/* Simulator Disclaimer Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Demonstration simulation — purely frontend state, no telephony costs.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
