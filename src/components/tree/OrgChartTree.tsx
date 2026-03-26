"use client";

import { useState, useMemo, useCallback, useRef, useEffect, type PointerEvent as ReactPointerEvent } from "react";

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
  spouseOf?: string;
}

interface OrgChartTreeProps {
  members: OrgMember[];
  focusedMemberId?: string;
  onMemberTap?: (member: OrgMember) => void;
  isDemo?: boolean;
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

/* ──────────────────────── Gender dot color ───────────────────────── */

function genderDotClass(gender: string, alive: boolean) {
  if (!alive) return "bg-dark/25";
  if (gender === "male") return "bg-blue-500";
  if (gender === "female") return "bg-pink-500";
  return "bg-emerald-500";
}

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

  return (
    <button
      onClick={onTap}
      data-member-id={member.id}
      className={`
        group relative w-[152px] shrink-0 rounded-xl bg-white p-3 text-left
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        border
        ${isFocused
          ? "border-accent ring-2 ring-accent/30 shadow-lg shadow-accent/10"
          : isHighlighted
            ? "border-accent/50 ring-1 ring-accent/20"
            : isDeceased
              ? "border-dark/10"
              : "border-border-warm"
        }
        ${isDeceased ? "opacity-75" : ""}
        ${isExpanded ? "shadow-md" : "shadow-sm"}
      `}
    >
      {/* Top row: gender dot + badges */}
      <div className="flex items-center gap-1.5">
        {/* Gender dot */}
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${genderDotClass(member.gender, !isDeceased)}`} />

        {isDeceased && (
          <span className="material-symbols-rounded text-dark/30" style={{ fontSize: "13px" }}>
            spa
          </span>
        )}
        {member.relationType === "adopted" && (
          <span className="rounded bg-accent/15 px-1 text-[8px] font-bold text-accent">दत्तक</span>
        )}
        {member.relationType === "step" && (
          <span className="rounded bg-warning/15 px-1 text-[8px] font-bold text-warning">सौतेला</span>
        )}
        {isFocused && (
          <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[7px] font-bold text-white leading-none">YOU</span>
        )}
      </div>

      {/* Name */}
      <p className={`mt-1.5 truncate text-[13px] font-bold leading-tight ${isDeceased ? "text-dark/50" : "text-dark"}`}>
        {member.nameHi || member.name}
      </p>
      <p className="truncate text-[10px] leading-tight text-dark/40">
        {member.nameHi ? member.name : ""}
      </p>

      {/* Née tag */}
      {member.nee && (
        <p className="truncate text-[9px] italic text-dark/30">née {member.nee}</p>
      )}

      {/* Relation */}
      <p className="mt-1 text-[10px] font-semibold text-accent">
        {member.relationHi || member.relation}
      </p>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-2 space-y-0.5 border-t border-dark/5 pt-2 text-[9px] text-dark/40">
          {isDeceased ? (
            <p className="flex items-center gap-1">
              <span className="material-symbols-rounded" style={{ fontSize: "11px" }}>spa</span>
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
    <div className="relative flex flex-col items-center py-1">
      {/* Branch in */}
      <div className="h-5 w-0.5 rounded-full bg-amber-800/20" />

      <button
        onClick={onExpand}
        className="flex items-center gap-2 rounded-full border border-dashed border-amber-800/25 bg-amber-50 px-4 py-1.5 text-xs transition-all hover:bg-amber-100 hover:border-amber-800/40"
      >
        <span className="material-symbols-rounded text-amber-800/60" style={{ fontSize: "14px" }}>
          expand_more
        </span>
        <span className="text-amber-900/60 font-medium">
          {label ? label.hi : `Gen ${gen}`}
        </span>
        <span className="rounded-full bg-amber-800/10 px-1.5 text-[10px] font-bold text-amber-800/60">
          {count}
        </span>
      </button>

      {/* Branch out */}
      <div className="h-5 w-0.5 rounded-full bg-amber-800/20" />
    </div>
  );
}

/* ─────────────────── Tree Branch Connectors (SVG) ────────────────── */

function BranchConnector({ memberCount }: { memberCount: number }) {
  if (memberCount <= 1) return null;

  // Calculate width of the horizontal span
  const cardWidth = 152;
  const gap = 12;
  const totalWidth = (memberCount - 1) * (cardWidth + gap);
  const svgWidth = totalWidth + 4;
  const mid = svgWidth / 2;

  return (
    <div className="relative flex justify-center" style={{ height: 28 }}>
      <svg
        width={svgWidth}
        height={28}
        viewBox={`0 0 ${svgWidth} 28`}
        fill="none"
        className="overflow-visible"
      >
        {/* Trunk coming down from center */}
        <line x1={mid} y1={0} x2={mid} y2={10} stroke="#92400e" strokeWidth={2.5} strokeOpacity={0.2} strokeLinecap="round" />

        {/* Horizontal branch */}
        <line x1={2} y1={10} x2={svgWidth - 2} y2={10} stroke="#92400e" strokeWidth={2} strokeOpacity={0.15} strokeLinecap="round" />

        {/* Vertical drops to each member */}
        {Array.from({ length: memberCount }, (_, i) => {
          const x = (cardWidth + gap) / 2 + i * (cardWidth + gap);
          return (
            <line
              key={i}
              x1={x}
              y1={10}
              x2={x}
              y2={28}
              stroke="#92400e"
              strokeWidth={2}
              strokeOpacity={0.15}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

/* Single trunk line between generations */
function TrunkLine() {
  return (
    <div className="flex justify-center">
      <div className="h-7 w-0.5 rounded-full bg-amber-800/20" />
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
  const treeInnerRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const pinchRef = useRef({ startDist: 0, startScale: 1 });
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = Array.from(pointersRef.current.values());
    if (pts.length === 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchRef.current.startDist === 0) {
        pinchRef.current.startDist = dist;
        pinchRef.current.startScale = scale;
      } else {
        const newScale = Math.min(Math.max(pinchRef.current.startScale * (dist / pinchRef.current.startDist), 0.4), 2.5);
        setScale(newScale);
      }
    }
  }, [scale]);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchRef.current.startDist = 0;
    }
  }, []);

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

  // Auto-collapse distant generations
  useEffect(() => {
    if (!focusedMemberId || isDemo) return;
    const toCollapse = new Set<number>();
    for (const [gen] of generations) {
      if (gen < focusedGen - 1 || gen > focusedGen + 2) {
        toCollapse.add(gen);
      }
    }
    setCollapsedGens(toCollapse);
  }, [focusedMemberId, focusedGen, generations, isDemo]);

  // Scroll to focused member
  useEffect(() => {
    if (focusedRef.current) {
      focusedRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [focusedMemberId]);

  // Search
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

  useEffect(() => {
    if (searchMatches.size > 0) {
      setCollapsedGens((prev) => {
        const next = new Set(prev);
        for (const m of members) {
          if (searchMatches.has(m.id)) next.delete(m.gen);
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
    <div className={`flex flex-col gap-3 ${className}`}>
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

      {searchQuery && (
        <p className="text-center text-xs text-dark/40">
          {searchMatches.size} result{searchMatches.size !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Zoom controls */}
      {!isDemo && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(s - 0.15, 0.4))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-warm bg-white text-dark/40 shadow-sm transition-colors hover:bg-bg-muted"
          >
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>remove</span>
          </button>
          <span className="text-[10px] text-dark/30 w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-warm bg-white text-dark/40 shadow-sm transition-colors hover:bg-bg-muted"
          >
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
          </button>
          {scale !== 1 && (
            <button
              onClick={() => setScale(1)}
              className="rounded-full border border-border-warm bg-white px-2 py-1 text-[10px] text-dark/40 shadow-sm transition-colors hover:bg-bg-muted"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Tree container — scrollable + pinch-zoomable */}
      <div
        ref={scrollRef}
        className="overflow-auto pb-4 touch-pan-x touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "pan-x pan-y" }}
      >
        <div
          ref={treeInnerRef}
          className="flex min-w-fit flex-col items-center px-6 origin-top"
          style={{ transform: `scale(${scale})`, transition: "transform 0.1s ease-out" }}
        >
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
                {/* Trunk from previous generation */}
                {!isFirstGen && <TrunkLine />}

                {/* Generation label pill */}
                <button
                  onClick={() => toggleGenCollapse(gen)}
                  className="mb-2 flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-800/10 px-3 py-1 transition-all hover:bg-amber-100"
                >
                  <span className="text-[11px] font-bold text-amber-900/70">
                    {label ? label.hi : `Gen ${gen}`}
                  </span>
                  <span className="text-[9px] text-amber-800/30">
                    {genMembers.length}
                  </span>
                  {!isDemo && (
                    <span className="material-symbols-rounded text-amber-800/30" style={{ fontSize: "12px" }}>
                      unfold_less
                    </span>
                  )}
                </button>

                {/* Branch connector (SVG) */}
                <BranchConnector memberCount={genMembers.length} />

                {/* Member cards */}
                <div
                  ref={genMembers.some((m) => m.id === focusedMemberId) ? focusedRef : undefined}
                  className="flex items-start justify-center gap-3"
                >
                  {genMembers.map((member) => {
                    const isFocused = member.id === focusedMemberId;
                    const isHighlighted = searchMatches.has(member.id);
                    const isExpanded = expandedMembers.has(member.id);

                    return (
                      <MemberNode
                        key={member.id}
                        member={member}
                        isFocused={isFocused}
                        isHighlighted={isHighlighted}
                        isExpanded={isExpanded}
                        onTap={() => {
                          toggleMemberExpand(member.id);
                          onMemberTap?.(member);
                        }}
                      />
                    );
                  })}
                </div>

                {/* Trunk to next generation */}
                {!isLastGen && !collapsedGens.has(generations[genIndex + 1]?.[0]) && (
                  <TrunkLine />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {!isDemo && (
        <div className="mx-auto flex flex-wrap items-center justify-center gap-4 text-[10px] text-dark/40">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Male
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-pink-500" /> Female
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-dark/25" /> Deceased
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full ring-2 ring-accent bg-accent/20" /> You
          </span>
        </div>
      )}
    </div>
  );
}
