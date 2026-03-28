"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
import { OnboardingGuide } from "@/components/layout/OnboardingGuide";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { MemberModal } from "@/components/ui/MemberModal";
import FamilyTree from "@/components/tree/FamilyTree";
import { DEMO_MEMBERS, DEMO_TREE } from "@/lib/demo-data";
import type { Member, TreeMetadata } from "@/types";

type MobilePanel = "sidebar" | "tree";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [treeMeta, setTreeMeta] = useState<TreeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("sidebar");

  useEffect(() => {
    // Check demo mode
    const demoParam = new URLSearchParams(window.location.search).get("demo");
    const demoStored = localStorage.getItem("vansh-vriksh-demo");
    if (demoParam === "true" || demoStored === "true") {
      setIsDemo(true);
      setMembers(DEMO_MEMBERS);
      setTreeMeta(DEMO_TREE);
      setLoading(false);
      return;
    }

    if (authLoading) return;

    if (!user) {
      router.replace("/verify");
      return;
    }

    if (!user.treeId) {
      setLoading(false);
      router.replace("/profile");
      return;
    }

    loadData(user.treeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const loadData = async (treeId: string) => {
    try {
      const [membersRes, treeRes] = await Promise.all([
        api.get<{ members: Member[] }>(`/api/trees/${treeId}/members`),
        api.get<{ tree: TreeMetadata }>(`/api/trees/${treeId}`),
      ]);
      setMembers(membersRes.members || []);
      setTreeMeta(treeRes.tree || null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const exitDemo = () => {
    localStorage.removeItem("vansh-vriksh-demo");
    router.push("/verify");
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
  const familyLabel = t("stats.families") === "परिवार" ? "परिवार" : "Family";

  // Find self member for tree focus
  const selfMember = members.find(
    (m) => m.relation === "self" || (m.relationGroup === "self" && m.generationLevel === 0)
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      {/* ─── Top Bar ─── */}
      <div className="z-30 border-b border-border-warm bg-bg-card px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-rounded text-accent" style={{ fontSize: "24px" }}>park</span>
            <div>
              <h1 className="font-heading text-lg font-bold text-earth">
                {treeMeta?.familySurname} {familyLabel}
              </h1>
              <p className="text-xs text-earth/40">
                {treeMeta?.gotra} | {treeMeta?.village}, {treeMeta?.district}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {isDemo ? (
              <button onClick={exitDemo} className="rounded-btn border border-border-warm px-3 py-1.5 text-xs text-dark/50 hover:bg-bg-muted transition-colors">
                {t("common.back")}
              </button>
            ) : (
              <button onClick={signOut} className="rounded-btn border border-border-warm px-3 py-1.5 text-xs text-dark/50 hover:bg-bg-muted transition-colors">
                {t("dashboard.logout")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile panel toggle ─── */}
      <div className="lg:hidden flex border-b border-border-warm bg-bg-card">
        <button
          onClick={() => setMobilePanel("sidebar")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            mobilePanel === "sidebar" ? "border-b-2 border-accent text-accent" : "text-dark/40"
          }`}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>dashboard</span>
          Dashboard
        </button>
        <button
          onClick={() => setMobilePanel("tree")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            mobilePanel === "tree" ? "border-b-2 border-accent text-accent" : "text-dark/40"
          }`}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>account_tree</span>
          Tree View
        </button>
      </div>

      {/* ─── Split Layout ─── */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR (35%) ── */}
        <div className={`w-full lg:w-[35%] lg:border-r lg:border-border-warm overflow-y-auto ${
          mobilePanel === "sidebar" ? "block" : "hidden lg:block"
        }`}>
          <div className="p-4 space-y-4">
            {/* Demo Banner */}
            {isDemo && (
              <div className="rounded-card border-2 border-warning/30 bg-warning/5 px-4 py-3 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <span className="label-mono text-warning">{t("demo.badge")}</span>
                  <p className="flex-1 text-xs text-dark/60">{t("demo.banner")}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href="/verify" onClick={() => localStorage.removeItem("vansh-vriksh-demo")} className="btn-primary flex-1 text-center text-xs py-1.5">
                    {t("demo.createTree")}
                  </Link>
                  <Link href="/search" onClick={() => localStorage.removeItem("vansh-vriksh-demo")} className="rounded-btn border border-border-warm bg-white flex-1 text-center text-xs py-1.5 font-medium text-dark/60 hover:bg-bg-muted transition-colors">
                    {t("demo.joinExisting")}
                  </Link>
                </div>
              </div>
            )}

            {/* Onboarding Guide */}
            {!isDemo && <OnboardingGuide />}

            {/* Tree ID Badge */}
            <div className="flex items-center gap-2 rounded-card bg-bg-muted px-3 py-2">
              <span className="text-[10px] text-earth/40">ID:</span>
              <code className="font-mono text-xs font-bold text-accent">{treeMeta?.treeId}</code>
              <button
                onClick={() => navigator.clipboard.writeText(treeMeta?.treeId || "")}
                className="ml-auto"
              >
                <span className="material-symbols-rounded text-earth/30 hover:text-accent" style={{ fontSize: "14px" }}>content_copy</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <StatCard label={t("dashboard.members")} value={members.length} />
              <StatCard label={t("dashboard.generations")} value={treeMeta?.generations || 1} />
              <StatCard label={t("dashboard.living")} value={livingMembers.length} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link href="/member/add" className="card flex items-center gap-2 px-3 py-3 text-xs font-medium text-dark">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>person_add</span>
                {t("dashboard.addMember")}
              </Link>
              <Link href={`/tree/${treeMeta?.treeId}`} className="card flex items-center gap-2 px-3 py-3 text-xs font-medium text-dark">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>open_in_full</span>
                {t("dashboard.viewTree")}
              </Link>
              <Link href="/tree/list" className="card flex items-center gap-2 px-3 py-3 text-xs font-medium text-dark">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>list_alt</span>
                {t("dashboard.listView")}
              </Link>
              <a
                href={`https://wa.me/?text=${shareMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-2 px-3 py-3 text-xs font-medium text-dark hover:border-green-seva"
              >
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>share</span>
                {t("dashboard.shareWhatsApp")}
              </a>
            </div>

            {/* Members List */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-earth">{t("dashboard.familyMembers")}</h2>
                <Link href="/member/add" className="text-xs text-accent hover:underline">
                  + {t("dashboard.addMember")}
                </Link>
              </div>

              {members.length === 0 ? (
                <div className="mt-3 card border-dashed p-5 text-center">
                  <span className="material-symbols-rounded text-accent/40" style={{ fontSize: "32px" }}>group</span>
                  <p className="mt-2 text-xs text-dark/60">{t("dashboard.noMembers")}</p>
                  <Link href="/member/add" className="btn-primary mt-2 inline-block text-xs">
                    {t("dashboard.addFirst")}
                  </Link>
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {members.slice(0, 15).map((member) => (
                    <MemberCard key={member.id} member={member} onTap={setSelectedMember} />
                  ))}
                  {members.length > 15 && (
                    <Link href="/tree/list" className="block text-center text-xs text-accent hover:underline py-1">
                      {t("dashboard.more")} ({members.length - 15})
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* More Actions */}
            <div className="space-y-1.5">
              <Link
                href="/settings/recycle-bin"
                className="flex items-center gap-2 rounded-card border border-border-warm px-3 py-2.5 text-xs text-dark/60 hover:bg-bg-muted transition-colors"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>delete</span>
                {t("dashboard.recycleBinLink")}
              </Link>
              <Link
                href="/discover"
                className="flex items-center gap-2 rounded-card border border-border-warm px-3 py-2.5 text-xs text-dark/60 hover:bg-bg-muted transition-colors"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>travel_explore</span>
                {t("dashboard.discoverLink")}
              </Link>
            </div>

            {/* Deceased Section */}
            {deceasedMembers.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-earth">
                  <span className="material-symbols-rounded mr-1 align-middle text-dark/40" style={{ fontSize: "16px" }}>spa</span>
                  {t("member.deceased")} ({deceasedMembers.length})
                </h2>
                <div className="mt-2 space-y-1.5">
                  {deceasedMembers.map((member) => (
                    <MemberCard key={member.id} member={member} onTap={setSelectedMember} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: LIVE TREE (65%) ── */}
        <div className={`w-full lg:w-[65%] lg:block ${
          mobilePanel === "tree" ? "block" : "hidden lg:block"
        }`}>
          <div className="h-[calc(100vh-57px)] lg:h-[calc(100vh-57px)] overflow-auto bg-bg-muted/30">
            {members.length > 0 ? (
              <FamilyTree members={members} focusedMemberId={selfMember?.id} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-dark/30">
                <span className="material-symbols-rounded" style={{ fontSize: "48px" }}>park</span>
                <p className="mt-3 text-sm">{t("dashboard.noMembers")}</p>
                <Link href="/member/add" className="btn-primary mt-3 text-xs">
                  {t("dashboard.addFirst")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Modal */}
      {selectedMember && user?.treeId && (
        <MemberModal
          member={selectedMember}
          treeId={user.treeId}
          onClose={() => setSelectedMember(null)}
          onUpdated={(updated) => {
            setMembers((prev) => prev.map((m) => m.id === updated.id ? updated : m));
            setSelectedMember(null);
          }}
          onDeleted={(id) => {
            setMembers((prev) => prev.filter((m) => m.id !== id));
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-2 text-center">
      <div className="text-xl font-bold text-accent">{value}</div>
      <div className="text-[10px] text-dark/50">{label}</div>
    </div>
  );
}

function MemberCard({ member, onTap }: { member: Member; onTap: (m: Member) => void }) {
  const genderBg =
    member.gender === "male"
      ? "bg-card-male"
      : member.gender === "female"
        ? "bg-card-female"
        : "bg-card-other";

  return (
    <button
      onClick={() => onTap(member)}
      className={`w-full text-left flex items-center gap-2.5 rounded-card border border-border-warm px-3 py-2.5 transition-all hover:border-accent hover:-translate-y-0.5 ${
        !member.alive ? "bg-card-deceased/30" : genderBg + "/30"
      }`}
    >
      <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "20px" }}>
        {!member.alive ? "spa" : member.gender === "male" ? "person" : member.gender === "female" ? "face_3" : "person"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-earth">
          {member.name}
          {member.nameHi && <span className="ml-1 text-earth/50 text-xs">({member.nameHi})</span>}
        </p>
        <p className="text-[10px] text-earth/50">
          {member.relation} | Gen {member.generationLevel >= 0 ? "+" : ""}{member.generationLevel}
          {member.relationType !== "blood" && (
            <span className="ml-1 rounded bg-accent/20 px-1 text-[9px] text-accent">{member.relationType}</span>
          )}
        </p>
      </div>
    </button>
  );
}
