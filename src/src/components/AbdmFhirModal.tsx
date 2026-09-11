import React, { useState, useEffect } from "react";
import { FileCode2, Copy, Check, Send, X, ExternalLink, ShieldCheck } from "lucide-react";

interface AbdmFhirModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export const AbdmFhirModal: React.FC<AbdmFhirModalProps> = ({ isOpen, onClose, patientId }) => {
  if (!isOpen) return null;

  const [fhirData, setFhirData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/fhir/${patientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFhirData(data.data);
        }
      })
      .catch(() => {
        // Fallback silently if offline
      });
  }, [patientId]);

  const handleCopy = () => {
    if (fhirData) {
      navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePushToAbdm = () => {
    setIsPushing(true);
    setTimeout(() => {
      setIsPushing(false);
      setPushSuccess(true);
      setTimeout(() => setPushSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full border border-slate-700 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500 text-purple-300 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">FHIR R4 / ABDM Health Artifact</h3>
                <span className="text-[10px] font-mono bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700">
                  National Digital Health Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Resource Bundle: Encounter, Patient, Condition (ID: {patientId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-800/60 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Standard:</span>
            <span className="font-mono text-teal-400 font-bold">HL7 FHIR R4 (ABDM v2.0)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>

            <button
              onClick={handlePushToAbdm}
              disabled={isPushing}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPushing ? "Pushing..." : "Simulate ABDM Gateway Push"}</span>
            </button>
          </div>
        </div>

        {/* Success confirmation */}
        {pushSuccess && (
          <div className="bg-emerald-950/80 border-b border-emerald-700 p-2.5 px-4 text-xs text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Successfully transmitted FHIR Encounter document to hospital EMR &amp; ABDM Gateway (Status: HTTP 201 Created).
            </span>
          </div>
        )}

        {/* Code Viewer */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950">
          <pre className="whitespace-pre-wrap">
            {fhirData ? JSON.stringify(fhirData, null, 2) : "// Loading FHIR Bundle..."}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>ABHA Profile: https://abdm.gov.in/fhir/encounter-id</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
