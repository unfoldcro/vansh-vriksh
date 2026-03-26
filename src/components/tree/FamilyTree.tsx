"use client";

import { useState, useMemo } from "react";
import type { Member } from "@/types";
import { getRelationConfig } from "@/lib/relations";

interface FamilyTreeProps {
  members: Member[];
  onMemberTap?: (member: Member) => void;
}

const GEN_LABELS: Record<number, string> = {
  [-3]: "परदादा-परदादी / Great-Grandparents",
  [-2]: "दादा-दादी / नाना-नानी / Grandparents",
  [-1]: "माता-पिता / Parents & Uncles/Aunts",
  [0]: "स्वयं / Self & Siblings",
  [1]: "संतान / Children",
  [2]: "पोता-पोती / Grandchildren",
  [3]: "परपोता-परपोती / Great-Grandchildren",
};

export default function FamilyTree({ members, onMemberTap }: FamilyTreeProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const generations = useMemo(() => {
    const genMap = new Map<number, Member[]>();
    for (const m of members) {
      const gen = m.generationLevel;
      if (!genMap.has(gen)) genMap.set(gen, []);
      genMap.get(gen)!.push(m);
    }
    return Array.from(genMap.entries()).sort(([a], [b]) => a - b);
  }, [members]);

  if (members.length === 0) {
    return (
      <div className="py-12 text-center text-earth/40">
        <p className="text-4xl">🌱</p>
        <p className="mt-2">अभी कोई सदस्य नहीं / No members yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px] space-y-6 p-4">
        {generations.map(([gen, genMembers]) => (
          <div key={gen}>
            {/* Generation label */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-border-warm" />
              <span className="label-mono whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-accent">
                {GEN_LABELS[gen] || `Generation ${gen}`}
              </span>
              <div className="h-px flex-1 bg-border-warm" />
            </div>

            {/* Members row */}
            <div className="flex flex-wrap justify-center gap-3">
              {genMembers.map((member) => {
                const rel = getRelationConfig(member.relation);
                const isExpanded = expanded === member.id;

                const bgColor = !member.alive
                  ? "bg-card-deceased/40 border-earth/20"
                  : member.gender === "male"
                    ? "bg-card-male border-card-male"
                    : member.gender === "female"
                      ? "bg-card-female border-card-female"
                      : "bg-card-other border-card-other";

                return (
                  <div key={member.id} className="flex flex-col items-center">
                    {/* Connector line from parent */}
                    {gen > generations[0][0] && (
                      <div className="h-4 w-px bg-border-warm" />
                    )}

                    <button
                      onClick={() => {
                        setExpanded(isExpanded ? null : member.id);
                        onMemberTap?.(member);
                      }}
                      className={`w-36 rounded-lg border-2 p-3 text-center transition-all ${bgColor} ${
                        isExpanded ? "ring-2 ring-accent shadow-md" : "hover:shadow-sm"
                      }`}
                    >
                      {/* Badges */}
                      <div className="flex justify-center gap-1">
                        {!member.alive && <span className="text-xs">🕊</span>}
                        {member.relationType === "adopted" && (
                          <span className="rounded bg-accent/30 px-1 text-[9px] text-accent">दत्तक</span>
                        )}
                        {member.relationType === "step" && (
                          <span className="rounded bg-warning/30 px-1 text-[9px] text-warning">सौतेला</span>
                        )}
                      </div>

                      {/* Name */}
                      <p className="mt-1 truncate text-sm font-semibold text-earth">
                        {member.name}
                      </p>
                      {member.nameHi && (
                        <p className="truncate font-hindi text-xs text-earth/60">
                          {member.nameHi}
                        </p>
                      )}

                      {/* Relation tag */}
                      <p className="mt-1 text-[10px] text-earth/50">
                        {rel?.labelHi || member.relation}
                      </p>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-2 space-y-1 border-t border-earth/10 pt-2 text-[10px] text-earth/60">
                          {member.dob && <p>DOB: {member.dob}</p>}
                          {member.occupation && <p>{member.occupation}</p>}
                          {!member.alive && member.deathYear && <p>🕊 {member.deathYear}</p>}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
