"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
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

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePasscode, setSharePasscode] = useState("");
  const [usePasscode, setUsePasscode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Passcode gate state (for public viewers)
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Scroll to the focused/self member card
  const scrollToSelf = useCallback(() => {
    if (!selfMemberId) return;
    const el = document.querySelector(`[data-member-id="${selfMemberId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      // Brief highlight flash
      el.classList.add("ring-4", "ring-accent/50");
      setTimeout(() => el.classList.remove("ring-4", "ring-accent/50"), 1500);
    }
  }, [selfMemberId]);

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
    try {
      const treeRes = await api.get<{ tree: TreeMetadata }>(`/api/trees/${treeId}`);
      const meta = treeRes.tree;
      if (!meta) { setLoading(false); return; }
      setTreeMeta(meta);

      // Load existing passcode for share modal
      if (meta.passcode) {
        setSharePasscode(meta.passcode);
        setUsePasscode(true);
      }

      if (user) {
        if (user.treeId === treeId) {
          setIsOwner(user.role === "owner");
          // Owner bypasses passcode
          setPasscodeUnlocked(true);
        }
        // Load members via API
        const membersRes = await api.get<{ members: Member[] }>(`/api/trees/${treeId}/members`);
        setMembers(membersRes.members || []);
        const selfMember = (membersRes.members || []).find(
          (m: Member) => m.relation === "self" || (m.relationGroup === "self" && m.generationLevel === 0)
        );
        if (selfMember) setSelfMemberId(selfMember.id);
      }
    } catch (err) {
      console.error("Failed to load tree:", err);
    }
    setLoading(false);
  };

  const treeUrl = `https://vansh-vriksh.unfoldcro.in/tree/${treeMeta?.treeId || treeId}`;

  const buildShareMessage = () => {
    if (!treeMeta) return "";
    let msg = `🌳 ${treeMeta.familySurname} ${t("share.shareMessage").replace("{family}", treeMeta.familySurname)}\n${treeUrl}`;
    if (usePasscode && sharePasscode.length === 4) {
      msg += `\n\n🔒 Passcode: ${sharePasscode}`;
    }
    return msg;
  };

  const handleShare = async () => {
    if (!treeMeta) return;
    // Save passcode via API
    if (!isDemoTreeId(treeId)) {
      try {
        await api.put(`/api/trees/${treeId}/passcode`, {
          passcode: usePasscode && sharePasscode.length === 4 ? sharePasscode : null,
        });
      } catch { /* ignore passcode save errors */ }
    }
    const msg = buildShareMessage();
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    setShowShareModal(false);
  };

  const handleCopyLink = async () => {
    let text = treeUrl;
    if (usePasscode && sharePasscode.length === 4) {
      text += `\n🔒 Passcode: ${sharePasscode}`;
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasscodeSubmit = () => {
    if (enteredPasscode === treeMeta?.passcode) {
      setPasscodeUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

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
        <p className="mt-2 text-earth/60">{t("common.error")}</p>
        <Link href="/search" className="btn-primary mt-4">
          {t("common.search")}
        </Link>
      </div>
    );
  }

  // ─── PASSCODE GATE (for public viewers when tree has passcode) ───
  if (!user && treeMeta.passcode && !passcodeUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
        <div className="w-full max-w-sm">
          <div className="card p-6 text-center">
            <span className="material-symbols-rounded text-accent" style={{ fontSize: "48px" }}>lock</span>
            <h1 className="mt-3 font-heading text-xl font-bold text-earth">
              {treeMeta.familySurname} {t("stats.families") === "परिवार" ? "परिवार" : "Family"}
            </h1>
            <p className="mt-2 text-sm text-earth/50">{t("share.enterPasscodeDesc")}</p>

            <div className="mt-6">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={enteredPasscode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setEnteredPasscode(val);
                  setPasscodeError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && enteredPasscode.length === 4 && handlePasscodeSubmit()}
                placeholder="● ● ● ●"
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
              />
              {passcodeError && (
                <p className="mt-2 text-sm text-error">{t("share.wrongPasscode")}</p>
              )}
            </div>

            <button
              onClick={handlePasscodeSubmit}
              disabled={enteredPasscode.length !== 4}
              className="btn-primary mt-4 w-full"
            >
              {t("share.unlock")}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-dark/30 hover:text-accent">
              Vansh-Vriksh.unfoldcro.in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── PUBLIC/SHARED VIEW (non-logged-in users) ───
  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary pb-16">
        {/* Minimal Header */}
        <div className="sticky top-0 z-30 border-b border-border-warm bg-bg-card px-4 py-3">
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

        {/* Sticky bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-warm bg-bg-card px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <p className="hidden sm:block text-xs text-dark/30">Vansh-Vriksh.unfoldcro.in</p>
            <div className="flex flex-1 sm:flex-none items-center gap-2">
              {selfMemberId && (
                <button
                  onClick={scrollToSelf}
                  className="flex items-center gap-1.5 rounded-btn border border-border-warm px-3 py-2 text-xs font-medium text-dark/50 transition-colors hover:bg-bg-muted"
                >
                  <span className="material-symbols-rounded text-accent" style={{ fontSize: "16px" }}>my_location</span>
                  Locate Me
                </button>
              )}
              <Link href="/verify" className="flex-1 sm:flex-none rounded-btn border border-border-warm px-4 py-2 text-center text-xs font-medium text-dark/50 transition-colors hover:bg-bg-muted">
                {t("landing.createTree")}
              </Link>
              <Link href={`/join/${treeId}`} className="flex-1 sm:flex-none btn-primary px-4 py-2 text-center text-xs">
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
    <div className="min-h-screen bg-bg-primary pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border-warm bg-bg-card px-4 py-4">
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
      <div className="sticky top-[106px] z-20 border-b border-border-warm bg-bg-card px-4 py-2">
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

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-warm bg-bg-card px-4 py-2.5 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
          {/* Locate Me */}
          {selfMemberId && (
            <button
              onClick={scrollToSelf}
              className="flex items-center gap-1.5 rounded-btn border border-border-warm px-3 py-2 text-xs font-medium text-dark/50 transition-colors hover:bg-bg-muted"
            >
              <span className="material-symbols-rounded text-accent" style={{ fontSize: "16px" }}>my_location</span>
              Locate Me
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Share (for owners) */}
            {isOwner && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 rounded-btn bg-green-seva px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-seva/90"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>share</span>
                {t("tree.share")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-md animate-fade-in-up rounded-t-2xl bg-bg-card p-6 shadow-xl sm:rounded-2xl sm:m-4">
            {/* Close */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute right-4 top-4 text-dark/30 hover:text-dark"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>close</span>
            </button>

            <h2 className="font-heading text-lg font-bold text-earth">{t("share.shareTree")}</h2>
            <p className="mt-1 text-xs text-earth/50">
              {treeMeta.familySurname} {t("stats.families") === "परिवार" ? "परिवार" : "Family"} — {treeMeta.gotra}
            </p>

            {/* Passcode Toggle */}
            <div className="mt-5 rounded-card border border-border-warm bg-bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-earth">{t("share.passcodeTitle")}</p>
                  <p className="text-xs text-earth/40">{t("share.passcodeDesc")}</p>
                </div>
                <button
                  onClick={() => setUsePasscode(!usePasscode)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    usePasscode ? "bg-accent" : "bg-dark/20"
                  }`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    usePasscode ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {usePasscode && (
                <div className="mt-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={sharePasscode}
                    onChange={(e) => setSharePasscode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder={t("share.passcodePlaceholder")}
                    className="input-field text-center text-xl tracking-[0.5em] font-mono"
                  />
                </div>
              )}
            </div>

            {/* Preview message */}
            <div className="mt-4 rounded-card border border-border-warm bg-white/50 p-3">
              <p className="text-xs text-dark/30 mb-1">Preview:</p>
              <p className="text-sm text-earth whitespace-pre-line">{buildShareMessage()}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleShare}
                disabled={usePasscode && sharePasscode.length !== 4}
                className="btn-primary flex w-full items-center justify-center gap-2 bg-green-seva hover:bg-green-seva/90"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>send</span>
                {t("share.shareOnWhatsApp")}
              </button>

              <button
                onClick={handleCopyLink}
                className="flex w-full items-center justify-center gap-2 rounded-btn border border-border-warm px-4 py-2.5 text-sm font-medium text-dark/60 transition-colors hover:bg-bg-muted"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                  {copied ? "check" : "content_copy"}
                </span>
                {copied ? t("share.copied") : t("dashboard.copy")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
