"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { addMember } from "@/lib/db";
import { RELATION_GROUPS, RELATIONS, getRelationConfig } from "@/lib/relations";
import { DOB_DECADES, DOB_MARKERS, GOTRAS, TEERTH_STHALS } from "@/lib/data";
import type { DobType, Gender, Member } from "@/types";

type FormStep = "relation" | "details" | "marriage" | "confirm";

export default function AddMemberPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<FormStep>("relation");
  const [saving, setSaving] = useState(false);

  // Relation
  const [selectedRelation, setSelectedRelation] = useState("");

  // Member details
  const [name, setName] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [alsoKnownAs, setAlsoKnownAs] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [alive, setAlive] = useState(true);
  const [dobType, setDobType] = useState<DobType>("unknown");
  const [dobExact, setDobExact] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [dobDecade, setDobDecade] = useState("");
  const [dobMarker, setDobMarker] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [deathTithi, setDeathTithi] = useState("");
  const [teerthSthal, setTeerthSthal] = useState("");
  const [occupation, setOccupation] = useState("");
  const [notes, setNotes] = useState("");
  const [oralHistory, setOralHistory] = useState("");

  // Marriage (shown for spouse relations)
  const [spouseName, setSpouseName] = useState("");
  const [spouseFatherName, setSpouseFatherName] = useState("");
  const [spouseGotra, setSpouseGotra] = useState("");
  const [spouseVillage, setSpouseVillage] = useState("");
  const [spouseDistrict, setSpouseDistrict] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [marriageStatus, setMarriageStatus] = useState<"active" | "divorced" | "widowed" | "separated">("active");

  useEffect(() => {
    if (!authLoading && !user) router.push("/verify");
  }, [user, authLoading, router]);

  const relationConfig = getRelationConfig(selectedRelation);
  const isSpouseRelation = relationConfig?.triggersMarriage || false;

  // Auto-set gender from relation config
  useEffect(() => {
    if (relationConfig) {
      setGender(relationConfig.gender);
    }
  }, [relationConfig]);

  const getDob = () => {
    switch (dobType) {
      case "exact": return dobExact || undefined;
      case "year": return dobYear || undefined;
      default: return undefined;
    }
  };

  const getDobApprox = () => {
    switch (dobType) {
      case "decade": return dobDecade || undefined;
      case "marker": return dobMarker || undefined;
      default: return undefined;
    }
  };

  const handleSave = async () => {
    if (!user || !relationConfig) return;
    setSaving(true);

    try {
      const memberData: Partial<Member> = {
        name,
        nameHi: nameHi || undefined,
        alsoKnownAs: alsoKnownAs || undefined,
        relation: selectedRelation,
        relationGroup: relationConfig.group,
        relationType: relationConfig.relationType,
        generationLevel: relationConfig.generationLevel,
        gender,
        alive,
        dob: getDob(),
        dobType,
        dobApproximate: getDobApprox(),
        deathYear: !alive && deathYear ? parseInt(deathYear) : undefined,
        deathTithi: !alive ? deathTithi || undefined : undefined,
        teerthSthal: !alive ? teerthSthal || undefined : undefined,
        occupation: occupation || undefined,
        notes: notes || undefined,
        oralHistory: oralHistory || undefined,
      };

      await addMember(user.uid, memberData);

      // TODO: If spouse relation, also save marriage document
      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-earth/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          &larr; वापस / Back
        </Link>

        <h1 className="font-hindi text-2xl font-bold text-earth">
          सदस्य जोड़ें / Add Member
        </h1>

        {/* Step indicator */}
        <div className="mt-4 flex gap-1">
          {(["relation", "details", ...(isSpouseRelation ? ["marriage"] : []), "confirm"] as FormStep[]).map((s, i, arr) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                arr.indexOf(step) >= i ? "bg-gold" : "bg-border-warm"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border-warm bg-bg-card p-6 shadow-sm">

          {/* ─── STEP 1: Relation Selection ─── */}
          {step === "relation" && (
            <div className="space-y-4">
              <p className="text-sm text-earth/60">
                रिश्ता चुनें / Select Relation
              </p>

              {RELATION_GROUPS.map((group) => {
                const relations = RELATIONS.filter((r) => r.group === group.key);
                return (
                  <div key={group.key}>
                    <h3 className="mb-2 text-sm font-semibold text-earth/70">
                      {group.labelHi} / {group.labelEn}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relations.map((rel) => (
                        <button
                          key={rel.key}
                          type="button"
                          onClick={() => setSelectedRelation(rel.key)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedRelation === rel.key
                              ? "bg-gold text-earth"
                              : "border border-border-warm text-earth/60 hover:bg-bg-muted"
                          }`}
                        >
                          {rel.labelHi} / {rel.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setStep("details")}
                disabled={!selectedRelation}
                className="mt-4 w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90 disabled:opacity-50"
              >
                आगे / Next &rarr;
              </button>
            </div>
          )}

          {/* ─── STEP 2: Member Details ─── */}
          {step === "details" && (
            <div className="space-y-5">
              {relationConfig && (
                <div className="rounded-lg bg-bg-muted px-3 py-2 text-sm text-earth/60">
                  रिश्ता: <span className="font-medium text-earth">{relationConfig.labelHi}</span> ({relationConfig.labelEn})
                  {relationConfig.relationType !== "blood" && (
                    <span className="ml-2 rounded bg-gold/20 px-1.5 text-xs text-gold">{relationConfig.relationType}</span>
                  )}
                </div>
              )}

              {/* Name */}
              <label className="block">
                <span className="text-sm font-medium text-earth">
                  नाम / Name <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Suresh Patil"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* Hindi Name */}
              <label className="block">
                <span className="text-sm font-medium text-earth">हिंदी नाम / Name in Hindi</span>
                <input
                  type="text"
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="सुरेश पाटिल"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 font-hindi text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* Also Known As */}
              <label className="block">
                <span className="text-sm font-medium text-earth">उपनाम / Also Known As</span>
                <input
                  type="text"
                  value={alsoKnownAs}
                  onChange={(e) => setAlsoKnownAs(e.target.value)}
                  placeholder="Babuji, Dada"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* Gender */}
              <div>
                <span className="text-sm font-medium text-earth">लिंग / Gender</span>
                <div className="mt-2 flex gap-3">
                  {([
                    { key: "male" as Gender, label: "♂ पुरुष / Male", bg: "bg-card-male" },
                    { key: "female" as Gender, label: "♀ स्त्री / Female", bg: "bg-card-female" },
                    { key: "other" as Gender, label: "अन्य / Other", bg: "bg-card-other" },
                  ]).map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setGender(g.key)}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                        gender === g.key
                          ? `${g.bg} border-2 border-gold text-earth`
                          : "border border-border-warm text-earth/60"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alive/Deceased */}
              <div>
                <span className="text-sm font-medium text-earth">स्थिति / Status</span>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAlive(true)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      alive
                        ? "bg-success/10 border-2 border-success text-success"
                        : "border border-border-warm text-earth/60"
                    }`}
                  >
                    जीवित / Living
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlive(false)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      !alive
                        ? "bg-card-deceased border-2 border-earth/30 text-earth"
                        : "border border-border-warm text-earth/60"
                    }`}
                  >
                    🕊 स्वर्गवासी / Deceased
                  </button>
                </div>
              </div>

              {/* DOB */}
              <div>
                <span className="text-sm font-medium text-earth">जन्म तिथि / Date of Birth</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { key: "exact" as DobType, label: "सटीक" },
                    { key: "year" as DobType, label: "वर्ष" },
                    { key: "decade" as DobType, label: "दशक" },
                    { key: "marker" as DobType, label: "संदर्भ" },
                    { key: "unknown" as DobType, label: "अज्ञात" },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setDobType(opt.key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        dobType === opt.key
                          ? "bg-gold text-earth"
                          : "border border-border-warm text-earth/60"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  {dobType === "exact" && (
                    <input type="date" value={dobExact} onChange={(e) => setDobExact(e.target.value)}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  )}
                  {dobType === "year" && (
                    <input type="number" value={dobYear} onChange={(e) => setDobYear(e.target.value)} placeholder="1955"
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  )}
                  {dobType === "decade" && (
                    <select value={dobDecade} onChange={(e) => setDobDecade(e.target.value)}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20">
                      <option value="">दशक चुनें</option>
                      {DOB_DECADES.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  )}
                  {dobType === "marker" && (
                    <select value={dobMarker} onChange={(e) => setDobMarker(e.target.value)}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20">
                      <option value="">संदर्भ चुनें</option>
                      {DOB_MARKERS.map((m) => <option key={m.value} value={m.value}>{m.label.hi}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Deceased fields */}
              {!alive && (
                <div className="space-y-4 rounded-lg border border-earth/10 bg-card-deceased/10 p-4">
                  <h3 className="text-sm font-semibold text-earth/70">🕊 स्वर्गवासी विवरण / Deceased Details</h3>
                  <label className="block">
                    <span className="text-sm text-earth/60">मृत्यु वर्ष / Death Year</span>
                    <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} placeholder="2015"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-earth/60">मृत्यु तिथि / Death Tithi</span>
                    <input type="text" value={deathTithi} onChange={(e) => setDeathTithi(e.target.value)} placeholder="Bhadrapada Krishna Amavasya"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-earth/60">तीर्थ स्थल / Teerth Sthal</span>
                    <select value={teerthSthal} onChange={(e) => setTeerthSthal(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20">
                      <option value="">चुनें</option>
                      {TEERTH_STHALS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                </div>
              )}

              {/* Occupation + Notes (collapsible) */}
              <details className="rounded-lg border border-border-warm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-earth/60">
                  अतिरिक्त / Additional Details
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  <label className="block">
                    <span className="text-sm text-earth/60">व्यवसाय / Occupation</span>
                    <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Teacher, Farmer..."
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-earth/60">नोट्स / Notes</span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any special notes..."
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-earth/60">मौखिक इतिहास / Oral History</span>
                    <textarea value={oralHistory} onChange={(e) => setOralHistory(e.target.value)} rows={3} placeholder="Stories and memories from elders..."
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                  </label>
                </div>
              </details>

              <div className="flex gap-3">
                <button onClick={() => setStep("relation")}
                  className="flex-1 rounded-lg border border-border-warm px-6 py-3 font-medium text-earth hover:bg-bg-muted">
                  &larr; पीछे
                </button>
                <button
                  onClick={() => setStep(isSpouseRelation ? "marriage" : "confirm")}
                  disabled={!name}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 font-semibold text-earth hover:bg-gold/90 disabled:opacity-50">
                  आगे &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Marriage Form (for spouse relations) ─── */}
          {step === "marriage" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-earth">विवाह विवरण / Marriage Details</h2>

              <label className="block">
                <span className="text-sm font-medium text-earth">जीवनसाथी का नाम / Spouse Name <span className="text-error">*</span></span>
                <input type="text" value={spouseName || name} onChange={(e) => setSpouseName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">पिता का नाम / Father&apos;s Name <span className="text-error">*</span></span>
                <input type="text" value={spouseFatherName} onChange={(e) => setSpouseFatherName(e.target.value)} placeholder="Father's name"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">गोत्र / Gotra <span className="text-error">*</span></span>
                <select value={spouseGotra} onChange={(e) => setSpouseGotra(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20">
                  <option value="">गोत्र चुनें</option>
                  {GOTRAS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">गांव / Village</span>
                  <input type="text" value={spouseVillage} onChange={(e) => setSpouseVillage(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">जिला / District</span>
                  <input type="text" value={spouseDistrict} onChange={(e) => setSpouseDistrict(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-earth">विवाह तिथि / Marriage Date</span>
                <input type="date" value={marriageDate} onChange={(e) => setMarriageDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              </label>

              <div>
                <span className="text-sm font-medium text-earth">विवाह स्थिति / Marriage Status</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { key: "active" as const, label: "विवाहित / Married" },
                    { key: "widowed" as const, label: "विधवा/विधुर / Widowed" },
                    { key: "divorced" as const, label: "तलाकशुदा / Divorced" },
                    { key: "separated" as const, label: "अलग / Separated" },
                  ]).map((s) => (
                    <button key={s.key} type="button"
                      onClick={() => setMarriageStatus(s.key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        marriageStatus === s.key ? "bg-gold text-earth" : "border border-border-warm text-earth/60"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("details")}
                  className="flex-1 rounded-lg border border-border-warm px-6 py-3 font-medium text-earth hover:bg-bg-muted">
                  &larr; पीछे
                </button>
                <button onClick={() => setStep("confirm")}
                  disabled={!spouseGotra}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 font-semibold text-earth hover:bg-gold/90 disabled:opacity-50">
                  आगे &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Confirm ─── */}
          {step === "confirm" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-earth">पुष्टि करें / Confirm</h2>

              <div className="space-y-2 rounded-lg bg-bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-earth/60">रिश्ता</span>
                  <span className="font-medium text-earth">{relationConfig?.labelHi} ({relationConfig?.labelEn})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth/60">नाम</span>
                  <span className="font-medium text-earth">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth/60">लिंग</span>
                  <span className="font-medium text-earth">{gender === "male" ? "♂ पुरुष" : gender === "female" ? "♀ स्त्री" : "अन्य"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth/60">स्थिति</span>
                  <span className="font-medium text-earth">{alive ? "जीवित" : "🕊 स्वर्गवासी"}</span>
                </div>
                {isSpouseRelation && spouseGotra && (
                  <>
                    <hr className="border-border-warm" />
                    <div className="flex justify-between">
                      <span className="text-earth/60">विवाह गोत्र</span>
                      <span className="font-medium text-earth">{spouseGotra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth/60">गांव</span>
                      <span className="font-medium text-earth">{spouseVillage || "—"}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(isSpouseRelation ? "marriage" : "details")}
                  className="flex-1 rounded-lg border border-border-warm px-6 py-3 font-medium text-earth hover:bg-bg-muted">
                  &larr; सुधारें
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 font-semibold text-earth hover:bg-gold/90 disabled:opacity-50">
                  {saving ? "जोड़ रहे हैं..." : "सदस्य जोड़ें / Add Member"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
