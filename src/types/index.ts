export type UserRole = "owner" | "branch_editor" | "viewer";
export type AuthMethod = "email" | "password";
export type DobType = "exact" | "year" | "decade" | "marker" | "unknown";
export type Gender = "male" | "female" | "other";
export type MarriageStatus = "active" | "divorced" | "widowed" | "separated" | "annulled";
export type SurnamePreference = "keep_maiden" | "husband" | "both" | "hyphenated";
export type MarriageVisibility = "visible_all" | "branch_only" | "hidden";
export type RelationType = "blood" | "marriage" | "adopted" | "step" | "dharma";
export type RelationGroup = "paternal" | "maternal" | "self" | "inlaw" | "children";
export type ItemStatus = "active" | "deleted";

export interface UserProfile {
  id: string;
  fullName: string;
  fullNameHi?: string;
  alsoKnownAs?: string;
  dob?: string;
  dobType?: DobType;
  dobApproximate?: string;
  phone?: string;
  email?: string;
  authMethod?: AuthMethod;
  gotra?: string;
  kulDevta?: string;
  kulDevi?: string;
  jati?: string;
  varna?: string;
  nakshatra?: string;
  rashi?: string;
  shakha?: string;
  pravar?: string;
  village?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  currentCity?: string;
  currentState?: string;
  migrationNote?: string;
  teerthSthal?: string;
  familyPriest?: string;
  treeId?: string;
  role?: UserRole;
  verified?: boolean;
  banned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lang?: "hi" | "en" | "hinglish";
}

export interface Member {
  id: string;
  treeId?: string;
  userId?: string;
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
  dobType?: DobType;
  dobApproximate?: string;
  deathYear?: number;
  deathTithi?: string;
  teerthSthal?: string;
  occupation?: string;
  notes?: string;
  oralHistory?: string;
  householdId?: string;
  addedBy?: string;
  status: ItemStatus;
  deletedAt?: string;
  deletedBy?: string;
  recoverableUntil?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Marriage {
  id: string;
  memberId?: string;
  spouseName?: string;
  spouseFatherName?: string;
  spouseGotra?: string;
  spouseKulDevta?: string;
  spouseKulDevi?: string;
  spouseJati?: string;
  spouseVillage?: string;
  spouseDistrict?: string;
  marriageDate?: string;
  marriageStatus?: MarriageStatus;
  endDate?: string;
  maidenName?: string;
  maidenFullName?: string;
  marriedSurname?: string;
  displayPreference?: SurnamePreference;
  displayName?: string;
  surnameSetBy?: string;
  visibility?: MarriageVisibility;
  linkedTreeId?: string;
  connectionStatus?: string;
  childrenFromThisMarriage?: string;
  status?: ItemStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TreeMetadata {
  treeId: string;
  ownerId?: string;
  familySurname: string;
  gotra?: string;
  kulDevta?: string;
  kulDevi?: string;
  village?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  totalMembers?: number;
  generations?: number;
  isPublic?: boolean;
  passcode?: string;
  status?: "active" | "deleted" | "merged" | "locked";
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinRequest {
  id: string;
  treeId?: string;
  requesterId?: string;
  requesterName?: string;
  claimedRelation?: string;
  status?: "pending" | "approved" | "rejected";
  requestedAt?: string;
}

export interface Connection {
  id: string;
  fromTreeId?: string;
  toTreeId?: string;
  fromMemberId?: string;
  toMemberId?: string;
  relationType?: string;
  status?: "pending" | "approved" | "rejected";
  requestedAt?: string;
  approvedAt?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  isAdmin: boolean;
}
