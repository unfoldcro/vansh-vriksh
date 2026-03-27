import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  serial,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Users ───
export const users = pgTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").unique(),
  passwordHash: text("password_hash"), // null for OTP-only users
  fullName: text("full_name").notNull(),
  fullNameHi: text("full_name_hi"),
  alsoKnownAs: text("also_known_as"),
  dob: text("dob"),
  dobType: text("dob_type").default("unknown"), // exact|year|decade|marker|unknown
  dobApproximate: text("dob_approximate"),
  phone: text("phone"),
  authMethod: text("auth_method").default("email"), // email|password
  gotra: text("gotra"),
  kulDevta: text("kul_devta"),
  kulDevi: text("kul_devi"),
  jati: text("jati"),
  varna: text("varna"),
  nakshatra: text("nakshatra"),
  rashi: text("rashi"),
  shakha: text("shakha"),
  pravar: text("pravar"),
  village: text("village"),
  tehsil: text("tehsil"),
  district: text("district"),
  state: text("state"),
  currentCity: text("current_city"),
  currentState: text("current_state"),
  migrationNote: text("migration_note"),
  teerthSthal: text("teerth_sthal"),
  familyPriest: text("family_priest"),
  treeId: text("tree_id"),
  role: text("role").default("viewer"), // owner|branch_editor|viewer
  verified: boolean("verified").default(false),
  banned: boolean("banned").default(false),
  lang: text("lang").default("hi"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ─── OTP Codes ───
export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── Trees ───
export const trees = pgTable("trees", {
  treeId: text("tree_id").primaryKey(),
  ownerId: text("owner_id").references(() => users.id),
  familySurname: text("family_surname").notNull(),
  gotra: text("gotra"),
  kulDevta: text("kul_devta"),
  kulDevi: text("kul_devi"),
  village: text("village"),
  tehsil: text("tehsil"),
  district: text("district"),
  state: text("state"),
  totalMembers: integer("total_members").default(1),
  generations: integer("generations").default(1),
  isPublic: boolean("is_public").default(true),
  passcode: text("passcode"),
  status: text("status").default("active"), // active|deleted|merged|locked
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ─── Members ───
export const members = pgTable("members", {
  id: text("id").primaryKey(),
  treeId: text("tree_id").references(() => trees.treeId),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  alsoKnownAs: text("also_known_as"),
  relation: text("relation").notNull(),
  relationGroup: text("relation_group").notNull(), // paternal|maternal|self|inlaw|children
  relationType: text("relation_type").notNull(), // blood|marriage|adopted|step|dharma
  generationLevel: integer("generation_level").default(0),
  gender: text("gender").notNull(),
  alive: boolean("alive").default(true),
  dob: text("dob"),
  dobType: text("dob_type").default("unknown"),
  dobApproximate: text("dob_approximate"),
  deathYear: integer("death_year"),
  deathTithi: text("death_tithi"),
  teerthSthal: text("teerth_sthal"),
  occupation: text("occupation"),
  notes: text("notes"),
  oralHistory: text("oral_history"),
  householdId: text("household_id"),
  addedBy: text("added_by").references(() => users.id),
  status: text("status").default("active"),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  deletedBy: text("deleted_by"),
  recoverableUntil: timestamp("recoverable_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ─── Marriages ───
export const marriages = pgTable("marriages", {
  id: text("id").primaryKey(),
  memberId: text("member_id").references(() => members.id),
  spouseName: text("spouse_name"),
  spouseFatherName: text("spouse_father_name"),
  spouseGotra: text("spouse_gotra"),
  spouseKulDevta: text("spouse_kul_devta"),
  spouseKulDevi: text("spouse_kul_devi"),
  spouseJati: text("spouse_jati"),
  spouseVillage: text("spouse_village"),
  spouseDistrict: text("spouse_district"),
  marriageDate: text("marriage_date"),
  marriageStatus: text("marriage_status").default("active"),
  endDate: text("end_date"),
  maidenName: text("maiden_name"),
  maidenFullName: text("maiden_full_name"),
  marriedSurname: text("married_surname"),
  displayPreference: text("display_preference").default("keep_maiden"),
  displayName: text("display_name"),
  surnameSetBy: text("surname_set_by"),
  visibility: text("visibility").default("visible_all"),
  linkedTreeId: text("linked_tree_id"),
  connectionStatus: text("connection_status"),
  childrenFromThisMarriage: text("children_from_this_marriage"), // JSON string array
  status: text("status").default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ─── Members Access (role-based permissions) ───
export const membersAccess = pgTable("members_access", {
  id: serial("id").primaryKey(),
  treeOwnerId: text("tree_owner_id").references(() => users.id),
  memberUserId: text("member_user_id").references(() => users.id),
  role: text("role").notNull(), // owner|branch_editor|viewer
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: text("approved_by"),
});

// ─── Join Requests ───
export const joinRequests = pgTable("join_requests", {
  id: text("id").primaryKey(),
  treeId: text("tree_id").references(() => trees.treeId),
  requesterId: text("requester_id").references(() => users.id),
  requesterName: text("requester_name"),
  claimedRelation: text("claimed_relation"),
  status: text("status").default("pending"), // pending|approved|rejected
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow(),
});

// ─── Connections (cross-tree marriages) ───
export const connections = pgTable("connections", {
  id: text("id").primaryKey(),
  fromTreeId: text("from_tree_id").references(() => trees.treeId),
  toTreeId: text("to_tree_id").references(() => trees.treeId),
  fromMemberId: text("from_member_id").references(() => members.id),
  toMemberId: text("to_member_id").references(() => members.id),
  relationType: text("relation_type").default("marriage"),
  status: text("status").default("pending"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

// ─── Gotra Index ───
export const gotraIndex = pgTable(
  "gotra_index",
  {
    id: serial("id").primaryKey(),
    gotra: text("gotra").notNull(),
    treeId: text("tree_id").references(() => trees.treeId),
    familySurname: text("family_surname"),
    village: text("village"),
    district: text("district"),
    kulDevta: text("kul_devta"),
    generations: integer("generations").default(1),
    memberCount: integer("member_count").default(1),
  },
  (table) => [uniqueIndex("gotra_tree_idx").on(table.gotra, table.treeId)]
);

// ─── Audit Log (admin actions) ───
export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  adminId: text("admin_id").references(() => users.id),
  action: text("action").notNull(),
  targetType: text("target_type"), // user|tree|member|connection
  targetId: text("target_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
