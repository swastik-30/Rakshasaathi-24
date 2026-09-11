export interface SlideContent {
  id: number;
  number: string;
  badge: string;
  title: string;
  subtitle: string;
}

export const SLIDES_METADATA: SlideContent[] = [
  {
    id: 1,
    number: "01",
    badge: "TITLE SLIDE",
    title: "RAKSHASAATHI",
    subtitle: "AI-Powered Multilingual Patient Case-Taking & Emergency Assistance Platform",
  },
  {
    id: 2,
    number: "02",
    badge: "PROPOSED SOLUTION",
    title: "Patient-Facing Clinical Intake & Triaging",
    subtitle: "End-to-end multilingual journey: Voice + Touch + Document AI + Doctor Verification",
  },
  {
    id: 3,
    number: "03",
    badge: "TECHNICAL APPROACH",
    title: "System Architecture & Engineering Stack",
    subtitle: "Modular, FHIR/ABDM-ready pipeline from raw speech & OCR to structured physician summary",
  },
  {
    id: 4,
    number: "04",
    badge: "FEASIBILITY & RISKS",
    title: "Feasibility Matrix & Clinical Risk Mitigation",
    subtitle: "Conservative human-in-the-loop safeguards, noise filtering, and data protection",
  },
  {
    id: 5,
    number: "05",
    badge: "IMPACT & BENEFITS",
    title: "Multi-Stakeholder Impact & Social Inclusion",
    subtitle: "Empowering patients, doctors, OPD hospitals, and structured AYUSH medicine",
  },
  {
    id: 6,
    number: "06",
    badge: "ROADMAP & REFERENCES",
    title: "Future Roadmap & Verified Research Basis",
    subtitle: "Phase 1 Core Clinical Intake to Phase 2 Emergency AI & Phase 3 Connected ABDM Digital Health",
  },
];
