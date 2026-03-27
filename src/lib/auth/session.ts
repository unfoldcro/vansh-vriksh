import { getAuthFromCookie } from "./jwt";

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  isAdmin: boolean;
}

function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export async function getSession(): Promise<SessionUser | null> {
  const payload = await getAuthFromCookie();
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
    isAdmin: isAdminEmail(payload.email),
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (!session.isAdmin) {
    throw new Error("Forbidden");
  }
  return session;
}
