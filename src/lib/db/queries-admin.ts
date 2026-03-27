import { db } from "./index";
import { users, trees, members, joinRequests, connections, auditLog } from "./schema";
import { eq, sql, desc, and } from "drizzle-orm";

// ─── Admin Stats ───
export async function getAdminStats() {
  const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  const [treeCount] = await db.select({ count: sql<number>`count(*)::int` }).from(trees).where(eq(trees.status, "active"));
  const [memberCount] = await db.select({ count: sql<number>`count(*)::int` }).from(members).where(eq(members.status, "active"));
  const [pendingJoins] = await db.select({ count: sql<number>`count(*)::int` }).from(joinRequests).where(eq(joinRequests.status, "pending"));
  const [pendingConnections] = await db.select({ count: sql<number>`count(*)::int` }).from(connections).where(eq(connections.status, "pending"));
  const [deletedCount] = await db.select({ count: sql<number>`count(*)::int` }).from(members).where(eq(members.status, "deleted"));

  return {
    users: userCount?.count ?? 0,
    trees: treeCount?.count ?? 0,
    members: memberCount?.count ?? 0,
    pendingJoins: pendingJoins?.count ?? 0,
    pendingConnections: pendingConnections?.count ?? 0,
    deletedItems: deletedCount?.count ?? 0,
  };
}

// ─── Admin Queries ───
export async function getAllUsers(limit = 100) {
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit);
}

export async function getAllTrees() {
  return db.select().from(trees).orderBy(desc(trees.createdAt));
}

export async function getAllJoinRequests() {
  return db.select().from(joinRequests).orderBy(desc(joinRequests.requestedAt));
}

export async function getAllConnections() {
  return db.select().from(connections).orderBy(desc(connections.requestedAt));
}

// ─── Admin Actions ───
export async function adminDeleteUser(userId: string, adminId: string) {
  await db.delete(users).where(eq(users.id, userId));
  await logAdminAction(adminId, "delete_user", "user", userId);
}

export async function adminBanUser(userId: string, adminId: string, ban: boolean) {
  await db.update(users).set({ banned: ban }).where(eq(users.id, userId));
  await logAdminAction(adminId, ban ? "ban_user" : "unban_user", "user", userId);
}

export async function adminDeleteTree(treeId: string, adminId: string) {
  await db.update(trees).set({ status: "deleted" }).where(eq(trees.treeId, treeId));
  await logAdminAction(adminId, "delete_tree", "tree", treeId);
}

export async function adminLockTree(treeId: string, adminId: string, lock: boolean) {
  await db
    .update(trees)
    .set({ status: lock ? "locked" : "active" })
    .where(eq(trees.treeId, treeId));
  await logAdminAction(adminId, lock ? "lock_tree" : "unlock_tree", "tree", treeId);
}

export async function adminTransferOwnership(
  treeId: string,
  newOwnerId: string,
  adminId: string
) {
  const [tree] = await db.select().from(trees).where(eq(trees.treeId, treeId)).limit(1);
  if (!tree) return;

  // Update tree owner
  await db.update(trees).set({ ownerId: newOwnerId }).where(eq(trees.treeId, treeId));

  // Update old owner role
  if (tree.ownerId) {
    await db.update(users).set({ role: "viewer" }).where(eq(users.id, tree.ownerId));
  }

  // Update new owner role
  await db.update(users).set({ treeId, role: "owner" }).where(eq(users.id, newOwnerId));

  await logAdminAction(adminId, "transfer_ownership", "tree", treeId, {
    fromOwner: tree.ownerId,
    toOwner: newOwnerId,
  });
}

// ─── Audit Log ───
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  await db.insert(auditLog).values({
    adminId,
    action,
    targetType,
    targetId,
    details: details ?? null,
  });
}

export async function getAuditLog(limit = 50, offset = 0) {
  return db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(limit)
    .offset(offset);
}

// ─── Cron Cleanup ───
export async function permanentlyDeleteExpiredItems() {
  const result = await db
    .delete(members)
    .where(
      and(
        eq(members.status, "deleted"),
        sql`${members.recoverableUntil} < NOW()`
      )
    )
    .returning({ id: members.id });
  return result.length;
}
