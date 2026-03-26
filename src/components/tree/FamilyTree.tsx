"use client";

import { useMemo } from "react";
import type { Member } from "@/types";
import { getRelationConfig } from "@/lib/relations";
import OrgChartTree from "./OrgChartTree";
import type { OrgMember } from "./OrgChartTree";

interface FamilyTreeProps {
  members: Member[];
  focusedMemberId?: string;
  onMemberTap?: (member: Member) => void;
}

export default function FamilyTree({ members, focusedMemberId, onMemberTap }: FamilyTreeProps) {
  // Convert Member[] to OrgMember[] for the org chart
  const orgMembers: OrgMember[] = useMemo(() => {
    return members.map((m) => {
      const rel = getRelationConfig(m.relation);
      return {
        id: m.id,
        name: m.name,
        nameHi: m.nameHi,
        relation: rel?.labelEn || m.relation,
        relationHi: rel?.labelHi || m.relation,
        gender: m.gender,
        alive: m.alive,
        gen: m.generationLevel,
        relationType: m.relationType,
        dob: m.dob,
        occupation: m.occupation,
        deathYear: m.deathYear,
      };
    });
  }, [members]);

  // Map org member tap back to original Member type
  const handleTap = (orgMember: OrgMember) => {
    const original = members.find((m) => m.id === orgMember.id);
    if (original && onMemberTap) onMemberTap(original);
  };

  return (
    <OrgChartTree
      members={orgMembers}
      focusedMemberId={focusedMemberId}
      onMemberTap={handleTap}
    />
  );
}
