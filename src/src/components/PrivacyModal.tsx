import React from "react";
import {
  Lock,
  X,
  ShieldCheck,
  FileCode2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Server,
} from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearSessionData: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onClearSessionData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-white">Privacy, Consent &amp; ABDM Security</h3>
              <p className="text-xs text-slate-300">
                Data protection principles, AI usage transparency, and session control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 flex-1 text-slate-700 text-xs sm:text-sm">
          {/* Prototype disclaimer banner */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold text-indigo-900 block">Demonstration Sandbox Environment</span>
              <p className="text-xs text-indigo-800 leading-relaxed">
                RakshaSaathi operates strictly on simulated demonstration records. Do not enter confidential government passwords or biometric credentials. Identity verification and insurance card numbers are purely optional.
              </p>
            </div>
          </div>

          {/* Core Principles */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-teal-600" />
              <span>Core Patient Privacy Commitments</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Purpose-Bound Clinical Collection
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Information is gathered exclusively for preparing a preliminary clinical history for the consulting OPD doctor.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5 text-blue-600" /> No Unsolicited Data Profiling
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Data is not shared with third-party advertising networks or commercial brokers.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <FileCode2 className="w-3.5 h-3.5 text-purple-600" /> HL7 FHIR R4 &amp; ABDM Sandbox
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Simulates Ayushman Bharat Digital Mission (ABDM) standards using open health interoperability formats.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Immediate Session Termination
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Patients have full autonomy to wipe temporary browser session caches anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Session Data Reset Box */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-rose-900 block">Purge Local Case Intake Session</span>
              <p className="text-xs text-rose-700">
                Immediately clear all entered patient details, conversation history, and uploaded documents from this device.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClearSessionData();
                onClose();
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge &amp; Reset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Ministry of Ayush &amp; AIIA Ethical AI Guidelines
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
