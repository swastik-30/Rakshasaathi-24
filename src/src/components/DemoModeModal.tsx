import React from "react";
import {
  Layers,
  X,
  Sparkles,
  AlertTriangle,
  Camera,
  FileText,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDemoEmergency: () => void;
  onLoadDemoRoutine: () => void;
  onLoadDemoTrauma: () => void;
  onLoadDemoSampleReport: () => void;
  onResetDemo: () => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  onLoadDemoEmergency,
  onLoadDemoRoutine,
  onLoadDemoTrauma,
  onLoadDemoSampleReport,
  onResetDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Presentation Demo Mode</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">
                  Evaluation Only
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Instantly load simulated patient scenarios to evaluate intake, OCR, injury triage, and AYUSH integration.
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

        {/* Modal Body: Scenarios Grid */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Separation Guarantee:</strong> Demo cases are strictly segregated from regular patients. Real patient workflows will never be polluted with these sample records.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Scenario 1: Normal Routine Patient */}
            <div
              id="demo-card-routine"
              onClick={() => {
                onLoadDemoRoutine();
                onClose();
              }}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 group-hover:text-teal-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" /> Normal Routine Patient
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                  Priya Verma (42y)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chronic bilateral knee discomfort. Demonstrates routine clinical intake, Prakriti assessment (Vata-Pitta), and physician OPD verification.
              </p>
              <div className="text-[11px] font-bold text-teal-700 flex items-center gap-1 group-hover:underline pt-1">
                <span>Load Scenario</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Scenario 2: Injury / Trauma with Wound Photo */}
            <div
              id="demo-card-trauma"
              onClick={() => {
                onLoadDemoTrauma();
                onClose();
              }}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 group-hover:text-amber-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-600" /> Injury &amp; Trauma Photo
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                  Kabir Deshmukh (24y)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Two-wheeler skid accident. Demonstrates AI-validated injury photo capture, knee abrasion assessment, and pre-consultation wound triage.
              </p>
              <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1 group-hover:underline pt-1">
                <span>Load Scenario</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Scenario 3: Emergency Acute Indicator */}
            <div
              id="demo-card-emergency"
              onClick={() => {
                onLoadDemoEmergency();
                onClose();
              }}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 group-hover:text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Acute Clinical Indicator
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                  Aarav Sharma (28y)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sudden retrosternal chest pain with diaphoresis. Shows internal red-flag identification and physician clinical attention notification without frightening the patient.
              </p>
              <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1 group-hover:underline pt-1">
                <span>Load Scenario</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Scenario 4: Sample Medical Report (X-Ray & Blood) */}
            <div
              id="demo-card-sample-report"
              onClick={() => {
                onLoadDemoSampleReport();
                onClose();
              }}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 group-hover:text-indigo-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" /> Sample Medical Report &amp; X-Ray
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                  Digitized Records
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrates digital X-Ray radiology impression extraction, CBC hematology laboratory parameters, and chronological consultation timeline.
              </p>
              <div className="text-[11px] font-bold text-indigo-700 flex items-center gap-1 group-hover:underline pt-1">
                <span>Load Scenario</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            id="btn-reset-demo-modal"
            onClick={() => {
              onResetDemo();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
