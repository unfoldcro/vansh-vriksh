"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getTreeMetadata, getMembers, getUser } from "@/lib/db";
import FamilyTree from "@/components/tree/FamilyTree";
import UltraLightTree from "@/components/tree/UltraLightTree";
import ShraddhView from "@/components/tree/ShraddhView";
import type { TreeMetadata, Member } from "@/types";

type ViewMode = "tree" | "ultralight" | "shraddh";

export default function TreeViewPage() {
  const params = useParams();
  const treeId = params.treeId as string;
  const { user } = useAuth();
  const [treeMeta, setTreeMeta] = useState<TreeMetadata | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border-warm bg-bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link href={user ? "/dashboard" : "/"} className="text-sm text-earth/50 hover:text-gold">
            &larr; {user ? "डैशबोर्ड" : "होम"} / {user ? "Dashboard" : "Home"}
          </Link>
          <h1 className="mt-2 font-hindi text-2xl font-bold text-earth">
            🌳 {treeMeta.familySurname} परिवार
          </h1>
          <p className="text-sm text-earth/50">
            {treeMeta.gotra} गोत्र | {treeMeta.village}, {treeMeta.district}, {treeMeta.state}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-earth/40">
            <span>{treeMeta.totalMembers} सदस्य</span>
            <span>{treeMeta.generations} पीढ़ी</span>
            <span>ID: {treeMeta.treeId}</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="border-b border-border-warm bg-bg-card px-4 py-2">
        <div className="mx-auto flex max-w-4xl gap-1">
          {([
            { key: "tree" as ViewMode, label: "🌳 वृक्ष / Tree" },
            { key: "ultralight" as ViewMode, label: "📝 हल्का / Light" },
            { key: "shraddh" as ViewMode, label: "🙏 श्राद्ध / Shraddh" },
          ]).map((v) => (
            <button
              key={v.key}
              onClick={() => setViewMode(v.key)}
              className={`rounded-btn px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === v.key
                  ? "bg-accent text-white"
                  : "text-dark/50 hover:bg-bg-muted"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tree Content */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {members.length > 0 ? (
          <>
            {viewMode === "tree" && <FamilyTree members={members} />}
            {viewMode === "ultralight" && <UltraLightTree members={members} />}
            {viewMode === "shraddh" && <ShraddhView members={members} />}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-earth/50">
              {user ? "अभी कोई सदस्य नहीं" : "वृक्ष देखने के लिए लॉगिन करें"}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Bar (for non-logged-in users) */}
      {!user && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border-warm bg-bg-card px-4 py-3">
          <div className="mx-auto flex max-w-4xl gap-3">
            <Link href="/" className="btn-ghost flex-1 text-center text-sm">
              बस देख रहे हैं / Just Browsing
            </Link>
            <Link href={`/join/${treeId}`} className="btn-primary flex-1 text-center text-sm">
              इस वृक्ष में जुड़ें / Join This Tree
            </Link>
          </div>
        </div>
      )}

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
