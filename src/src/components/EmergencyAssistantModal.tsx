import React, { useState } from "react";
import { AlertTriangle, PhoneCall, Bot, Send, Sparkles, X, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

interface EmergencyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyAssistantModal: React.FC<EmergencyAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [scenario, setScenario] = useState("Chest Pain / Suspected Heart Attack");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<any>({
    title: "Emergency Guidance: Chest Pain / Heart Attack",
    immediateSteps: [
      "Have the person sit down immediately in a comfortable 'W-position' (seated on floor, knees bent, back supported).",
      "Loosen all tight or restrictive clothing around neck, chest, and waist to assist breathing.",
      "Call National Emergency 112 or Ambulance 108 right away.",
      "If the patient has prescribed emergency medication (e.g. Nitroglycerin / Sorbitrate) from their cardiologist, assist them in taking it.",
      "Prepare for Hands-Only CPR if the person becomes unresponsive and stops breathing normally.",
    ],
    doNots: [
      "Do NOT let the patient walk, exercise, or drive themselves to the hospital.",
      "Do NOT ignore symptoms assuming it is mere indigestion or gas.",
      "Do NOT give oral food, heavy drinks, or unprescribed pills.",
    ],
    whenToCallAmbulance: "Call 108 immediately if chest discomfort radiates to arm/jaw or is accompanied by cold sweating.",
    emergencyNumbers: ["112 (National Emergency Service)", "108 (Medical Ambulance)"],
    disclaimer: "RakshaSaathi Emergency AI provides basic precautionary first-aid awareness and does not replace professional medical diagnosis or emergency care.",
  });

  const fetchGuidance = async (selectedScenario: string) => {
    setScenario(selectedScenario);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/emergency-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: selectedScenario }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success && data.data) {
        setGuidance(data.data);
      }
    } catch {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setScenario(customQuery);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/emergency-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: customQuery, userQuery: customQuery }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success && data.data) {
        setGuidance(data.data);
      }
      setCustomQuery("");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black">
                  <span className="text-amber-300">Raksha</span><span className="text-emerald-300">Saathi</span> Emergency AI
                </h3>
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                  Phase 2 Feature
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Pre-Hospital First-Aid Guidance &amp; Triage • 108 / 112 Ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Numbers Banner */}
        <div className="bg-rose-50 border-b border-rose-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-900 font-bold">
            <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce" />
            <span>National Emergency Helplines:</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:108"
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <PhoneCall className="w-3 h-3" /> Call 108 (Ambulance)
            </a>
            <a
              href="tel:112"
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <PhoneCall className="w-3 h-3" /> Call 112 (Emergency)
            </a>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Quick Scenario Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select an Emergency Situation:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Chest Pain / Suspected Heart Attack",
                "Difficulty Breathing / Asthma",
                "Fainting / Loss of Consciousness",
                "Severe Bleeding / Trauma",
                "Burns & Scalds",
                "Allergic Reaction (Anaphylaxis)",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => fetchGuidance(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    scenario === s
                      ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Custom query input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Or describe the emergency (e.g., child swallowed coin, snake bite)..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!customQuery.trim() || loading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Content Card */}
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <Sparkles className="w-6 h-6 text-rose-600 animate-spin mx-auto" />
              <p>Fetching clinical first-aid safety protocol...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">{guidance.title}</h4>
                <p className="text-xs text-rose-700 font-semibold">{guidance.whenToCallAmbulance}</p>
              </div>

              {/* Immediate Steps */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Action Steps (What To Do):</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-emerald-950 space-y-1.5 pl-1">
                  {guidance.immediateSteps?.map((step: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              {/* Do Nots */}
              <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Critical Precautionary Warnings (What NOT To Do):</span>
                </div>
                <ul className="list-disc list-inside text-xs text-rose-950 space-y-1 pl-1">
                  {guidance.doNots?.map((dont: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{dont}</li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 italic flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> {guidance.disclaimer}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
