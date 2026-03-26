"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUser, getMembers, getTreeMetadata } from "@/lib/db";
import type { UserProfile, Member, TreeMetadata } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  // Used for role checks (owner vs branch_editor)
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [treeMeta, setTreeMeta] = useState<TreeMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/verify");
      return;
    }
    if (user) {
      loadData(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const loadData = async (uid: string) => {
    const profile = await getUser(uid);
    if (!profile) {
      router.push("/profile");
      return;
    }
    if (!profile.treeId) {
      router.push("/profile");
      return;
    }
    setUserProfile(profile);

    const [memberList, metadata] = await Promise.all([
      getMembers(uid),
      getTreeMetadata(profile.treeId),
    ]);
    setMembers(memberList);
    setTreeMeta(metadata);
    setLoading(false);
  };

  const shareMessage = treeMeta
    ? encodeURIComponent(
        `🌳 ${treeMeta.familySurname} परिवार का वंश वृक्ष देखें!\n${treeMeta.familySurname} Family Tree\nhttps://vansh-vriksh.unfoldcro.in/tree/${treeMeta.treeId}`
      )
    : "";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-dark/60"><span className="loading-dot" />Loading...</div>
      </div>
    );
  }

  const livingMembers = members.filter((m) => m.alive);
  const deceasedMembers = members.filter((m) => !m.alive);

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-hindi text-2xl font-bold text-earth">
              {treeMeta?.familySurname} परिवार
            </h1>
            <p className="text-sm text-earth/50">
              {treeMeta?.gotra} गोत्र | {treeMeta?.village}, {treeMeta?.district}
            </p>
          </div>
          <button
            onClick={signOut}
            className="rounded-input border border-border-warm px-3 py-1.5 text-xs text-dark/50 hover:bg-bg-muted transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tree ID Badge */}
        <div className="mt-4 flex items-center gap-2 rounded-input bg-bg-muted px-4 py-2">
          <span className="text-xs text-earth/50">Tree ID:</span>
          <code className="font-mono text-sm font-bold text-accent">{treeMeta?.treeId}</code>
          <button
            onClick={() => navigator.clipboard.writeText(treeMeta?.treeId || "")}
            className="ml-auto text-xs text-earth/40 hover:text-accent"
          >
            Copy
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatCard label="सदस्य / Members" value={members.length} />
          <StatCard label="पीढ़ी / Generations" value={treeMeta?.generations || 1} />
          <StatCard label="जीवित / Living" value={livingMembers.length} />
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/member/add"
            className="card flex items-center gap-2 px-4 py-4 text-sm font-medium text-dark"
          >
            <span className="text-xl">+</span>
            सदस्य जोड़ें / Add Member
          </Link>
          <Link
            href={`/tree/${treeMeta?.treeId}`}
            className="card flex items-center gap-2 px-4 py-4 text-sm font-medium text-dark"
          >
            <span className="text-xl">🌳</span>
            वृक्ष देखें / View Tree
          </Link>
          <Link
            href="/tree/list"
            className="card flex items-center gap-2 px-4 py-4 text-sm font-medium text-dark"
          >
            <span className="text-xl">📋</span>
            सूची / List View
          </Link>
          <a
            href={`https://wa.me/?text=${shareMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-2 px-4 py-4 text-sm font-medium text-dark hover:border-green-seva"
          >
            <span className="text-xl">📤</span>
            WhatsApp पर भेजें / Share
          </a>
        </div>

        {/* Members Preview */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-earth">परिवार के सदस्य / Family Members</h2>
            <Link href="/member/add" className="text-sm text-accent hover:underline">
              + जोड़ें
            </Link>
          </div>

          {members.length === 0 ? (
            <div className="mt-4 card border-dashed p-6 text-center">
              <p className="text-2xl">👨‍👩‍👧‍👦</p>
              <p className="mt-2 text-sm text-dark/60">
                अभी कोई सदस्य नहीं — पहले परिवार जोड़ें!
              </p>
              <Link
                href="/member/add"
                className="btn-primary mt-3 inline-block text-sm"
              >
                पहला सदस्य जोड़ें / Add First Member
              </Link>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {members.slice(0, 10).map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
              {members.length > 10 && (
                <Link
                  href="/tree/list"
                  className="block text-center text-sm text-accent hover:underline"
                >
                  और {members.length - 10} सदस्य देखें / View {members.length - 10} more
                </Link>
              )}
            </div>
          )}
        </div>

        {/* More Actions */}
        <div className="mt-6 space-y-2">
          <Link
            href="/settings/recycle-bin"
            className="block rounded-card border border-border-warm px-4 py-3 text-sm text-dark/60 hover:bg-bg-muted transition-colors"
          >
            🗑 रीसायकल बिन / Recycle Bin
          </Link>
          <Link
            href="/discover"
            className="block rounded-card border border-border-warm px-4 py-3 text-sm text-dark/60 hover:bg-bg-muted transition-colors"
          >
            🔍 गोत्र खोजें / Gotra Discovery
          </Link>
        </div>

        {/* Deceased Section */}
        {deceasedMembers.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-earth">
              🕊 स्वर्गवासी / Deceased ({deceasedMembers.length})
            </h2>
            <div className="mt-3 space-y-2">
              {deceasedMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-2xl font-bold text-accent">{value}</div>
      <div className="text-xs text-dark/50">{label}</div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const genderBg =
    member.gender === "male"
      ? "bg-card-male"
      : member.gender === "female"
        ? "bg-card-female"
        : "bg-card-other";

  return (
    <Link
      href={`/member/${member.id}`}
      className={`flex items-center gap-3 rounded-card border border-border-warm px-4 py-3 transition-all hover:border-accent hover:-translate-y-0.5 ${
        !member.alive ? "bg-card-deceased/30" : genderBg + "/30"
      }`}
    >
      <span className="text-lg">
        {!member.alive ? "🕊" : member.gender === "male" ? "👤" : member.gender === "female" ? "👩" : "🧑"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-earth">
          {member.name}
          {member.nameHi && <span className="ml-1 text-earth/50">({member.nameHi})</span>}
        </p>
        <p className="text-xs text-earth/50">
          {member.relation} | Gen {member.generationLevel >= 0 ? "+" : ""}{member.generationLevel}
          {member.relationType !== "blood" && (
            <span className="ml-1 rounded bg-gold/20 px-1 text-[10px] text-accent">{member.relationType}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
