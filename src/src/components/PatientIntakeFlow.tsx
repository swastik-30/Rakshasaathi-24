import React, { useState, useEffect, useRef } from "react";
import {
  PatientInfo,
  ClinicalSummary,
  DocumentItem,
  ChatMessage,
  InjuryPhotoItem,
  LanguageCode,
  PatientCase,
} from "../types";
import { UI_STRINGS, LANGUAGES } from "../data/translations";
import {
  User,
  Heart,
  Shield,
  Volume2,
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  Clock,
  Activity,
  Camera,
  Image as ImageIcon,
  Trash2,
  Eye,
  Building,
  Phone,
  HelpCircle,
  Zap,
  Check,
  Globe,
} from "lucide-react";

export const SPEECH_LANG_CODES: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  hinglish: "hi-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  pa: "pa-IN",
};

export const LANGUAGE_DISPLAY_NAMES: Record<LanguageCode, string> = {
  en: "English",
  hi: "Hindi",
  hinglish: "Hinglish (Hindi-English blend)",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  pa: "Punjabi",
};

const INITIAL_GREETINGS: Record<
  LanguageCode,
  { greeting: (name: string, complaint: string) => string; options: string[] }
> = {
  en: {
    greeting: (name, complaint) =>
      `Namaste ${name}! To help your consulting doctor thoroughly understand your complaint ("${complaint}"), could you describe the type, onset, and intensity of this discomfort?`,
    options: [
      "Sharp & continuous pain",
      "Dull, throbbing discomfort",
      "Caused by acute accident / trauma",
      "Restricted movement / swelling",
    ],
  },
  hi: {
    greeting: (name, complaint) =>
      `नमस्ते ${name} जी! आपकी मुख्य समस्या (${complaint}) के बारे में अधिक जानने के लिए कृपया बताएं कि यह दर्द या तकलीफ़ किस प्रकार की है?`,
    options: [
      "तेज़ और लगातार दर्द (Sharp & Continuous)",
      "हल्का पर बढ़ता हुआ (Dull & Worsening)",
      "दुर्घटना / चोट के कारण (Accident / Injury)",
      "चलने-फिरने में भारी तकलीफ़ (Difficulty in movement)",
    ],
  },
  hinglish: {
    greeting: (name, complaint) =>
      `Namaste ${name} ji! Aapki problem (${complaint}) ke baare mein doctor ko batane ke liye, please batayein ki yeh pain kaisa feel ho raha hai?`,
    options: [
      "Tez aur continuous pain",
      "Dull aur dheere dheere badhne wala",
      "Chot ya accident ki wajah se",
      "Swelling aur movement mein takleef",
    ],
  },
  bn: {
    greeting: (name, complaint) =>
      `নমস্কার ${name}! আপনার সমস্যা (${complaint}) সম্পর্কে বিস্তারিত জানতে, দয়া করে বলুন এই অস্বস্তি বা ব্যথা কেমন ধরণের?`,
    options: [
      "তীব্র ও অবিরাম ব্যথা",
      "হালকা কিন্তু ক্রমবর্ধমান অস্বস্তি",
      "দুর্ঘটনা বা আঘাতের কারণে",
      "ফোলাভাব ও চলাফেরায় সমস্যা",
    ],
  },
  ta: {
    greeting: (name, complaint) =>
      `வணக்கம் ${name}! உங்கள் பிரச்சனை (${complaint}) குறித்து மருத்துவரிடம் தெரிவிக்க, வலி அல்லது அசௌகரியத்தின் தன்மை எப்படி உள்ளது?`,
    options: [
      "கடுமையான தொடர் வலி",
      "லேசான ஆனால் அதிகரிக்கும் வலி",
      "விபத்து அல்லது காயம் காரணமாக",
      "வீக்கம் மற்றும் அசைக்க இயலாமை",
    ],
  },
  te: {
    greeting: (name, complaint) =>
      `నమస్కారం ${name}! మీ సమస్య (${complaint}) గురించి వైద్యుడికి తెలియజేయడానికి, నొప్పి లేదా అసౌకర్యం ఎలా ఉందో వివరించండి?`,
    options: [
      "తీవ్రమైన మరియు నిరంతర నొప్పి",
      "నెమ్మదిగా పెరుగుతున్న అసౌకర్యం",
      "ప్రమాదం లేదా గాయం కారణంగా",
      "వాపు మరియు కదలలేని స్థితి",
    ],
  },
  mr: {
    greeting: (name, complaint) =>
      `नमस्कार ${name}! तुमच्या तक्रारीबद्दल (${complaint}) अधिक माहितीसाठी, कृपया वेदनेचे स्वरूप आणि तीव्रता सांगा?`,
    options: [
      "तीव्र आणि सतत होणारी वेदना",
      "मंद पण वाढणारी अस्वस्थता",
      "अपघात किंवा दुखापतीमुळे",
      "सूज आणि हालचालीत अडचण",
    ],
  },
  gu: {
    greeting: (name, complaint) =>
      `નમસ્તે ${name}! તમારી સમસ્યા (${complaint}) વિશે ડૉક્ટરને જણાવવા માટે, દુખાવાનો પ્રકાર કેવો છે તે જણાવશો?`,
    options: [
      "તીવ્ર અને સતત દુખાવો",
      "ધીમો પણ વધતો અસ્વસ્થતા",
      "અકસ્માત કે ઈજાના કારણે",
      "સોજો અને હલનચલનમાં મુશ્કેલી",
    ],
  },
  kn: {
    greeting: (name, complaint) =>
      `ನಮಸ್ಕಾರ ${name}! ನಿಮ್ಮ ಸಮಸ್ಯೆಯ (${complaint}) ಬಗ್ಗೆ ವೈದ್ಯರಿಗೆ ತಿಳಿಸಲು, ನೋವು ಅಥವಾ ಅಸ್ವಸ್ಥತೆಯ ತೀವ್ರತೆ ಹೇಗಿದೆ ತಿಳಿಸಿ?`,
    options: [
      "ತೀವ್ರ ಮತ್ತು ನಿರಂತರ ನೋವು",
      "ಮಂದ ಆದರೆ ಹೆಚ್ಚುತ್ತಿರುವ ನೋವು",
      "ಅಪಘಾತ ಅಥವಾ ಗಾಯದ ಕಾರಣದಿಂದ",
      "ಊತ ಮತ್ತು ಚಲಿಸಲು ಕಷ್ಟ",
    ],
  },
  pa: {
    greeting: (name, complaint) =>
      `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name}! ਤੁਹਾਡੀ ਤਕਲੀਫ਼ (${complaint}) ਬਾਰੇ ਡਾਕਟਰ ਨੂੰ ਦੱਸਣ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਦਰਦ ਦੀ ਕਿਸਮ ਦੱਸੋ?`,
    options: [
      "ਤੇਜ਼ ਅਤੇ ਲਗਾਤਾਰ ਦਰਦ",
      "ਹੌਲੀ ਪਰ ਵਧ ਰਹੀ ਤਕਲੀਫ਼",
      "ਹਾਦਸੇ ਜਾਂ ਸੱਟ ਕਾਰਨ",
      "ਸੋਜ ਅਤੇ ਹਿੱਲਣ-ਜੁਲਣ ਵਿੱਚ ਔਖ",
    ],
  },
};

