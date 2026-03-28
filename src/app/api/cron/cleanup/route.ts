import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { members, marriages } from "@/lib/db/schema";
import { eq, and, lt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Permanently delete members past their 30-day recovery window
    const deletedMembers = await db
      .delete(members)
      .where(
        and(
          eq(members.status, "deleted"),
          lt(members.recoverableUntil, now)
        )
      )
      .returning({ id: members.id });

    // Permanently delete marriages past their recovery window
    const deletedMarriages = await db
      .delete(marriages)
      .where(eq(marriages.status, "deleted"))
      .returning({ id: marriages.id });

    return NextResponse.json({
      success: true,
      permanentlyDeleted: {
        members: deletedMembers.length,
        marriages: deletedMarriages.length,
      },
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error("Cleanup cron error:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
