import { db } from "./firebase";
import {
  getDocs,
  collection,
  query,
  where,
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { UserProfile, TreeMetadata, JoinRequest, Connection } from "@/types";

// ─── All Registered Users ───
export async function getAllUsers(maxResults = 100): Promise<UserProfile[]> {
  const q = query(collection(db, "users"), limit(maxResults));
  const snap = await getDocs(q);
  const users: UserProfile[] = [];
  snap.forEach((d) => users.push({ uid: d.id, ...d.data() } as UserProfile));
  // Sort by createdAt descending (newest first)
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return users;
}

// ─── All Trees ───
export async function getAllTrees(): Promise<TreeMetadata[]> {
  const q = query(collection(db, "tree-metadata"));
  const snap = await getDocs(q);
  const trees: TreeMetadata[] = [];
  snap.forEach((d) => trees.push(d.data() as TreeMetadata));
  trees.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return trees;
}

// ─── All Join Requests (all statuses) ───
export async function getAllJoinRequests(): Promise<JoinRequest[]> {
  const snap = await getDocs(collection(db, "join-requests"));
  const requests: JoinRequest[] = [];
  snap.forEach((d) => requests.push({ id: d.id, ...d.data() } as JoinRequest));
  requests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  return requests;
}

// ─── All Connections ───
export async function getAllConnections(): Promise<Connection[]> {
  const snap = await getDocs(collection(db, "connections"));
  const connections: Connection[] = [];
  snap.forEach((d) => connections.push({ id: d.id, ...d.data() } as Connection));
  connections.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  return connections;
}

// ─── Get user by UID ───
export async function getUserById(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserProfile) : null;
}

// ─── Delete tree (hard) ───
export async function adminDeleteTree(treeId: string) {
  await deleteDoc(doc(db, "tree-metadata", treeId));
}

// ─── Lock/Unlock tree ───
export async function adminToggleTreeLock(treeId: string, locked: boolean) {
  await updateDoc(doc(db, "tree-metadata", treeId), {
    status: locked ? "locked" : "active",
  });
}

// ─── Transfer ownership ───
export async function adminTransferOwnership(treeId: string, newOwnerUid: string) {
  await updateDoc(doc(db, "tree-metadata", treeId), { ownerUid: newOwnerUid });
  await updateDoc(doc(db, "users", newOwnerUid), { role: "owner" });
}

// ─── Get all deleted items across all users (metadata only) ───
export async function getGlobalDeletedCount(): Promise<number> {
  // We can only count from tree-metadata that are deleted
  const q = query(collection(db, "tree-metadata"), where("status", "==", "deleted"));
  const snap = await getDocs(q);
  return snap.size;
}
