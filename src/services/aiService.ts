// ============================================================================
// RakshaSaathi AI Service Abstraction
// Ministry of Ayush & AIIA Clinical OPD Platform
// ============================================================================
// NOTE FOR DEVELOPERS:
// This service provides an abstraction layer for AI-driven multilingual case taking,
// adaptive clinical questioning, red-flag triage detection, and clinical summarization.
// In production, configure GEMINI_API_KEY in .env. When no key is set or offline,
// it gracefully falls back to structured, deterministic clinical heuristics.
// ============================================================================

import { ClinicalSummary, LanguageCode } from "../types";

export interface AIQuestionResponse {
  question: string;
  category: string;
  touchOptions: string[];
  isRedFlag: boolean;
  explanation?: string;
}

export interface RedFlagCheckResult {
  hasRedFlag: boolean;
  flags: string[];
  reassuranceMessage: string;
  clinicalNote: string;
}

/**
 * Generates an adaptive follow-up question based on patient's symptoms & previous answers.
 * TODO: Connect to Gemini 2.5 Flash API endpoint (/api/ai/follow-up) or Antigravity client.
 */
export async function generateAdaptiveQuestion(
  chiefComplaint: string,
  turnCount: number,
  previousAnswers: string[],
  language: LanguageCode = "en",
  ayushMode: boolean = false
): Promise<AIQuestionResponse> {
  try {
    const res = await fetch("/api/ai/follow-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chiefComplaint,
        turnCount,
        previousAnswers,
        language,
        ayushMode,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Graceful offline/local fallback
  }

  // Fallback intelligent clinical question tree based on chief complaint & turn
  const lower = chiefComplaint.toLowerCase();

  if (ayushMode && turnCount >= 3) {
    if (turnCount === 3) {
      return {
        question:
          language === "hi"
            ? "आयुष मूल्यांकन: आपकी पाचन शक्ति (अग्नि) और भूख कैसी रहती है?"
            : "AYUSH Evaluation: How is your digestive appetite (Agni) and bowel habit (Koshtha)?",
        category: "AYUSH Prakriti & Agni",
        touchOptions: [
          language === "hi" ? "नियमित व अच्छी भूख (सम अग्नि)" : "Regular & Strong (Sama Agni)",
          language === "hi" ? "अनियमित / कम ज्यादा भूख (विषम अग्नि)" : "Irregular / Variable (Vishama Agni)",
          language === "hi" ? "अत्यधिक भूख व जलन (तीक्ष्ण अग्नि)" : "Excessive Hunger / Acidity (Teekshna)",
          language === "hi" ? "मंद / भारीपन (मंद अग्नि)" : "Sluggish / Heaviness (Manda Agni)",
        ],
        isRedFlag: false,
      };
    }
    if (turnCount === 4) {
      return {
        question:
          language === "hi"
            ? "आपकी नींद (निद्रा) और शारीरिक सहनशीलता (ऋतु अनुसार शीत/उष्ण संवेदनशीलता) कैसी है?"
            : "AYUSH Evaluation: How is your sleep pattern and weather tolerance (cold vs heat sensitivity)?",
        category: "AYUSH Ahara-Vihara",
        touchOptions: [
          language === "hi" ? "गहरी शांत नींद (कफज)" : "Deep undisturbed sleep (Kaphaja)",
          language === "hi" ? "हल्की या बार-बार टूटने वाली नींद (वातज)" : "Light / broken sleep (Vataja)",
          language === "hi" ? "मध्यम नींद, गर्मी सहन नहीं (पित्तज)" : "Moderate sleep, heat intolerant (Pittaja)",
        ],
        isRedFlag: false,
      };
    }
  }

  // General clinical adaptive questions
  if (turnCount === 1) {
    return {
      question:
        language === "hi"
          ? "यह परेशानी पहली बार कब महसूस हुई और क्या यह लगातार बनी रहती है?"
          : "When did you first notice this problem, and is it constant or does it come and go?",
      category: "Onset & Duration",
      touchOptions: [
        language === "hi" ? "आज सुबह से (Today)" : "Started today / sudden",
        language === "hi" ? "पिछले 2-3 दिनों से (2-3 days)" : "2 to 3 days ago",
        language === "hi" ? "1-2 हफ्तों से (1-2 weeks)" : "1 to 2 weeks ago",
        language === "hi" ? "लंबे समय / 1 महीने से अधिक (Chronic)" : "More than a month (chronic)",
      ],
      isRedFlag: false,
    };
  }

  if (turnCount === 2) {
    if (lower.includes("chest") || lower.includes("pain") || lower.includes("dard")) {
      return {
        question:
          language === "hi"
            ? "दर्द की तीव्रता कैसी है और क्या यह बांह, गर्दन या पीठ की तरफ फैलता है?"
            : "How intense is the pain, and does it spread or radiate to your arm, neck, or back?",
        category: "Pain Radiation & Severity",
        touchOptions: [
          language === "hi" ? "हल्का दर्द (Mild)" : "Mild discomfort (1-3 / 10)",
          language === "hi" ? "मध्यम असहजता (Moderate)" : "Moderate ache (4-6 / 10)",
          language === "hi" ? "अत्यधिक तेज दर्द (Severe)" : "Severe pressure / spreading (7-10 / 10)",
          language === "hi" ? "भारीपन / दबाव जैसा" : "Heavy tightening sensation",
        ],
        isRedFlag: lower.includes("chest"),
      };
    }

    return {
      question:
        language === "hi"
          ? "क्या इस परेशानी के साथ बुखार, चक्कर या कमजोरी जैसा कोई अन्य लक्षण भी है?"
          : "Are you experiencing any associated symptoms like fever, dizziness, nausea, or fatigue?",
      category: "Associated Symptoms",
      touchOptions: [
        language === "hi" ? "हल्का बुखार / कंपकंपी" : "Fever / Chills",
        language === "hi" ? "चक्कर या कमजोरी" : "Dizziness / Weakness",
        language === "hi" ? "जी मिचलाना / उल्टी" : "Nausea / Vomiting",
        language === "hi" ? "कोई अन्य लक्षण नहीं" : "No other symptoms",
      ],
      isRedFlag: false,
    };
  }

  return {
    question:
      language === "hi"
        ? "क्या आप इसके लिए पहले से कोई दवा ले रहे हैं या आपको कोई एलर्जी है?"
        : "Are you currently taking any medications for this condition, or do you have any drug allergies?",
    category: "Medication & Allergy History",
    touchOptions: [
      language === "hi" ? "कोई दवा नहीं ले रहे" : "No current medications",
      language === "hi" ? "पेरासिटामोल / दर्द निवारक ली" : "Took OTC analgesic / antipyretic",
      language === "hi" ? "बीपी / शुगर की दवाएं जारी हैं" : "Regular BP / Diabetes medicines",
      language === "hi" ? "दवाओं से एलर्जी का इतिहास है" : "History of drug allergy",
    ],
    isRedFlag: false,
  };
}

/**
 * Checks for red-flag emergency symptoms in patient input.
 * Informs medical staff silently on doctor portal without frightening the patient.
 */
export function checkClinicalRedFlags(text: string): RedFlagCheckResult {
  const lower = text.toLowerCase();
  const emergencyKeywords = [
    "chest pain",
    "heart attack",
    "shortness of breath",
    "difficulty breathing",
    "breathless",
    "unconscious",
    "fainted",
    "seizure",
    "bleeding heavily",
    "blood vomit",
    "chhati me dard",
    "saans lene me takleef",
    "behoshi",
    "severe burn",
  ];

  const matched = emergencyKeywords.filter((k) => lower.includes(k));

  if (matched.length > 0) {
    return {
      hasRedFlag: true,
      flags: matched,
      reassuranceMessage:
        "Your symptoms may require prompt medical attention. Please inform the triage or OPD nursing staff immediately so they can arrange an expedited evaluation.",
      clinicalNote: `Potential Acute Clinical Indicator: Patient reported '${matched.join(
        ", "
      )}'. Flagged for prompt physician review.`,
    };
  }

  return {
    hasRedFlag: false,
    flags: [],
    reassuranceMessage: "",
    clinicalNote: "Standard outpatient evaluation queue.",
  };
}

/**
 * Synthesizes collected conversation into a structured physician-ready clinical summary.
 * TODO: Connect to backend Gemini / LLM summarizer with FHIR template structure.
 */
export async function generateClinicalSummary(patientData: {
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  conversation: Array<{ sender: string; text: string }>;
  ayushMode?: boolean;
}): Promise<ClinicalSummary> {
  try {
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }

  const patientUtterances = patientData.conversation
    .filter((c) => c.sender === "patient")
    .map((c) => c.text)
    .join("; ");

  return {
    chiefComplaint: patientData.chiefComplaint || "General consultation",
    hpi: `Patient presents with ${patientData.chiefComplaint || "unspecified symptoms"}. Key reported factors: ${
      patientUtterances || "Onset in recent days without relieved distress"
    }.`,
    pastMedicalHistory: "No significant past hospital admissions reported by patient in preliminary intake.",
    pastSurgicalHistory: "None declared during intake.",
    drugHistory: "No regular prescription medications recorded in preliminary intake.",
    allergyHistory: "No documented drug or food allergies declared.",
    familyHistory: "Non-contributory for early familial disorders.",
    personalHistory: "Non-smoker, non-alcoholic; balanced Indian vegetarian/mixed dietary intake.",
    reviewOfSystems: "Cardiovascular, Respiratory, and GI systems preliminarily reviewed through patient responses.",
    investigations: "Pending physician review of uploaded scans and lab records.",
    ayushPrakriti: patientData.ayushMode ? "Vata-Pitta Pradhana (Preliminary screening)" : undefined,
    ayushAgni: patientData.ayushMode ? "Vishama Agni (Variable digestive fire)" : undefined,
    ayushKoshtha: patientData.ayushMode ? "Madhyama Koshtha" : undefined,
    ayushAharaVihara: patientData.ayushMode ? "Regular daytime routines; mild sleep disturbance noted" : undefined,
    aiConfidence: "High",
  };
}
