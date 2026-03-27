import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/db/queries";

export async function GET() {
  try {
    const payload = await getAuthFromCookie();
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await getUserById(payload.sub);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        fullNameHi: user.fullNameHi,
        role: user.role,
        treeId: user.treeId,
        gotra: user.gotra,
        village: user.village,
        district: user.district,
        state: user.state,
        isAdmin: adminEmails.includes((user.email || "").toLowerCase()),
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
