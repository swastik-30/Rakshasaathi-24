import React, { useState } from "react";
import {
  Shield,
  Sparkles,
  Stethoscope,
  AlertTriangle,
  FileCode2,
  Globe2,
  Layers,
  Menu,
  X,
  Pill,
  Lock,
  ArrowLeft,
  User,
  HeartPulse,
} from "lucide-react";
import { LanguageCode } from "../types";
import { LANGUAGES, UI_STRINGS } from "../data/translations";

interface NavbarProps {
  currentView: "landing" | "patient" | "doctor";
  onSelectView: (view: "landing" | "patient" | "doctor") => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  isAyushMode: boolean;
  onToggleAyushMode: () => void;
  queueCount?: number;
  onOpenDemoModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenPharmacyModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenFhirModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  selectedLanguage,
  onSelectLanguage,
  isAyushMode,
  onToggleAyushMode,
  queueCount = 3,
  onOpenDemoModal,
  onOpenEmergencyModal,
  onOpenPharmacyModal,
  onOpenPrivacyModal,
  onOpenFhirModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const strings = UI_STRINGS[selectedLanguage] || UI_STRINGS.en;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Clinical Header Ticker */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 border border-teal-400/30">
            <HeartPulse className="w-3 h-3 text-teal-400" /> Clinical OPD
          </span>
          <span className="font-medium text-slate-300 truncate text-[11px]">
            Ministry of Ayush &amp; AIIA Integrated Patient Case-Taking Software
          </span>
        </div>

        {/* Evaluation Demo Mode Button & Firebase Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded text-[10px] text-emerald-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Firestore DB Connected</span>
            <span className="sm:hidden">DB Live</span>
          </div>

          <button
            type="button"
            id="btn-nav-demo-mode"
            onClick={onOpenDemoModal}
            className="px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-md font-bold text-[10px] flex items-center gap-1 transition-all"
            title="Open Presentation Demo Mode"
          >
            <Layers className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">Demo Mode</span>
            <span className="sm:hidden">Demo</span>
          </button>
        </div>
      </div>

      {/* Main Nav Body */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          id="nav-brand-logo"
          onClick={() => onSelectView("landing")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-blue-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight">
                <span className="text-orange-500">Raksha</span><span className="text-teal-600">Saathi</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentView === "doctor"
                    ? "bg-blue-100 text-blue-800"
                    : currentView === "patient"
                    ? "bg-teal-100 text-teal-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {currentView === "doctor" ? "Doctor OPD" : currentView === "patient" ? "Patient Portal" : "Hospital"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none hidden md:block">
              Pre-Consultation Clinical Intake • AIIA Standards
            </p>
          </div>
        </div>

        {/* Desktop View Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {/* Back to Home / Landing */}
          <button
            type="button"
            onClick={() => onSelectView("landing")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              currentView === "landing"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Hospital Home
          </button>

          {/* Patient Portal */}
          <button
            type="button"
            id="nav-btn-patient-portal"
            onClick={() => onSelectView("patient")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentView === "patient"
                ? "bg-teal-600 text-white shadow-xs ring-2 ring-teal-600/30"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Intake (5 Steps)</span>
          </button>

          {/* Doctor Portal */}
          <button
            type="button"
            id="nav-btn-doctor-portal"
            onClick={() => onSelectView("doctor")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentView === "doctor"
                ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/30"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor OPD Queue</span>
            {queueCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  currentView === "doctor" ? "bg-white text-blue-700" : "bg-blue-100 text-blue-800"
                }`}
              >
                {queueCount}
              </span>
            )}
          </button>

          {/* Patient-relevant utilities (Pharmacy) */}
          <button
            type="button"
            onClick={onOpenPharmacyModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-1 transition-colors"
          >
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>Pharmacy</span>
          </button>

          {/* Emergency Guide (Safety) */}
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200/80 flex items-center gap-1 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency 112</span>
          </button>
        </nav>

        {/* Right Controls: AYUSH Mode, Language & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AYUSH Mode Toggle */}
          <button
            id="btn-toggle-ayush-mode"
            type="button"
            onClick={onToggleAyushMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isAyushMode
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle Ayurvedic Prakriti / Agni / Koshtha Clinical Parameters"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAyushMode ? "text-emerald-600" : "text-slate-400"}`} />
            <span className="hidden sm:inline">AYUSH:</span>
            <span className={isAyushMode ? "text-emerald-700 font-extrabold" : "text-slate-500 font-normal"}>
              {isAyushMode ? "ON" : "OFF"}
            </span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <Globe2 className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5 shrink-0" />
            <select
              id="select-app-language"
              aria-label="Select Application Language"
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden pr-2 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => {
                onSelectView("patient");
                closeMobileMenu();
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                currentView === "patient"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 border border-slate-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectView("doctor");
                closeMobileMenu();
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                currentView === "doctor"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 border border-slate-200"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor OPD</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                onSelectView("landing");
                closeMobileMenu();
              }}
              className="px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Hospital Home Front Page</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenPharmacyModal();
                closeMobileMenu();
              }}
              className="px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Online Medicine &amp; Jan Aushadhi Pharmacy</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenPrivacyModal();
                closeMobileMenu();
              }}
              className="px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Privacy, Consent &amp; ABDM Security</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenEmergencyModal();
                closeMobileMenu();
              }}
              className="px-3 py-2 text-left font-semibold text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Emergency Services (112 / First Aid)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenDemoModal();
                closeMobileMenu();
              }}
              className="px-3 py-2 text-left font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 mt-1"
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Open Demo Mode (For Evaluators)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
