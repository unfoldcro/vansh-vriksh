"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
import { isDemoMode } from "@/lib/demo-data";
import { RELATION_GROUPS, RELATIONS, getRelationConfig } from "@/lib/relations";
import { DOB_DECADES, DOB_MARKERS, GOTRAS, TEERTH_STHALS } from "@/lib/data";
import TransliterateInput from "@/components/ui/TransliterateInput";
import type { DobType, Gender, Member } from "@/types";

type FormStep = "relation" | "details" | "marriage" | "confirm";

export default function AddMemberPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useTranslation();
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

  const isDemo = isDemoMode();

  useEffect(() => {
    if (!authLoading && !user && !isDemo) router.push("/verify");
  }, [user, authLoading, router, isDemo]);

  const relationConfig = getRelationConfig(selectedRelation);
  const isSpouseRelation = relationConfig?.triggersMarriage || false;
  const isHindiMode = lang === "hi" || lang === "hinglish";

  // Primary/secondary name based on language
  const primaryName = isHindiMode ? nameHi : name;
  const secondaryName = isHindiMode ? name : nameHi;
  const setPrimaryName = (val: string) => { if (isHindiMode) setNameHi(val); else setName(val); };
  const setSecondaryName = (val: string) => { if (isHindiMode) setName(val); else setNameHi(val); };

  // Auto-set gender from relation config
  useEffect(() => {
    if (relationConfig) setGender(relationConfig.gender);
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
    if (!relationConfig) return;
    setSaving(true);

    // Demo mode — pretend to save, redirect back (data resets on refresh)
    if (isDemo) {
      await new Promise((r) => setTimeout(r, 500)); // Brief delay for UX
      router.push("/dashboard?demo=true");
      return;
    }

    if (!user) return;

    try {
      const memberData: Partial<Member> = {
        name: name || nameHi,
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

      if (!user.treeId) {
        router.push("/profile");
        return;
      }
      await api.post(`/api/trees/${user.treeId}/members`, memberData);
      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  };

  // Get relation label based on language
  const getRelLabel = (rel: { labelHi: string; labelEn: string }) => {
    if (lang === "en") return rel.labelEn;
    if (lang === "hinglish") return rel.labelEn;
    return rel.labelHi;
  };

  const getGroupLabel = (group: { labelHi: string; labelEn: string }) => {
    if (lang === "en") return group.labelEn;
    return group.labelHi;
  };

  const formSteps: FormStep[] = ["relation", "details", ...(isSpouseRelation ? ["marriage" as FormStep] : []), "confirm"];
  const stepIndex = formSteps.indexOf(step);

  if (authLoading && !isDemo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-dark/60"><span className="loading-dot" />{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-dark/50 hover:text-accent">
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
          {t("common.back")}
        </Link>

        <h1 className="font-hindi text-2xl font-bold text-earth">
          {t("member.addMember")}
        </h1>

        {/* Step indicator */}
        <div className="mt-4 flex gap-1">
          {formSteps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${stepIndex >= i ? "bg-accent" : "bg-border-warm"}`} />
          ))}
        </div>

        <div className="mt-6 card p-6">

          {/* ─── STEP 1: Relation Selection ─── */}
          {step === "relation" && (
            <div className="space-y-4">
              <p className="text-sm text-dark/60">{t("member.selectRelation")}</p>

              {RELATION_GROUPS.map((group) => {
                const relations = RELATIONS.filter((r) => r.group === group.key);
                return (
                  <div key={group.key}>
                    <h3 className="mb-2 text-sm font-semibold text-dark/70">
                      {getGroupLabel(group)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relations.map((rel) => (
                        <button key={rel.key} type="button"
                          onClick={() => setSelectedRelation(rel.key)}
                          className={`rounded-btn px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedRelation === rel.key
                              ? "bg-accent text-white"
                              : "border border-border-warm text-dark/60 hover:bg-bg-muted"
                          }`}>
                          {getRelLabel(rel)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              <button onClick={() => setStep("details")} disabled={!selectedRelation} className="btn-primary mt-4 w-full">
                {t("common.next")} &rarr;
              </button>
            </div>
          )}

          {/* ─── STEP 2: Member Details ─── */}
          {step === "details" && (
            <div className="space-y-5">
              {relationConfig && (
                <div className="rounded-card bg-bg-muted px-3 py-2 text-sm text-dark/60">
                  {t("member.relation")}: <span className="font-medium text-earth">{getRelLabel(relationConfig)}</span>
                  {relationConfig.relationType !== "blood" && (
                    <span className="ml-2 rounded bg-accent/20 px-1.5 text-xs text-accent">{relationConfig.relationType}</span>
                  )}
                </div>
              )}

              {/* Name with auto-transliteration */}
              <div>
                <span className="text-sm font-medium text-earth">
                  {t("member.name")} <span className="text-error">*</span>
                </span>
                <TransliterateInput
                  value={primaryName}
                  onChange={setPrimaryName}
                  transliteratedValue={secondaryName}
                  onTransliteratedChange={setSecondaryName}
                  placeholder={isHindiMode ? "सुरेश पाटिल" : "Suresh Patil"}
                  required
                  className="mt-1"
                />
              </div>

              {/* Also Known As */}
              <label className="block">
                <span className="text-sm font-medium text-earth">{t("profile.alsoKnownAs")}</span>
                <input type="text" value={alsoKnownAs} onChange={(e) => setAlsoKnownAs(e.target.value)}
                  placeholder="Babuji, Dada" className="mt-1 input-field" />
              </label>

              {/* Gender */}
              <div>
                <span className="text-sm font-medium text-earth">{t("member.gender")}</span>
                <div className="mt-2 flex gap-3">
                  {([
                    { key: "male" as Gender, label: t("member.male"), bg: "bg-card-male", icon: "person" },
                    { key: "female" as Gender, label: t("member.female"), bg: "bg-card-female", icon: "face_3" },
                    { key: "other" as Gender, label: t("member.other"), bg: "bg-card-other", icon: "person" },
                  ]).map((g) => (
                    <button key={g.key} type="button" onClick={() => setGender(g.key)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-card py-2 text-sm font-medium transition-colors ${
                        gender === g.key
                          ? `${g.bg} border-2 border-accent text-dark`
                          : "border border-border-warm text-dark/60"
                      }`}>
                      <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>{g.icon}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alive/Deceased */}
              <div>
                <span className="text-sm font-medium text-earth">{t("member.status")}</span>
                <div className="mt-2 flex gap-3">
                  <button type="button" onClick={() => setAlive(true)}
                    className={`flex-1 rounded-card py-2 text-sm font-medium transition-colors ${
                      alive ? "bg-success/10 border-2 border-success text-success" : "border border-border-warm text-dark/60"
                    }`}>
                    {t("member.alive")}
                  </button>
                  <button type="button" onClick={() => setAlive(false)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-card py-2 text-sm font-medium transition-colors ${
                      !alive ? "bg-card-deceased border-2 border-dark/30 text-dark" : "border border-border-warm text-dark/60"
                    }`}>
                    <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>spa</span>
                    {t("member.deceased")}
                  </button>
                </div>
              </div>

              {/* DOB */}
              <div>
                <span className="text-sm font-medium text-earth">{t("profile.dob")}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { key: "exact" as DobType, tKey: "profile.dobExact" },
                    { key: "year" as DobType, tKey: "profile.dobYear" },
                    { key: "decade" as DobType, tKey: "profile.dobDecade" },
                    { key: "marker" as DobType, tKey: "profile.dobMarker" },
                    { key: "unknown" as DobType, tKey: "profile.dobUnknown" },
                  ]).map((opt) => (
                    <button key={opt.key} type="button" onClick={() => setDobType(opt.key)}
                      className={`rounded-btn px-3 py-1.5 text-xs font-medium transition-colors ${
                        dobType === opt.key ? "bg-accent text-white" : "border border-border-warm text-dark/60"
                      }`}>
                      {t(opt.tKey)}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  {dobType === "exact" && (
                    <input type="date" value={dobExact} onChange={(e) => setDobExact(e.target.value)} className="input-field" />
                  )}
                  {dobType === "year" && (
                    <input type="number" value={dobYear} onChange={(e) => setDobYear(e.target.value)} placeholder="1955" className="input-field" />
                  )}
                  {dobType === "decade" && (
                    <select value={dobDecade} onChange={(e) => setDobDecade(e.target.value)} className="input-field">
                      <option value="">{t("profile.selectDecade")}</option>
                      {DOB_DECADES.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  )}
                  {dobType === "marker" && (
                    <select value={dobMarker} onChange={(e) => setDobMarker(e.target.value)} className="input-field">
                      <option value="">{t("profile.selectMarker")}</option>
                      {DOB_MARKERS.map((m) => (
                        <option key={m.value} value={m.value}>{lang === "en" ? m.label.en : m.label.hi}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Deceased fields */}
              {!alive && (
                <div className="space-y-4 rounded-card border border-dark/10 bg-card-deceased/10 p-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-dark/70">
                    <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>spa</span>
                    {t("member.deceasedDetails")}
                  </h3>
                  <label className="block">
                    <span className="text-sm text-dark/60">{t("member.deathYear")}</span>
                    <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} placeholder="2015" className="mt-1 input-field" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-dark/60">{t("member.deathTithi")}</span>
                    <input type="text" value={deathTithi} onChange={(e) => setDeathTithi(e.target.value)} className="mt-1 input-field" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-dark/60">{t("profile.teerthSthal")}</span>
                    <select value={teerthSthal} onChange={(e) => setTeerthSthal(e.target.value)} className="mt-1 input-field">
                      <option value="">{t("profile.select")}</option>
                      {TEERTH_STHALS.map((ts) => <option key={ts} value={ts}>{ts}</option>)}
                    </select>
                  </label>
                </div>
              )}

              {/* Additional Details (collapsible) */}
              <details className="rounded-card border border-border-warm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-dark/60">
                  {t("member.additionalDetails")}
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  <label className="block">
                    <span className="text-sm text-dark/60">{t("member.occupation")}</span>
                    <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="mt-1 input-field" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-dark/60">{t("member.notes")}</span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 input-field" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-dark/60">{t("member.oralHistory")}</span>
                    <textarea value={oralHistory} onChange={(e) => setOralHistory(e.target.value)} rows={3} className="mt-1 input-field" />
                  </label>
                </div>
              </details>

              <div className="flex gap-3">
                <button onClick={() => setStep("relation")} className="btn-ghost flex-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span> {t("common.back")}
                </button>
                <button onClick={() => setStep(isSpouseRelation ? "marriage" : "confirm")}
                  disabled={!primaryName} className="btn-primary flex-1">
                  {t("common.next")} &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Marriage Form ─── */}
          {step === "marriage" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-earth">{t("member.marriageDetails")}</h2>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("marriage.spouseName")} <span className="text-error">*</span>
                </span>
                <input type="text" value={spouseName || name || nameHi} onChange={(e) => setSpouseName(e.target.value)}
                  className="mt-1 input-field" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("marriage.fatherName")} <span className="text-error">*</span>
                </span>
                <input type="text" value={spouseFatherName} onChange={(e) => setSpouseFatherName(e.target.value)}
                  className="mt-1 input-field" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("profile.gotra")} <span className="text-error">*</span>
                </span>
                <select value={spouseGotra} onChange={(e) => setSpouseGotra(e.target.value)} className="mt-1 input-field">
                  <option value="">{t("profile.select")}</option>
                  {GOTRAS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">{t("profile.village")}</span>
                  <input type="text" value={spouseVillage} onChange={(e) => setSpouseVillage(e.target.value)}
                    className="mt-1 input-field" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">{t("profile.district")}</span>
                  <input type="text" value={spouseDistrict} onChange={(e) => setSpouseDistrict(e.target.value)}
                    className="mt-1 input-field" />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-earth">{t("marriage.marriageDate")}</span>
                <input type="date" value={marriageDate} onChange={(e) => setMarriageDate(e.target.value)}
                  className="mt-1 input-field" />
              </label>

              <div>
                <span className="text-sm font-medium text-earth">{t("marriage.status")}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { key: "active" as const, tKey: "marriage.active" },
                    { key: "widowed" as const, tKey: "marriage.widowed" },
                    { key: "divorced" as const, tKey: "marriage.divorced" },
                    { key: "separated" as const, tKey: "marriage.separated" },
                  ]).map((s) => (
                    <button key={s.key} type="button" onClick={() => setMarriageStatus(s.key)}
                      className={`rounded-btn px-3 py-1.5 text-xs font-medium transition-colors ${
                        marriageStatus === s.key ? "bg-accent text-white" : "border border-border-warm text-dark/60"
                      }`}>
                      {t(s.tKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("details")} className="btn-ghost flex-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span> {t("common.back")}
                </button>
                <button onClick={() => setStep("confirm")} disabled={!spouseGotra} className="btn-primary flex-1">
                  {t("common.next")} &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Confirm ─── */}
          {step === "confirm" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-earth">{t("member.confirm")}</h2>

              <div className="space-y-2 rounded-card bg-bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark/60">{t("member.relation")}</span>
                  <span className="font-medium text-earth">{relationConfig ? getRelLabel(relationConfig) : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">{t("member.name")}</span>
                  <span className="font-medium text-earth">{name || nameHi}</span>
                </div>
                {nameHi && name && (
                  <div className="flex justify-between">
                    <span className="text-dark/60">{t("profile.nameHi")}</span>
                    <span className="font-medium text-earth font-hindi">{nameHi}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark/60">{t("member.gender")}</span>
                  <span className="font-medium text-earth">{t(`member.${gender}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">{t("member.status")}</span>
                  <span className="font-medium text-earth">{alive ? t("member.alive") : t("member.deceased")}</span>
                </div>
                {isSpouseRelation && spouseGotra && (
                  <>
                    <hr className="border-border-warm" />
                    <div className="flex justify-between">
                      <span className="text-dark/60">{t("profile.gotra")}</span>
                      <span className="font-medium text-earth">{spouseGotra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark/60">{t("profile.village")}</span>
                      <span className="font-medium text-earth">{spouseVillage || "—"}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(isSpouseRelation ? "marriage" : "details")} className="btn-ghost flex-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>edit</span> {t("common.edit")}
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? t("member.adding") : t("member.addMember")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
