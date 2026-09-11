import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { PatientIntakeFlow } from "./components/PatientIntakeFlow";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { DemoModeModal } from "./components/DemoModeModal";
import { PharmacyModal } from "./components/PharmacyModal";
import { PrivacyModal } from "./components/PrivacyModal";
import { EmergencyAssistantModal } from "./components/EmergencyAssistantModal";
import { AbdmFhirModal } from "./components/AbdmFhirModal";
import { SideUtilityToolbar } from "./components/SideUtilityToolbar";
import { PatientCase, LanguageCode } from "./types";
import { getPatientCases, updatePatientCaseStatus } from "./services/fhirService";
import {
  subscribeToPatients,
  savePatientToFirestore,
  updatePatientVerificationInFirestore,
  seedInitialPatientsIfEmpty,
} from "./services/firebasePatientService";

export default function App() {
  // Navigation State: "landing" (default front page) | "patient" (clean intake) | "doctor" (OPD dashboard)
  const [currentView, setCurrentView] = useState<"landing" | "patient" | "doctor">("landing");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const [isAyushMode, setIsAyushMode] = useState<boolean>(true);
  const [patients, setPatients] = useState<PatientCase[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("RS-2026-003");

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isFhirModalOpen, setIsFhirModalOpen] = useState<boolean>(false);
  const [fhirPatientId, setFhirPatientId] = useState<string>("RS-2026-003");
  const [isSideToolbarOpen, setIsSideToolbarOpen] = useState<boolean>(false);

  // Real-time Firestore sync + fallback initialization
  useEffect(() => {
    seedInitialPatientsIfEmpty();
    const unsubscribe = subscribeToPatients((livePatients) => {
      if (Array.isArray(livePatients) && livePatients.length > 0) {
        setPatients(livePatients);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatientCases();
      if (Array.isArray(data) && data.length > 0) {
        setPatients(data);
      }
    } catch {
      // Handled
    }
  };

  // Add newly intake patient to queue and sync to Firestore
  const handleCaseCompleted = async (newCase: PatientCase) => {
    setPatients((prev) => [newCase, ...prev.filter((p) => p.id !== newCase.id)]);
    setSelectedPatientId(newCase.id);
    setCurrentView("doctor");

    // Sync to Firestore & backend
    try {
      await savePatientToFirestore(newCase);
    } catch {
      // Non-blocking
    }
    fetchPatients();
  };

  // Doctor signs / verifies patient case with Firestore persistence
  const handleVerifyCase = async (
    id: string,
    doctorNotes: string,
    status: "CONFIRMED" | "CORRECTION_REQUESTED"
  ) => {
    const verifiedBy = "Dr. Ananya Joshi (MD Ayush / Consultant)";
    // Optimistic UI update
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, doctorNotes, verifiedBy, verifiedAt: new Date().toISOString() }
          : p
      )
    );

    try {
      await updatePatientVerificationInFirestore(id, status, doctorNotes, verifiedBy);
      await updatePatientCaseStatus(id, status, doctorNotes);
    } catch {
      // Handled gracefully
    }
  };

  // Interactive Demo Scenarios
  const handleLoadDemoEmergency = () => {
    setSelectedPatientId("RS-2026-001");
    setCurrentView("doctor");
  };

  const handleLoadDemoRoutine = () => {
    setSelectedPatientId("RS-2026-002");
    setIsAyushMode(true);
    setCurrentView("doctor");
  };

  const handleLoadDemoTrauma = () => {
    setSelectedPatientId("RS-2026-003");
    setCurrentView("doctor");
  };

  const handleLoadDemoSampleReport = () => {
    setSelectedPatientId("RS-2026-002");
    setCurrentView("doctor");
  };

  const handleResetDemo = () => {
    fetchPatients();
    setSelectedPatientId("RS-2026-003");
  };

  const handleOpenFhirModal = (id: string) => {
    setFhirPatientId(id);
    setIsFhirModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* 1. When on LANDING view: Render clean, welcoming hospital front page */}
      {currentView === "landing" ? (
        <LandingPage
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          onEnterPatientPortal={() => setCurrentView("patient")}
          onEnterDoctorPortal={() => setCurrentView("doctor")}
          onOpenDemoMode={() => setIsDemoModalOpen(true)}
          onOpenEmergencyHelp={() => setIsEmergencyModalOpen(true)}
          onOpenPharmacy={() => setIsPharmacyModalOpen(true)}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      ) : (
        <>
          {/* 2. When in PATIENT or DOCTOR portal: Top Navigation Bar */}
          <Navbar
            currentView={currentView}
            onSelectView={(view) => setCurrentView(view)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            isAyushMode={isAyushMode}
            onToggleAyushMode={() => setIsAyushMode(!isAyushMode)}
            queueCount={patients.length}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onOpenPharmacyModal={() => setIsPharmacyModalOpen(true)}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            onOpenFhirModal={() => handleOpenFhirModal(selectedPatientId || "RS-2026-003")}
          />

          {/* Main Workspace */}
          <main className="flex-1">
            {currentView === "patient" && (
              <PatientIntakeFlow
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                isAyushMode={isAyushMode}
                onCaseCompleted={handleCaseCompleted}
                onOpenDoctorDashboard={() => setCurrentView("doctor")}
              />
            )}

            {currentView === "doctor" && (
              <DoctorDashboard
                patientsList={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={setSelectedPatientId}
                onVerifyCase={handleVerifyCase}
                onOpenFhirView={handleOpenFhirModal}
              />
            )}
          </main>

          {/* Clinical App Footer */}
          <footer className="bg-white border-t border-slate-200 py-3.5 px-4 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">
                  <span className="text-orange-500">Raksha</span><span className="text-teal-600">Saathi</span>
                </span>
                <span>• Clinical Case-Taking Platform</span>
                <span className="hidden sm:inline">• Ministry of Ayush &amp; AIIA</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <button
                  type="button"
                  onClick={() => setIsPharmacyModalOpen(true)}
                  className="hover:text-teal-700 font-medium"
                >
                  Jan Aushadhi Pharmacy
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:text-indigo-700 font-medium"
                >
                  Privacy &amp; ABDM Consent
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="text-rose-700 hover:text-rose-800 font-semibold"
                >
                  Emergency (112)
                </button>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-bold">
                  AI Assists. Doctor Decides.
                </span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* MODAL 1: Presentation Demo Mode for Clinical Evaluation */}
      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLoadDemoEmergency={handleLoadDemoEmergency}
        onLoadDemoRoutine={handleLoadDemoRoutine}
        onLoadDemoTrauma={handleLoadDemoTrauma}
        onLoadDemoSampleReport={handleLoadDemoSampleReport}
        onResetDemo={handleResetDemo}
      />

      {/* MODAL 2: Online Medicine & Jan Aushadhi Pharmacy */}
      <PharmacyModal
        isOpen={isPharmacyModalOpen}
        onClose={() => setIsPharmacyModalOpen(false)}
      />

      {/* MODAL 3: Privacy, Consent & ABDM Security */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* MODAL 4: Emergency Assistance (112 & First Aid Guide) */}
      <EmergencyAssistantModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* MODAL 5: HL7 FHIR R4 Health Record Viewer */}
      <AbdmFhirModal
        isOpen={isFhirModalOpen}
        onClose={() => setIsFhirModalOpen(false)}
        patientId={fhirPatientId}
      />

      {/* Floating Quick Action: Side Utility Toolbar for fast testing */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
        <button
          type="button"
          id="btn-floating-quick-tools"
          onClick={() => setIsSideToolbarOpen(true)}
          className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 group"
          title="Quick Utility Toolbar: Demos, Scenarios & Diagnostics"
        >
          <span className="w-5 h-5 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black text-xs group-hover:rotate-12 transition-transform">
            ⚡
          </span>
          <span className="hidden sm:inline text-teal-300 font-extrabold">Quick Tools</span>
        </button>
      </div>

      <SideUtilityToolbar
        isOpen={isSideToolbarOpen}
        onClose={() => setIsSideToolbarOpen(false)}
        patientsList={patients}
        selectedPatientId={selectedPatientId}
        onSelectPatient={(id) => {
          setSelectedPatientId(id);
          setCurrentView("doctor");
        }}
        onLoadDemoEmergency={handleLoadDemoEmergency}
        onLoadDemoRoutine={handleLoadDemoRoutine}
        onLoadDemoTrauma={handleLoadDemoTrauma}
        onResetDemo={handleResetDemo}
      />
    </div>
  );
}
