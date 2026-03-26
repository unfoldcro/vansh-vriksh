import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // TODO: Implement with Firebase Admin SDK for server-side deletion
    // Query: status=='deleted' AND recoverableUntil < now
    // Then permanently delete those documents

    return NextResponse.json({
      success: true,
      message: `Cleanup check completed at ${now}.`,
      timestamp: now,
    });
  } catch {
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
