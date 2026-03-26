"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { getTreeMetadata, getMembers, getUser } from "@/lib/db";
import { isDemoTreeId, DEMO_MEMBERS, DEMO_TREE } from "@/lib/demo-data";
import FamilyTree from "@/components/tree/FamilyTree";
import UltraLightTree from "@/components/tree/UltraLightTree";
import ShraddhView from "@/components/tree/ShraddhView";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import type { TreeMetadata, Member } from "@/types";

type ViewMode = "tree" | "ultralight" | "shraddh";

export default function TreeViewPage() {
  const params = useParams();
  const treeId = params.treeId as string;
  const { user } = useAuth();
  const { t } = useTranslation();
  const [treeMeta, setTreeMeta] = useState<TreeMetadata | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [isOwner, setIsOwner] = useState(false);
  const [selfMemberId, setSelfMemberId] = useState<string | undefined>();

  useEffect(() => {
    // Demo tree — load instantly, no Firestore
    if (isDemoTreeId(treeId)) {
      setTreeMeta(DEMO_TREE);
      setMembers(DEMO_MEMBERS);
      const selfMember = DEMO_MEMBERS.find((m) => m.relation === "self");
      if (selfMember) setSelfMemberId(selfMember.id);
      setLoading(false);
      return;
    }

    loadTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeId, user]);

  const loadTree = async () => {
    const meta = await getTreeMetadata(treeId);
    if (!meta) { setLoading(false); return; }
    setTreeMeta(meta);

    if (user) {
      const profile = await getUser(user.uid);
      if (profile?.treeId === treeId) {
        setIsOwner(profile.role === "owner");
        const memberList = await getMembers(user.uid);
        setMembers(memberList);
        const selfMember = memberList.find(
          (m) => m.relation === "self" || m.relationGroup === "self" && m.generationLevel === 0
        );
        if (selfMember) setSelfMemberId(selfMember.id);
      }
    }
    setLoading(false);
  };

  const shareMessage = treeMeta
    ? encodeURIComponent(
        `🌳 ${treeMeta.familySurname} परिवार का वंश वृक्ष देखें!\nhttps://vansh-vriksh.unfoldcro.in/tree/${treeMeta.treeId}`
      )
    : "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-earth/60">Loading...</div>
      </div>
    );
  }

  if (!treeMeta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4">
        <p className="text-2xl">🌳</p>
        <p className="mt-2 text-earth/60">यह वृक्ष नहीं मिला / Tree not found</p>
        <Link href="/search" className="btn-primary mt-4">
          खोजें / Search
        </Link>
      </div>
    );
  }

  // ─── PUBLIC/SHARED VIEW (non-logged-in users) ───
  // Clean, minimal — just the tree with a small header
  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary">
        {/* Minimal Header */}
        <div className="border-b border-border-warm bg-bg-card px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-rounded text-accent" style={{ fontSize: "24px" }}>park</span>
              <div>
                <h1 className="font-heading text-lg font-bold text-earth">
                  {treeMeta.familySurname} {t("stats.families") === "परिवार" ? "परिवार" : "Family"}
                </h1>
                <p className="text-xs text-earth/40">
                  {treeMeta.gotra} | {treeMeta.village}, {treeMeta.district}
                </p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>

        {/* Tree Only */}
        <div className="mx-auto max-w-4xl px-4 py-6">
          {members.length > 0 ? (
            <FamilyTree members={members} focusedMemberId={selfMemberId} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-earth/50">{t("common.loading")}</p>
            </div>
          )}
        </div>

        {/* Small footer with CTAs */}
        <div className="border-t border-border-warm bg-bg-card px-4 py-4">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <p className="text-xs text-dark/30">Vansh-Vriksh.unfoldcro.in</p>
            <div className="flex gap-2">
              <Link href="/verify" className="rounded-btn border border-border-warm px-4 py-2 text-xs font-medium text-dark/50 transition-colors hover:bg-bg-muted">
                {t("landing.createTree")}
              </Link>
              <Link href={`/join/${treeId}`} className="btn-primary px-4 py-2 text-xs">
                {t("tree.joinTree")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGGED-IN VIEW (full experience) ───
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border-warm bg-bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-sm text-earth/50 hover:text-gold">
              &larr; {t("nav.dashboard")}
            </Link>
            <LanguageToggle />
          </div>
          <h1 className="mt-2 font-heading text-2xl font-bold text-earth">
            {treeMeta.familySurname} {t("stats.families") === "परिवार" ? "परिवार" : "Family"}
          </h1>
          <p className="text-sm text-earth/50">
            {treeMeta.gotra} | {treeMeta.village}, {treeMeta.district}, {treeMeta.state}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-earth/40">
            <span>{treeMeta.totalMembers} {t("dashboard.members")}</span>
            <span>{treeMeta.generations} {t("dashboard.generations")}</span>
            <span>ID: {treeMeta.treeId}</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="border-b border-border-warm bg-bg-card px-4 py-2">
        <div className="mx-auto flex max-w-4xl gap-1">
          {([
            { key: "tree" as ViewMode, icon: "account_tree", label: "वृक्ष / Tree" },
            { key: "ultralight" as ViewMode, icon: "format_list_bulleted", label: "हल्का / Light" },
            { key: "shraddh" as ViewMode, icon: "self_improvement", label: "श्राद्ध / Shraddh" },
          ]).map((v) => (
            <button
              key={v.key}
              onClick={() => setViewMode(v.key)}
              className={`flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === v.key
                  ? "bg-accent text-white"
                  : "text-dark/50 hover:bg-bg-muted"
              }`}
            >
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tree Content */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {members.length > 0 ? (
          <>
            {viewMode === "tree" && <FamilyTree members={members} focusedMemberId={selfMemberId} />}
            {viewMode === "ultralight" && <UltraLightTree members={members} />}
            {viewMode === "shraddh" && <ShraddhView members={members} />}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-earth/50">{t("common.loading")}</p>
          </div>
        )}
      </div>

      {/* Share FAB (for owners) */}
      {isOwner && (
        <a
          href={`https://wa.me/?text=${shareMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-seva text-2xl text-white shadow-lg"
        >
          📤
        </a>
      )}
    </div>
  );
}
