import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { discoverByGotra } from "@/lib/db/queries";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const gotra = searchParams.get("gotra") || "";
    const district = searchParams.get("district") || undefined;

    if (!gotra) return NextResponse.json({ results: [] });

    const results = await discoverByGotra(gotra, district);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
