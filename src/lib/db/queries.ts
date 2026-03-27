import { db } from "./index";
import { users, trees, members, membersAccess, gotraIndex, joinRequests, connections } from "./schema";
import { eq, and, sql, ilike } from "drizzle-orm";

// ─── ID Generation ───
function generateId(): string {
  return crypto.randomUUID();
}

function generateTreeId(surname: string, birthYear: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${surname.toUpperCase()}-${birthYear}-${random}`;
}

function generateMemberId(): string {
  return `member_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ─── User Operations ───
export async function createUser(data: {
  id: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  authMethod?: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      id: data.id,
      email: data.email,
      passwordHash: data.passwordHash || null,
      fullName: data.fullName,
      authMethod: data.authMethod || "email",
      verified: true,
    })
    .returning();
  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user || null;
}

export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

// ─── Tree Operations ───
export async function createTree(
  userId: string,
  profile: {
    fullName: string;
    fullNameHi?: string;
    dob?: string;
    dobType?: string;
    dobApproximate?: string;
    gotra?: string;
    kulDevta?: string;
    kulDevi?: string;
    village?: string;
    tehsil?: string;
    district?: string;
    state?: string;
  }
) {
  const birthYear = profile.dob
    ? new Date(profile.dob).getFullYear().toString()
    : profile.dobApproximate || "0000";
  const surname = profile.fullName?.split(" ").pop() || "FAMILY";

  // Generate unique tree ID
  let treeId = generateTreeId(surname, birthYear);
  let attempts = 0;
  while (attempts < 10) {
    const [existing] = await db.select().from(trees).where(eq(trees.treeId, treeId)).limit(1);
    if (!existing) break;
    treeId = generateTreeId(surname, birthYear);
    attempts++;
  }

  // Create tree
  await db.insert(trees).values({
    treeId,
    ownerId: userId,
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
    status: "active",
  });

  // Create gotra index entry
  if (profile.gotra) {
    await db.insert(gotraIndex).values({
      gotra: profile.gotra,
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
  await db.update(users).set({ treeId, role: "owner" }).where(eq(users.id, userId));

  // Create self member
  const selfId = "self";
  await db.insert(members).values({
    id: selfId,
    treeId,
    userId,
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
    addedBy: userId,
    status: "active",
  });

  // Set owner access
  await db.insert(membersAccess).values({
    treeOwnerId: userId,
    memberUserId: userId,
    role: "owner",
    approvedAt: new Date(),
    approvedBy: userId,
  });

  return treeId;
}

export async function getTreeMetadata(treeId: string) {
  const [tree] = await db.select().from(trees).where(eq(trees.treeId, treeId)).limit(1);
  return tree || null;
}

export async function setTreePasscode(treeId: string, passcode: string | null) {
  await db.update(trees).set({ passcode: passcode || null }).where(eq(trees.treeId, treeId));
}

// ─── Duplicate Detection ───
export async function findDuplicateTrees(surname: string, gotra: string, district: string) {
  const results = await db
    .select()
    .from(trees)
    .where(
      and(
        eq(trees.gotra, gotra),
        eq(trees.district, district),
        eq(trees.status, "active")
      )
    );
  const normalizedSurname = surname.toLowerCase().trim();
  return results.filter(
    (t) => t.familySurname.toLowerCase().trim() === normalizedSurname
  );
}

// ─── Member Operations ───
export async function addMember(
  userId: string,
  treeId: string,
  member: Partial<typeof members.$inferInsert>
) {
  const memberId = generateMemberId();
  await db.insert(members).values({
    ...member,
    id: memberId,
    treeId,
    userId,
    name: member.name || "",
    relation: member.relation || "",
    relationGroup: member.relationGroup || "self",
    relationType: member.relationType || "blood",
    gender: member.gender || "male",
    addedBy: userId,
    status: "active",
  });

  // Update tree member count
  await db
    .update(trees)
    .set({ totalMembers: sql`${trees.totalMembers} + 1` })
    .where(eq(trees.treeId, treeId));

  return memberId;
}

export async function getMembers(userId: string) {
  return db
    .select()
    .from(members)
    .where(and(eq(members.userId, userId), eq(members.status, "active")));
}

export async function getMembersByTreeId(treeId: string) {
  return db
    .select()
    .from(members)
    .where(and(eq(members.treeId, treeId), eq(members.status, "active")));
}

export async function softDeleteMember(userId: string, memberId: string) {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  await db
    .update(members)
    .set({
      status: "deleted",
      deletedAt: new Date(),
      deletedBy: userId,
      recoverableUntil: thirtyDaysFromNow,
    })
    .where(eq(members.id, memberId));

  // Get tree ID to update count
  const [member] = await db.select().from(members).where(eq(members.id, memberId)).limit(1);
  if (member?.treeId) {
    await db
      .update(trees)
      .set({ totalMembers: sql`GREATEST(${trees.totalMembers} - 1, 0)` })
      .where(eq(trees.treeId, member.treeId));
  }
}

export async function recoverMember(userId: string, memberId: string) {
  await db
    .update(members)
    .set({
      status: "active",
      deletedAt: null,
      deletedBy: null,
      recoverableUntil: null,
    })
    .where(eq(members.id, memberId));

  const [member] = await db.select().from(members).where(eq(members.id, memberId)).limit(1);
  if (member?.treeId) {
    await db
      .update(trees)
      .set({ totalMembers: sql`${trees.totalMembers} + 1` })
      .where(eq(trees.treeId, member.treeId));
  }
}

export async function getDeletedMembers(userId: string) {
  return db
    .select()
    .from(members)
    .where(
      and(
        eq(members.userId, userId),
        eq(members.status, "deleted"),
        sql`${members.recoverableUntil} > NOW()`
      )
    );
}

export async function getDeletedMembersByTreeId(treeId: string) {
  return db
    .select()
    .from(members)
    .where(
      and(
        eq(members.treeId, treeId),
        eq(members.status, "deleted"),
        sql`${members.recoverableUntil} > NOW()`
      )
    );
}

// ─── Join Requests ───
export async function createJoinRequest(data: {
  treeId: string;
  requesterId: string;
  requesterName: string;
  claimedRelation: string;
}) {
  const id = generateId();
  await db.insert(joinRequests).values({ id, ...data });
  return id;
}

export async function getJoinRequests(treeId: string) {
  return db
    .select()
    .from(joinRequests)
    .where(and(eq(joinRequests.treeId, treeId), eq(joinRequests.status, "pending")));
}

export async function approveJoinRequest(requestId: string, approverUid: string) {
  const [request] = await db
    .select()
    .from(joinRequests)
    .where(eq(joinRequests.id, requestId))
    .limit(1);
  if (!request) return;

  await db
    .update(joinRequests)
    .set({ status: "approved" })
    .where(eq(joinRequests.id, requestId));

  // Give branch_editor role
  await db.insert(membersAccess).values({
    treeOwnerId: approverUid,
    memberUserId: request.requesterId!,
    role: "branch_editor",
    approvedAt: new Date(),
    approvedBy: approverUid,
  });

  // Update user role
  await db
    .update(users)
    .set({ treeId: request.treeId!, role: "branch_editor" })
    .where(eq(users.id, request.requesterId!));
}

export async function rejectJoinRequest(requestId: string) {
  await db
    .update(joinRequests)
    .set({ status: "rejected" })
    .where(eq(joinRequests.id, requestId));
}

// ─── Connections ───
export async function createConnection(data: {
  fromTreeId: string;
  toTreeId: string;
  fromMemberId: string;
  toMemberId: string;
}) {
  const id = generateId();
  await db.insert(connections).values({ id, ...data, relationType: "marriage" });
  return id;
}

export async function approveConnection(connectionId: string) {
  await db
    .update(connections)
    .set({ status: "approved", approvedAt: new Date() })
    .where(eq(connections.id, connectionId));
}

// ─── Gotra Discovery ───
export async function discoverByGotra(gotra: string, district?: string) {
  if (district) {
    return db
      .select()
      .from(gotraIndex)
      .where(and(eq(gotraIndex.gotra, gotra), eq(gotraIndex.district, district)));
  }
  return db.select().from(gotraIndex).where(eq(gotraIndex.gotra, gotra));
}

// ─── Search Trees ───
export async function searchTrees(query: string) {
  return db
    .select()
    .from(trees)
    .where(
      and(
        eq(trees.status, "active"),
        ilike(trees.familySurname, `%${query}%`)
      )
    )
    .limit(20);
}
