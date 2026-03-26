import type { Member, TreeMetadata } from "@/types";

export const DEMO_TREE_ID = "PATIL-1985-DEMO";

export const DEMO_MEMBERS: Member[] = [
  { id: "d1", name: "Ramji Patil", nameHi: "रामजी पाटिल", relation: "pardada", relationGroup: "paternal", relationType: "blood", generationLevel: -3, gender: "male", alive: false, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d2", name: "Savitri Patil", nameHi: "सावित्री पाटिल", relation: "pardadi", relationGroup: "paternal", relationType: "blood", generationLevel: -3, gender: "female", alive: false, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d3", name: "Suresh Patil", nameHi: "सुरेश पाटिल", relation: "father", relationGroup: "paternal", relationType: "blood", generationLevel: -1, gender: "male", alive: true, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d4", name: "Kamla Patil", nameHi: "कमला पाटिल", relation: "mother", relationGroup: "paternal", relationType: "blood", generationLevel: -1, gender: "female", alive: true, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d5", name: "Rajesh Patil", nameHi: "राजेश पाटिल", relation: "self", relationGroup: "self", relationType: "blood", generationLevel: 0, gender: "male", alive: true, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d6", name: "Sunita Patil", nameHi: "सुनीता पाटिल", relation: "wife", relationGroup: "self", relationType: "marriage", generationLevel: 0, gender: "female", alive: true, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d7", name: "Arjun Patil", nameHi: "अर्जुन पाटिल", relation: "son", relationGroup: "children", relationType: "blood", generationLevel: 1, gender: "male", alive: true, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d8", name: "Ananya Patil", nameHi: "अनन्या पाटिल", relation: "daughter", relationGroup: "children", relationType: "blood", generationLevel: 1, gender: "female", alive: true, dobType: "unknown", status: "active", addedBy: "demo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const DEMO_TREE: TreeMetadata = {
  treeId: DEMO_TREE_ID,
  ownerUid: "demo",
  familySurname: "Patil",
  gotra: "Kashyap",
  kulDevta: "",
  kulDevi: "Maa Sharda",
  village: "Doraha",
  tehsil: "Sehore",
  district: "Sehore",
  state: "Madhya Pradesh",
  totalMembers: 8,
  generations: 4,
  createdAt: new Date().toISOString(),
  isPublicToSameGotra: true,
  status: "active",
};

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("vansh-vriksh-demo") === "true";
}

export function isDemoTreeId(treeId: string): boolean {
  return treeId === DEMO_TREE_ID;
}
