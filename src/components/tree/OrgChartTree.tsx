"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ────────────────────────────── Types ────────────────────────────── */

export interface OrgMember {
  id: string;
  name: string;
  nameHi?: string;
  relation: string;
  relationHi?: string;
  gender: "male" | "female" | "other";
  alive?: boolean;
  deceased?: boolean;
  nee?: string;
  gen: number;
  relationType?: "blood" | "marriage" | "adopted" | "step" | "dharma";
  dob?: string;
  occupation?: string;
  deathYear?: number;
  spouseOf?: string; // id of spouse to draw marriage lines
}

interface OrgChartTreeProps {
  members: OrgMember[];
  focusedMemberId?: string; // logged-in user's member id
  onMemberTap?: (member: OrgMember) => void;
  isDemo?: boolean; // landing page demo mode
  className?: string;
}

/* ──────────────────────── Generation labels ──────────────────────── */

const GEN_LABELS: Record<number, { hi: string; en: string }> = {
  [-3]: { hi: "परदादा-परदादी", en: "Great-Grandparents" },
  [-2]: { hi: "दादा-दादी", en: "Grandparents" },
  [-1]: { hi: "माता-पिता", en: "Parents" },
  [0]: { hi: "स्वयं", en: "Self" },
  [1]: { hi: "संतान", en: "Children" },
  [2]: { hi: "पोता-पोती", en: "Grandchildren" },
  [3]: { hi: "परपोता-परपोती", en: "Great-Grandchildren" },
};

/* ────────────────────────── Member Card ──────────────────────────── */

function MemberNode({
  member,
  isFocused,
  isHighlighted,
  isExpanded,
  onTap,
}: {
  member: OrgMember;
  isFocused: boolean;
  isHighlighted: boolean;
  isExpanded: boolean;
  onTap: () => void;
}) {
  const isDeceased = member.deceased || member.alive === false;
  const bgColor = isDeceased
    ? "bg-card-deceased/50"
    : member.gender === "male"
      ? "bg-card-male"
      : member.gender === "female"
        ? "bg-card-female"
        : "bg-card-other";

  return (
    <button
      onClick={onTap}
      data-member-id={member.id}
      className={`
        group relative w-[140px] rounded-card border-2 p-3 text-left
        transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
        ${bgColor}
        ${isFocused
          ? "border-accent ring-2 ring-accent/30 shadow-lg shadow-accent/10"
          : isHighlighted
            ? "border-accent/50 ring-1 ring-accent/20"
            : "border-border-warm"
        }
        ${isExpanded ? "shadow-md" : ""}
      `}
    >
      {/* Badges row */}
      <div className="flex items-center gap-1">
        {isDeceased && (
          <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "14px" }}>
            spa
          </span>
        )}
        {member.relationType === "adopted" && (
          <span className="rounded bg-accent/20 px-1 text-[9px] font-bold text-accent">दत्तक</span>
        )}
        {member.relationType === "step" && (
          <span className="rounded bg-warning/20 px-1 text-[9px] font-bold text-warning">सौतेला</span>
        )}
        {isFocused && (
          <span className="ml-auto rounded-full bg-accent px-1.5 text-[8px] font-bold text-white">YOU</span>
        )}
      </div>

      {/* Name */}
      <p className="mt-1 truncate text-sm font-bold text-dark">
        {member.nameHi || member.name}
      </p>
      <p className="truncate text-[11px] text-dark/50">
        {member.nameHi ? member.name : ""}
      </p>

      {/* Née tag */}
      {member.nee && (
        <p className="truncate text-[10px] italic text-dark/40">née {member.nee}</p>
      )}

      {/* Relation */}
      <p className="mt-1 text-[11px] font-semibold text-accent">
        {member.relationHi || member.relation}
      </p>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-2 space-y-0.5 border-t border-dark/10 pt-2 text-[10px] text-dark/50">
          {isDeceased ? (
            <p className="flex items-center gap-1">
              <span className="material-symbols-rounded" style={{ fontSize: "12px" }}>spa</span>
              स्वर्गवासी {member.deathYear ? `(${member.deathYear})` : ""}
            </p>
          ) : (
            <p>जीवित</p>
          )}
          {member.dob && <p>DOB: {member.dob}</p>}
          {member.occupation && <p>{member.occupation}</p>}
        </div>
      )}
    </button>
  );
}

