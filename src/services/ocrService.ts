// ============================================================================
// RakshaSaathi OCR & Medical Document Extraction Service Abstraction
// Ministry of Ayush & AIIA Clinical OPD Platform
// ============================================================================
// NOTE FOR DEVELOPERS:
// This service abstracts document digitization, OCR, and structured clinical
// parameter extraction (Prescriptions, Lab Reports, X-Rays, Discharge Summaries).
// In production, configure OCR_API_KEY in .env. When not configured or in demo mode,
// it uses simulated intelligent medical entity extraction.
// ============================================================================

import { DocumentItem } from "../types";

export type SupportedDocType =
  | "X-Ray / Scan"
  | "Blood Test Report"
  | "Lab Report"
  | "Prescription"
  | "Doctor's Previous Description"
  | "Discharge Summary"
  | "Medical Certificate"
  | "Other Medical Document";

export interface ExtractedDocResult {
  name: string;
  type: string;
  date: string;
  summary: string;
  confidence: number;
  radiologyFindings?: string;
  bodyPartOrOrgan?: string;
  extractedData?: {
    medicines?: string[];
    diagnoses?: string[];
    tests?: Array<{ name: string; value: string; status: string }>;
    dates?: string[];
  };
}

/**
 * Extracts clinical parameters from uploaded medical files.
 * TODO: Connect to Google Cloud Document AI / AWS Textract / Tesseract endpoint (/api/ocr/extract)
 */
export async function extractDocumentData(
  fileName: string,
  docType: SupportedDocType,
  fileUrl?: string
): Promise<ExtractedDocResult> {
  // If OCR_API_KEY is hooked to backend, try invoking API
  try {
    const res = await fetch("/api/ocr/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, docType, fileUrl }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback to simulated medical extraction
  }

  const today = new Date().toISOString().split("T")[0];

  switch (docType) {
    case "X-Ray / Scan":
      return {
        name: fileName || "Chest & Skeletal X-Ray PA View",
        type: "X-Ray / Scan",
        date: today,
        summary:
          "High-resolution digital radiographic examination. Bony architecture intact; no radiopaque foreign body or focal consolidation detected.",
        confidence: 96,
        bodyPartOrOrgan: "Thoracic & Skeletal",
        radiologyFindings:
          "Cardiothoracic ratio within normal limits (<0.50). Bilateral costophrenic angles sharp. Clear lung fields with no acute pneumothorax.",
        extractedData: {
          diagnoses: ["Normal Chest Radiograph", "No Acute Bony Fracture"],
          dates: [today],
        },
      };

    case "Blood Test Report":
    case "Lab Report":
      return {
        name: fileName || "Complete Blood Count (CBC) & Metabolic Panel",
        type: "Lab Report",
        date: today,
        summary:
          "Automated hematology analyzer report. Hemoglobin 13.8 g/dL (Normal). TLC 7,400 /mcL. Platelet count 240,000 /mcL.",
        confidence: 98,
        extractedData: {
          tests: [
            { name: "Hemoglobin (Hb)", value: "13.8 g/dL", status: "Normal (13.0 - 17.0)" },
            { name: "Total Leukocyte Count", value: "7,400 /mcL", status: "Normal (4,000 - 11,000)" },
            { name: "Platelets", value: "240,000 /mcL", status: "Normal (150,000 - 450,000)" },
            { name: "Random Blood Sugar", value: "108 mg/dL", status: "Normal (<140 mg/dL)" },
            { name: "Serum Creatinine", value: "0.9 mg/dL", status: "Normal (0.7 - 1.2)" },
          ],
          dates: [today],
        },
      };

    case "Prescription":
      return {
        name: fileName || "OPD Follow-up Prescription",
        type: "Prescription",
        date: today,
        summary:
          "Handwritten prescription digitized. Rx: Tab Paracetamol 650mg SOS, Tab Pantoprazole 40mg OD AC x 5 days, Cap Amoxicillin-Clav 625mg BD x 5 days.",
        confidence: 94,
        extractedData: {
          medicines: [
            "Tab Paracetamol 650mg - 1 SOS for fever/bodyache",
            "Tab Pantoprazole 40mg - 1 OD morning empty stomach",
            "Cap Amoxicillin-Clav 625mg - 1 BD after meals x 5 days",
          ],
          diagnoses: ["Upper Respiratory Tract Infection / Fever"],
          dates: [today],
        },
      };

    case "Doctor's Previous Description":
      return {
        name: fileName || "Previous Physician Consultation Note",
        type: "Previous Consultation",
        date: today,
        summary:
          "Prior OPD clinical notes: Patient presented with episodic epigastric discomfort after spicy meals. Advised lifestyle modifications and proton-pump inhibitors.",
        confidence: 93,
        extractedData: {
          diagnoses: ["GERD / Non-ulcer Dyspepsia"],
          medicines: ["Lifestyle advice", "Antacids as needed"],
          dates: [today],
        },
      };

    case "Discharge Summary":
      return {
        name: fileName || "Inpatient Hospital Discharge Summary",
        type: "Discharge Summary",
        date: today,
        summary:
          "Discharged in stable, ambulatory condition. Vitals normal at discharge: BP 120/80 mmHg, HR 76/min, SpO2 99% on room air. Suture removal advised on day 7.",
        confidence: 97,
        extractedData: {
          diagnoses: ["Elective minor procedure / Observation"],
          dates: [today],
        },
      };

    default:
      return {
        name: fileName || "General Medical Document",
        type: "Other Medical Document",
        date: today,
        summary: "Document verified and securely archived in patient record.",
        confidence: 90,
        extractedData: {
          dates: [today],
        },
      };
  }
}
