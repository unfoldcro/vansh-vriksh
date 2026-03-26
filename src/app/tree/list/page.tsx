"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUser, getMembers, softDeleteMember } from "@/lib/db";
import { getRelationConfig } from "@/lib/relations";
import type { Member, UserProfile } from "@/types";

type SortKey = "name" | "generation" | "dateAdded";
type FilterGen = "all" | "-3" | "-2" | "-1" | "0" | "1" | "2" | "3";

export default function ListViewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("generation");
  const [filterGen, setFilterGen] = useState<FilterGen>("all");
  const [filterAlive, setFilterAlive] = useState<"all" | "living" | "deceased">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/verify"); return; }
    if (user) loadData(user.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const loadData = async (uid: string) => {
    const p = await getUser(uid);
    if (!p?.treeId) { router.push("/profile"); return; }
    setProfile(p);
    const m = await getMembers(uid);
    setMembers(m);
    setLoading(false);
  };

  const isOwner = profile?.role === "owner";

  const filtered = useMemo(() => {
    let list = [...members];

    if (search) {
      const s = search.toLowerCase();
      list = list.filter((m) =>
        m.name.toLowerCase().includes(s) ||
        (m.nameHi && m.nameHi.includes(s)) ||
        m.relation.toLowerCase().includes(s)
      );
    }

    if (filterGen !== "all") {
      list = list.filter((m) => m.generationLevel === parseInt(filterGen));
    }

    if (filterAlive === "living") list = list.filter((m) => m.alive);
    if (filterAlive === "deceased") list = list.filter((m) => !m.alive);

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "generation") return a.generationLevel - b.generationLevel;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [members, search, sortBy, filterGen, filterAlive]);

  const handleDelete = async (memberId: string) => {
    if (!user) return;
    await softDeleteMember(user.uid, memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setDeleteConfirm(null);
  };

  const genLabels: Record<string, string> = {
    "-3": "परदादा-परदादी", "-2": "दादा-दादी/नाना-नानी",
    "-1": "माता-पिता/ताऊ-चाचा", "0": "स्वयं/भाई-बहन",
    "1": "संतान", "2": "पोता-पोती", "3": "परपोता-परपोती",
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-earth/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-4 inline-block text-sm text-earth/50 hover:text-gold">
          &larr; डैशबोर्ड / Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="font-hindi text-2xl font-bold text-earth">
            सदस्य सूची / Member List
          </h1>
          <span className="rounded-full bg-bg-muted px-3 py-1 text-sm text-earth/60">
            {filtered.length} / {members.length}
          </span>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="खोजें — नाम, रिश्ता / Search..."
          className="mt-4 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />

        {/* Filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-border-warm bg-bg-card px-3 py-1.5 text-xs text-earth">
            <option value="generation">Sort: Generation</option>
            <option value="name">Sort: Name</option>
            <option value="dateAdded">Sort: Date Added</option>
          </select>
          <select value={filterGen} onChange={(e) => setFilterGen(e.target.value as FilterGen)}
            className="rounded-lg border border-border-warm bg-bg-card px-3 py-1.5 text-xs text-earth">
            <option value="all">All Generations</option>
            {Object.entries(genLabels).map(([k, v]) => (
              <option key={k} value={k}>Gen {k}: {v}</option>
            ))}
          </select>
          <select value={filterAlive} onChange={(e) => setFilterAlive(e.target.value as "all" | "living" | "deceased")}
            className="rounded-lg border border-border-warm bg-bg-card px-3 py-1.5 text-xs text-earth">
            <option value="all">All Status</option>
            <option value="living">Living</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>

        {/* Member List */}
        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-earth/40">कोई सदस्य नहीं मिला / No members found</p>
          ) : (
            filtered.map((member) => {
              const rel = getRelationConfig(member.relation);
              const genderBg = member.gender === "male" ? "bg-card-male/30" :
                member.gender === "female" ? "bg-card-female/30" : "bg-card-other/30";

              return (
                <div key={member.id}
                  className={`rounded-lg border border-border-warm p-4 ${!member.alive ? "bg-card-deceased/20" : genderBg}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-earth">
                        {!member.alive && "🕊 "}
                        {member.name}
                        {member.nameHi && <span className="ml-1 text-earth/50">({member.nameHi})</span>}
                      </p>
                      <p className="text-xs text-earth/50">
                        {rel?.labelHi || member.relation} | Gen {member.generationLevel >= 0 ? "+" : ""}{member.generationLevel}
                        {member.relationType !== "blood" && (
                          <span className="ml-1 rounded bg-gold/20 px-1 text-[10px] text-gold">{member.relationType}</span>
                        )}
                        {member.occupation && <span className="ml-2">{member.occupation}</span>}
                      </p>
                    </div>

                    {/* Actions - role based */}
                    {(isOwner || member.addedBy === user?.uid) && member.relation !== "self" && (
                      <div className="flex gap-1">
                        <Link href={`/member/edit/${member.id}`}
                          className="rounded px-2 py-1 text-xs text-earth/50 hover:bg-bg-muted hover:text-earth">
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(member.id)}
                          className="rounded px-2 py-1 text-xs text-error/60 hover:bg-error/10 hover:text-error">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Member FAB */}
        <Link href="/member/add"
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-earth shadow-lg hover:bg-gold/90">
          +
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-bg-card p-6 shadow-xl">
            <h3 className="font-bold text-earth">क्या आप पक्के हैं? / Are you sure?</h3>
            <p className="mt-2 text-sm text-earth/60">
              30 दिन तक रीसायकल बिन से रिकवर कर सकते हैं।
              <br />You can recover within 30 days from Recycle Bin.
            </p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-border-warm px-4 py-2 text-sm text-earth hover:bg-bg-muted">
                रद्द / Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white hover:bg-error/90">
                हटाएं / Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
