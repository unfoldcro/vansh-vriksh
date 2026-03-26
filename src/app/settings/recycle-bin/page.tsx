"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { recoverMember } from "@/lib/db";
import { getDeletedMembers } from "@/lib/db-extra";

interface DeletedItem {
  id: string;
  name?: string;
  relation?: string;
  deletedAt?: string;
  recoverableUntil?: string;
  [key: string]: unknown;
}

export default function RecycleBinPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/verify"); return; }
    if (user) loadData(user.uid);
  }, [user, authLoading, router]);

  const loadData = async (uid: string) => {
    const deleted = await getDeletedMembers(uid);
    setItems(deleted as DeletedItem[]);
    setLoading(false);
  };

  const handleRecover = async (memberId: string) => {
    if (!user) return;
    await recoverMember(user.uid, memberId);
    setItems((prev) => prev.filter((i) => i.id !== memberId));
  };

  const getDaysLeft = (recoverableUntil?: string): number => {
    if (!recoverableUntil) return 0;
    const diff = new Date(recoverableUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-earth/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          &larr; डैशबोर्ड / Dashboard
        </Link>

        <h1 className="font-hindi text-2xl font-bold text-earth">
          🗑 रीसायकल बिन / Recycle Bin
        </h1>
        <p className="mt-1 text-sm text-earth/50">
          30 दिन तक रिकवर करें / Recover within 30 days
        </p>

        {items.length === 0 ? (
          <div className="mt-8 card p-8 text-center">
            <p className="text-2xl">🗑</p>
            <p className="mt-2 text-earth/50">खाली है / Empty</p>
            <p className="mt-1 text-sm text-earth/40">
              कोई हटाया गया सदस्य नहीं / No deleted members
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((item) => {
              const daysLeft = getDaysLeft(item.recoverableUntil);
              return (
                <div
                  key={item.id}
                  className="card flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-earth">{item.name || "Unknown"}</p>
                    <p className="text-xs text-earth/50">{item.relation || "Member"}</p>
                    <p className={`text-xs ${daysLeft <= 5 ? "text-error" : "text-earth/40"}`}>
                      {daysLeft > 0 ? `${daysLeft} दिन बाकी / ${daysLeft} days left` : "Expired"}
                    </p>
                  </div>
                  {daysLeft > 0 && (
                    <button
                      onClick={() => handleRecover(item.id)}
                      className="rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success hover:bg-success/20"
                    >
                      रिकवर / Recover
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