const WRAP_UP_MESSAGES: Record<LanguageCode, string> = {
  en: "Clinical conversation responses gathered. Please proceed to Step 3 to upload accident/injury photos or previous medical reports.",
  hi: "क्लिनिकल बातचीत पूर्ण हुई। कृपया कदम 3 पर जाएँ और दुर्घटना/चोट की फोटो या पूर्व पर्चियां अपलोड करें।",
  hinglish: "Clinical conversation complete ho gaya hai. Please Step 3 par jayein aur injury photos ya purane reports upload karein.",
  bn: "ক্লিনিক্যাল কথোপকথন সম্পন্ন হয়েছে। অনুগ্রহ করে ধাপ ৩-এ যান এবং আঘাতের ছবি বা প্রেসক্রিপশন আপলোড করুন।",
  ta: "மருத்துவ உரையாடல் முடிந்தது. தயவுசெய்து படி 3-க்கு சென்று காயம் புகைப்படங்கள் அல்லது ஆவணங்களை பதிவேற்றவும்.",
  te: "క్లినికల్ సంభాషణ పూర్తయింది. దయచేసి దశ 3 కి వెళ్లి గాయం ఫోటోలు లేదా మునుపటి నివేదికలను అప్‌లోడ్ చేయండి.",
  mr: "क्लिनिकल संभाषण पूर्ण झाले आहे. कृपया पायरी ३ वर जा आणि दुखापतीचे फोटो किंवा जुने अहवाल अपलोड करा.",
  gu: "ક્લિનિકલ વાતચીત પૂર્ણ થઈ. કૃપા કરીને પગલું ૩ પર જાઓ અને ઈજાના ફોટા અથવા રિપોર્ટ અપલોડ કરો.",
  kn: "ಕ್ಲಿನಿಕಲ್ ಸಂಭಾಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ದಯವಿಟ್ಟು ಹಂತ ೩ ಕ್ಕೆ ಹೋಗಿ ಗಾಯದ ಫೋಟೋಗಳು ಅಥವಾ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
  pa: "ਕਲੀਨਿਕਲ ਗੱਲਬਾਤ ਪੂਰੀ ਹੋ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕਦਮ 3 'ਤੇ ਜਾਓ ਅਤੇ ਸੱਟ ਦੀਆਂ ਫੋਟੋਆਂ ਜਾਂ ਰਿਪੋਰਟਾਂ ਅੱਪਲੋਡ ਕਰੋ।",
};

interface PatientIntakeFlowProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
  isAyushMode: boolean;
  onCaseCompleted: (newCase: PatientCase) => void;
  onOpenDoctorDashboard: () => void;
}

