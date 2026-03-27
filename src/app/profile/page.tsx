"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
import TransliterateInput from "@/components/ui/TransliterateInput";
import {
  GOTRAS, NAKSHATRAS, RASHIS, VARNAS, INDIAN_STATES,
  MP_DISTRICTS, DOB_DECADES, DOB_MARKERS,
  COMMON_KUL_DEVTAS, COMMON_KUL_DEVIS, TEERTH_STHALS,
} from "@/lib/data";
import type { DobType } from "@/types";

type Step = "identity" | "location" | "ritual" | "review";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useTranslation();
  const [step, setStep] = useState<Step>("identity");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [duplicates, setDuplicates] = useState<Array<{
    treeId: string;
    familySurname: string;
    gotra: string;
    village: string;
    district: string;
    totalMembers: number;
    generations: number;
  }>>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Identity fields
  const [fullName, setFullName] = useState("");
  const [fullNameHi, setFullNameHi] = useState("");
  const [alsoKnownAs, setAlsoKnownAs] = useState("");
  const [dobType, setDobType] = useState<DobType>("unknown");
  const [dobExact, setDobExact] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [dobDecade, setDobDecade] = useState("");
  const [dobMarker, setDobMarker] = useState("");
  const [gotra, setGotra] = useState("");
  const [gotraSearch, setGotraSearch] = useState("");
  const [kulDevta, setKulDevta] = useState("");
  const [kulDevi, setKulDevi] = useState("");
  const [jati, setJati] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [rashi, setRashi] = useState("");
  const [varna, setVarna] = useState("");
  const [shakha, setShakha] = useState("");
  const [pravar, setPravar] = useState("");

  // Location fields
  const [village, setVillage] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Madhya Pradesh");
  const [currentCity, setCurrentCity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [migrationNote, setMigrationNote] = useState("");

  // Ritual fields
  const [teerthSthal, setTeerthSthal] = useState("");
  const [familyPriest, setFamilyPriest] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/verify");
    }
  }, [user, authLoading, router]);

  // If user already has a tree, go to dashboard
  useEffect(() => {
    if (user?.treeId) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const isHindiMode = lang === "hi" || lang === "hinglish";

  const primaryName = isHindiMode ? fullNameHi : fullName;
  const secondaryName = isHindiMode ? fullName : fullNameHi;

  const setPrimaryName = (val: string) => {
    if (isHindiMode) setFullNameHi(val);
    else setFullName(val);
  };

  const setSecondaryName = (val: string) => {
    if (isHindiMode) setFullName(val);
    else setFullNameHi(val);
  };

  const getDobValue = (): string | undefined => {
    switch (dobType) {
      case "exact": return dobExact || undefined;
      case "year": return dobYear || undefined;
      default: return undefined;
    }
  };

  const getDobApproximate = (): string | undefined => {
    switch (dobType) {
      case "decade": return dobDecade || undefined;
      case "marker": return dobMarker || undefined;
      default: return undefined;
    }
  };

  const buildProfile = () => ({
    fullName: fullName || fullNameHi,
    fullNameHi: fullNameHi || undefined,
    alsoKnownAs: alsoKnownAs || undefined,
    dob: getDobValue(),
    dobType,
    dobApproximate: getDobApproximate(),
    gotra,
    kulDevta: kulDevta || undefined,
    kulDevi: kulDevi || undefined,
    jati: jati || undefined,
    nakshatra: nakshatra || undefined,
    rashi: rashi || undefined,
    varna: varna || undefined,
    shakha: shakha || undefined,
    pravar: pravar || undefined,
    village,
    tehsil: tehsil || undefined,
    district,
    state,
    currentCity: currentCity || undefined,
    currentState: currentState || undefined,
    migrationNote: migrationNote || undefined,
    teerthSthal: teerthSthal || undefined,
    familyPriest: familyPriest || undefined,
    lang,
  });

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setError("");

    try {
      // Check for duplicates first
      const surname = fullName.split(" ").pop() || fullNameHi.split(" ").pop() || "";
      const dupRes = await api.get<{ trees: Array<typeof duplicates[0]> }>(
        `/api/trees/duplicates?surname=${encodeURIComponent(surname)}&gotra=${encodeURIComponent(gotra)}&district=${encodeURIComponent(district)}`
      );

      if (dupRes.trees && dupRes.trees.length > 0) {
        setDuplicates(dupRes.trees);
        setShowDuplicateModal(true);
        setSaving(false);
        return;
      }

      await createUserAndTree();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  };

  const createUserAndTree = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const profile = buildProfile();

      // Update user profile
      await api.put("/api/users/me", profile);

      // Create tree
      await api.post<{ treeId: string }>("/api/trees", profile);

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tree");
      setSaving(false);
    }
  };

  const handleDuplicateChoice = async (choice: "join" | "new" | "later") => {
    setShowDuplicateModal(false);

    if (choice === "join" && duplicates[0]) {
      router.push(`/join/${duplicates[0].treeId}`);
    } else {
      await createUserAndTree();
    }
  };

  const filteredGotras = gotraSearch
    ? GOTRAS.filter((g) => g.toLowerCase().includes(gotraSearch.toLowerCase()))
    : GOTRAS;

  const STEPS: Step[] = ["identity", "location", "ritual", "review"];
  const stepIndex = STEPS.indexOf(step);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-dark/60"><span className="loading-dot" />{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/verify" className="mb-6 inline-flex items-center gap-1 text-sm text-dark/50 hover:text-accent">
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
          {t("common.back")}
        </Link>

        <h1 className="font-hindi text-2xl font-bold text-earth">
          {t("profile.title")}
        </h1>
        <p className="mt-1 text-sm text-dark/50">
          {t("profile.subtitle")}
        </p>

        {/* Step Indicator */}
        <div className="mt-6 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                stepIndex >= i ? "bg-accent" : "bg-border-warm"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-dark/40">
          {t(`profile.step${stepIndex + 1}`)}
        </p>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div className="mt-6 card p-6">
          {/* ─── STEP 1: Identity ─── */}
          {step === "identity" && (
            <div className="space-y-5">
              <div>
                <span className="text-sm font-medium text-earth">
                  {t("profile.fullName")} <span className="text-error">*</span>
                </span>
                <TransliterateInput
                  value={primaryName}
                  onChange={setPrimaryName}
                  transliteratedValue={secondaryName}
                  onTransliteratedChange={setSecondaryName}
                  placeholder={isHindiMode ? "राजेश पाटिल" : "Rajesh Patil"}
                  required
                  className="mt-1"
                />
              </div>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("profile.alsoKnownAs")}
                </span>
                <input
                  type="text"
                  value={alsoKnownAs}
                  onChange={(e) => setAlsoKnownAs(e.target.value)}
                  placeholder="Raju, Babuji"
                  className="input-field mt-1"
                />
              </label>

              {/* DOB Type Selector */}
              <div>
                <span className="text-sm font-medium text-earth">
                  {t("profile.dob")}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { key: "exact" as DobType, tKey: "profile.dobExact" },
                    { key: "year" as DobType, tKey: "profile.dobYear" },
                    { key: "decade" as DobType, tKey: "profile.dobDecade" },
                    { key: "marker" as DobType, tKey: "profile.dobMarker" },
                    { key: "unknown" as DobType, tKey: "profile.dobUnknown" },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setDobType(opt.key)}
                      className={`rounded-btn px-3 py-1.5 text-xs font-medium transition-colors ${
                        dobType === opt.key
                          ? "bg-accent text-white"
                          : "border border-border-warm text-dark/60 hover:bg-bg-muted"
                      }`}
                    >
                      {t(opt.tKey)}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  {dobType === "exact" && (
                    <input type="date" value={dobExact} onChange={(e) => setDobExact(e.target.value)} className="input-field" />
                  )}
                  {dobType === "year" && (
                    <input type="number" value={dobYear} onChange={(e) => setDobYear(e.target.value)} placeholder="1985"
                      min="1850" max={new Date().getFullYear()} className="input-field" />
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
                        <option key={m.value} value={m.value}>
                          {lang === "en" ? m.label.en : m.label.hi}
                        </option>
                      ))}
                    </select>
                  )}
                  {dobType === "unknown" && (
                    <p className="text-sm text-dark/40">{t("profile.dobUnknownNote")}</p>
                  )}
                </div>
              </div>

              {/* Gotra */}
              <div>
                <span className="text-sm font-medium text-earth">
                  {t("profile.gotra")} <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={gotra || gotraSearch}
                  onChange={(e) => { setGotraSearch(e.target.value); setGotra(""); }}
                  placeholder={t("profile.searchGotra")}
                  className="input-field mt-1"
                />
                {gotraSearch && !gotra && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-card border border-border-warm bg-bg-card shadow-lg">
                    {filteredGotras.map((g) => (
                      <button key={g} type="button"
                        onClick={() => { setGotra(g); setGotraSearch(""); }}
                        className="block w-full px-4 py-2 text-left text-sm text-earth hover:bg-bg-muted">
                        {g}
                      </button>
                    ))}
                    {filteredGotras.length === 0 && (
                      <button type="button"
                        onClick={() => { setGotra(gotraSearch); setGotraSearch(""); }}
                        className="block w-full px-4 py-2 text-left text-sm text-accent">
                        {t("profile.addGotra")} &quot;{gotraSearch}&quot;
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Kul Devta + Kul Devi */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">{t("profile.kulDevta")}</span>
                  <input type="text" value={kulDevta} onChange={(e) => setKulDevta(e.target.value)}
                    list="kulDevtaList" className="input-field mt-1" />
                  <datalist id="kulDevtaList">
                    {COMMON_KUL_DEVTAS.map((d) => <option key={d} value={d} />)}
                  </datalist>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">{t("profile.kulDevi")}</span>
                  <input type="text" value={kulDevi} onChange={(e) => setKulDevi(e.target.value)}
                    list="kulDeviList" className="input-field mt-1" />
                  <datalist id="kulDeviList">
                    {COMMON_KUL_DEVIS.map((d) => <option key={d} value={d} />)}
                  </datalist>
                </label>
              </div>

              {/* Jati */}
              <label className="block">
                <span className="text-sm font-medium text-earth">{t("profile.jati")}</span>
                <input type="text" value={jati} onChange={(e) => setJati(e.target.value)}
                  className="input-field mt-1" />
                <p className="mt-1 text-xs text-dark/40">{t("profile.jatiNote")}</p>
              </label>

              {/* Nakshatra + Rashi */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">{t("profile.nakshatra")}</span>
                  <select value={nakshatra} onChange={(e) => setNakshatra(e.target.value)} className="input-field mt-1">
                    <option value="">{t("profile.select")}</option>
                    {NAKSHATRAS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">{t("profile.rashi")}</span>
                  <select value={rashi} onChange={(e) => setRashi(e.target.value)} className="input-field mt-1">
                    <option value="">{t("profile.select")}</option>
                    {RASHIS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
              </div>

              {/* Additional Identity (collapsible) */}
              <details className="rounded-card border border-border-warm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-dark/60">
                  {t("profile.additionalIdentity")}
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  <label className="block">
                    <span className="text-sm font-medium text-earth">{t("profile.varna")}</span>
                    <select value={varna} onChange={(e) => setVarna(e.target.value)} className="input-field mt-1">
                      <option value="">{t("profile.select")}</option>
                      {VARNAS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">{t("profile.shakha")}</span>
                    <input type="text" value={shakha} onChange={(e) => setShakha(e.target.value)} className="input-field mt-1" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">{t("profile.pravar")}</span>
                    <input type="text" value={pravar} onChange={(e) => setPravar(e.target.value)} className="input-field mt-1" />
                  </label>
                </div>
              </details>

              <button onClick={() => setStep("location")} disabled={!primaryName || !gotra} className="btn-primary w-full">
                {t("common.next")} &rarr;
              </button>
            </div>
          )}

          {/* ─── STEP 2: Location ─── */}
          {step === "location" && (
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("profile.village")} <span className="text-error">*</span>
                </span>
                <input type="text" value={village} onChange={(e) => setVillage(e.target.value)}
                  placeholder="Doraha" className="input-field mt-1" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">{t("profile.tehsil")}</span>
                <input type="text" value={tehsil} onChange={(e) => setTehsil(e.target.value)}
                  placeholder="Sehore" className="input-field mt-1" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("profile.district")} <span className="text-error">*</span>
                </span>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="input-field mt-1">
                  <option value="">{t("profile.selectDistrict")}</option>
                  {(state === "Madhya Pradesh" ? MP_DISTRICTS : []).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  <option value="__other">{t("profile.otherDistrict")}</option>
                </select>
                {district === "__other" && (
                  <input type="text" onChange={(e) => setDistrict(e.target.value)}
                    className="input-field mt-2" />
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  {t("profile.state")} <span className="text-error">*</span>
                </span>
                <select value={state} onChange={(e) => setState(e.target.value)} className="input-field mt-1">
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <details className="rounded-card border border-border-warm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-dark/60">
                  {t("profile.currentResidence")}
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  <label className="block">
                    <span className="text-sm font-medium text-earth">{t("profile.currentCity")}</span>
                    <input type="text" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)}
                      className="input-field mt-1" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">{t("profile.currentState")}</span>
                    <select value={currentState} onChange={(e) => setCurrentState(e.target.value)} className="input-field mt-1">
                      <option value="">{t("profile.select")}</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">{t("profile.migrationNote")}</span>
                    <input type="text" value={migrationNote} onChange={(e) => setMigrationNote(e.target.value)}
                      className="input-field mt-1" />
                  </label>
                </div>
              </details>

              <div className="flex gap-3">
                <button onClick={() => setStep("identity")} className="btn-ghost flex-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span> {t("common.back")}
                </button>
                <button onClick={() => setStep("ritual")} disabled={!village || !district} className="btn-primary flex-1">
                  {t("common.next")} &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Ritual (Optional) ─── */}
          {step === "ritual" && (
            <div className="space-y-5">
              <p className="text-sm text-dark/50">{t("profile.ritualOptional")}</p>

              <label className="block">
                <span className="text-sm font-medium text-earth">{t("profile.teerthSthal")}</span>
                <select value={teerthSthal} onChange={(e) => setTeerthSthal(e.target.value)} className="input-field mt-1">
                  <option value="">{t("profile.select")}</option>
                  {TEERTH_STHALS.map((ts) => <option key={ts} value={ts}>{ts}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">{t("profile.familyPriest")}</span>
                <input type="text" value={familyPriest} onChange={(e) => setFamilyPriest(e.target.value)}
                  className="input-field mt-1" />
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep("location")} className="btn-ghost flex-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span> {t("common.back")}
                </button>
                <button onClick={() => setStep("review")} className="btn-primary flex-1">
                  {t("profile.review")} &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Review ─── */}
          {step === "review" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-earth">{t("profile.review")}</h2>

              <div className="space-y-3 rounded-card bg-bg-muted p-4">
                <ReviewRow label={t("profile.fullName")} value={fullName || fullNameHi} />
                {fullNameHi && fullName && <ReviewRow label={t("profile.nameHi")} value={fullNameHi} />}
                <ReviewRow
                  label={t("profile.dob")}
                  value={
                    dobType === "exact" ? dobExact :
                    dobType === "year" ? dobYear :
                    dobType === "decade" ? dobDecade :
                    dobType === "marker" ? DOB_MARKERS.find((m) => m.value === dobMarker)?.label[lang === "en" ? "en" : "hi"] || dobMarker :
                    t("profile.dobUnknown")
                  }
                />
                <ReviewRow label={t("profile.gotra")} value={gotra} />
                {kulDevta && <ReviewRow label={t("profile.kulDevta")} value={kulDevta} />}
                {kulDevi && <ReviewRow label={t("profile.kulDevi")} value={kulDevi} />}
                {nakshatra && <ReviewRow label={t("profile.nakshatra")} value={nakshatra} />}
                {rashi && <ReviewRow label={t("profile.rashi")} value={rashi} />}
                <ReviewRow label={t("profile.village")} value={village} />
                {tehsil && <ReviewRow label={t("profile.tehsil")} value={tehsil} />}
                <ReviewRow label={t("profile.district")} value={district} />
                <ReviewRow label={t("profile.state")} value={state} />
                {currentCity && <ReviewRow label={t("profile.currentCity")} value={currentCity} />}
                {teerthSthal && <ReviewRow label={t("profile.teerthSthal")} value={teerthSthal} />}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("ritual")} className="btn-ghost flex-1">
                  <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>edit</span> {t("common.edit")}
                </button>
                <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1">
                  {saving ? t("profile.creating") : t("profile.createTree")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Duplicate Detection Modal ─── */}
      {showDuplicateModal && duplicates.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-card bg-bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold text-earth">{t("profile.duplicateTitle")}</h2>
            <p className="mt-2 text-sm text-dark/60">
              {duplicates[0].familySurname} ({duplicates[0].gotra}, {duplicates[0].district})
              {" "}{t("profile.duplicateDesc")}
            </p>
            <div className="mt-4 rounded-card bg-bg-muted p-3 text-sm">
              <p className="font-medium text-earth">{duplicates[0].familySurname}</p>
              <p className="text-dark/60">
                {duplicates[0].gotra} | {duplicates[0].village}, {duplicates[0].district}
              </p>
              <p className="text-dark/60">
                {duplicates[0].totalMembers} {t("dashboard.members")} | {duplicates[0].generations} {t("dashboard.generations")}
              </p>
            </div>
            <div className="mt-5 space-y-2">
              <button onClick={() => handleDuplicateChoice("join")} className="btn-primary w-full">
                {t("profile.duplicateYes")}
              </button>
              <button onClick={() => handleDuplicateChoice("new")}
                className="w-full rounded-card border border-border-warm px-4 py-3 font-medium text-earth transition-colors hover:bg-bg-muted">
                {t("profile.duplicateNo")}
              </button>
              <button onClick={() => handleDuplicateChoice("later")}
                className="w-full px-4 py-2 text-sm text-dark/50 transition-colors hover:text-earth">
                {t("profile.duplicateLater")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-dark/60">{label}</span>
      <span className="font-medium text-earth">{value || "—"}</span>
    </div>
  );
}