/* ──────────────────── Collapsed Generation Row ───────────────────── */

function CollapsedRow({
  gen,
  count,
  onExpand,
}: {
  gen: number;
  count: number;
  onExpand: () => void;
}) {
  const label = GEN_LABELS[gen];
  return (
    <div className="relative flex flex-col items-center py-2">
      {/* Connector line in */}
      <div className="h-4 w-px bg-accent/30" />

      <button
        onClick={onExpand}
        className="flex items-center gap-2 rounded-full border border-dashed border-accent/40 bg-accent/5 px-4 py-2 text-xs transition-all hover:bg-accent/10 hover:border-accent"
      >
        <span className="material-symbols-rounded text-accent" style={{ fontSize: "16px" }}>
          expand_more
        </span>
        <span className="text-dark/60">
          {label ? label.hi : `Gen ${gen}`}
        </span>
        <span className="rounded-full bg-accent/20 px-1.5 text-[10px] font-bold text-accent">
          {count}
        </span>
      </button>

      {/* Connector line out */}
      <div className="h-4 w-px bg-accent/30" />
    </div>
  );
}

/* ─────────────────────── Main OrgChartTree ────────────────────────── */

export default function OrgChartTree({
  members,
  focusedMemberId,
  onMemberTap,
  isDemo = false,
  className = "",
}: OrgChartTreeProps) {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [collapsedGens, setCollapsedGens] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef<HTMLDivElement>(null);

  // Determine focused member generation
  const focusedMember = members.find((m) => m.id === focusedMemberId);
  const focusedGen = focusedMember?.gen ?? 0;

  // Group members by generation
  const generations = useMemo(() => {
    const genMap = new Map<number, OrgMember[]>();
    for (const m of members) {
      if (!genMap.has(m.gen)) genMap.set(m.gen, []);
      genMap.get(m.gen)!.push(m);
    }
    return Array.from(genMap.entries()).sort(([a], [b]) => a - b);
  }, [members]);

  // Auto-collapse generations outside focus range
  useEffect(() => {
    if (!focusedMemberId || isDemo) return;
    const toCollapse = new Set<number>();
    for (const [gen] of generations) {
      // Show: 1 above, self, 2 below
      if (gen < focusedGen - 1 || gen > focusedGen + 2) {
        toCollapse.add(gen);
      }
    }
    setCollapsedGens(toCollapse);
  }, [focusedMemberId, focusedGen, generations, isDemo]);

  // Scroll to focused member on mount
  useEffect(() => {
    if (focusedRef.current) {
      focusedRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [focusedMemberId]);

  // Search filter
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      members
        .filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            (m.nameHi && m.nameHi.includes(q)) ||
            m.relation.toLowerCase().includes(q) ||
            (m.relationHi && m.relationHi.includes(q))
        )
        .map((m) => m.id)
    );
  }, [searchQuery, members]);

  // When search finds results, expand those generations
  useEffect(() => {
    if (searchMatches.size > 0) {
      setCollapsedGens((prev) => {
        const next = new Set(prev);
        for (const m of members) {
          if (searchMatches.has(m.id)) {
            next.delete(m.gen);
          }
        }
        return next;
      });
    }
  }, [searchMatches, members]);

  const toggleMemberExpand = useCallback((id: string) => {
    setExpandedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleGenCollapse = useCallback((gen: number) => {
    setCollapsedGens((prev) => {
      const next = new Set(prev);
      if (next.has(gen)) next.delete(gen);
      else next.add(gen);
      return next;
    });
  }, []);

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-dark/40">
        <span className="material-symbols-rounded icon-xl text-accent/40">park</span>
        <p className="mt-3 text-sm">अभी कोई सदस्य नहीं / No members yet</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Search bar */}
      {!isDemo && (
        <div className="relative mx-auto w-full max-w-sm">
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" style={{ fontSize: "18px" }}>
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name... / नाम खोजें..."
            className="input-field pl-10 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
            </button>
          )}
        </div>
      )}

      {/* Search results count */}
      {searchQuery && (
        <p className="text-center text-xs text-dark/40">
          {searchMatches.size} result{searchMatches.size !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Tree container */}
      <div ref={scrollRef} className="overflow-x-auto pb-6">
        <div className="mx-auto flex min-w-fit flex-col items-center gap-0 px-4">
          {generations.map(([gen, genMembers], genIndex) => {
            const isCollapsed = collapsedGens.has(gen);
            const label = GEN_LABELS[gen];
            const isFirstGen = genIndex === 0;
            const isLastGen = genIndex === generations.length - 1;

            if (isCollapsed) {
              return (
                <CollapsedRow
                  key={gen}
                  gen={gen}
                  count={genMembers.length}
                  onExpand={() => toggleGenCollapse(gen)}
                />
              );
            }

            return (
              <div key={gen} className="flex flex-col items-center">
                {/* Vertical connector from previous generation */}
                {!isFirstGen && (
                  <div className="h-6 w-px bg-accent/30" />
                )}

                {/* Generation label */}
                <button
                  onClick={() => toggleGenCollapse(gen)}
                  className="mb-3 flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 transition-all hover:bg-accent/20"
                >
                  <span className="text-xs font-bold text-accent">
                    {label ? label.hi : `Gen ${gen}`}
                  </span>
                  <span className="text-[10px] text-dark/30">
                    ({genMembers.length})
                  </span>
                  {!isDemo && (
                    <span className="material-symbols-rounded text-accent/50" style={{ fontSize: "14px" }}>
                      unfold_less
                    </span>
                  )}
                </button>

                {/* Horizontal line spanning all members */}
                {genMembers.length > 1 && (
                  <div className="relative mb-2 flex w-full justify-center">
                    <div
                      className="h-px bg-accent/20"
                      style={{
                        width: `${Math.max((genMembers.length - 1) * 156, 100)}px`,
                      }}
                    />
                  </div>
                )}

                {/* Member cards row */}
                <div
                  ref={genMembers.some((m) => m.id === focusedMemberId) ? focusedRef : undefined}
                  className="flex flex-wrap items-start justify-center gap-4"
                >
                  {genMembers.map((member) => {
                    const isFocused = member.id === focusedMemberId;
                    const isHighlighted = searchMatches.has(member.id);
                    const isExpanded = expandedMembers.has(member.id);

                    return (
                      <div key={member.id} className="flex flex-col items-center">
                        {/* Vertical connector down from horizontal line */}
                        {genMembers.length > 1 && (
                          <div className="h-2 w-px bg-accent/20" />
                        )}

                        <MemberNode
                          member={member}
                          isFocused={isFocused}
                          isHighlighted={isHighlighted}
                          isExpanded={isExpanded}
                          onTap={() => {
                            toggleMemberExpand(member.id);
                            onMemberTap?.(member);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Vertical connector to next generation */}
                {!isLastGen && !collapsedGens.has(generations[genIndex + 1]?.[0]) && (
                  <div className="h-6 w-px bg-accent/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend (non-demo) */}
      {!isDemo && (
        <div className="mx-auto flex flex-wrap items-center justify-center gap-3 text-[10px] text-dark/40">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border border-border-warm bg-card-male" /> Male
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border border-border-warm bg-card-female" /> Female
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border border-border-warm bg-card-deceased/50" /> Deceased
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm border-2 border-accent bg-accent/10" /> You
          </span>
        </div>
      )}
    </div>
  );
}
