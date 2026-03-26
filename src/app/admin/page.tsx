"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

interface Stats {
  totalTrees: number;
  totalMembers: number;
  pendingJoinRequests: number;
  pendingConnections: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalTrees: 0, totalMembers: 0, pendingJoinRequests: 0, pendingConnections: 0 });

  useEffect(() => {
    if (!authLoading && !user) { router.push("/verify"); return; }
    if (user) checkAdmin(user.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const checkAdmin = async (uid: string) => {
    // Check admins collection
    const adminDoc = await getDoc(doc(db, "admins", uid));
    if (!adminDoc.exists()) {
      // Also check env-based admin UIDs
      const adminUids = process.env.NEXT_PUBLIC_ADMIN_UIDS?.split(",") || [];
      if (!adminUids.includes(uid)) {
        router.push("/dashboard");
        return;
      }
    }
    setIsAdmin(true);
    await loadStats();
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const treesSnap = await getDocs(query(collection(db, "tree-metadata"), where("status", "==", "active")));
      const joinSnap = await getDocs(query(collection(db, "join-requests"), where("status", "==", "pending")));
      const connSnap = await getDocs(query(collection(db, "connections"), where("status", "==", "pending")));

      let totalMembers = 0;
      treesSnap.forEach((d) => { totalMembers += (d.data().totalMembers || 0); });

      setStats({
        totalTrees: treesSnap.size,
        totalMembers,
        pendingJoinRequests: joinSnap.size,
        pendingConnections: connSnap.size,
      });
    } catch {
      // Stats may fail if collections don't exist yet
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-earth/60">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          &larr; डैशबोर्ड / Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-earth">Admin Panel</h1>
        <p className="mt-1 text-sm text-earth/50">
          Platform-level management — no personal data visible
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border-warm bg-bg-card p-4 text-center">
            <div className="text-3xl font-bold text-gold">{stats.totalTrees}</div>
            <div className="text-xs text-earth/50">Active Trees</div>
          </div>
          <div className="rounded-xl border border-border-warm bg-bg-card p-4 text-center">
            <div className="text-3xl font-bold text-gold">{stats.totalMembers}</div>
            <div className="text-xs text-earth/50">Total Members</div>
          </div>
          <div className="rounded-xl border border-border-warm bg-bg-card p-4 text-center">
            <div className="text-3xl font-bold text-warning">{stats.pendingJoinRequests}</div>
            <div className="text-xs text-earth/50">Pending Join Requests</div>
          </div>
          <div className="rounded-xl border border-border-warm bg-bg-card p-4 text-center">
            <div className="text-3xl font-bold text-info">{stats.pendingConnections}</div>
            <div className="text-xs text-earth/50">Pending Connections</div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-6 space-y-3">
          <h2 className="font-bold text-earth">Actions</h2>
          <p className="text-xs text-earth/40">
            Admin cannot see: names, DOBs, phone numbers, gotra, personal data.
            Only metadata and action types are visible.
          </p>

          <div className="space-y-2">
            {[
              { label: "View All Trees", desc: "Browse tree metadata (ID, district, member count)", href: "#" },
              { label: "Pending Join Requests", desc: "Review and manage pending requests", href: "#" },
              { label: "Pending Connections", desc: "Cross-tree marriage connection requests", href: "#" },
              { label: "Merge History", desc: "All merges with undo option", href: "#" },
              { label: "Global Recycle Bin", desc: "All deleted items (metadata only)", href: "#" },
            ].map((action) => (
              <div
                key={action.label}
                className="rounded-lg border border-border-warm bg-bg-card px-4 py-3"
              >
                <p className="font-medium text-earth">{action.label}</p>
                <p className="text-xs text-earth/40">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
