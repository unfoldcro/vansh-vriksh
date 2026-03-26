import { db } from "./firebase";
import {
  doc, setDoc, getDoc, getDocs, collection, query, where,
  updateDoc,
} from "firebase/firestore";
import type { JoinRequest, TreeMetadata } from "@/types";

// ─── Join Requests ───
export async function createJoinRequest(
  treeId: string,
  requesterUid: string,
  requesterName: string,
  claimedRelation: string
): Promise<string> {
  const requestId = `join_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await setDoc(doc(db, "join-requests", requestId), {
    id: requestId,
    treeId,
    requesterUid,
    requesterName,
    claimedRelation,
    status: "pending",
    requestedAt: new Date().toISOString(),
  });
  return requestId;
}

export async function getJoinRequests(treeId: string): Promise<JoinRequest[]> {
  const q = query(
    collection(db, "join-requests"),
    where("treeId", "==", treeId),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  const requests: JoinRequest[] = [];
  snap.forEach((d) => requests.push({ id: d.id, ...d.data() } as JoinRequest));
  return requests;
}

export async function approveJoinRequest(requestId: string, approverUid: string) {
  const reqDoc = await getDoc(doc(db, "join-requests", requestId));
  if (!reqDoc.exists()) return;

  const request = reqDoc.data() as JoinRequest;

  await updateDoc(doc(db, "join-requests", requestId), { status: "approved" });

  // Give requester branch_editor role
  const treeMetaDoc = await getDoc(doc(db, "tree-metadata", request.treeId));
  if (!treeMetaDoc.exists()) return;
  const treeMeta = treeMetaDoc.data() as TreeMetadata;

  await setDoc(doc(db, `users/${treeMeta.ownerUid}/members-access`, request.requesterUid), {
    role: "branch_editor",
    approvedAt: new Date().toISOString(),
    approvedBy: approverUid,
  });

  // Update requester's user doc
  await updateDoc(doc(db, "users", request.requesterUid), {
    treeId: request.treeId,
    role: "branch_editor",
  });
}

export async function rejectJoinRequest(requestId: string) {
  await updateDoc(doc(db, "join-requests", requestId), { status: "rejected" });
}

// ─── Connections (Cross-tree marriage) ───
export async function createConnection(
  fromTreeId: string,
  toTreeId: string,
  fromMemberId: string,
  toMemberId: string
): Promise<string> {
  const connectionId = `conn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await setDoc(doc(db, "connections", connectionId), {
    id: connectionId,
    fromTreeId,
    toTreeId,
    fromMemberId,
    toMemberId,
    relationType: "marriage",
    status: "pending",
    requestedAt: new Date().toISOString(),
  });
  return connectionId;
}

export async function approveConnection(connectionId: string) {
  await updateDoc(doc(db, "connections", connectionId), {
    status: "approved",
    approvedAt: new Date().toISOString(),
  });
}

// ─── Gotra Discovery ───
export async function discoverByGotra(
  gotra: string,
  district?: string
): Promise<TreeMetadata[]> {
  const constraints = [
    where("gotra", "==", gotra),
    where("status", "==", "active"),
  ];
  if (district) {
    constraints.push(where("district", "==", district));
  }

  const q = query(collection(db, "tree-metadata"), ...constraints);
  const snap = await getDocs(q);
  const results: TreeMetadata[] = [];
  snap.forEach((d) => results.push(d.data() as TreeMetadata));
  return results;
}

// ─── Recycle Bin (query deleted members) ───
export async function getDeletedMembers(uid: string) {
  const q = query(
    collection(db, `users/${uid}/members`),
    where("status", "==", "deleted")
  );
  const snap = await getDocs(q);
  const members: { id: string; [key: string]: unknown }[] = [];
  snap.forEach((d) => members.push({ id: d.id, ...d.data() }));
  return members;
}
