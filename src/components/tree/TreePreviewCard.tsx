import Link from "next/link";
import type { TreeMetadata } from "@/types";

interface TreePreviewCardProps {
  treeId?: string;
  familySurname?: string;
  gotra?: string;
  kulDevta?: string;
  village?: string;
  district?: string;
  state?: string;
  totalMembers?: number;
  generations?: number;
  ownerFirstName?: string;
  matchScore?: number;
  tree?: TreeMetadata;
}

function MatchBadge({ score }: { score: number }) {
  if (score >= 90)
    return <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Best Match ✅</span>;
  if (score >= 60)
    return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Possible Match 🟡</span>;
  return <span className="rounded-full bg-info/10 px-2 py-0.5 text-xs font-medium text-info">Similar Family 🔵</span>;
}

export default function TreePreviewCard(props: TreePreviewCardProps) {
  const {
    treeId = props.tree?.treeId ?? "",
    familySurname = props.tree?.familySurname ?? "",
    gotra = props.tree?.gotra ?? "",
    kulDevta = props.tree?.kulDevta,
    village = props.tree?.village ?? "",
    district = props.tree?.district ?? "",
    state = props.tree?.state ?? "",
    totalMembers = props.tree?.totalMembers ?? 0,
    generations = props.tree?.generations ?? 0,
    ownerFirstName,
    matchScore,
  } = props;
  return (
    <div className="rounded-xl border border-border-warm bg-bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-earth">
          🌳 {familySurname} Family
        </h3>
        {matchScore !== undefined && <MatchBadge score={matchScore} />}
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-earth/70">
        <div>गोत्र: <span className="font-medium text-earth">{gotra}</span></div>
        {kulDevta && <div>कुलदेवी: <span className="font-medium text-earth">{kulDevta}</span></div>}
        <div>गांव: <span className="font-medium text-earth">{village}, {district}, {state}</span></div>
      </div>

      <div className="mt-3 flex gap-4 text-sm text-earth/60">
        <span>👥 {totalMembers} Members</span>
        <span>📊 {generations} Generations</span>
      </div>

      {ownerFirstName && (
        <div className="mt-2 text-xs text-earth/40">
          Created by: {ownerFirstName}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          href={`/tree/${treeId}`}
          className="rounded-lg border border-border-warm px-4 py-2 text-sm font-medium text-earth transition-colors hover:bg-bg-muted"
        >
          👁 View Tree
        </Link>
        <Link
          href={`/join/${treeId}`}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-earth transition-colors hover:bg-gold/90"
        >
          🤝 Join This Tree
        </Link>
      </div>
    </div>
  );
}
