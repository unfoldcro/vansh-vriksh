"use client";

import { useMemo } from "react";
import type { Member } from "@/types";
import { getRelationConfig } from "@/lib/relations";

interface UltraLightTreeProps {
  members: Member[];
}

export default function UltraLightTree({ members }: UltraLightTreeProps) {
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
    return <p className="py-8 text-center text-earth/40">No members</p>;
  }

  return (
    <div className="font-mono text-sm text-earth">
      {generations.map(([gen, genMembers]) => (
        <div key={gen} className="mb-2">
          <div className="text-xs font-bold text-earth/40">
            ── Gen {gen >= 0 ? "+" : ""}{gen} ──
          </div>
          {genMembers.map((member, i) => {
            const rel = getRelationConfig(member.relation);
            const prefix = i === genMembers.length - 1 ? "└── " : "├── ";
            const genderIcon = member.gender === "male" ? "♂" : member.gender === "female" ? "♀" : "◇";
            const deadIcon = !member.alive ? " 🕊" : "";
            const badge = member.relationType !== "blood" ? ` [${member.relationType}]` : "";

            return (
              <div key={member.id} className="whitespace-nowrap">
                <span className="text-earth/30">{prefix}</span>
                <span>{genderIcon}{deadIcon} </span>
                <span className="font-medium">{member.name}</span>
                <span className="text-earth/50"> ({rel?.labelHi || member.relation})</span>
                {member.dob && <span className="text-earth/40">, {member.dob}</span>}
                {!member.alive && member.deathYear && <span className="text-earth/40"> †{member.deathYear}</span>}
                <span className="text-earth/30">{badge}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
