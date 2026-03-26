export type UserRole = "owner" | "branch_editor" | "viewer";
export type AuthMethod = "phone" | "email";
export type DobType = "exact" | "year" | "decade" | "marker" | "unknown";
export type Gender = "male" | "female" | "other";
export type MarriageStatus = "active" | "divorced" | "widowed" | "separated" | "annulled";
export type SurnamePreference = "keep_maiden" | "husband" | "both" | "hyphenated";
export type MarriageVisibility = "visible_all" | "branch_only" | "hidden";
export type RelationType = "blood" | "marriage" | "adopted" | "step" | "dharma";
export type RelationGroup = "paternal" | "maternal" | "self" | "inlaw" | "children";
export type ItemStatus = "active" | "deleted";

export interface UserProfile {
  uid: string;
  fullName: string;
  fullNameHi?: string;
  alsoKnownAs?: string;
  dob?: string;
  dobType: DobType;
  dobApproximate?: string;
  phone?: string;
  email?: string;
  authMethod: AuthMethod;
  gotra: string;
  kulDevta?: string;
  kulDevi?: string;
  jati?: string;
  varna?: string;
  nakshatra?: string;
  rashi?: string;
  shakha?: string;
  pravar?: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  currentCity?: string;
  currentState?: string;
  migrationNote?: string;
  teerthSthal?: string;
  familyPriest?: string;
  treeId: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  lang: "hi" | "en";
}

export interface Member {
  id: string;
  name: string;
  nameHi?: string;
  alsoKnownAs?: string;
  relation: string;
  relationGroup: RelationGroup;
  relationType: RelationType;
  generationLevel: number;
  gender: Gender;
  alive: boolean;
  dob?: string;
  dobType: DobType;
  dobApproximate?: string;
  deathYear?: number;
  deathTithi?: string;
  teerthSthal?: string;
  occupation?: string;
  notes?: string;
  oralHistory?: string;
  householdId?: string;
  addedBy: string;
  status: ItemStatus;
  deletedAt?: string;
  recoverableUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Marriage {
  id: string;
  spouseName: string;
  spouseFatherName: string;
  spouseGotra: string;
  spouseKulDevta?: string;
  spouseKulDevi?: string;
  spouseJati?: string;
  spouseVillage: string;
  spouseDistrict?: string;
  marriageDate?: string;
  marriageStatus: MarriageStatus;
  endDate?: string;
  maidenName: string;
  maidenFullName: string;
  marriedSurname?: string;
  displayPreference: SurnamePreference;
  displayName: string;
  surnameSetBy?: string;
  visibility: MarriageVisibility;
  linkedTreeId?: string;
  connectionStatus?: string;
  childrenFromThisMarriage: string[];
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TreeMetadata {
  treeId: string;
  ownerUid: string;
  familySurname: string;
  gotra: string;
  kulDevta?: string;
  kulDevi?: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  totalMembers: number;
  generations: number;
  createdAt: string;
  isPublicToSameGotra: boolean;
  status: "active" | "deleted" | "merged";
}

export interface JoinRequest {
  id: string;
  treeId: string;
  requesterUid: string;
  requesterName: string;
  claimedRelation: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export interface Connection {
  id: string;
  fromTreeId: string;
  toTreeId: string;
  fromMemberId: string;
  toMemberId: string;
  relationType: "marriage";
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  approvedAt?: string;
}
