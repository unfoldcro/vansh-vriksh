"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/lib/db";
import { discoverByGotra } from "@/lib/db-extra";
import { GOTRAS, MP_DISTRICTS } from "@/lib/data";
import TreePreviewCard from "@/components/tree/TreePreviewCard";
import type { TreeMetadata } from "@/types";

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userGotra, setUserGotra] = useState("");
  const [gotra, setGotra] = useState("");
  const [district, setDistrict] = useState("");
  const [results, setResults] = useState<TreeMetadata[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/verify"); return; }
    if (user) {
      getUser(user.uid).then((p) => {
        if (p?.gotra) {
          setUserGotra(p.gotra);
          setGotra(p.gotra);
        }
      });
    }
  }, [user, authLoading, router]);

  const handleSearch = async () => {
    if (!gotra) return;
    setSearching(true);
    const trees = await discoverByGotra(gotra, district || undefined);
    setResults(trees);
    setSearched(true);
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-earth/50 hover:text-accent">
          &larr; डैशबोर्ड / Dashboard
        </Link>

        <h1 className="font-hindi text-2xl font-bold text-earth">
          🔍 गोत्र खोज / Gotra Discovery
        </h1>
        <p className="mt-1 text-sm text-earth/50">
          अपने गोत्र के अन्य परिवार खोजें / Find other families of your gotra
        </p>

        {userGotra && (
          <p className="mt-2 text-xs text-earth/40">
            आपका गोत्र: <span className="font-medium text-accent">{userGotra}</span>
            {" "}— केवल समान गोत्र के वृक्ष दिखेंगे / Only same-gotra trees shown
          </p>
        )}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-earth">गोत्र / Gotra</span>
            <select
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              className="input-field mt-1"
            >
              <option value="">गोत्र चुनें</option>
              {GOTRAS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-earth">जिला / District (Optional)</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input-field mt-1"
            >
              <option value="">सभी जिले / All Districts</option>
              {MP_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>

          <button
            onClick={handleSearch}
            disabled={!gotra || searching}
            className="btn-primary w-full"
          >
            {searching ? "खोज रहे हैं..." : "खोजें / Search"}
          </button>
        </div>

        {searched && (
          <div className="mt-6">
            {results.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-earth/60">{results.length} परिवार मिले / families found</p>
                {results.map((tree) => (
                  <TreePreviewCard key={tree.treeId} tree={tree} />
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center">
                <p className="text-earth/50">कोई परिवार नहीं मिला / No families found</p>
                <p className="mt-1 text-sm text-earth/40">
                  दूसरे जिले में खोजें या अपना वृक्ष बढ़ाएं
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
