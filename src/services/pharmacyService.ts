// ============================================================================
// RakshaSaathi Medicine & Pharmacy Service Abstraction
// Ministry of Ayush & AIIA Clinical OPD Platform
// ============================================================================
// NOTE FOR DEVELOPERS:
// This service abstracts generic drug search, Jan Aushadhi Kendras availability,
// prescription fulfillment, and pharmacy delivery integration.
// In production, configure PHARMACY_API_KEY in .env to connect to Pradhan Mantri
// Bhartiya Janaushadhi Pariyojana (PMBJP) or partner e-pharmacy APIs.
// Currently operating in: DEMO INTEGRATION / COMING SOON mode.
// ============================================================================

import { OnlineMedicineItem } from "../types";

export const SAMPLE_MEDICINES: OnlineMedicineItem[] = [
  {
    id: "MED-001",
    name: "Paracetamol Tablets IP 650 mg",
    genericName: "Paracetamol",
    category: "Analgesic / Anti-inflammatory",
    mrp: 32,
    janAushadhiPrice: 8.5,
    discountPercentage: 73,
    dosage: "650 mg",
    packSize: "10 Tablets / Strip",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "MED-002",
    name: "Amoxicillin & Potassium Clavulanate 625 mg",
    genericName: "Amoxicillin + Clavulanic Acid",
    category: "Antibiotic",
    mrp: 185,
    janAushadhiPrice: 48,
    discountPercentage: 74,
    dosage: "500 mg + 125 mg",
    packSize: "10 Tablets / Strip",
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "MED-003",
    name: "Pantoprazole Gastro-Resistant Tablets 40 mg",
    genericName: "Pantoprazole",
    category: "Analgesic / Anti-inflammatory",
    mrp: 110,
    janAushadhiPrice: 22,
    discountPercentage: 80,
    dosage: "40 mg",
    packSize: "10 Tablets / Strip",
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "MED-004",
    name: "Metformin Hydrochloride Prolonged Release 500 mg",
    genericName: "Metformin HCl",
    category: "Antidiabetic",
    mrp: 45,
    janAushadhiPrice: 12,
    discountPercentage: 73,
    dosage: "500 mg PR",
    packSize: "10 Tablets / Strip",
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "MED-005",
    name: "Amlodipine Tablets IP 5 mg",
    genericName: "Amlodipine Besylate",
    category: "Antihypertensive",
    mrp: 38,
    janAushadhiPrice: 6.2,
    discountPercentage: 84,
    dosage: "5 mg",
    packSize: "10 Tablets / Strip",
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "MED-006",
    name: "Ayush Kwath Churna / Tablets (Ministry of Ayush)",
    genericName: "Tulsi, Dalchini, Sunthi, Krishna Marich",
    category: "AYUSH Herbal",
    mrp: 90,
    janAushadhiPrice: 35,
    discountPercentage: 61,
    dosage: "3g sachet / 500mg tab",
    packSize: "100g Bottle",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "MED-007",
    name: "Povidone Iodine Ointment USP 5% w/w",
    genericName: "Povidone Iodine",
    category: "First Aid & Wound Care",
    mrp: 65,
    janAushadhiPrice: 19.5,
    discountPercentage: 70,
    dosage: "5% w/w",
    packSize: "20g Tube",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "MED-008",
    name: "Cetirizine Hydrochloride Tablets IP 10 mg",
    genericName: "Cetirizine HCl",
    category: "Analgesic / Anti-inflammatory",
    mrp: 24,
    janAushadhiPrice: 5.5,
    discountPercentage: 77,
    dosage: "10 mg",
    packSize: "10 Tablets / Strip",
    requiresPrescription: false,
    inStock: true,
  },
];

export interface PharmacyOrderSimulation {
  orderId: string;
  items: OnlineMedicineItem[];
  patientName: string;
  deliveryCity: string;
  totalMrp: number;
  totalJanAushadhiPrice: number;
  savings: number;
  status: "Order Received (Simulated)" | "Prescription Verification Pending" | "Ready for Jan Aushadhi Pickup";
  deliveryEstimate: string;
}

/**
 * Searches medicine inventory.
 * TODO: Hook up PHARMACY_API_KEY with real PMBJP / e-pharmacy microservice.
 */
export async function searchMedicines(query: string, category?: string): Promise<OnlineMedicineItem[]> {
  try {
    const res = await fetch(`/api/pharmacy/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category || "")}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // offline fallback
  }

  let results = SAMPLE_MEDICINES;
  if (category && category !== "All") {
    results = results.filter((m) => m.category === category);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }
  return results;
}

/**
 * Simulates placing a Jan Aushadhi order or prescription fulfillment.
 */
export function simulatePharmacyOrder(
  items: OnlineMedicineItem[],
  patientName: string,
  city: string
): PharmacyOrderSimulation {
  const totalMrp = items.reduce((sum, item) => sum + item.mrp, 0);
  const totalJanAushadhi = items.reduce((sum, item) => sum + item.janAushadhiPrice, 0);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return {
    orderId: `PMBJP-ORD-${randomSuffix}`,
    items,
    patientName: patientName || "Valued Citizen",
    deliveryCity: city || "Local District",
    totalMrp,
    totalJanAushadhiPrice: totalJanAushadhi,
    savings: totalMrp - totalJanAushadhi,
    status: "Order Received (Simulated)",
    deliveryEstimate: "Today within 2-4 hours from nearest Pradhan Mantri Jan Aushadhi Kendra",
  };
}
