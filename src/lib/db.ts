import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import type { UserProfile, TreeMetadata, Member } from "@/types";

// ─── Tree ID Generation ───
function generateTreeId(surname: string, birthYear: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${surname.toUpperCase()}-${birthYear}-${random}`;
}

// ─── User Operations ───
export async function createUser(uid: string, profile: Partial<UserProfile>) {
  await setDoc(doc(db, "users", uid), {
    ...profile,
    uid,
    verified: true,
    createdAt: new Date().toISOString(),
  });
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUser(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), data);
}

// ─── Tree Operations ───
export async function createTree(
  uid: string,
  profile: Partial<UserProfile>
): Promise<string> {
  const birthYear = profile.dob
    ? new Date(profile.dob).getFullYear().toString()
    : profile.dobApproximate || "0000";
  const surname = profile.fullName?.split(" ").pop() || "FAMILY";

  let treeId = generateTreeId(surname, birthYear);

  // Ensure uniqueness
  let exists = true;
  let attempts = 0;
  while (exists && attempts < 10) {
    const snap = await getDoc(doc(db, "tree-metadata", treeId));
    if (!snap.exists()) {
      exists = false;
    } else {
      treeId = generateTreeId(surname, birthYear);
      attempts++;
    }
  }

  // Create tree-metadata
  const treeData: Partial<TreeMetadata> = {
    treeId,
    ownerUid: uid,
    familySurname: surname,
    gotra: profile.gotra || "",
    kulDevta: profile.kulDevta,
    kulDevi: profile.kulDevi,
    village: profile.village || "",
    tehsil: profile.tehsil,
    district: profile.district || "",
    state: profile.state || "",
    totalMembers: 1,
    generations: 1,
    createdAt: new Date().toISOString(),
    isPublicToSameGotra: true,
    status: "active",
  };
  await setDoc(doc(db, "tree-metadata", treeId), treeData);

  // Create gotra index
  if (profile.gotra) {
    await setDoc(doc(db, "gotra-index", profile.gotra, treeId), {
      treeId,
      familySurname: surname,
      village: profile.village,
      district: profile.district,
      kulDevta: profile.kulDevta,
      generations: 1,
      memberCount: 1,
    });
  }

  // Update user with treeId
  await updateDoc(doc(db, "users", uid), { treeId, role: "owner" });

  // Create self member
  await setDoc(doc(db, `users/${uid}/members`, "self"), {
    name: profile.fullName,
    nameHi: profile.fullNameHi,
    relation: "self",
    relationGroup: "self",
    relationType: "blood",
    generationLevel: 0,
    gender: "male",
    alive: true,
    dob: profile.dob,
    dobType: profile.dobType || "unknown",
    addedBy: uid,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Set role
  await setDoc(doc(db, `users/${uid}/members-access`, uid), {
    role: "owner",
    approvedAt: new Date().toISOString(),
    approvedBy: uid,
  });

  return treeId;
}

// ─── Duplicate Detection ───
export async function findDuplicateTrees(
  surname: string,
  gotra: string,
  district: string
): Promise<TreeMetadata[]> {
  const normalizedSurname = surname.toLowerCase().trim();
  const q = query(
    collection(db, "tree-metadata"),
    where("gotra", "==", gotra),
    where("district", "==", district),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  const matches: TreeMetadata[] = [];
  snap.forEach((doc) => {
    const data = doc.data() as TreeMetadata;
    if (data.familySurname.toLowerCase().trim() === normalizedSurname) {
      matches.push(data);
    }
  });
  return matches;
}

// ─── Member Operations ───
export async function addMember(uid: string, member: Partial<Member>): Promise<string> {
  const memberId = `member_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await setDoc(doc(db, `users/${uid}/members`, memberId), {
    ...member,
    id: memberId,
    addedBy: uid,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Update tree member count
  const user = await getUser(uid);
  if (user?.treeId) {
    await updateDoc(doc(db, "tree-metadata", user.treeId), {
      totalMembers: increment(1),
    });
  }

  return memberId;
}

export async function getMembers(uid: string): Promise<Member[]> {
  const q = query(
    collection(db, `users/${uid}/members`),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  const members: Member[] = [];
  snap.forEach((doc) => members.push({ id: doc.id, ...doc.data() } as Member));
  return members;
}

export async function softDeleteMember(uid: string, memberId: string) {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  await updateDoc(doc(db, `users/${uid}/members`, memberId), {
    status: "deleted",
    deletedAt: new Date().toISOString(),
    deletedBy: uid,
    recoverableUntil: thirtyDaysFromNow.toISOString(),
  });

  const user = await getUser(uid);
  if (user?.treeId) {
    await updateDoc(doc(db, "tree-metadata", user.treeId), {
      totalMembers: increment(-1),
    });
  }
}

export async function recoverMember(uid: string, memberId: string) {
  await updateDoc(doc(db, `users/${uid}/members`, memberId), {
    status: "active",
    deletedAt: null,
    deletedBy: null,
    recoverableUntil: null,
  });

  const user = await getUser(uid);
  if (user?.treeId) {
    await updateDoc(doc(db, "tree-metadata", user.treeId), {
      totalMembers: increment(1),
    });
  }
}

// ─── Tree Metadata Lookup ───
export async function getTreeMetadata(treeId: string): Promise<TreeMetadata | null> {
  const snap = await getDoc(doc(db, "tree-metadata", treeId));
  return snap.exists() ? (snap.data() as TreeMetadata) : null;
}
