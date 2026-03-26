"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getTreeMetadata, getUser } from "@/lib/db";
import { createJoinRequest } from "@/lib/db-extra";
import { RELATIONS } from "@/lib/relations";
import type { TreeMetadata } from "@/types";

export default function JoinTreePage() {
  const params = useParams();
  const treeId = params.treeId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [treeMeta, setTreeMeta] = useState<TreeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [yourName, setYourName] = useState("");
  const [claimedRelation, setClaimedRelation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeId]);

  useEffect(() => {
    if (user) {
      getUser(user.uid).then((profile) => {
        if (profile?.fullName) setYourName(profile.fullName);
        if (profile?.treeId === treeId) {
          router.push("/dashboard");
        }
      });
    }
  }, [user, treeId, router]);

  const loadTree = async () => {
    const meta = await getTreeMetadata(treeId);
    setTreeMeta(meta);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push("/verify");
      return;
    }
    if (!yourName || !claimedRelation) {
      setError("कृपया सभी फ़ील्ड भरें / Please fill all fields");
      return;
    }

    try {
      await createJoinRequest(treeId, user.uid, yourName, claimedRelation);
      setSubmitted(true);
    } catch {
      setError("कुछ गलत हो गया / Something went wrong");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-earth/60">Loading...</div>
      </div>
    );
  }

  if (!treeMeta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4">
        <p className="text-earth/60">वृक्ष नहीं मिला / Tree not found</p>
        <Link href="/search" className="mt-4 text-gold hover:underline">खोजें / Search</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4">
        <div className="w-full max-w-md rounded-xl border border-border-warm bg-bg-card p-6 text-center shadow-sm">
          <div className="text-4xl">✅</div>
          <h2 className="mt-3 text-lg font-bold text-earth">अनुरोध भेजा गया!</h2>
          <p className="mt-2 text-sm text-earth/60">
            वृक्ष के मालिक को आपका अनुरोध मिल गया है। स्वीकृति के बाद आप जुड़ जाएंगे।
          </p>
          <p className="mt-1 text-sm text-earth/40">
            Your request has been sent. You&apos;ll be added once the tree owner approves.
          </p>
          <Link href="/" className="mt-4 btn-primary inline-block">
            होम / Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md">
        <Link href={`/tree/${treeId}`} className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          &larr; वृक्ष देखें / View Tree
        </Link>

        <div className="card p-6">
          <h1 className="font-hindi text-xl font-bold text-earth">
            वृक्ष में जुड़ें / Join Tree
          </h1>

          {/* Tree info */}
          <div className="mt-3 rounded-lg bg-bg-muted p-3">
            <p className="font-medium text-earth">{treeMeta.familySurname} परिवार</p>
            <p className="text-xs text-earth/50">
              {treeMeta.gotra} गोत्र | {treeMeta.village}, {treeMeta.district}
            </p>
          </div>

          {!user ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-earth/60">पहले सत्यापन करें / Verify first</p>
              <Link href="/verify" className="btn-primary mt-3 inline-block">
                सत्यापित करें / Verify
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">आपका नाम / Your Name <span className="text-error">*</span></span>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="input-field mt-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  आपका रिश्ता / Your Relation <span className="text-error">*</span>
                </span>
                <select
                  value={claimedRelation}
                  onChange={(e) => setClaimedRelation(e.target.value)}
                  className="input-field mt-1"
                >
                  <option value="">रिश्ता चुनें / Select</option>
                  {RELATIONS.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.labelHi} / {r.labelEn}
                    </option>
                  ))}
                </select>
              </label>

              {error && <p className="text-sm text-error">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!yourName || !claimedRelation}
                className="btn-primary w-full"
              >
                अनुरोध भेजें / Send Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
