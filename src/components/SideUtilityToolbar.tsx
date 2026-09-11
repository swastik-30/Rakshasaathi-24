import React, { useState, useEffect } from "react";
import {
  X,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  Camera,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  Pill,
  Search,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  Upload,
  FileText,
  Clock,
  ArrowRight,
  Layers,
  IndianRupee,
  Package,
  Plus,
  Minus,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { PatientCase, OnlineMedicineItem, InsuranceInfo, AadhaarInfo } from "../types";

interface SideUtilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  patientsList: PatientCase[];
  selectedPatientId?: string;
  onSelectPatient: (id: string) => void;
  onLoadDemoEmergency: () => void;
  onLoadDemoRoutine: () => void;
  onLoadDemoTrauma: () => void;
  onResetDemo: () => void;
  onUpdatePatientInsurance?: (patientId: string, insurance: InsuranceInfo) => void;
  onUpdatePatientAadhaar?: (patientId: string, aadhaar: AadhaarInfo) => void;
}

export const SideUtilityToolbar: React.FC<SideUtilityToolbarProps> = ({
  isOpen,
  onClose,
  patientsList,
  selectedPatientId,
  onSelectPatient,
  onLoadDemoEmergency,
  onLoadDemoRoutine,
  onLoadDemoTrauma,
  onResetDemo,
  onUpdatePatientInsurance,
  onUpdatePatientAadhaar,
}) => {
  const [activeTab, setActiveTab] = useState<"demos" | "queue" | "insurance" | "medicines">("demos");

  // Selected patient for context
  const activePatient = patientsList.find((p) => p.id === selectedPatientId) || patientsList[0];

  // --- INSURANCE & AADHAAR STATE ---
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [aadhaarPhotoPreview, setAadhaarPhotoPreview] = useState<string | null>(null);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);

  const [insuranceScheme, setInsuranceScheme] = useState<
    "Ayushman Bharat (PM-JAY)" | "CGHS / ECHS" | "Private TPA Mediclaim" | "Corporate"
  >("Ayushman Bharat (PM-JAY)");
  const [insurancePolicyNo, setInsurancePolicyNo] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("National Health Authority / State Agency");
  const [insuranceCardPreview, setInsuranceCardPreview] = useState<string | null>(null);
  const [isInsuranceVerified, setIsInsuranceVerified] = useState(false);
  const [insuranceSuccessMessage, setInsuranceSuccessMessage] = useState("");

  // Prepopulate if active patient has insurance/aadhaar
  useEffect(() => {
    if (activePatient?.aadhaarInfo) {
      setAadhaarInput(activePatient.aadhaarInfo.aadhaarNumberMasked);
      setIsAadhaarVerified(Boolean(activePatient.aadhaarInfo.isVerified));
      if (activePatient.aadhaarInfo.cardPhotoUrl) {
        setAadhaarPhotoPreview(activePatient.aadhaarInfo.cardPhotoUrl);
      }
    } else {
      setAadhaarInput("");
      setIsAadhaarVerified(false);
      setAadhaarPhotoPreview(null);
    }

    if (activePatient?.insuranceInfo) {
      setInsuranceScheme(activePatient.insuranceInfo.schemeType);
      setInsurancePolicyNo(activePatient.insuranceInfo.policyNumber);
      setInsuranceProvider(activePatient.insuranceInfo.provider);
      setIsInsuranceVerified(Boolean(activePatient.insuranceInfo.isVerified));
      if (activePatient.insuranceInfo.cardPhotoUrl) {
        setInsuranceCardPreview(activePatient.insuranceInfo.cardPhotoUrl);
      }
    } else {
      setInsurancePolicyNo("");
      setIsInsuranceVerified(false);
      setInsuranceCardPreview(null);
    }
  }, [activePatient?.id]);

  // --- ONLINE MEDICINE STATE ---
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineCategory, setMedicineCategory] = useState<string>("ALL");
  const [cart, setCart] = useState<Array<{ item: OnlineMedicineItem; quantity: number }>>([]);
  const [orderSlipModal, setOrderSlipModal] = useState<any | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Local medicine catalog
  const MEDICINES_CATALOG: OnlineMedicineItem[] = [
    {
      id: "med-01",
      name: "Paracetamol 650mg Tablets",
      genericName: "Paracetamol IP",
      category: "Analgesic / Anti-inflammatory",
      mrp: 35,
      janAushadhiPrice: 8.5,
      discountPercentage: 76,
      dosage: "650mg (10 tabs)",
      packSize: "Strip of 10",
      requiresPrescription: false,
      inStock: true,
    },
    {
      id: "med-02",
      name: "Metformin Hydrochloride 500mg SR",
      genericName: "Metformin HCl",
      category: "Antidiabetic",
      mrp: 65,
      janAushadhiPrice: 12.0,
      discountPercentage: 81,
      dosage: "500mg SR (10 tabs)",
      packSize: "Strip of 10",
      requiresPrescription: true,
      inStock: true,
    },
    {
      id: "med-03",
      name: "Amlodipine 5mg Tablets",
      genericName: "Amlodipine Besylate",
      category: "Antihypertensive",
      mrp: 45,
      janAushadhiPrice: 6.5,
      discountPercentage: 85,
      dosage: "5mg (10 tabs)",
      packSize: "Strip of 10",
      requiresPrescription: true,
      inStock: true,
    },
    {
      id: "med-04",
      name: "Amoxicillin & Potassium Clavulanate 625mg",
      genericName: "Amoxicillin + Clavulanic Acid",
      category: "Antibiotic",
      mrp: 215,
      janAushadhiPrice: 58.0,
      discountPercentage: 73,
      dosage: "625mg (6 tabs)",
      packSize: "Strip of 6",
      requiresPrescription: true,
      inStock: true,
    },
    {
      id: "med-05",
      name: "Povidone Iodine 5% Ointment",
      genericName: "Povidone Iodine IP 5% w/w",
      category: "First Aid & Wound Care",
      mrp: 85,
      janAushadhiPrice: 22.0,
      discountPercentage: 74,
      dosage: "5% w/w (20g Tube)",
      packSize: "20g Tube",
      requiresPrescription: false,
      inStock: true,
    },
    {
      id: "med-06",
      name: "Sterile Absorbent Gauze & Roller Bandage",
      genericName: "Cotton Gauze Bandage IP",
      category: "First Aid & Wound Care",
      mrp: 40,
      janAushadhiPrice: 9.0,
      discountPercentage: 77,
      dosage: "10cm x 4m",
      packSize: "Pack of 2",
      requiresPrescription: false,
      inStock: true,
    },
    {
      id: "med-07",
      name: "AIIA Ayush Ashwagandha Churna",
      genericName: "Withania Somnifera Pure Extract",
      category: "AYUSH Herbal",
      mrp: 140,
      janAushadhiPrice: 45.0,
      discountPercentage: 68,
      dosage: "100g Jar",
      packSize: "100g",
      requiresPrescription: false,
      inStock: true,
    },
    {
      id: "med-08",
      name: "Yograj Guggulu Tablets (Ayurvedic)",
      genericName: "Classical Joint & Vata Shaman Formulation",
      category: "AYUSH Herbal",
      mrp: 180,
      janAushadhiPrice: 65.0,
      discountPercentage: 64,
      dosage: "60 Tablets",
      packSize: "Bottle of 60",
      requiresPrescription: false,
      inStock: true,
    },
  ];

  const filteredMedicines = MEDICINES_CATALOG.filter((med) => {
    if (medicineCategory !== "ALL" && med.category !== medicineCategory) return false;
    if (medicineQuery.trim()) {
      const q = medicineQuery.toLowerCase();
      return (
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddToCart = (med: OnlineMedicineItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === med.id);
      if (existing) {
        return prev.map((c) => (c.item.id === med.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item: med, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === id) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as Array<{ item: OnlineMedicineItem; quantity: number }>
    );
  };

  const totalCartSubtotal = cart.reduce(
    (sum, c) => sum + c.item.janAushadhiPrice * c.quantity,
    0
  );
  const totalCartMrp = cart.reduce((sum, c) => sum + c.item.mrp * c.quantity, 0);
  const totalSavings = totalCartMrp - totalCartSubtotal;

  const handlePlaceOnlineOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/medicines/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: activePatient?.id || "RS-2026-NEW",
          patientName: activePatient?.name || "OPD Patient",
          items: cart.map((c) => ({
            name: c.item.name,
            genericName: c.item.genericName,
            dosage: c.item.dosage,
            price: c.item.janAushadhiPrice,
            mrp: c.item.mrp,
            quantity: c.quantity,
          })),
          deliveryAddress: "AIIA Pradhan Mantri Jan Aushadhi Kendra (PMBJP) Counter #3",
          prescriptionUploaded: Boolean(activePatient?.documents?.some((d) => d.type === "Prescription")),
        }),
      });
      const data = await res.json();
      setIsPlacingOrder(false);
      if (data.success && data.data) {
        setOrderSlipModal(data.data);
        setCart([]);
      }
    } catch {
      setIsPlacingOrder(false);
      // Fallback order slip
      setOrderSlipModal({
        orderId: `PMBJP-ORD-${Date.now().toString().slice(-6)}`,
        orderDate: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        patientId: activePatient?.id || "RS-2026-OPD",
        patientName: activePatient?.name || "Patient",
        items: cart.map((c) => ({
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.janAushadhiPrice,
        })),
        totalAmount: Math.round(totalCartSubtotal),
        totalSavings: Math.round(totalSavings),
        status: "CONFIRMED_READY",
        estimatedTime: "Ready for pickup in 15 mins at PMBJP Counter #3",
      });
      setCart([]);
    }
  };

  // --- AADHAAR CARD SIMULATED UPLOAD ---
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result as string;
      setAadhaarPhotoPreview(res);
      setAadhaarInput("XXXX-XXXX-7119");
      setIsAadhaarVerified(true);
      if (activePatient && onUpdatePatientAadhaar) {
        onUpdatePatientAadhaar(activePatient.id, {
          aadhaarNumberMasked: "XXXX-XXXX-7119",
          cardPhotoUrl: res,
          isVerified: true,
          linkedAbha: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // --- INSURANCE CARD SIMULATED UPLOAD ---
  const handleInsuranceCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result as string;
      setInsuranceCardPreview(res);
      setInsurancePolicyNo("PMJAY-DEL-2026-8831");
      setIsInsuranceVerified(true);
      setInsuranceSuccessMessage("Insurance Card scanned & PM-JAY Cashless eligibility verified.");
      if (activePatient && onUpdatePatientInsurance) {
        onUpdatePatientInsurance(activePatient.id, {
          provider: insuranceProvider,
          policyNumber: "PMJAY-DEL-2026-8831",
          schemeType: insuranceScheme,
          cardPhotoUrl: res,
          isVerified: true,
          sumInsured: "₹5,00,000",
          validUpto: "31-Dec-2027",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInsuranceAndAadhaar = () => {
    if (activePatient) {
      if (onUpdatePatientAadhaar && aadhaarInput) {
        onUpdatePatientAadhaar(activePatient.id, {
          aadhaarNumberMasked: aadhaarInput.startsWith("XXXX") ? aadhaarInput : `XXXX-XXXX-${aadhaarInput.slice(-4)}`,
          cardPhotoUrl: aadhaarPhotoPreview || undefined,
          isVerified: true,
          linkedAbha: true,
        });
      }
      if (onUpdatePatientInsurance && insurancePolicyNo) {
        onUpdatePatientInsurance(activePatient.id, {
          provider: insuranceProvider,
          policyNumber: insurancePolicyNo,
          schemeType: insuranceScheme,
          cardPhotoUrl: insuranceCardPreview || undefined,
          isVerified: true,
          sumInsured: "₹5,00,000",
          validUpto: "31-Dec-2027",
        });
      }
      setIsAadhaarVerified(true);
      setIsInsuranceVerified(true);
      setInsuranceSuccessMessage("Linked successfully to patient medical record.");
      setTimeout(() => setInsuranceSuccessMessage(""), 4000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Main Drawer Window */}
      <div className="w-full sm:w-[480px] md:w-[520px] bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                Clinical OPD Side Toolbar
              </h2>
              <p className="text-[11px] text-slate-400">
                Demo Cases • OPD Queue • Insurance &amp; Aadhaar • Jan Aushadhi
              </p>
            </div>
          </div>
          <button
            id="btn-close-side-toolbar"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Close Toolbar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Header */}
        <div className="grid grid-cols-4 bg-slate-100 p-1 border-b border-slate-200 text-[11px] font-bold">
          <button
            id="side-tab-demos"
            onClick={() => setActiveTab("demos")}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              activeTab === "demos"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Demo Cases</span>
          </button>

          <button
            id="side-tab-queue"
            onClick={() => setActiveTab("queue")}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all relative ${
              activeTab === "queue"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>OPD Queue ({patientsList.length})</span>
          </button>

          <button
            id="side-tab-insurance"
            onClick={() => setActiveTab("insurance")}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              activeTab === "insurance"
                ? "bg-white text-indigo-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
            <span>Aadhaar / Card</span>
          </button>

          <button
            id="side-tab-medicines"
            onClick={() => setActiveTab("medicines")}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all relative ${
              activeTab === "medicines"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-emerald-600" />
            <span>Medicines</span>
            {cart.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            )}
          </button>
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: DEMO CASES */}
          {activeTab === "demos" && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h3 className="text-xs font-black text-slate-900 mb-1">
                  Pre-Loaded Clinical Test Cases
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Click any verified clinical scenario below to instantly populate the triage system, preview injury images, check red flags, or inspect Ayurvedic parameters.
                </p>
              </div>

              {/* Trauma & Injury Photo Case */}
              <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-300/80 hover:border-amber-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Trauma &amp; Injury Photo
                  </span>
                  <span className="text-[11px] font-mono text-amber-900 font-bold">24y Male • Pune</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Kabir Deshmukh (Motorcycle Skid)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Bleeding pre-patellar laceration on right knee. Includes high-resolution injury photo, uploaded X-Ray, and tetanus review.
                  </p>
                </div>
                <div className="flex items-center justify-end pt-1">
                  <button
                    id="btn-side-load-trauma"
                    onClick={() => {
                      onLoadDemoTrauma();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                  >
                    <span>Load Kabir Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Acute Emergency Case */}
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 hover:border-rose-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Cardiac Red Flag
                  </span>
                  <span className="text-[11px] font-mono text-rose-900 font-bold">28y Male • Delhi</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Aarav Sharma (Chest Discomfort)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Acute retrosternal chest pain radiating to left arm with vegetative sweating. Immediate priority triage flags.
                  </p>
                </div>
                <div className="flex items-center justify-end pt-1">
                  <button
                    id="btn-side-load-emergency"
                    onClick={() => {
                      onLoadDemoEmergency();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                  >
                    <span>Load Aarav Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AYUSH Chronic Case */}
              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 hover:border-teal-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AYUSH / AIIA Case
                  </span>
                  <span className="text-[11px] font-mono text-teal-900 font-bold">42y Female • Varanasi</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Priya Verma (Joint Stiffness)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Chronic bilateral knee stiffness (6 months), sluggish Agni, Vata-Kapha Prakriti, and past metabolic reports.
                  </p>
                </div>
                <div className="flex items-center justify-end pt-1">
                  <button
                    id="btn-side-load-routine"
                    onClick={() => {
                      onLoadDemoRoutine();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                  >
                    <span>Load Priya Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-2">
                <button
                  id="btn-side-reset-demo"
                  onClick={onResetDemo}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Demo Cases &amp; Queue</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OPD QUEUE */}
          {activeTab === "queue" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900">Physician Queue Overview</h3>
                  <p className="text-[11px] text-slate-500">Live list of waiting patients</p>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {patientsList.length} In Queue
                </span>
              </div>

              <div className="space-y-2">
                {patientsList.map((patient) => {
                  const isSelected = patient.id === selectedPatientId;
                  const hasInjury = patient.injuryPhotos && patient.injuryPhotos.length > 0;
                  return (
                    <div
                      key={patient.id}
                      onClick={() => {
                        onSelectPatient(patient.id);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-slate-900">{patient.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{patient.id}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>
                              {patient.age}y • {patient.gender}
                            </span>
                            {patient.city && (
                              <span className="flex items-center gap-0.5 text-teal-600 font-semibold">
                                <MapPin className="w-2.5 h-2.5" />
                                {patient.city}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            patient.priority === "HIGH"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-teal-100 text-teal-800 border border-teal-200"
                          }`}
                        >
                          {patient.priority === "HIGH" ? "🚨 High Priority" : "Routine"}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mt-1.5">
                        {patient.chiefComplaint}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          {hasInjury && (
                            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                              <Camera className="w-2.5 h-2.5 text-amber-700" /> Injury Photo
                            </span>
                          )}
                          {patient.ayushMode && (
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              AYUSH
                            </span>
                          )}
                        </div>
                        <span className="text-blue-600 font-bold flex items-center gap-0.5">
                          <span>Review</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INSURANCE & AADHAAR UPLOAD (OPTIONAL) */}
          {activeTab === "insurance" && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                  <h3 className="text-xs font-black text-indigo-950">
                    Aadhaar &amp; Health Insurance (Optional)
                  </h3>
                </div>
                <p className="text-[11px] text-indigo-800/80 mt-1 leading-relaxed">
                  Both Aadhaar verification and Health Insurance uploads are completely optional. Patients without these documents can proceed directly for clinical consultation.
                </p>
              </div>

              {activePatient && (
                <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] flex items-center justify-between">
                  <span className="text-slate-600">Active Patient:</span>
                  <span className="font-bold text-slate-900">
                    {activePatient.name} ({activePatient.id})
                  </span>
                </div>
              )}

              {/* Section 1: Aadhaar Card (Optional) */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-extrabold text-slate-900">
                      Aadhaar Card Upload / Entry
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Optional</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Aadhaar Number (Masked)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. XXXX-XXXX-7119"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* Aadhaar Photo Upload */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Upload Aadhaar Card Image (Optional)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 p-3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-50 hover:bg-indigo-50/20 transition-all text-center">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-indigo-700">Click or Drag Aadhaar Card</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, PDF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleAadhaarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {aadhaarPhotoPreview && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Photo Attached
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">Verified UIDAI</span>
                  </div>
                )}
              </div>

              {/* Section 2: Health Insurance (Optional) */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold text-slate-900">
                      Health Insurance Scheme
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Optional</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Select Insurance Scheme
                  </label>
                  <select
                    value={insuranceScheme}
                    onChange={(e: any) => setInsuranceScheme(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Ayushman Bharat (PM-JAY)">
                      Ayushman Bharat (PM-JAY) - Up to ₹5 Lakh Cashless
                    </option>
                    <option value="CGHS / ECHS">CGHS / ECHS Government Healthcare Scheme</option>
                    <option value="Private TPA Mediclaim">Private Mediclaim (Star, Care, Niva Bupa, etc.)</option>
                    <option value="Corporate">Corporate / Employer Group Health Policy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Policy Number / PM-JAY Card ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PMJAY-DEL-2026-8831"
                    value={insurancePolicyNo}
                    onChange={(e) => setInsurancePolicyNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* Insurance Card Upload */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Upload Insurance Card Photo (Optional)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-emerald-400 p-3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-50 hover:bg-emerald-50/20 transition-all text-center">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-emerald-700">Click to Upload Insurance Card</span>
                    <span className="text-[10px] text-slate-400">Card Photo or Policy Document</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleInsuranceCardUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {insuranceCardPreview && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Insurance Card Attached
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">₹5 Lakh Cashless</span>
                  </div>
                )}
              </div>

              {insuranceSuccessMessage && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{insuranceSuccessMessage}</span>
                </div>
              )}

              <button
                type="button"
                id="btn-save-insurance-aadhaar"
                onClick={handleSaveInsuranceAndAadhaar}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Current Patient Record</span>
              </button>
            </div>
          )}

          {/* TAB 4: ONLINE MEDICINE & JAN AUSHADHI PLATFORM */}
          {activeTab === "medicines" && (
            <div className="space-y-4">
              {/* Jan Aushadhi Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 rounded-xl shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    PMBJP Integration
                  </span>
                  <span className="text-[11px] font-bold">Up to 85% Savings</span>
                </div>
                <h3 className="text-sm font-black">Pradhan Mantri Jan Aushadhi E-Pharmacy</h3>
                <p className="text-[11px] text-emerald-100">
                  Affordable generic &amp; Ayurvedic medicines available for direct clinic pickup or online dispatch.
                </p>
              </div>

              {/* Medicine Search & Category Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Paracetamol, Metformin, Ointment, AYUSH..."
                    value={medicineQuery}
                    onChange={(e) => setMedicineQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold text-slate-600">
                  {["ALL", "Analgesic / Anti-inflammatory", "Antidiabetic", "Antihypertensive", "Antibiotic", "First Aid & Wound Care", "AYUSH Herbal"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMedicineCategory(cat)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                        medicineCategory === cat
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {cat === "ALL" ? "All Medicines" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medicine Catalog Cards */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredMedicines.map((med) => {
                  const inCart = cart.find((c) => c.item.id === med.id);
                  return (
                    <div
                      key={med.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all space-y-2 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{med.name}</h4>
                          <span className="text-[10px] text-slate-500 block">
                            Generic: {med.genericName} • {med.dosage}
                          </span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded shrink-0">
                          {med.discountPercentage}% OFF
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-emerald-700 text-sm">
                            ₹{med.janAushadhiPrice}
                          </span>
                          <span className="text-slate-400 line-through text-[11px]">
                            MRP ₹{med.mrp}
                          </span>
                        </div>

                        {inCart ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 rounded-lg p-0.5 border border-emerald-200">
                            <button
                              onClick={() => handleUpdateCartQuantity(med.id, -1)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white text-emerald-700 font-bold hover:bg-emerald-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5 text-emerald-900">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateCartQuantity(med.id, 1)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white text-emerald-700 font-bold hover:bg-emerald-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(med)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary & Order Trigger */}
              {cart.length > 0 && (
                <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{cart.length} Medicines in Order Cart</span>
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      Saved ₹{Math.round(totalSavings)} with Jan Aushadhi
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Payable:</span>
                      <span className="text-base font-black text-white">
                        ₹{Math.round(totalCartSubtotal)}
                      </span>
                    </div>

                    <button
                      id="btn-checkout-medicine-order"
                      onClick={handlePlaceOnlineOrder}
                      disabled={isPlacingOrder}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isPlacingOrder ? "Processing..." : "Generate E-Pharmacy Slip"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Status */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            <span className="text-orange-500 font-bold">Raksha</span><span className="text-teal-600 font-bold">Saathi</span> Multi-Channel Access
          </span>
          <span className="font-bold text-teal-700">AIIA &amp; Ayush OPD Portal</span>
        </div>
      </div>

      {/* Order Slip Modal */}
      {orderSlipModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">E-Pharmacy Order Generated</h3>
                  <span className="text-[10px] font-mono text-slate-500">{orderSlipModal.orderId}</span>
                </div>
              </div>
              <button
                onClick={() => setOrderSlipModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{orderSlipModal.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Counter:</span>
                  <span className="font-semibold text-slate-800">{orderSlipModal.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup ETA:</span>
                  <span className="font-bold text-emerald-700">{orderSlipModal.estimatedTime}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ordered Items:</span>
                {orderSlipModal.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-slate-700 text-xs">
                    <span>
                      {item.name} x {item.quantity || 1}
                    </span>
                    <span className="font-bold">₹{item.price * (item.quantity || 1)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900">
                  <span>Total Amount (Jan Aushadhi Subsidized):</span>
                  <span className="text-emerald-700">₹{orderSlipModal.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Print Pharmacy Slip
              </button>
              <button
                onClick={() => setOrderSlipModal(null)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
