import React, { useState, useEffect } from "react";
import { PatientCase, InjuryPhotoItem, DocumentItem } from "../types";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Activity,
  History,
  ShieldCheck,
  Shield,
  Share2,
  Edit3,
  Search,
  ExternalLink,
  Camera,
  MapPin,
  Maximize2,
  X,
  Zap,
} from "lucide-react";

interface DoctorDashboardProps {
  patientsList: PatientCase[];
  selectedPatientId?: string;
  onSelectPatient: (id: string) => void;
  onVerifyCase: (id: string, notes: string, status: "CONFIRMED" | "CORRECTION_REQUESTED") => void;
  onOpenFhirView: (id: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patientsList,
  selectedPatientId,
  onSelectPatient,
  onVerifyCase,
  onOpenFhirView,
}) => {
  const [filterPriority, setFilterPriority] = useState<"ALL" | "HIGH" | "ROUTINE">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING_REVIEW" | "CONFIRMED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "injuries" | "timeline" | "documents" | "transcript">("summary");
  const [selectedInjuryZoom, setSelectedInjuryZoom] = useState<InjuryPhotoItem | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);

  // Selected patient
  const activePatient =
    patientsList.find((p) => p.id === selectedPatientId) || patientsList[0];

  // Doctor notes editor state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [doctorNotesInput, setDoctorNotesInput] = useState(
    activePatient?.doctorNotes || "Verified pre-consultation intake. Clinical correlation advised."
  );

  useEffect(() => {
    if (activePatient) {
      setDoctorNotesInput(
        activePatient.doctorNotes ||
          "Clinical intake verified. History correlated with previous documents."
      );
    }
  }, [activePatient]);

  // Filter logic
  const filteredPatients = patientsList.filter((p) => {
    if (filterPriority !== "ALL" && p.priority !== filterPriority) return false;
    if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        p.chiefComplaint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmVerification = () => {
    if (!activePatient) return;
    onVerifyCase(activePatient.id, doctorNotesInput, "CONFIRMED");
    setIsEditingNotes(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 my-2">
      {/* Top Doctor Dashboard Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">Physician OPD Review Dashboard</h1>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                AIIA OPD Triage
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Human-in-the-loop clinical case verification • Ministry of Ayush &amp; AIIA
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1.5 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firestore Live Sync</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI Assists. Doctor Decides.</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-mono font-bold">
            Queue Count: {patientsList.length}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Queue (4 cols) | Right Detail Review (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: OPD Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-patients-queue"
                type="text"
                placeholder="Search patient, city, symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <button
                id="filter-priority-all"
                onClick={() => setFilterPriority("ALL")}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                  filterPriority === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <button
                id="filter-priority-high"
                onClick={() => setFilterPriority("HIGH")}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  filterPriority === "HIGH"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Priority (High)
              </button>
              <button
                id="filter-priority-routine"
                onClick={() => setFilterPriority("ROUTINE")}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                  filterPriority === "ROUTINE"
                    ? "bg-teal-700 text-white"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                }`}
              >
                Routine
              </button>
            </div>

            {/* Patient Queue Cards */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No patient cases match the filters.
                </div>
              ) : (
                filteredPatients.map((patient) => {
                  const isSelected = activePatient?.id === patient.id;
                  const hasInjury = patient.injuryPhotos && patient.injuryPhotos.length > 0;
                  return (
                    <div
                      key={patient.id}
                      id={`queue-patient-${patient.id}`}
                      onClick={() => onSelectPatient(patient.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900">{patient.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({patient.id})</span>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            patient.priority === "HIGH"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-teal-100 text-teal-800 border border-teal-200"
                          }`}
                        >
                          {patient.priority === "HIGH" ? "⚠ Clinical Attention" : "Routine"}
                        </span>
                      </div>

                      {/* City & Demographics */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5 flex-wrap">
                        <span>
                          {patient.age}y • {patient.gender}
                        </span>
                        {patient.city && (
                          <span className="flex items-center gap-0.5 text-slate-600 font-semibold">
                            <MapPin className="w-2.5 h-2.5 text-teal-600" />
                            {patient.city}
                          </span>
                        )}
                        {hasInjury && (
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded text-[10px] font-bold flex items-center gap-0.5">
                            <Camera className="w-2.5 h-2.5 text-amber-700" /> Injury Photo
                          </span>
                        )}
                        {patient.ayushMode && (
                          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[10px] font-bold">
                            AYUSH
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {patient.chiefComplaint}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <span>Duration: {patient.duration}</span>
                        <span
                          className={`font-semibold ${
                            patient.status === "CONFIRMED"
                              ? "text-emerald-700"
                              : "text-amber-600"
                          }`}
                        >
                          {patient.status === "CONFIRMED" ? "✓ Confirmed" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Patient Clinical Detail */}
        <div className="lg:col-span-8 space-y-4">
          {activePatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header Box */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-black">{activePatient.name}</h2>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {activePatient.id}
                    </span>
                    {activePatient.ayushMode && (
                      <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-semibold">
                        AYUSH Case
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>
                      {activePatient.age} Years • {activePatient.gender}
                    </span>
                    {activePatient.city && (
                      <span className="flex items-center gap-1 text-teal-300 font-semibold">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        {activePatient.city}
                      </span>
                    )}
                    <span>ABHA: {activePatient.abhaId || "Not Registered"}</span>
                    <span>Intake Lang: {activePatient.language}</span>
                    {activePatient.insurancePolicy && (
                      <span className="flex items-center gap-1 text-emerald-300 font-semibold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/40">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Insurance: {activePatient.insurancePolicy}</span>
                      </span>
                    )}
                    {activePatient.aadhaarNumber && (
                      <span className="text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded">
                        Aadhaar: {activePatient.aadhaarNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-view-fhir-bundle"
                    onClick={() => onOpenFhirView(activePatient.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                    title="View ABDM / FHIR R4 Bundle JSON"
                  >
                    <span>FHIR Bundle</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      activePatient.priority === "HIGH"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-teal-600 text-white"
                    }`}
                  >
                    {activePatient.priority === "HIGH" ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Clinical Attention Indicator</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Routine OPD Queue</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Accident / Injury Notice Banner if present */}
              {activePatient.injuryPhotos && activePatient.injuryPhotos.length > 0 && (
                <div className="bg-amber-500/10 border-b border-amber-300/80 px-4 py-2.5 flex items-center justify-between text-xs text-amber-950">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-bold">
                      🚨 Acute Accident / Injury Photos Attached ({activePatient.injuryPhotos.length}):
                    </span>
                    <span className="text-amber-800 truncate">
                      {activePatient.injuryPhotos.map((i) => `${i.bodyPart} (${i.severityScore})`).join(", ")}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("injuries")}
                    className="font-bold text-blue-700 hover:underline shrink-0 text-[11px]"
                  >
                    View Photos &rarr;
                  </button>
                </div>
              )}

              {/* Red Flags Banner */}
              {activePatient.redFlags && activePatient.redFlags.length > 0 && (
                <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center gap-2 text-xs text-rose-900 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Clinical Red Flags:</span>
                  <div className="flex flex-wrap gap-1">
                    {activePatient.redFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-300"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50 text-xs font-semibold text-slate-600 overflow-x-auto">
                <button
                  id="tab-btn-clinical-summary"
                  onClick={() => setActiveTab("summary")}
                  className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap transition-all ${
                    activeTab === "summary"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Structured Clinical Summary
                </button>

                <button
                  id="tab-btn-injury-photos"
                  onClick={() => setActiveTab("injuries")}
                  className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === "injuries"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Accident &amp; Injury Photos ({activePatient.injuryPhotos?.length || 0})</span>
                </button>

                <button
                  id="tab-btn-medical-timeline"
                  onClick={() => setActiveTab("timeline")}
                  className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap transition-all ${
                    activeTab === "timeline"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Chronological Timeline ({activePatient.timeline?.length || 0})
                </button>

                <button
                  id="tab-btn-medical-documents"
                  onClick={() => setActiveTab("documents")}
                  className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap transition-all ${
                    activeTab === "documents"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Scanned Records ({activePatient.documents?.length || 0})
                </button>

                <button
                  id="tab-btn-raw-transcript"
                  onClick={() => setActiveTab("transcript")}
                  className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap transition-all ${
                    activeTab === "transcript"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  Raw Voice Transcript
                </button>
              </div>

              {/* Tab 1: Clinical Summary */}
              {activeTab === "summary" && (
                <div className="p-5 space-y-4">
                  {/* Chief Complaint */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Chief Complaint (CC)
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {activePatient.clinicalSummary?.chiefComplaint || activePatient.chiefComplaint}
                    </p>
                  </div>

                  {/* History of Present Illness */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      History of Present Illness (HPI)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activePatient.clinicalSummary?.hpi}
                    </p>
                  </div>

                  {/* Prominent Injury Photos Box in Summary if present */}
                  {activePatient.injuryPhotos && activePatient.injuryPhotos.length > 0 && (
                    <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-amber-700" />
                          Accident &amp; Injury Triage (Forwarded to Examining Doctor)
                        </span>
                        <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                          {activePatient.injuryPhotos.length} Photo(s) Captured
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activePatient.injuryPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="bg-white rounded-xl p-3 border border-amber-200 shadow-2xs flex gap-3"
                          >
                            <div className="relative group shrink-0 cursor-pointer" onClick={() => setSelectedInjuryZoom(photo)}>
                              <img
                                src={photo.imageUrl}
                                alt="Injury"
                                className="w-20 h-20 rounded-lg object-cover border border-slate-200 group-hover:opacity-90"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-white transition-opacity">
                                <Maximize2 className="w-4 h-4" />
                              </div>
                            </div>

                            <div className="flex-1 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{photo.bodyPart}</span>
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                    photo.severityScore === "CRITICAL"
                                      ? "bg-rose-600 text-white"
                                      : photo.severityScore === "SEVERE"
                                      ? "bg-amber-600 text-white"
                                      : "bg-teal-100 text-teal-800"
                                  }`}
                                >
                                  {photo.severityScore}
                                </span>
                              </div>
                              <p className="text-slate-600 text-[11px] line-clamp-2">
                                {photo.visualFindings}
                              </p>
                              <div className="pt-1 text-[10px] text-slate-500">
                                <strong>First Aid:</strong> {photo.recommendations[0]}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medications & Allergies Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                        Active Medications (Drug History)
                      </span>
                      <p className="text-xs text-slate-800 font-medium">
                        {activePatient.clinicalSummary?.drugHistory || "None reported"}
                      </p>
                    </div>

                    <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                        Known Allergies &amp; Adverse Reactions
                      </span>
                      <p className="text-xs font-bold text-rose-900">
                        {activePatient.clinicalSummary?.allergyHistory || "No Known Drug Allergies (NKDA)"}
                      </p>
                    </div>
                  </div>

                  {/* Past History & Systemic Review */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Past Medical &amp; Surgical History
                      </span>
                      <p className="text-xs text-slate-700">
                        <strong>Medical:</strong> {activePatient.clinicalSummary?.pastMedicalHistory || "None"}
                      </p>
                      <p className="text-xs text-slate-700 mt-1">
                        <strong>Surgical:</strong> {activePatient.clinicalSummary?.pastSurgicalHistory || "None"}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Review of Systems (ROS)
                      </span>
                      <p className="text-xs text-slate-700">
                        {activePatient.clinicalSummary?.reviewOfSystems || "Cardiovascular, Respiratory, GI screened."}
                      </p>
                    </div>
                  </div>

                  {/* AYUSH Module Assessment if applicable */}
                  {activePatient.ayushMode && (
                    <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                          <span>🌿</span> Ministry of Ayush • Ayurvedic Intake (AIIA Protocol)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                          AYUSH Grid Validated
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2 rounded border border-emerald-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Prakriti (Dosha)</span>
                          <span className="font-bold text-emerald-900">{activePatient.clinicalSummary?.ayushPrakriti || "Vata-Pitta"}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-emerald-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Agni (Digestive Fire)</span>
                          <span className="font-bold text-emerald-900">{activePatient.clinicalSummary?.ayushAgni || "Manda Agni"}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-emerald-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Koshtha (Bowel Habit)</span>
                          <span className="font-bold text-emerald-900">{activePatient.clinicalSummary?.ayushKoshtha || "Krura"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Doctor Verification Box */}
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                        Physician Notes &amp; Verification Sign-off
                      </span>
                      {activePatient.verifiedBy && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                          Signed by: {activePatient.verifiedBy}
                        </span>
                      )}
                    </div>

                    <textarea
                      id="textarea-doctor-notes"
                      rows={2}
                      value={doctorNotesInput}
                      onChange={(e) => setDoctorNotesInput(e.target.value)}
                      className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter physician examination notes or amendment..."
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        id="btn-sign-and-confirm-record"
                        onClick={handleConfirmVerification}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✓ Confirm &amp; Sign Medical Record</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Accident & Injury Photos */}
              {activeTab === "injuries" && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Accident &amp; Injury High-Resolution Visual Triage
                      </h4>
                      <p className="text-xs text-slate-500">
                        Uploaded by patient during Step 3 of digital intake
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      Total: {activePatient.injuryPhotos?.length || 0}
                    </span>
                  </div>

                  {activePatient.injuryPhotos && activePatient.injuryPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePatient.injuryPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3"
                        >
                          <div className="relative group cursor-pointer" onClick={() => setSelectedInjuryZoom(photo)}>
                            <img
                              src={photo.imageUrl}
                              alt="Injury"
                              className="w-full h-56 object-cover bg-slate-100"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-2">
                              <Maximize2 className="w-5 h-5" />
                              <span className="text-xs font-bold">Click to Zoom Full Screen</span>
                            </div>
                            <span
                              className={`absolute top-3 right-3 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm ${
                                photo.severityScore === "CRITICAL"
                                  ? "bg-rose-600 text-white"
                                  : photo.severityScore === "SEVERE"
                                  ? "bg-amber-600 text-white"
                                  : "bg-teal-600 text-white"
                              }`}
                            >
                              {photo.severityScore} SEVERITY
                            </span>
                          </div>

                          <div className="p-4 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-slate-900">{photo.bodyPart}</span>
                              <span className="text-[11px] text-slate-400">{photo.timestamp}</span>
                            </div>

                            <p className="text-slate-700 font-medium leading-relaxed">
                              <strong>Accident Context:</strong> {photo.accidentContext}
                            </p>

                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                AI Visual Trauma Findings:
                              </span>
                              <p className="text-slate-800 leading-relaxed font-semibold">
                                {photo.visualFindings}
                              </p>
                            </div>

                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-bold text-teal-800 uppercase block">
                                Recommended Physician Actions:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                                {photo.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No acute injury photos were attached for this patient intake.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Chronological Timeline */}
              {activeTab === "timeline" && (
                <div className="p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Extracted Chronological Patient Health Journey
                  </h4>
                  <div className="border-l-2 border-slate-200 pl-4 space-y-4 my-2">
                    {activePatient.timeline?.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="w-3 h-3 rounded-full bg-teal-600 absolute -left-[22px] top-1 border-2 border-white" />
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900">{item.title}</span>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {item.year}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{item.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Source: {item.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Medical Documents, X-Rays & Previous Consultations */}
              {activeTab === "documents" && (
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Uploaded Medical Prescriptions, X-Rays &amp; Lab Records
                      </h4>
                      <p className="text-xs text-slate-400">
                        Patient uploaded records digitized by AI &amp; linked to consultation
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      Records: {activePatient.documents?.length || 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activePatient.documents?.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">{doc.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 border ${
                            doc.type === "X-Ray / Scan"
                              ? "bg-slate-900 text-teal-300 border-slate-800"
                              : doc.type === "Previous Consultation"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                            {doc.type}
                          </span>
                        </div>

                        {doc.imageUrl && (
                          <div className="relative group cursor-pointer" onClick={() => setSelectedDocPreview(doc)}>
                            <img
                              src={doc.imageUrl}
                              alt={doc.name}
                              className="w-full h-36 object-cover rounded-lg bg-slate-900 border border-slate-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-1.5 rounded-lg">
                              <Maximize2 className="w-4 h-4" />
                              <span className="text-[11px] font-bold">Zoom Full Record &amp; Share</span>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-slate-600 leading-relaxed">{doc.summary}</p>

                        {doc.radiologyFindings && (
                          <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg text-[11px] text-teal-900">
                            <strong>Radiology Impression:</strong> {doc.radiologyFindings}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                          <span>Date: {doc.date}</span>
                          <div className="flex items-center gap-2">
                            <span>Confidence {doc.confidence}%</span>
                            <button
                              type="button"
                              onClick={() => setSelectedDocPreview(doc)}
                              className="text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>View / Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Raw Interview Transcript */}
              {activeTab === "transcript" && (
                <div className="p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Full AI Voice &amp; Touch Interview Log
                  </h4>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[400px] overflow-y-auto">
                    {activePatient.conversation?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg text-xs ${
                          msg.sender === "ai"
                            ? "bg-white border border-slate-200 text-slate-800"
                            : "bg-teal-50 border border-teal-200 text-teal-900"
                        }`}
                      >
                        <span className="font-bold text-[10px] uppercase block mb-0.5 text-slate-400">
                          {msg.sender === "ai" ? "RakshaSaathi AI Kiosk" : activePatient.name} ({msg.timestamp})
                        </span>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400">
              Select a patient from the queue to view full clinical details.
            </div>
          )}
        </div>
      </div>

      {/* Injury Photo Full View Zoom Modal */}
      {selectedInjuryZoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm">
                  Full Resolution Inspection: {selectedInjuryZoom.bodyPart}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInjuryZoom(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <img
                src={selectedInjuryZoom.imageUrl}
                alt="Zoomed Injury"
                className="w-full max-h-[60vh] object-contain rounded-xl bg-slate-950 border border-slate-200"
              />

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Severity: {selectedInjuryZoom.severityScore}
                  </span>
                  <span className="text-slate-400">{selectedInjuryZoom.timestamp}</span>
                </div>
                <p className="text-slate-700 font-medium">
                  {selectedInjuryZoom.visualFindings}
                </p>
                <div className="pt-1 text-[11px] text-slate-600">
                  <strong>Recommendations:</strong> {selectedInjuryZoom.recommendations.join(" • ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Document / X-Ray Viewer & Share Modal for Physician */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedDocPreview.name}</h3>
                  <span className="text-xs text-slate-500">
                    Category: {selectedDocPreview.type} • Digitized Record
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDocPreview.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-96">
                <img
                  src={selectedDocPreview.imageUrl}
                  alt={selectedDocPreview.name}
                  className="max-h-96 w-auto object-contain"
                />
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Digitized Record Analysis:</span>
                <p className="text-slate-700 leading-relaxed">{selectedDocPreview.summary}</p>
                {selectedDocPreview.radiologyFindings && (
                  <div className="mt-2 p-2.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-900">
                    <strong>Radiology / Imaging Interpretation:</strong> {selectedDocPreview.radiologyFindings}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                ABHA Linked Record ID: {selectedDocPreview.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Consultation record link copied for referral/sharing!");
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share / Refer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocPreview(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
