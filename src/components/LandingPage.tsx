import React from "react";
import {
  Shield,
  Stethoscope,
  UserPlus,
  Sparkles,
  Globe2,
  FileText,
  Activity,
  ArrowRight,
  Pill,
  Lock,
  Layers,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { LanguageCode } from "../types";
import { UI_STRINGS, LANGUAGES } from "../data/translations";

interface LandingPageProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onEnterPatientPortal: () => void;
  onEnterDoctorPortal: () => void;
  onOpenDemoMode: () => void;
  onOpenEmergencyHelp: () => void;
  onOpenPharmacy: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onEnterPatientPortal,
  onEnterDoctorPortal,
  onOpenDemoMode,
  onOpenEmergencyHelp,
  onOpenPharmacy,
  onOpenPrivacy,
}) => {
  const strings = UI_STRINGS[selectedLanguage] || UI_STRINGS.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 text-slate-900 flex flex-col justify-between">
      {/* Institutional Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2 py-0.5 rounded border border-teal-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Clinical AI Case-Taking
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              Ministry of Ayush &amp; All India Institute of Ayurveda
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Multilingual Selector */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-teal-400 ml-1.5 mr-1 shrink-0" />
              <select
                id="landing-select-language"
                aria-label="Select Application Language"
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-hidden pr-2 py-0.5 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              id="btn-landing-demo-mode"
              onClick={onOpenDemoMode}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-all flex items-center gap-1"
              title="Open Presentation Demo Mode"
            >
              <Layers className="w-3 h-3" />
              <span>Demo Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex-1 flex flex-col justify-center">
        {/* Header Branding */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold shadow-xs">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Official Government OPD Intake Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight select-none">
            <span className="text-orange-500">Raksha</span><span className="text-teal-600">Saathi</span>
          </h1>

          <p className="text-lg sm:text-xl font-bold text-slate-800">
            {strings.appTagline || "AI-Powered Multilingual Patient Case-Taking"}
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal italic max-w-2xl mx-auto">
            &ldquo;{strings.appQuote || "Capture the right history, in the patient's own language, before the consultation."}&rdquo;
          </p>

          {/* Ethical Medical Notice */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs max-w-xl mx-auto text-xs text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Every patient receives dedicated clinical attention. AI assists preliminary history-taking and does not replace a licensed physician.
            </span>
          </div>
        </div>

        {/* Two Primary Portal Cards: Patient vs Doctor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-4xl mx-auto w-full">
          {/* PORTAL 1: Patient Experience */}
          <div
            id="card-portal-patient"
            onClick={onEnterPatientPortal}
            className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-teal-50/40 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-teal-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <UserPlus className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                    Patient Portal
                  </h2>
                  <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                    5-Step Flow
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Start your clinical case-taking in your own language using voice or touch. Upload prescriptions, X-Rays, or injury photos before meeting the doctor.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>10 Indian Languages &amp; Voice Input</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>Secure Document &amp; X-Ray Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>Validated Injury Photo Recording</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>Optional Insurance &amp; Identity Verification</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-portal-patient-enter"
              className="mt-6 w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all group-hover:shadow-lg"
            >
              <span>{strings.startIntake || "Start Patient Case-Taking"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* PORTAL 2: Doctor Experience */}
          <div
            id="card-portal-doctor"
            onClick={onEnterDoctorPortal}
            className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50/40 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-blue-600 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Doctor Portal
                  </h2>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                    OPD Dashboard
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Physician OPD Review Dashboard. Access patient queue, review structured AI histories, examine digitized scans, and confirm clinical summaries.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Real-time OPD Patient Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Clinical Attention Indicators (Objective Triage)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>AYUSH Prakriti &amp; Agni Intake Parameters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>HL7 FHIR R4 &amp; ABDM Health Record Export</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-portal-doctor-enter"
              className="mt-6 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all group-hover:shadow-lg"
            >
              <span>{strings.doctorDashboard || "Open Physician OPD Dashboard"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Utility Access Links */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={onOpenPharmacy}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>Online Medicine &amp; Pharmacy (Jan Aushadhi)</span>
          </button>

          <button
            type="button"
            onClick={onOpenEmergencyHelp}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 text-rose-700 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency Help &amp; Safety Guide</span>
          </button>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Privacy, Consent &amp; ABDM Compliance</span>
          </button>
        </div>

        {/* Future Roadmap Accordion */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs max-w-4xl mx-auto w-full">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>RakshaSaathi Technical Roadmap (6 Phases)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 block">Phase 1</span>
              <span className="text-slate-600">AI Multilingual Case-Taking</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 block">Phase 2</span>
              <span className="text-slate-600">Advanced OCR &amp; Rx Extraction</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 block">Phase 3</span>
              <span className="text-slate-600">ABDM / FHIR Integration</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 block">Phase 4</span>
              <span className="text-slate-600">Hospital HIS / EMR Integration</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 block">Phase 5</span>
              <span className="text-slate-600">Emergency AI Assistant</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 block">Phase 6</span>
              <span className="text-slate-600">Jan Aushadhi Pharmacy</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span className="font-extrabold text-slate-900">
              <span className="text-orange-500">Raksha</span><span className="text-teal-600">Saathi</span>
            </span>
            <span>• Ministry of Ayush &amp; All India Institute of Ayurveda</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Clinical OPD Platform</span>
            <span>ABDM FHIR R4 Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
