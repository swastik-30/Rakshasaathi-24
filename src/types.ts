export type LanguageCode =
  | "en"
  | "hi"
  | "hinglish"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "pa";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface InjuryPhotoItem {
  id: string;
  imageUrl: string;
  timestamp: string;
  bodyPart: string;
  accidentContext: string;
  visualFindings: string;
  severityScore: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";
  recommendations: string[];
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number | string;
  gender: string;
  city: string;
  phone: string;
  emergencyContact: string;
  abhaId?: string;
  chiefComplaint: string;
  duration: string;
  language: LanguageCode;
  ayushMode: boolean;
}

export interface ClinicalSummary {
  chiefComplaint: string;
  hpi: string;
  pastMedicalHistory: string;
  pastSurgicalHistory: string;
  drugHistory: string;
  allergyHistory: string;
  familyHistory: string;
  personalHistory: string;
  reviewOfSystems: string;
  investigations: string;
  ayushPrakriti?: string;
  ayushAgni?: string;
  ayushKoshtha?: string;
  ayushAharaVihara?: string;
  aiConfidence: "High" | "Medium" | "Low";
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  schemeType: "Ayushman Bharat (PM-JAY)" | "CGHS / ECHS" | "Private TPA Mediclaim" | "Corporate";
  cardPhotoUrl?: string;
  isVerified?: boolean;
  sumInsured?: string;
  validUpto?: string;
}

export interface AadhaarInfo {
  aadhaarNumberMasked: string;
  cardPhotoUrl?: string;
  isVerified?: boolean;
  linkedAbha?: boolean;
}

export interface OnlineMedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: "Analgesic / Anti-inflammatory" | "Antibiotic" | "Antidiabetic" | "Antihypertensive" | "AYUSH Herbal" | "First Aid & Wound Care";
  mrp: number;
  janAushadhiPrice: number;
  discountPercentage: number;
  dosage: string;
  packSize: string;
  requiresPrescription: boolean;
  inStock: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: "Prescription" | "Lab Report" | "X-Ray / Scan" | "Discharge Summary" | "Previous Consultation";
  date: string;
  summary: string;
  confidence: number;
  imageUrl?: string;
  bodyPartOrOrgan?: string;
  radiologyFindings?: string;
  extractedData?: {
    medicines?: string[];
    diagnoses?: string[];
    tests?: Array<{ name: string; value: string; status: string }>;
    dates?: string[];
  };
}

export interface TimelineItem {
  year: string;
  title: string;
  category: "Diagnosis" | "Medication" | "Investigation" | "Consultation";
  description: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "patient" | "system";
  text: string;
  timestamp: string;
  category?: string;
  touchOptions?: string[];
  isRedFlag?: boolean;
}

export interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  phone: string;
  emergencyContact?: string;
  abhaId?: string;
  language: string;
  ayushMode: boolean;
  chiefComplaint: string;
  duration: string;
  priority: "HIGH" | "MODERATE" | "ROUTINE";
  status: "PENDING_REVIEW" | "CONFIRMED" | "CORRECTION_REQUESTED";
  redFlags: string[];
  clinicalSummary: ClinicalSummary;
  injuryPhotos?: InjuryPhotoItem[];
  documents: DocumentItem[];
  timeline: TimelineItem[];
  conversation: Array<{ sender: "ai" | "patient"; text: string; timestamp: string }>;
  insuranceInfo?: InsuranceInfo;
  aadhaarInfo?: AadhaarInfo;
  verifiedBy?: string;
  doctorNotes?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}
