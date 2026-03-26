"use client";

import type { Member } from "@/types";

interface ShraddhViewProps {
  members: Member[];
}

export default function ShraddhView({ members }: ShraddhViewProps) {
  // Find paternal line: self → father → dada → pardada
  const self = members.find((m) => m.relation === "self");
  const father = members.find((m) => m.relation === "father");
  const dada = members.find((m) => m.relation === "dada");
  const pardada = members.find((m) => m.relation === "pardada");

  const paternalLine = [father, dada, pardada].filter(Boolean) as Member[];
  const missingCount = 3 - paternalLine.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-4">
        <h2 className="text-center font-hindi text-lg font-bold text-earth">
          🙏 श्राद्ध सहायक / Shraddh Helper
        </h2>
        <p className="mt-1 text-center text-xs text-earth/50">
          पिता, दादा, परदादा — 3 पीढ़ी का विवरण
        </p>
      </div>

      {/* Self reference */}
      {self && (
        <div className="rounded-lg bg-bg-muted px-4 py-2 text-sm text-earth/60">
          आप: <span className="font-medium text-earth">{self.name}</span>
          {self.nameHi && <span> ({self.nameHi})</span>}
        </div>
      )}

      {/* Paternal line cards */}
      {paternalLine.length > 0 ? (
        <div className="space-y-3">
          {paternalLine.map((member, i) => (
            <div
              key={member.id}
              className="rounded-xl border-2 border-accent/40 bg-bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gold">
                    {i === 0 ? "पिता / Father" : i === 1 ? "दादा / Grandfather" : "परदादा / Great-Grandfather"}
                  </p>
                  <p className="mt-1 text-lg font-bold text-earth">
                    {!member.alive && "🕊 "}
                    {member.name}
                  </p>
                  {member.nameHi && (
                    <p className="font-hindi text-sm text-earth/60">{member.nameHi}</p>
                  )}
                </div>
                <span className="text-2xl">{!member.alive ? "🕊" : "🙏"}</span>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                {member.dob && (
                  <div className="flex justify-between">
                    <span className="text-earth/50">जन्म / Birth</span>
                    <span className="text-earth">{member.dob}</span>
                  </div>
                )}
                {!member.alive && member.deathYear && (
                  <div className="flex justify-between">
                    <span className="text-earth/50">मृत्यु / Death</span>
                    <span className="text-earth">{member.deathYear}</span>
                  </div>
                )}
                {member.deathTithi && (
                  <div className="flex justify-between">
                    <span className="text-earth/50">मृत्यु तिथि / Tithi</span>
                    <span className="font-medium text-gold">{member.deathTithi}</span>
                  </div>
                )}
                {member.teerthSthal && (
                  <div className="flex justify-between">
                    <span className="text-earth/50">तीर्थ स्थल</span>
                    <span className="text-earth">{member.teerthSthal}</span>
                  </div>
                )}
              </div>

              {!member.deathTithi && !member.alive && (
                <p className="mt-2 rounded bg-warning/10 px-2 py-1 text-xs text-warning">
                  मृत्यु तिथि जोड़ें — श्राद्ध की तारीख जानने के लिए / Add death tithi for shraddh date
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-bg-muted p-6 text-center">
          <p className="text-earth/50">
            पिता, दादा, परदादा की जानकारी अभी उपलब्ध नहीं है।
          </p>
          <p className="mt-1 text-sm text-earth/40">
            बुज़ुर्गों से पूछकर जोड़ें / Ask elders and add details.
          </p>
        </div>
      )}

      {/* Missing info alert */}
      {missingCount > 0 && paternalLine.length > 0 && (
        <div className="rounded-lg bg-info/10 p-3 text-sm text-info">
          {missingCount === 1
            ? "1 पीढ़ी की जानकारी गायब है।"
            : `${missingCount} पीढ़ियों की जानकारी गायब है।`}
          {" "}बुज़ुर्गों से पूछकर जोड़ें।
        </div>
      )}
    </div>
  );
}
