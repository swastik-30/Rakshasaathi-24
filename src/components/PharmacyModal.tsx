import React, { useState } from "react";
import {
  Pill,
  Search,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Tag,
  Clock,
} from "lucide-react";
import {
  SAMPLE_MEDICINES,
  searchMedicines,
  simulatePharmacyOrder,
  PharmacyOrderSimulation,
} from "../services/pharmacyService";
import { OnlineMedicineItem } from "../types";

interface PharmacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientCity?: string;
}

export const PharmacyModal: React.FC<PharmacyModalProps> = ({
  isOpen,
  onClose,
  patientName = "Patient",
  patientCity = "Delhi",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<OnlineMedicineItem[]>([]);
  const [orderResult, setOrderResult] = useState<PharmacyOrderSimulation | null>(null);
  const [uploadedRxName, setUploadedRxName] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    "All",
    "Analgesic / Anti-inflammatory",
    "Antibiotic",
    "Antidiabetic",
    "Antihypertensive",
    "AYUSH Herbal",
    "First Aid & Wound Care",
  ];

  const filteredMedicines = SAMPLE_MEDICINES.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const addToCart = (item: OnlineMedicineItem) => {
    if (!cart.some((c) => c.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const handleSimulateOrder = () => {
    if (cart.length === 0) return;
    const order = simulatePharmacyOrder(cart, patientName, patientCity);
    setOrderResult(order);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-white">Online Medicine &amp; Pharmacy</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/40">
                  Demo Integration • Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) generic medicines &amp; prescription delivery interface
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

        {/* Prototype Transparency Notice */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Prototype Notice:</strong> This is an integrated architecture placeholder. Real commercial ordering will be linked with official Jan Aushadhi &amp; licensed e-pharmacy APIs in Phase 6.
          </span>
        </div>

        {/* Main Content Area */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Order Placed Confirmation (If simulated) */}
          {orderResult && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-sm">Order Simulation Successful</span>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                  {orderResult.orderId}
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Thank you, <strong>{orderResult.patientName}</strong>. Your generic medicine requirement has been simulated for delivery to <strong>{orderResult.deliveryCity}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-900 pt-2 border-t border-emerald-200 font-medium">
                <span>Total Jan Aushadhi Cost: <strong>₹{orderResult.totalJanAushadhiPrice.toFixed(1)}</strong></span>
                <span>Market Price (MRP): <del className="text-emerald-700">₹{orderResult.totalMrp.toFixed(1)}</del></span>
                <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                  You Save: ₹{orderResult.savings.toFixed(1)} (70%+ Discount)
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5" />
                  {orderResult.deliveryEstimate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderResult(null);
                  setCart([]);
                }}
                className="text-xs font-bold text-emerald-800 hover:underline pt-1 block"
              >
                ← Place another search / order
              </button>
            </div>
          )}

          {/* Quick Prescription Upload Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Upload Doctor Prescription for Fulfillment</h4>
                <p className="text-[11px] text-slate-500">
                  {uploadedRxName ? `Attached: ${uploadedRxName}` : "PDF, JPG, or camera scan from your consultation"}
                </p>
              </div>
            </div>

            <label className="cursor-pointer px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadedRxName ? "Change File" : "Upload Prescription"}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadedRxName(file.name);
                }}
              />
            </label>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search generic salt, brand, or AYUSH formulation (e.g. Paracetamol, Metformin, Ayush Kwath)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredMedicines.map((med) => {
              const isAdded = cart.some((c) => c.id === med.id);
              return (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-2xs flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block leading-tight">{med.name}</span>
                        <span className="text-[11px] text-teal-700 font-medium">{med.genericName}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded shrink-0">
                        {med.dosage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                      <span>Pack: {med.packSize}</span>
                      {med.requiresPrescription && (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold text-[10px] border border-amber-200">
                          Rx Required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-slate-950">₹{med.janAushadhiPrice}</span>
                        <del className="text-[11px] text-slate-400">₹{med.mrp}</del>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                          {med.discountPercentage}% OFF
                        </span>
                      </div>
                      <span className="text-[10px] text-teal-800 font-semibold block">Jan Aushadhi Price</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => (isAdded ? removeFromCart(med.id) : addToCart(med))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isAdded
                          ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          : "bg-teal-600 hover:bg-teal-700 text-white shadow-2xs"
                      }`}
                    >
                      {isAdded ? "Remove" : "+ Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Bar */}
          {cart.length > 0 && !orderResult && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-teal-400" />
                <div>
                  <span className="text-xs font-bold">{cart.length} Medicines in Cart</span>
                  <span className="text-xs text-slate-300 block">
                    Total: ₹{cart.reduce((s, i) => s + i.janAushadhiPrice, 0).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSimulateOrder}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all"
                >
                  Simulate Order Placement →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Jan Aushadhi Scheme • Government of India Affordable Medicine Initiative
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
