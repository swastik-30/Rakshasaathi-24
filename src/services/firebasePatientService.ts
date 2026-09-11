import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { PatientCase } from "../types";
import { INITIAL_DEMO_PATIENTS } from "../data/initialPatients";

const PATIENTS_COLLECTION = "patients";

function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Initializes Firestore with demo patients if collection is empty.
 */
export async function seedInitialPatientsIfEmpty(): Promise<void> {
  try {
    const colRef = collection(db, PATIENTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      for (const patient of INITIAL_DEMO_PATIENTS) {
        await setDoc(doc(db, PATIENTS_COLLECTION, patient.id), sanitizeForFirestore(patient));
      }
    }
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Saves or updates a patient record in Firestore.
 */
export async function savePatientToFirestore(patient: PatientCase): Promise<void> {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patient.id);
    const sanitized = sanitizeForFirestore({
      ...patient,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, sanitized, { merge: true });
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Updates doctor verification status in Firestore.
 */
export async function updatePatientVerificationInFirestore(
  id: string,
  status: "CONFIRMED" | "CORRECTION_REQUESTED",
  doctorNotes: string,
  verifiedBy: string = "Dr. Ananya Joshi (MD Ayush / Consultant)"
): Promise<Partial<PatientCase>> {
  const updates: Partial<PatientCase> = {
    status,
    doctorNotes,
    verifiedBy,
    verifiedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, PATIENTS_COLLECTION, id);
    await updateDoc(docRef, updates as any);
  } catch {
    // Fallback gracefully
  }

  return updates;
}

/**
 * One-time fetch of all patient records from Firestore.
 */
export async function getPatientsFromFirestore(): Promise<PatientCase[]> {
  try {
    const colRef = collection(db, PATIENTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items: PatientCase[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as PatientCase);
      });
      // Sort by createdAt descending
      return items.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    }
    // If empty in Firestore, seed and return demo patients
    await seedInitialPatientsIfEmpty();
    return INITIAL_DEMO_PATIENTS;
  } catch {
    return INITIAL_DEMO_PATIENTS;
  }
}

/**
 * Subscribes to real-time changes in the patients collection.
 * Returns unsubscribe function.
 */
export function subscribeToPatients(
  onUpdate: (patients: PatientCase[]) => void
): () => void {
  try {
    const colRef = collection(db, PATIENTS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PatientCase[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as PatientCase);
          });
          list.sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });
          onUpdate(list);
        } else {
          // If empty, trigger seeding
          seedInitialPatientsIfEmpty().then(() => {
            onUpdate(INITIAL_DEMO_PATIENTS);
          });
        }
      },
      () => {
        // Fallback to initial demo cases on snapshot error
        onUpdate(INITIAL_DEMO_PATIENTS);
      }
    );
    return unsubscribe;
  } catch {
    onUpdate(INITIAL_DEMO_PATIENTS);
    return () => {};
  }
}
