"use client";

import { useState } from "react";

interface DemoMember {
  id: string;
  name: string;
  nameHi: string;
  relation: string;
  gender: "male" | "female";
  deceased?: boolean;
  nee?: string;
  gen: number;
}

const demoMembers: DemoMember[] = [
  { id: "1", name: "Ramji Patil", nameHi: "रामजी पाटिल", relation: "दादा", gender: "male", deceased: true, gen: -2 },
  { id: "2", name: "Savitri Patil", nameHi: "सावित्री पाटिल", relation: "दादी", gender: "female", deceased: true, gen: -2 },
  { id: "3", name: "Suresh Patil", nameHi: "सुरेश पाटिल", relation: "पिता", gender: "male", gen: -1 },
  { id: "4", name: "Kamla Patil", nameHi: "कमला पाटिल", relation: "माता", gender: "female", nee: "Joshi", gen: -1 },
  { id: "5", name: "Lata Gupta", nameHi: "लता गुप्ता", relation: "बुआ", gender: "female", nee: "Patil", gen: -1 },
  { id: "6", name: "Rajesh Patil", nameHi: "राजेश पाटिल", relation: "स्वयं", gender: "male", gen: 0 },
  { id: "7", name: "Sunita Patil", nameHi: "सुनीता पाटिल", relation: "पत्नी", gender: "female", nee: "Sharma", gen: 0 },
  { id: "8", name: "Mahesh Patil", nameHi: "महेश पाटिल", relation: "भाई", gender: "male", gen: 0 },
  { id: "9", name: "Meena Patil", nameHi: "मीना पाटिल", relation: "भाभी", gender: "female", nee: "Verma", gen: 0 },
  { id: "10", name: "Arjun", nameHi: "अर्जुन", relation: "पुत्र", gender: "male", gen: 1 },
  { id: "11", name: "Ananya", nameHi: "अनन्या", relation: "पुत्री → विवाहित: देशमुख", gender: "female", gen: 1 },
  { id: "12", name: "Vikram", nameHi: "विक्रम", relation: "पुत्र", gender: "male", gen: 1 },
];

const genLabels: Record<number, string> = {
  [-2]: "दादा-दादी",
  [-1]: "माता-पिता",
  [0]: "स्वयं",
  [1]: "संतान",
};

function MemberCard({ member, isExpanded, onTap }: { member: DemoMember; isExpanded: boolean; onTap: () => void }) {
  const bgColor = member.deceased
    ? "bg-card-deceased"
    : member.gender === "male"
      ? "bg-card-male"
      : "bg-card-female";

  return (
    <button
      onClick={onTap}
      className={`relative rounded-lg border border-border-warm ${bgColor} px-3 py-2 text-left transition-all hover:shadow-md ${isExpanded ? "ring-2 ring-gold" : ""}`}
      style={{ minWidth: "120px" }}
    >
      {member.deceased && (
        <span className="absolute -top-1 -right-1 text-xs">🕊</span>
      )}
      <div className="text-sm font-semibold text-earth">{member.nameHi}</div>
      <div className="text-xs text-earth/60">{member.name}</div>
      {member.nee && (
        <div className="text-xs italic text-earth/50">née {member.nee}</div>
      )}
      <div className="mt-0.5 text-xs text-gold">{member.relation}</div>
      {isExpanded && (
        <div className="mt-2 border-t border-border-warm pt-1.5 text-xs text-earth/60">
          {member.deceased ? "स्वर्गवासी" : "जीवित"} | {member.gender === "male" ? "पुरुष" : "महिला"}
        </div>
      )}
    </button>
  );
}

export function DemoTree() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const generations = [-2, -1, 0, 1];

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px] space-y-6">
        {generations.map((gen) => {
          const members = demoMembers.filter((m) => m.gen === gen);
          return (
            <div key={gen}>
              <div className="mb-2 flex justify-center">
                <span className="rounded-full bg-gold/10 px-3 py-0.5 text-xs font-medium text-gold">
                  {genLabels[gen]}
                </span>
              </div>
              <div className="flex flex-wrap items-start justify-center gap-3">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isExpanded={expandedId === member.id}
                    onTap={() => setExpandedId(expandedId === member.id ? null : member.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
