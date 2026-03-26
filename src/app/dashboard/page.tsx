"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { getUser, getMembers, getTreeMetadata } from "@/lib/db";
import type { UserProfile, Member, TreeMetadata } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useTranslation();
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
        <div className="text-dark/60"><span className="loading-dot" />{t("common.loading")}</div>
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
              {treeMeta?.familySurname} {t("stats.families") === "परिवार" ? "परिवार" : "Family"}
            </h1>
            <p className="text-sm text-earth/50">
              {treeMeta?.gotra} {t("profile.gotra")} | {treeMeta?.village}, {treeMeta?.district}
            </p>
          </div>
          <button
            onClick={signOut}
            className="rounded-input border border-border-warm px-3 py-1.5 text-xs text-dark/50 hover:bg-bg-muted transition-colors"
          >
            {t("dashboard.logout")}
          </button>
        </div>

        {/* Tree ID Badge */}
        <div className="mt-4 flex items-center gap-2 rounded-input bg-bg-muted px-4 py-2">
          <span className="text-xs text-earth/50">{t("dashboard.treeId")}:</span>
          <code className="font-mono text-sm font-bold text-accent">{treeMeta?.treeId}</code>
          <button
            onClick={() => navigator.clipboard.writeText(treeMeta?.treeId || "")}
            className="ml-auto text-xs text-earth/40 hover:text-accent"
          >
            {t("dashboard.copy")}
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatCard label={t("dashboard.members")} value={members.length} />
          <StatCard label={t("dashboard.generations")} value={treeMeta?.generations || 1} />
          <StatCard label={t("dashboard.living")} value={livingMembers.length} />
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/member/add"
            className="card flex items-center gap-3 px-4 py-4 text-sm font-medium text-dark"
          >
            <span className="material-symbols-rounded icon-lg text-accent">person_add</span>
            {t("dashboard.addMember")}
          </Link>
          <Link
            href={`/tree/${treeMeta?.treeId}`}
            className="card flex items-center gap-3 px-4 py-4 text-sm font-medium text-dark"
          >
            <span className="material-symbols-rounded icon-lg text-accent">account_tree</span>
            {t("dashboard.viewTree")}
          </Link>
          <Link
            href="/tree/list"
            className="card flex items-center gap-3 px-4 py-4 text-sm font-medium text-dark"
          >
            <span className="material-symbols-rounded icon-lg text-accent">list_alt</span>
            {t("dashboard.listView")}
          </Link>
          <a
            href={`https://wa.me/?text=${shareMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-3 px-4 py-4 text-sm font-medium text-dark hover:border-green-seva"
          >
            <span className="material-symbols-rounded icon-lg text-accent">share</span>
            {t("dashboard.shareWhatsApp")}
          </a>
        </div>

        {/* Members Preview */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-earth">{t("dashboard.familyMembers")}</h2>
            <Link href="/member/add" className="text-sm text-accent hover:underline">
              + {t("dashboard.addMember")}
            </Link>
          </div>

          {members.length === 0 ? (
            <div className="mt-4 card border-dashed p-6 text-center">
              <span className="material-symbols-rounded icon-xl text-accent/40">group</span>
              <p className="mt-2 text-sm text-dark/60">
                {t("dashboard.noMembers")}
              </p>
              <Link
                href="/member/add"
                className="btn-primary mt-3 inline-block text-sm"
              >
                {t("dashboard.addFirst")}
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
                  {t("dashboard.more")} ({members.length - 10})
                </Link>
              )}
            </div>
          )}
        </div>

        {/* More Actions */}
        <div className="mt-6 space-y-2">
          <Link
            href="/settings/recycle-bin"
            className="flex items-center gap-3 rounded-card border border-border-warm px-4 py-3 text-sm text-dark/60 hover:bg-bg-muted transition-colors"
          >
            <span className="material-symbols-rounded icon-sm">delete</span>
            {t("dashboard.recycleBinLink")}
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-3 rounded-card border border-border-warm px-4 py-3 text-sm text-dark/60 hover:bg-bg-muted transition-colors"
          >
            <span className="material-symbols-rounded icon-sm">travel_explore</span>
            {t("dashboard.discoverLink")}
          </Link>
        </div>

        {/* Deceased Section */}
        {deceasedMembers.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-earth">
              <span className="material-symbols-rounded mr-1 align-middle text-dark/40" style={{ fontSize: "18px" }}>spa</span>
              {t("member.deceased")} ({deceasedMembers.length})
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
      <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "24px" }}>
        {!member.alive ? "spa" : member.gender === "male" ? "person" : member.gender === "female" ? "face_3" : "person"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-earth">
          {member.name}
          {member.nameHi && <span className="ml-1 text-earth/50">({member.nameHi})</span>}
        </p>
        <p className="text-xs text-earth/50">
          {member.relation} | Gen {member.generationLevel >= 0 ? "+" : ""}{member.generationLevel}
          {member.relationType !== "blood" && (
            <span className="ml-1 rounded bg-accent/20 px-1 text-[10px] text-accent">{member.relationType}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
