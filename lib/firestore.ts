import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ==================== PROFILE ====================

export interface ProfileData {
  name: string;
  role: string;
  bio: string;
  email: string;
  avatar: string;
  experience: string;
  education: string;
  location: string;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "Nattawat",
  role: "Full Stack Developer",
  bio: "นักพัฒนาเว็บผู้หลงใหลในการสร้างสรรค์ประสบการณ์ผู้ใช้ที่ดี",
  email: "contact@example.com",
  avatar: "https://github.com/shadcn.png",
  experience: "3+ ปี พัฒนาเว็บ",
  education: "วิศวกรรมคอมพิวเตอร์และสารสนเทศ",
  location: "กรุงเทพฯ, ประเทศไทย",
};

export async function getProfile(): Promise<ProfileData> {
  try {
    const docRef = doc(db, "settings", "profile");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ProfileData;
    }
    // If no profile exists, create default
    await setDoc(docRef, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  } catch (error) {
    console.error("Error getting profile:", error);
    return DEFAULT_PROFILE;
  }
}

export async function updateProfile(data: Partial<ProfileData>): Promise<void> {
  const docRef = doc(db, "settings", "profile");
  await setDoc(docRef, data, { merge: true });
}

// ==================== SKILLS ====================

export interface SkillData {
  id?: string;
  name: string;
  level: number;
  category: string;
  order?: number;
}

export async function getSkills(): Promise<SkillData[]> {
  try {
    const q = query(collection(db, "skills"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SkillData[];
  } catch (error) {
    console.error("Error getting skills:", error);
    // Return defaults on error (e.g. if no "order" index yet)
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SkillData[];
    } catch {
      return [];
    }
  }
}

export async function addSkill(skill: Omit<SkillData, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "skills"), {
    ...skill,
    order: skill.order ?? 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateSkill(
  id: string,
  data: Partial<SkillData>
): Promise<void> {
  const docRef = doc(db, "skills", id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, "skills", id));
}

// ==================== PROJECTS ====================

export interface ProjectData {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  image: string;
  tech: string[];
  link: string;
  github?: string;
  type?: string;
  rarity?: string;
  order?: number;
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProjectData[];
  } catch (error) {
    console.error("Error getting projects:", error);
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProjectData[];
    } catch {
      return [];
    }
  }
}

export async function getProjectById(id: string): Promise<ProjectData | null> {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectData;
    }
    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    return null;
  }
}

export async function addProject(
  project: Omit<ProjectData, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, "projects"), {
    ...project,
    order: project.order ?? 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(
  id: string,
  data: Partial<ProjectData>
): Promise<void> {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// ==================== CONTACT MESSAGES ====================

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
  read?: boolean;
}

export async function addContactMessage(
  msg: Omit<ContactMessage, "id" | "createdAt" | "read">
): Promise<string> {
  const docRef = await addDoc(collection(db, "messages"), {
    ...msg,
    read: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ContactMessage[];
  } catch {
    return [];
  }
}