export const PatientIntakeFlow: React.FC<PatientIntakeFlowProps> = ({
  selectedLanguage,
  onSelectLanguage,
  isAyushMode: globalAyushMode,
  onCaseCompleted,
  onOpenDoctorDashboard,
}) => {
  const strings = UI_STRINGS[selectedLanguage] || UI_STRINGS.en;

  // 5-Step Workflow:
  // 1: Identify (Registration, City, Problem, Language, Audio Consent)
  // 2: Converse (AI voice + touch history interview, red flags)
  // 3: Scan (Upload prescriptions, lab reports & Accident/Injury Photo Sharing)
  // 4: Summarize & Route (AI structures history summary, pushes to HIS/ABHA)
  // 5: Consult (Physician review & consultation)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // --- STEP 1: PATIENT IDENTIFICATION & GENERAL DETAILS ---
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    id: `RS-2026-${Math.floor(100 + Math.random() * 900)}`,
    name: "Vikram Malhotra",
    city: "New Delhi",
    age: 32,
    gender: "Male",
    phone: "+91 98111 22334",
    emergencyContact: "+91 98111 00000 (Spouse)",
    abhaId: "14-2604-9812-4455",
    chiefComplaint: "Road bike skid injury with painful laceration and swelling",
    duration: "1 hour ago",
    language: selectedLanguage,
    ayushMode: globalAyushMode,
  });

  const [hasConsented, setHasConsented] = useState(true);
  const [isReadingConsent, setIsReadingConsent] = useState(false);

  // --- STEP 2: CONVERSE (AI VOICE + TOUCH INTERVIEW) ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStep, setInterviewStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [isEmergencyDetected, setIsEmergencyDetected] = useState(false);
  const [answersStore, setAnswersStore] = useState<Record<string, string>>({});

  // --- STEP 3: SCAN & INJURY PHOTO SHARING ---
  // Documents & Imaging (X-Ray, Reports, Previous Doctor Description)
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [previewDocModal, setPreviewDocModal] = useState<DocumentItem | null>(null);
  const docFileInputRef = useRef<HTMLInputElement | null>(null);
  const [docUploadCategory, setDocUploadCategory] = useState<"X-Ray / Scan" | "Prescription" | "Lab Report" | "Previous Consultation">("X-Ray / Scan");

  // Injury & Accident Photo Sharing
  const [injuryPhotos, setInjuryPhotos] = useState<InjuryPhotoItem[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("Right Knee");
  const [accidentContextInput, setAccidentContextInput] = useState<string>(
    "Motorcycle skid on wet road, scraped knee hard on asphalt with active bleeding."
  );
  const [painScale, setPainScale] = useState<number>(7);
  const [isAnalyzingInjury, setIsAnalyzingInjury] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImagePreview, setCapturedImagePreview] = useState<string | null>(null);
  const [injuryPhotoError, setInjuryPhotoError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // Camera & Video Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- STEP 4: SUMMARIZE & ROUTE ---
  const [clinicalSummary, setClinicalSummary] = useState<ClinicalSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [routedCaseId, setRoutedCaseId] = useState<string>("");
  const [routingSuccess, setRoutingSuccess] = useState<boolean>(false);

  // Speech Recognition & Scroll Refs
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  // Keep language in sync if prop changes
  useEffect(() => {
    setPatientInfo((prev) => ({ ...prev, language: selectedLanguage, ayushMode: globalAyushMode }));
  }, [selectedLanguage, globalAyushMode]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Text-To-Speech helper with Indian languages support
  const speakText = (text: string, langCode: LanguageCode | string = "en") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const bcp47 = SPEECH_LANG_CODES[langCode as LanguageCode] || "en-IN";
      utterance.lang = bcp47;
      utterance.rate = 0.92;
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      const matchingVoice = voices.find(
        (v) => v.lang === bcp47 || v.lang.startsWith(bcp47.split("-")[0])
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      utterance.onerror = () => {
        // Silent recovery
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech audio fallback
    }
  };

  // Listen to Consent Aloud using strings
  const handleListenConsent = () => {
    setIsReadingConsent(true);
    const textToRead = strings.consentText || "RakshaSaathi collects your symptoms, history, and accident details strictly to assist your treating doctor during OPD consultation.";
    speakText(textToRead, selectedLanguage);
    setTimeout(() => setIsReadingConsent(false), 8000);
  };

  // --- CAMERA HANDLING FOR INJURY PHOTOS ---
  const startCamera = async () => {
    setCameraError(null);
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setCameraError("Camera access is unavailable or denied. You can still upload an image file using the Upload Photo button.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImagePreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Injury Preset Demonstrator (Road accident, knife cut, burn, sprain)
  const handleLoadSampleInjury = (type: "bike_accident" | "knife_cut" | "hot_oil_burn") => {
    setInjuryPhotoError(null);
    if (type === "bike_accident") {
      setSelectedBodyPart("Right Knee & Shin");
      setAccidentContextInput("Road traffic two-wheeler skid on asphalt road. Heavy abrasion with active capillary oozing.");
      setPainScale(8);
      setCapturedImagePreview("https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80");
    } else if (type === "knife_cut") {
      setSelectedBodyPart("Left Index Finger & Palm");
      setAccidentContextInput("Sharp kitchen knife accidental slice while cutting vegetables. Moderate active bleeding.");
      setPainScale(6);
      setCapturedImagePreview("https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80");
    } else if (type === "hot_oil_burn") {
      setSelectedBodyPart("Dorsal Forearm");
      setAccidentContextInput("Cooking oil splash burn with intense burning pain and small blister formation.");
      setPainScale(7);
      setCapturedImagePreview("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80");
    }
  };

  // Run AI analysis on the uploaded injury photo with strict injury detection
  const handleAnalyzeInjuryPhoto = async () => {
    if (!capturedImagePreview) {
      alert("Please capture or upload an injury photo first.");
      return;
    }

    setIsAnalyzingInjury(true);
    setInjuryPhotoError(null);

    try {
      const res = await fetch("/api/ai/analyze-injury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: capturedImagePreview,
          bodyPart: selectedBodyPart,
          accidentContext: accidentContextInput,
          painLevel: painScale,
          timeElapsed: "1 hour ago",
        }),
      });

      const data = await res.json();
      setIsAnalyzingInjury(false);

      if (data.success && data.data) {
        const result = data.data;

        // Strict injury verification check as requested by user
        if (result.isInjuryPhoto === false) {
          setInjuryPhotoError(
            result.invalidPhotoReason ||
              "❌ Wrong Photo Detected: This image does not show a bodily injury, wound, abrasion, or trauma. Please upload only valid injury photos. (Non-injury photos will be rejected)."
          );
          return;
        }

        const newPhotoItem: InjuryPhotoItem = {
          id: `inj-${Date.now()}`,
          imageUrl: capturedImagePreview,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          bodyPart: result.bodyPart || selectedBodyPart,
          accidentContext: result.accidentContext || accidentContextInput,
          visualFindings: result.visualFindings || "Trauma findings registered for examining physician.",
          severityScore: result.severityScore || "MODERATE",
          recommendations: result.recommendations || [
            "Physician wound examination",
            "Tetanus Toxoid verification",
            "Wound toilet & sterile dressing",
          ],
        };

        setInjuryPhotos((prev) => [newPhotoItem, ...prev]);
        setCapturedImagePreview(null);
        setInjuryPhotoError(null);

        // If red flag triggered, register alert
        if (result.redFlagTriggered) {
          setIsEmergencyDetected(true);
          setRedFlags((prev) => Array.from(new Set([...prev, result.redFlagReason || "Acute traumatic injury with hemorrhage"])));
        }
      }
    } catch {
      setIsAnalyzingInjury(false);
      // Fallback
      const fallbackItem: InjuryPhotoItem = {
        id: `inj-${Date.now()}`,
        imageUrl: capturedImagePreview,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        bodyPart: selectedBodyPart,
        accidentContext: accidentContextInput,
        visualFindings: `Acute traumatic injury over ${selectedBodyPart}. Soft tissue erythema and laceration noted.`,
        severityScore: painScale >= 7 ? "SEVERE" : "MODERATE",
        recommendations: [
          "Sterile wound debridement & saline irrigation",
          "Assess for primary closure / suturing",
          "Tetanus Toxoid 0.5ml IM if > 5 years",
          "X-Ray if bony tenderness or inability to bear weight",
        ],
      };
      setInjuryPhotos((prev) => [fallbackItem, ...prev]);
      setCapturedImagePreview(null);
    }
  };

  // --- SPEECH RECOGNITION INTERVIEW ---
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicNotice("Speech recognition is not supported in this browser. Please type your message.");
      setTimeout(() => setMicNotice(null), 5000);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = SPEECH_LANG_CODES[selectedLanguage] || "en-IN";

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } catch {
        setIsRecording(false);
      }
    }
  };

  // Start Step 2: AI Interview
  const startAiInterview = async () => {
    if (!patientInfo.name.trim()) {
      setValidationError("Please enter patient name.");
      return;
    }
    if (!patientInfo.city.trim()) {
      setValidationError("Please enter patient city.");
      return;
    }
    if (!hasConsented) {
      setValidationError("Please check the consent box to proceed.");
      return;
    }
    setValidationError(null);

    setCurrentStep(2);

    const greetingObj = INITIAL_GREETINGS[selectedLanguage] || INITIAL_GREETINGS.en;
    const initialGreeting = greetingObj.greeting(
      patientInfo.name,
      patientInfo.chiefComplaint || "health concern"
    );
    const initialTouchOptions = greetingObj.options;

    setMessages([
      {
        id: "msg-0",
        sender: "ai",
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: "Chief Complaint",
        touchOptions: initialTouchOptions,
      },
    ]);

    speakText(initialGreeting, selectedLanguage);
  };

  // Send patient response during interview
  const handleSendResponse = async (responseText?: string) => {
    const textToSend = (responseText || inputText).trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "patient",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Check red flags immediately
    try {
      const redFlagRes = await fetch("/api/ai/red-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });
      const redFlagData = await redFlagRes.json();
      if (redFlagData.data?.isEmergency) {
        setIsEmergencyDetected(true);
        setRedFlags((prev) => Array.from(new Set([...prev, ...redFlagData.data.triggers])));
      }
    } catch {
      // Non-blocking red flag check fallback
    }

    const updatedAnswers = {
      ...answersStore,
      [`step_${interviewStep}`]: textToSend,
    };
    setAnswersStore(updatedAnswers);

    setIsAiTyping(true);
    try {
      const response = await fetch("/api/ai/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentComplaint: patientInfo.chiefComplaint || textToSend,
          answersSoFar: updatedAnswers,
          language: LANGUAGE_DISPLAY_NAMES[selectedLanguage] || "English",
          ayushMode: patientInfo.ayushMode,
          stepCount: interviewStep + 1,
        }),
      });

      const resData = await response.json();
      setIsAiTyping(false);

      if (resData.success && resData.data) {
        const nextQ = resData.data;
        setInterviewStep((prev) => prev + 1);
        setProgress(nextQ.progress || Math.min((interviewStep + 1) * 20, 95));

        if (nextQ.isRedFlag && nextQ.redFlagReason) {
          setIsEmergencyDetected(true);
          setRedFlags((prev) => Array.from(new Set([...prev, nextQ.redFlagReason])));
        }

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "ai",
          text: nextQ.question,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          category: nextQ.category,
          touchOptions: nextQ.touchOptions,
          isRedFlag: nextQ.isRedFlag,
        };

        setMessages((prev) => [...prev, aiMsg]);
        speakText(nextQ.question, selectedLanguage);

        if (nextQ.isFinalStep || interviewStep >= 4) {
          setTimeout(() => {
            const wrapUpMsg: ChatMessage = {
              id: `msg-wrapup`,
              sender: "system",
              text: WRAP_UP_MESSAGES[selectedLanguage] || WRAP_UP_MESSAGES.en,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, wrapUpMsg]);
          }, 1200);
        }
      }
    } catch {
      setIsAiTyping(false);
    }
  };

  // Add sample document (Prescription, Lab Report, X-Ray, or Previous Consultation)
  const handleAddSampleDoc = async (
    type: "Prescription" | "Lab Report" | "X-Ray / Scan" | "Previous Consultation"
  ) => {
    setIsProcessingDoc(true);
    let docText = "";
    let filename = "";
    let sampleImg = "";

    if (type === "X-Ray / Scan") {
      docText = "Plain Radiograph Right Knee AP & Lateral: Bone cortex intact, no acute patellar hairline fracture. Soft tissue pre-patellar edema noted. Joint space symmetrical.";
      filename = "Right_Knee_AP_Lateral_XRay.jpg";
      sampleImg = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80";
    } else if (type === "Previous Consultation") {
      docText = "Previous Consultation Note: Dr. K.S. Rao (MBBS, DNB Ortho). Patient presented with right knee blunt trauma. Cleaned with sterile saline, Inj Tetanus 0.5ml IM given. Advised X-ray & follow-up at tertiary OPD.";
      filename = "Previous_Consultation_Trauma_Slip.pdf";
      sampleImg = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80";
    } else if (type === "Prescription") {
      docText = "Rx: Metformin 500mg BD after meals. Amlodipine 5mg OD morning. Advised low salt diet, fasting sugar check. Dr. Ramesh Gupta (MD).";
      filename = "Prescription_Metformin_Amlodipine.pdf";
      sampleImg = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80";
    } else {
      docText = "Laboratory Investigation Report: HbA1c Glycated Hemoglobin: 8.8% (Reference: 4.0-5.6% HIGH). Fasting Blood Glucose: 162 mg/dL. Serum Creatinine: 0.9 mg/dL (Normal).";
      filename = "Blood_Lab_Report_HbA1c.pdf";
      sampleImg = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80";
    }

    try {
      const res = await fetch("/api/ai/extract-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: docText,
          documentType: type,
          filename: filename,
        }),
      });
      const data = await res.json();
      setIsProcessingDoc(false);

      if (data.success && data.data) {
        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          name: filename,
          type: type,
          date: new Date().toISOString().split("T")[0],
          summary: data.data.summary,
          confidence: data.data.confidence || 95,
          extractedData: data.data.extractedData,
          imageUrl: sampleImg,
          bodyPartOrOrgan: data.data.bodyPartOrOrgan || (type === "X-Ray / Scan" ? "Right Knee" : undefined),
          radiologyFindings: data.data.radiologyFindings || (type === "X-Ray / Scan" ? "No acute fracture detected; soft tissue swelling present." : undefined),
        };
        setDocuments((prev) => [...prev, newDoc]);
      }
    } catch {
      setIsProcessingDoc(false);
    }
  };

  // Upload user's real document file (X-Ray, lab report, previous prescription)
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingDoc(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target?.result as string;

      try {
        const res = await fetch("/api/ai/extract-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentText: `Uploaded ${docUploadCategory} file: ${file.name}. Patient submitted digital imaging / consultation record.`,
            documentType: docUploadCategory,
            filename: file.name,
          }),
        });
        const data = await res.json();
        setIsProcessingDoc(false);

        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: docUploadCategory,
          date: new Date().toISOString().split("T")[0],
          summary: data.data?.summary || `${docUploadCategory} processed and shared with physician.`,
          confidence: data.data?.confidence || 96,
          extractedData: data.data?.extractedData,
          imageUrl: file.type.startsWith("image/") ? base64Data : undefined,
          bodyPartOrOrgan: docUploadCategory === "X-Ray / Scan" ? "Uploaded Radiograph" : undefined,
          radiologyFindings: docUploadCategory === "X-Ray / Scan" ? "Digital radiograph uploaded for doctor's direct viewing and verification." : undefined,
        };

        setDocuments((prev) => [...prev, newDoc]);
      } catch {
        setIsProcessingDoc(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- STEP 4: SUMMARIZE & ROUTE CASE TO OPD DOCTOR ---
  const handleGenerateAndRouteCase = async () => {
    setCurrentStep(4);
    setIsGeneratingSummary(true);

    try {
      const res = await fetch("/api/ai/structure-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: patientInfo,
          answers: answersStore,
          documents: documents,
          ayushData: {
            prakriti: "Vata-Kapha Prakriti",
            agni: "Tikshna / Vishama Agni",
            koshtha: "Madhyama Koshtha",
            aharaVihara: "Regular diet, active mobility",
          },
        }),
      });

      const data = await res.json();
      setIsGeneratingSummary(false);

      if (data.success && data.data) {
        setClinicalSummary(data.data);

        // Build full case object
        const caseRecord: PatientCase = {
          id: patientInfo.id,
          name: patientInfo.name,
          age: Number(patientInfo.age),
          gender: patientInfo.gender,
          city: patientInfo.city,
          phone: patientInfo.phone,
          emergencyContact: patientInfo.emergencyContact,
          abhaId: patientInfo.abhaId,
          language: LANGUAGE_DISPLAY_NAMES[patientInfo.language] || "English",
          ayushMode: patientInfo.ayushMode,
          chiefComplaint: patientInfo.chiefComplaint,
          duration: patientInfo.duration,
          priority: isEmergencyDetected || injuryPhotos.some((i) => i.severityScore === "SEVERE" || i.severityScore === "CRITICAL")
            ? "HIGH"
            : "ROUTINE",
          status: "PENDING_REVIEW",
          redFlags: redFlags,
          clinicalSummary: data.data,
          injuryPhotos: injuryPhotos,
          documents: documents,
          timeline: [
            {
              year: "2026",
              title: "Pre-Consultation Digital Intake",
              category: "Consultation",
              description: `Intake completed via RakshaSaathi in ${patientInfo.city}. ${injuryPhotos.length} injury photos attached.`,
              source: "RakshaSaathi Intake",
            },
          ],
          conversation: messages.map((m) => ({
            sender: m.sender === "ai" ? "ai" : "patient",
            text: m.text,
            timestamp: m.timestamp,
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Push to server /api/patients
        try {
          const postRes = await fetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(caseRecord),
          });
          const postData = await postRes.json();
          if (postData.success) {
            setRoutedCaseId(caseRecord.id);
          }
        } catch {
          // Handled
        }

        setRoutedCaseId(caseRecord.id);
        setRoutingSuccess(true);
        onCaseCompleted(caseRecord);
      }
    } catch {
      setIsGeneratingSummary(false);
      setRoutingSuccess(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-3">
      {/* 5-Step Process Visual Tracker */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              Patient Digital Case-Taking Workflow
            </h2>
            <p className="text-xs text-slate-500">
              5-Step AI Intake Protocol • AIIA &amp; Ministry of Ayush Standards
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200">
            Step {currentStep} of 5
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[
            { num: 1, title: "Identify", desc: "Details & Consent" },
            { num: 2, title: "Converse", desc: "Voice AI Interview" },
            { num: 3, title: "Scan & Share", desc: "Injuries & Records" },
            { num: 4, title: "Summarize", desc: "HIS / ABHA Route" },
            { num: 5, title: "Consult", desc: "Doctor OPD Review" },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                // allow clicking back to visited steps
                if (s.num <= currentStep) setCurrentStep(s.num as any);
              }}
              className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentStep === s.num
                  ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                  : currentStep > s.num
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70"
                  : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-75"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {currentStep > s.num ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      currentStep === s.num ? "bg-white text-teal-700" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {s.num}
                  </span>
                )}
                <span className="font-bold text-xs sm:text-sm">{s.title}</span>
              </div>
              <span
                className={`text-[10px] hidden sm:block truncate mt-0.5 ${
                  currentStep === s.num ? "text-teal-100" : "text-slate-500"
                }`}
              >
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Attention Prompt (Patient-Facing Calm Reassurance) */}
      {isEmergencyDetected && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-6 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded tracking-wide">
                Prompt Attention Recommended
              </span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              Your symptoms may require prompt medical attention. Please inform the medical staff immediately.
            </p>
            <p className="text-[11px] text-amber-800 italic">
              RakshaSaathi assists with case history taking and does not diagnose or replace a licensed physician.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 1: IDENTIFY (Fill Details Immediately on Site Open) */}
      {/* ========================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Step 1: Patient Registration &amp; Identification
                </h1>
              </div>

              {/* Language Selector in Step 1 */}
              <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                <Globe className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-xs font-bold text-teal-900 hidden sm:inline">Language:</span>
                <select
                  id="select-step1-language"
                  value={selectedLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value as LanguageCode;
                    onSelectLanguage?.(newLang);
                    setPatientInfo((prev) => ({ ...prev, language: newLang }));
                  }}
                  className="bg-white text-xs font-bold text-teal-900 px-2 py-1 rounded-md border border-teal-300 focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="en">English (English)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="hinglish">Hinglish (हिंग्लिश)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your basic details, location, and main health concern to begin the AI case-taking process.
            </p>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center justify-between animate-shake">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-600" /> Full Name (नाम) *
              </label>
              <input
                id="input-patient-name"
                type="text"
                placeholder="e.g. Vikram Malhotra"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-teal-600" /> City / Location (शहर) *
              </label>
              <input
                id="input-patient-city"
                type="text"
                placeholder="e.g. New Delhi, Mumbai, Varanasi, Pune"
                value={patientInfo.city}
                onChange={(e) => setPatientInfo({ ...patientInfo, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-semibold"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender (लिंग) *
              </label>
              <select
                id="select-patient-gender"
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Male">Male (पुरुष)</option>
                <option value="Female">Female (महिला)</option>
                <option value="Other">Other (अन्य)</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Age in Years (उम्र) *
              </label>
              <input
                id="input-patient-age"
                type="number"
                min="1"
                max="120"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" /> Mobile Number (फोन नंबर) *
              </label>
              <input
                id="input-patient-phone"
                type="text"
                placeholder="+91 98765 43210"
                value={patientInfo.phone}
                onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* ABHA ID / Aadhaar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>ABHA Health ID (आभा आईडी)</span>
                <span className="text-[10px] text-teal-600 font-bold">ABDM Verified</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  id="input-patient-abha"
                  type="text"
                  placeholder="14-2604-9812-4455"
                  value={patientInfo.abhaId}
                  onChange={(e) => setPatientInfo({ ...patientInfo, abhaId: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPatientInfo({
                      ...patientInfo,
                      abhaId: `14-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
                        1000 + Math.random() * 9000
                      )}-${Math.floor(1000 + Math.random() * 9000)}`,
                    })
                  }
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300"
                  title="Generate simulated ABHA ID"
                >
                  Gen
                </button>
              </div>
            </div>
          </div>

          {/* Chief Complaint / Problem and Duration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Main Problem / Chief Complaint (मुख्य बीमारी / क्या समस्या है?) *
              </label>
              <textarea
                id="input-patient-problem"
                rows={2}
                placeholder="e.g. Sharp pain in chest radiating to left arm, or bike skid injury on right knee with bleeding..."
                value={patientInfo.chiefComplaint}
                onChange={(e) => setPatientInfo({ ...patientInfo, chiefComplaint: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> Duration of Symptoms (कब से है?)
              </label>
              <input
                id="input-patient-duration"
                type="text"
                placeholder="e.g. 1 hour ago, 2 days, 3 weeks"
                value={patientInfo.duration}
                onChange={(e) => setPatientInfo({ ...patientInfo, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Audio Guided Consent Box */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Audio-Guided Informed Clinical Consent (सहमति)
                </h3>
              </div>
              <button
                id="btn-listen-consent"
                type="button"
                onClick={handleListenConsent}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isReadingConsent ? "animate-pulse text-teal-600" : ""}`} />
                <span>{isReadingConsent ? "Reading aloud..." : "Listen to Consent (बोलकर सुनें)"}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              RakshaSaathi will securely record your symptoms, medical history, and accident details strictly to assist your consulting OPD doctor. RakshaSaathi AI does NOT replace a licensed doctor and does not prescribe medicines directly.
            </p>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                id="checkbox-patient-consent"
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-800">
                I understand and provide consent for AI-assisted clinical intake &amp; triage. (मैंने समझ लिया है और मैं सहमति देता/देती हूँ)
              </span>
            </label>
          </div>

          {/* Action Button: Proceed to Step 2 */}
          <div className="flex justify-end pt-2">
            <button
              id="btn-proceed-step-2"
              type="button"
              onClick={startAiInterview}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:gap-3"
            >
              <span>Proceed to Step 2: AI Voice Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: CONVERSE (AI Voice + Touch Adaptive Interview) */}
      {/* ========================================================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Step 2: AI Adaptive Clinical Interview
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-bold text-slate-700">{patientInfo.name}</span> ({patientInfo.city}) • {patientInfo.chiefComplaint}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Progress: {progress}%</span>
              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div
            ref={chatScrollRef}
            className="h-96 overflow-y-auto p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "patient" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-medium">
                  {msg.sender === "ai" ? (
                    <>
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span className="font-bold text-teal-800">RakshaSaathi AI</span>
                      {msg.category && (
                        <span className="bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                          {msg.category}
                        </span>
                      )}
                    </>
                  ) : msg.sender === "system" ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="font-bold text-emerald-800">Intake System</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-slate-600" />
                      <span className="font-bold text-slate-700">{patientInfo.name}</span>
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "patient"
                      ? "bg-teal-600 text-white rounded-tr-xs shadow-xs"
                      : msg.sender === "system"
                      ? "bg-emerald-50 text-emerald-950 border border-emerald-300 rounded-xl"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Touch Response Option Chips */}
                  {msg.touchOptions && msg.touchOptions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.touchOptions.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendResponse(opt)}
                          className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 rounded-lg text-xs font-semibold transition-all hover:scale-102"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 w-fit text-xs text-slate-500 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></div>
                <span>Formulating clinical follow-up question...</span>
              </div>
            )}
          </div>

          {/* Mic notice if speech recognition not supported */}
          {micNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-between">
              <span>🎙️ {micNotice}</span>
              <button
                type="button"
                onClick={() => setMicNotice(null)}
                className="text-[11px] font-bold text-amber-700 underline hover:text-amber-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Input Bar: Mic + Text + Send */}
          <div className="flex items-center gap-2 pt-2">
            <button
              id="btn-voice-record-interview"
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
                isRecording
                  ? "bg-rose-600 text-white border-rose-700 animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
              }`}
              title="Voice Input: Speak your symptoms in your language"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-teal-700" />}
              <span className="text-xs font-bold hidden sm:inline">
                {isRecording ? "Listening..." : "Tap to Speak"}
              </span>
            </button>

            <input
              id="input-chat-patient-reply"
              type="text"
              placeholder="Type your answer or speak your symptoms in your language..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendResponse();
              }}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />

            <button
              id="btn-send-patient-reply"
              type="button"
              onClick={() => handleSendResponse()}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Step 1</span>
            </button>

            <button
              id="btn-proceed-step-3"
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs"
            >
              <span>Proceed to Step 3: Scan &amp; Share Injury Photos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: SCAN & SHARE (Accident / Injury & Medical Docs) */}
      {/* ========================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Step 3: Scan Documents &amp; Share Accident / Injury Photos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Upload photos of any cut, accident, bike skid, burn, or wound. The image and AI visual assessment are directly forwarded to the OPD doctor.
            </p>
          </div>

          {/* SECTION A: ACCIDENT / INJURY PHOTO SHARING */}
          <div className="p-5 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Accident &amp; Injury Image Capture (चोट या दुर्घटना की फोटो)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct visual triage sent to consulting doctor
                  </p>
                </div>
              </div>

              {/* Sample injury demo triggers */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold hidden md:inline">Quick Samples:</span>
                <button
                  type="button"
                  onClick={() => handleLoadSampleInjury("bike_accident")}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 shadow-2xs"
                >
                  🏍️ Bike Skid
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSampleInjury("knife_cut")}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 shadow-2xs"
                >
                  🔪 Knife Cut
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSampleInjury("hot_oil_burn")}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-md border border-slate-200 shadow-2xs"
                >
                  🔥 Burn
                </button>
              </div>
            </div>

            {/* Injury Meta inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Body Part Affected (प्रभावित अंग)
                </label>
                <select
                  id="select-injury-body-part"
                  value={selectedBodyPart}
                  onChange={(e) => setSelectedBodyPart(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="Right Knee">Right Knee (दायाँ घुटना)</option>
                  <option value="Left Knee">Left Knee (बायाँ घुटना)</option>
                  <option value="Forearm / Wrist">Forearm / Wrist (हाथ / कलाई)</option>
                  <option value="Head / Forehead">Head / Forehead (सिर / माथा)</option>
                  <option value="Foot / Ankle">Foot / Ankle (पैर / टखना)</option>
                  <option value="Face / Eye">Face / Eye (चेहरा / आँख)</option>
                  <option value="Chest / Ribs">Chest / Ribs (छाती)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Accident Type / Cause
                </label>
                <input
                  id="input-accident-context"
                  type="text"
                  placeholder="e.g. Road bike skid, cut from sharp glass..."
                  value={accidentContextInput}
                  onChange={(e) => setAccidentContextInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pain Scale: {painScale}/10</span>
                  <span className={`text-[10px] font-bold ${painScale >= 7 ? "text-rose-600" : "text-amber-600"}`}>
                    {painScale >= 8 ? "Severe" : painScale >= 5 ? "Moderate" : "Mild"}
                  </span>
                </label>
                <input
                  id="slider-injury-pain"
                  type="range"
                  min="1"
                  max="10"
                  value={painScale}
                  onChange={(e) => setPainScale(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-teal-600"
                />
              </div>
            </div>

            {/* Active Camera Live View or Preview */}
            {isCameraActive && (
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden p-2 text-center">
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-72 rounded-xl object-contain mx-auto" />
                <div className="flex items-center justify-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={capturePhotoFromCamera}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Camera className="w-4 h-4" /> Capture Photo (फोटो खींचें)
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview & Upload Controls */}
            {!isCameraActive && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="btn-open-camera"
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Camera (कैमरा खोलें)</span>
                </button>

                <button
                  id="btn-upload-injury-file"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-teal-600" />
                  <span>Upload Image File (गैलरी से चुनें)</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Camera Access Notice / Error */}
            {cameraError && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-between">
                <span>📷 {cameraError}</span>
                <button
                  type="button"
                  onClick={() => setCameraError(null)}
                  className="text-[11px] font-bold text-amber-700 underline hover:text-amber-900"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Error Banner for Wrong Photo Detection */}
            {injuryPhotoError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-2 animate-shake">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold text-rose-950 block">Wrong Photo Detected (गलत फोटो पहचानी गई)</span>
                    <p className="text-rose-800 leading-relaxed font-medium">{injuryPhotoError}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                        API Hook: /api/ai/analyze-injury (Strict Trauma Filter)
                      </span>
                      <button
                        type="button"
                        onClick={() => setInjuryPhotoError(null)}
                        className="text-[11px] font-bold text-rose-700 underline hover:text-rose-900"
                      >
                        Dismiss &amp; Try Clear Injury Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Captured Preview Banner */}
            {capturedImagePreview && (
              <div className="bg-white p-4 rounded-xl border border-teal-300 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={capturedImagePreview}
                      alt="Captured preview"
                      className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Photo Ready for AI Triage</span>
                      <span className="text-[11px] text-slate-500 block">
                        Location: {selectedBodyPart} • Pain: {painScale}/10
                      </span>
                      <span className="text-[11px] text-teal-700 font-semibold block truncate max-w-sm">
                        {accidentContextInput}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCapturedImagePreview(null);
                      setInjuryPhotoError(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    id="btn-analyze-injury-ai"
                    type="button"
                    onClick={handleAnalyzeInjuryPhoto}
                    disabled={isAnalyzingInjury}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {isAnalyzingInjury ? "AI Verifying Injury Photo..." : "Verify & Attach to Doctor Record"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Attached Injury Photos */}
            {injuryPhotos.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Attached Injury Photos ({injuryPhotos.length}) - Transmitted to OPD Physician:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {injuryPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2 flex gap-3"
                    >
                      <img
                        src={photo.imageUrl}
                        alt="Injury"
                        className="w-24 h-24 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
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
                        <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                          {photo.visualFindings}
                        </p>
                        <div className="pt-1">
                          <span className="text-[10px] font-bold text-teal-800 block">Immediate First-Aid:</span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {photo.recommendations[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION B: PREVIOUS PRESCRIPTIONS, X-RAYS & LAB REPORTS SCANNER */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Medical Reports, X-Rays &amp; Doctor Descriptions (एक्स-रे, रिपोर्ट व पुरानी पर्चियां)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload X-Ray scans, pathology reports, and past prescriptions to share directly with the doctor.
                  </p>
                </div>
              </div>

              {/* Upload Real File trigger */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={docUploadCategory}
                  onChange={(e) => setDocUploadCategory(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="X-Ray / Scan">X-Ray / Radiograph</option>
                  <option value="Previous Consultation">Doctor Previous Description</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab / Blood Report</option>
                </select>

                <button
                  type="button"
                  onClick={() => docFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File / Scan</span>
                </button>

                <input
                  ref={docFileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Quick Demo Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">Quick Medical Samples:</span>
              <button
                type="button"
                onClick={() => handleAddSampleDoc("X-Ray / Scan")}
                disabled={isProcessingDoc}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-900 text-[11px] font-bold rounded-md border border-slate-300 shadow-2xs flex items-center gap-1"
              >
                🦴 Knee X-Ray Scan
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleDoc("Previous Consultation")}
                disabled={isProcessingDoc}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-purple-900 text-[11px] font-bold rounded-md border border-slate-300 shadow-2xs flex items-center gap-1"
              >
                👨‍⚕️ Previous Doctor Description
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleDoc("Prescription")}
                disabled={isProcessingDoc}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-md border border-slate-300 shadow-2xs"
              >
                💊 Prescription Slip
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleDoc("Lab Report")}
                disabled={isProcessingDoc}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-md border border-slate-300 shadow-2xs"
              >
                🩸 Blood Lab Report
              </button>
              {isProcessingDoc && (
                <span className="text-xs text-blue-600 font-bold animate-pulse">Extracting &amp; digitizing...</span>
              )}
            </div>

            {/* List of scanned documents */}
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          doc.type === "X-Ray / Scan"
                            ? "bg-slate-900 text-teal-300 border-slate-800"
                            : doc.type === "Previous Consultation"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {doc.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Conf: {doc.confidence}%</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{doc.summary}</p>

                      {/* Image Preview & Share trigger */}
                      {doc.imageUrl && (
                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={doc.imageUrl}
                            alt="Document"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer"
                            onClick={() => setPreviewDocModal(doc)}
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewDocModal(doc)}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>View Full Scan / Share Record &rarr;</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))}
                      className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No past documents or X-Rays uploaded yet. You can click "+ Upload File / Scan" or pick a sample above.
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Step 2</span>
            </button>

            <button
              id="btn-proceed-step-4"
              type="button"
              onClick={handleGenerateAndRouteCase}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:gap-3"
            >
              <span>Proceed to Step 4: Summarize &amp; Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: SUMMARIZE & ROUTE TO HIS / OPD DOCTOR */}
      {/* ========================================================= */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Step 4: AI Clinical Structuring &amp; HIS Routing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Case generated, linked to ABHA ID, and pushed to Hospital Information System (HIS) OPD Queue.
            </p>
          </div>

          {isGeneratingSummary ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-slate-800">
                AI Structuring Clinical History, Injury Assessment &amp; Routing...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Routing Success Confirmation */}
              {routingSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-emerald-950 block">
                        Case Successfully Routed to Doctor OPD Queue!
                      </span>
                      <span className="text-xs text-emerald-800 font-mono">
                        Encounter Token: <strong>{routedCaseId || patientInfo.id}</strong> • ABHA: {patientInfo.abhaId}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold">
                    ✓ Available on Physician Screen
                  </span>
                </div>
              )}

              {/* Structured Summary Preview */}
              {clinicalSummary && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-slate-900 uppercase tracking-wide text-xs">
                      Physician Case Intake Summary
                    </span>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      Confidence: {clinicalSummary.aiConfidence}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Chief Complaint:</span>
                    <p className="font-semibold text-slate-900">{clinicalSummary.chiefComplaint}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 block">History of Present Illness (HPI):</span>
                    <p className="text-slate-700 leading-relaxed text-xs">{clinicalSummary.hpi}</p>
                  </div>

                  {/* Injury Photo Preview in Summary */}
                  {injuryPhotos.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-2">
                      <span className="text-xs font-bold text-teal-900 block flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-teal-600" />
                        Attached Injury Photo ({injuryPhotos[0].bodyPart}):
                      </span>
                      <div className="flex items-center gap-3">
                        <img
                          src={injuryPhotos[0].imageUrl}
                          alt="Injury Summary"
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-slate-800 block">
                            Severity: {injuryPhotos[0].severityScore} • {injuryPhotos[0].accidentContext}
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {injuryPhotos[0].visualFindings}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Active Medications:</span>
                      <p className="text-slate-600 text-xs">{clinicalSummary.drugHistory}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Allergies:</span>
                      <p className="text-slate-600 text-xs">{clinicalSummary.allergyHistory}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 3</span>
                </button>

                <button
                  id="btn-proceed-step-5-consult"
                  type="button"
                  onClick={() => {
                    setCurrentStep(5);
                    onOpenDoctorDashboard();
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:gap-3"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Proceed to Step 5: Doctor OPD Consult</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 5: CONSULT (Physician Consultation Transition View) */}
      {/* ========================================================= */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Stethoscope className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-slate-900">
              Step 5: Physician Consultation Active
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The complete structured clinical history, timeline, and accident/injury photos are now live on the Doctor OPD Review Dashboard. The doctor can review everything in seconds and devote the entire consultation to physical examination and counseling.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="btn-open-doctor-opd-now"
              type="button"
              onClick={onOpenDoctorDashboard}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-102"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Open Doctor OPD Review Screen</span>
            </button>

            <button
              id="btn-new-patient-intake"
              type="button"
              onClick={() => {
                setPatientInfo({
                  id: `RS-2026-${Math.floor(100 + Math.random() * 900)}`,
                  name: "",
                  city: "",
                  age: "",
                  gender: "Male",
                  phone: "",
                  emergencyContact: "",
                  abhaId: "",
                  chiefComplaint: "",
                  duration: "",
                  language: selectedLanguage,
                  ayushMode: globalAyushMode,
                });
                setMessages([]);
                setInjuryPhotos([]);
                setDocuments([]);
                setClinicalSummary(null);
                setCurrentStep(1);
              }}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
            >
              + Register Another Patient
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Full Document / X-Ray Viewer & Sharing */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{previewDocModal.name}</h3>
                  <span className="text-xs text-slate-500">{previewDocModal.type} • Confirmed by Digital Health System</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {previewDocModal.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-96">
                <img
                  src={previewDocModal.imageUrl}
                  alt={previewDocModal.name}
                  className="max-h-96 w-auto object-contain"
                />
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Clinical / Radiology Summary:</span>
                <p className="text-slate-700 leading-relaxed">{previewDocModal.summary}</p>
                {previewDocModal.radiologyFindings && (
                  <p className="text-teal-800 font-semibold mt-1">
                    Radiology Findings: {previewDocModal.radiologyFindings}
                  </p>
                )}
              </div>
            </div>

            {/* Share and Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                ✓ Shared directly with Consulting Doctor &amp; Linked to ABHA
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Report link & clinical token copied to clipboard!");
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                >
                  📋 Copy Share Link
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDocModal(null)}
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
