"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUser, createUser, createTree, findDuplicateTrees } from "@/lib/db";
import {
  GOTRAS, NAKSHATRAS, RASHIS, VARNAS, INDIAN_STATES,
  MP_DISTRICTS, DOB_DECADES, DOB_MARKERS,
  COMMON_KUL_DEVTAS, COMMON_KUL_DEVIS, TEERTH_STHALS,
} from "@/lib/data";
import type { DobType, TreeMetadata } from "@/types";

type Step = "identity" | "location" | "ritual" | "review";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>("identity");
  const [saving, setSaving] = useState(false);
  const [duplicates, setDuplicates] = useState<TreeMetadata[]>([]);
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/verify");
    }
  }, [user, authLoading, router]);

  // Check if user already has a profile
  useEffect(() => {
    if (user) {
      getUser(user.uid).then((profile) => {
        if (profile?.treeId) {
          router.push("/dashboard");
        }
      });
    }
  }, [user, router]);

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

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const profile = {
        fullName,
        fullNameHi: fullNameHi || undefined,
        alsoKnownAs: alsoKnownAs || undefined,
        dob: getDobValue(),
        dobType,
        dobApproximate: getDobApproximate(),
        phone: user.phoneNumber || undefined,
        email: user.email || undefined,
        authMethod: user.phoneNumber ? "phone" as const : "email" as const,
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
        lang: "hi" as const,
      };

      // Check for duplicates first
      const surname = fullName.split(" ").pop() || "";
      const matches = await findDuplicateTrees(surname, gotra, district);

      if (matches.length > 0) {
        setDuplicates(matches);
        setShowDuplicateModal(true);
        setSaving(false);
        return;
      }

      await createUserAndTree(profile);
    } catch {
      setSaving(false);
    }
  };

  const createUserAndTree = async (profile: Parameters<typeof createUser>[1]) => {
    if (!user) return;
    setSaving(true);
    try {
      await createUser(user.uid, profile);
      await createTree(user.uid, profile);
      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  };

  const handleDuplicateChoice = async (choice: "join" | "new" | "later") => {
    if (!user) return;
    setShowDuplicateModal(false);

    const profile = {
      fullName, fullNameHi, gotra, kulDevta, kulDevi, jati,
      village, tehsil, district, state,
      dob: getDobValue(), dobType, dobApproximate: getDobApproximate(),
      phone: user.phoneNumber || undefined,
      email: user.email || undefined,
      authMethod: user.phoneNumber ? "phone" as const : "email" as const,
      lang: "hi" as const,
    };

    if (choice === "join" && duplicates[0]) {
      router.push(`/join/${duplicates[0].treeId}`);
    } else {
      await createUserAndTree(profile);
    }
  };

  const filteredGotras = gotraSearch
    ? GOTRAS.filter((g) => g.toLowerCase().includes(gotraSearch.toLowerCase()))
    : GOTRAS;

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
        <Link href="/verify" className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          &larr; वापस / Back
        </Link>

        <h1 className="font-hindi text-2xl font-bold text-earth">
          प्रोफ़ाइल बनाएं / Create Your Profile
        </h1>
        <p className="mt-1 text-sm text-earth/50">
          अपनी पूरी हिंदू पहचान दर्ज करें / Enter your complete Hindu identity
        </p>

        {/* Step Indicator */}
        <div className="mt-6 flex gap-1">
          {(["identity", "location", "ritual", "review"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                (["identity", "location", "ritual", "review"] as Step[]).indexOf(step) >= i
                  ? "bg-gold"
                  : "bg-border-warm"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-earth/40">
          {step === "identity" && "चरण 1/4 — पहचान / Step 1/4 — Identity"}
          {step === "location" && "चरण 2/4 — स्थान / Step 2/4 — Location"}
          {step === "ritual" && "चरण 3/4 — परंपरा / Step 3/4 — Ritual (Optional)"}
          {step === "review" && "चरण 4/4 — समीक्षा / Step 4/4 — Review"}
        </p>

        <div className="mt-6 rounded-xl border border-border-warm bg-bg-card p-6 shadow-sm">
          {/* ─── STEP 1: Identity ─── */}
          {step === "identity" && (
            <div className="space-y-5">
              {/* Full Name */}
              <label className="block">
                <span className="text-sm font-medium text-earth">
                  पूरा नाम / Full Name <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rajesh Patil"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* Name in Hindi */}
              <label className="block">
                <span className="text-sm font-medium text-earth">
                  हिंदी में नाम / Name in Hindi
                </span>
                <input
                  type="text"
                  value={fullNameHi}
                  onChange={(e) => setFullNameHi(e.target.value)}
                  placeholder="राजेश पाटिल"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 font-hindi text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* Also Known As */}
              <label className="block">
                <span className="text-sm font-medium text-earth">
                  उपनाम / Also Known As
                </span>
                <input
                  type="text"
                  value={alsoKnownAs}
                  onChange={(e) => setAlsoKnownAs(e.target.value)}
                  placeholder="Raju, Babuji"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              {/* DOB Type Selector */}
              <div>
                <span className="text-sm font-medium text-earth">
                  जन्म तिथि / Date of Birth
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { key: "exact", label: "सटीक / Exact" },
                    { key: "year", label: "केवल वर्ष / Year Only" },
                    { key: "decade", label: "दशक / Decade" },
                    { key: "marker", label: "संदर्भ / Marker" },
                    { key: "unknown", label: "अज्ञात / Unknown" },
                  ] as { key: DobType; label: string }[]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setDobType(opt.key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        dobType === opt.key
                          ? "bg-gold text-earth"
                          : "border border-border-warm text-earth/60 hover:bg-bg-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* DOB Inputs based on type */}
                <div className="mt-3">
                  {dobType === "exact" && (
                    <input
                      type="date"
                      value={dobExact}
                      onChange={(e) => setDobExact(e.target.value)}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  )}
                  {dobType === "year" && (
                    <input
                      type="number"
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      placeholder="1985"
                      min="1850"
                      max={new Date().getFullYear()}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  )}
                  {dobType === "decade" && (
                    <select
                      value={dobDecade}
                      onChange={(e) => setDobDecade(e.target.value)}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="">दशक चुनें / Select Decade</option>
                      {DOB_DECADES.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  )}
                  {dobType === "marker" && (
                    <select
                      value={dobMarker}
                      onChange={(e) => setDobMarker(e.target.value)}
                      className="w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="">संदर्भ चुनें / Select Marker</option>
                      {DOB_MARKERS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label.hi} / {m.label.en}
                        </option>
                      ))}
                    </select>
                  )}
                  {dobType === "unknown" && (
                    <p className="text-sm text-earth/40">
                      कोई बात नहीं — बाद में जोड़ सकते हैं / No worries — you can add later
                    </p>
                  )}
                </div>
              </div>

              {/* Gotra - Searchable */}
              <div>
                <span className="text-sm font-medium text-earth">
                  गोत्र / Gotra <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={gotra || gotraSearch}
                  onChange={(e) => {
                    setGotraSearch(e.target.value);
                    setGotra("");
                  }}
                  placeholder="खोजें / Search gotra..."
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                {gotraSearch && !gotra && (
                  <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-border-warm bg-bg-card shadow-lg">
                    {filteredGotras.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => { setGotra(g); setGotraSearch(""); }}
                        className="block w-full px-4 py-2 text-left text-sm text-earth hover:bg-bg-muted"
                      >
                        {g}
                      </button>
                    ))}
                    {filteredGotras.length === 0 && (
                      <button
                        type="button"
                        onClick={() => { setGotra(gotraSearch); setGotraSearch(""); }}
                        className="block w-full px-4 py-2 text-left text-sm text-gold"
                      >
                        &quot;{gotraSearch}&quot; जोड़ें / Add &quot;{gotraSearch}&quot;
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Kul Devta */}
              <label className="block">
                <span className="text-sm font-medium text-earth">कुलदेवता / Kul Devta</span>
                <input
                  type="text"
                  value={kulDevta}
                  onChange={(e) => setKulDevta(e.target.value)}
                  list="kulDevtaList"
                  placeholder="Lord Shiva / भगवान शिव"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                <datalist id="kulDevtaList">
                  {COMMON_KUL_DEVTAS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </label>

              {/* Kul Devi */}
              <label className="block">
                <span className="text-sm font-medium text-earth">कुलदेवी / Kul Devi</span>
                <input
                  type="text"
                  value={kulDevi}
                  onChange={(e) => setKulDevi(e.target.value)}
                  list="kulDeviList"
                  placeholder="Maa Sharda / माँ शारदा"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                <datalist id="kulDeviList">
                  {COMMON_KUL_DEVIS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </label>

              {/* Jati */}
              <label className="block">
                <span className="text-sm font-medium text-earth">जाति / Jati</span>
                <input
                  type="text"
                  value={jati}
                  onChange={(e) => setJati(e.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                <p className="mt-1 text-xs text-earth/40">
                  यह निजी है, केवल आपका परिवार देख सकता है / Private — only your family sees this
                </p>
              </label>

              {/* Nakshatra + Rashi row */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">नक्षत्र / Nakshatra</span>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="">चुनें / Select</option>
                    {NAKSHATRAS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">राशि / Rashi</span>
                  <select
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="">चुनें / Select</option>
                    {RASHIS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Varna + Shakha + Pravar (collapsible) */}
              <details className="rounded-lg border border-border-warm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-earth/60">
                  अतिरिक्त पहचान / Additional Identity (Optional)
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  <label className="block">
                    <span className="text-sm font-medium text-earth">वर्ण / Varna</span>
                    <select
                      value={varna}
                      onChange={(e) => setVarna(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="">चुनें / Select</option>
                      {VARNAS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">शाखा / Shakha</span>
                    <input
                      type="text"
                      value={shakha}
                      onChange={(e) => setShakha(e.target.value)}
                      placeholder="For Brahmin families"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">प्रवर / Pravar</span>
                    <input
                      type="text"
                      value={pravar}
                      onChange={(e) => setPravar(e.target.value)}
                      placeholder="Optional"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </label>
                </div>
              </details>

              <button
                onClick={() => setStep("location")}
                disabled={!fullName || !gotra}
                className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90 disabled:opacity-50"
              >
                आगे बढ़ें / Next &rarr;
              </button>
            </div>
          )}

          {/* ─── STEP 2: Location ─── */}
          {step === "location" && (
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-earth">
                  मूल गांव / Native Village <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Doraha"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">तहसील / Tehsil</span>
                <input
                  type="text"
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                  placeholder="Sehore"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  जिला / District <span className="text-error">*</span>
                </span>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">जिला चुनें / Select District</option>
                  {(state === "Madhya Pradesh" ? MP_DISTRICTS : []).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  <option value="__other">अन्य / Other (type below)</option>
                </select>
                {district === "__other" && (
                  <input
                    type="text"
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Type district name"
                    className="mt-2 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">
                  राज्य / State <span className="text-error">*</span>
                </span>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              {/* Current Location (collapsible) */}
              <details className="rounded-lg border border-border-warm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-earth/60">
                  वर्तमान निवास / Current Residence (Optional)
                </summary>
                <div className="space-y-4 px-4 pb-4">
                  <label className="block">
                    <span className="text-sm font-medium text-earth">वर्तमान शहर / Current City</span>
                    <input
                      type="text"
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                      placeholder="Indore"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">वर्तमान राज्य / Current State</span>
                    <select
                      value={currentState}
                      onChange={(e) => setCurrentState(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="">चुनें / Select</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-earth">प्रवास नोट / Migration Note</span>
                    <input
                      type="text"
                      value={migrationNote}
                      onChange={(e) => setMigrationNote(e.target.value)}
                      placeholder="Moved to Indore in 1998"
                      className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </label>
                </div>
              </details>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("identity")}
                  className="flex-1 rounded-lg border border-border-warm px-6 py-3 font-medium text-earth transition-colors hover:bg-bg-muted"
                >
                  &larr; पीछे / Back
                </button>
                <button
                  onClick={() => setStep("ritual")}
                  disabled={!village || !district}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90 disabled:opacity-50"
                >
                  आगे / Next &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Ritual (Optional) ─── */}
          {step === "ritual" && (
            <div className="space-y-5">
              <p className="text-sm text-earth/50">
                ये वैकल्पिक हैं — बाद में भी जोड़ सकते हैं / These are optional — can add later
              </p>

              <label className="block">
                <span className="text-sm font-medium text-earth">तीर्थ स्थल / Teerth Sthal</span>
                <select
                  value={teerthSthal}
                  onChange={(e) => setTeerthSthal(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">चुनें / Select</option>
                  {TEERTH_STHALS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  <option value="__other">अन्य / Other</option>
                </select>
                {teerthSthal === "__other" && (
                  <input
                    type="text"
                    onChange={(e) => setTeerthSthal(e.target.value)}
                    placeholder="Type teerth sthal name"
                    className="mt-2 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-earth">पारिवारिक पुरोहित / Family Priest</span>
                <input
                  type="text"
                  value={familyPriest}
                  onChange={(e) => setFamilyPriest(e.target.value)}
                  placeholder="Pandit Sharma ji"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("location")}
                  className="flex-1 rounded-lg border border-border-warm px-6 py-3 font-medium text-earth transition-colors hover:bg-bg-muted"
                >
                  &larr; पीछे / Back
                </button>
                <button
                  onClick={() => setStep("review")}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90"
                >
                  समीक्षा / Review &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Review ─── */}
          {step === "review" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-earth">
                समीक्षा करें / Review Your Profile
              </h2>

              <div className="space-y-3 rounded-lg bg-bg-muted p-4">
                <ReviewRow label="नाम / Name" value={fullName} />
                {fullNameHi && <ReviewRow label="हिंदी नाम" value={fullNameHi} />}
                <ReviewRow
                  label="जन्म / DOB"
                  value={
                    dobType === "exact" ? dobExact :
                    dobType === "year" ? dobYear :
                    dobType === "decade" ? dobDecade :
                    dobType === "marker" ? DOB_MARKERS.find((m) => m.value === dobMarker)?.label.hi || dobMarker :
                    "अज्ञात / Unknown"
                  }
                />
                <ReviewRow label="गोत्र / Gotra" value={gotra} />
                {kulDevta && <ReviewRow label="कुलदेवता" value={kulDevta} />}
                {kulDevi && <ReviewRow label="कुलदेवी" value={kulDevi} />}
                {nakshatra && <ReviewRow label="नक्षत्र" value={nakshatra} />}
                {rashi && <ReviewRow label="राशि" value={rashi} />}
                <ReviewRow label="गांव / Village" value={village} />
                {tehsil && <ReviewRow label="तहसील" value={tehsil} />}
                <ReviewRow label="जिला / District" value={district} />
                <ReviewRow label="राज्य / State" value={state} />
                {currentCity && <ReviewRow label="वर्तमान शहर" value={currentCity} />}
                {teerthSthal && <ReviewRow label="तीर्थ स्थल" value={teerthSthal} />}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("ritual")}
                  className="flex-1 rounded-lg border border-border-warm px-6 py-3 font-medium text-earth transition-colors hover:bg-bg-muted"
                >
                  &larr; सुधारें / Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90 disabled:opacity-50"
                >
                  {saving ? "बना रहे हैं... / Creating..." : "वृक्ष बनाएं / Create Tree"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Duplicate Detection Modal ─── */}
      {showDuplicateModal && duplicates.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold text-earth">
              क्या यह आपका परिवार है? / Is this your family?
            </h2>
            <p className="mt-2 text-sm text-earth/60">
              {duplicates[0].familySurname} परिवार ({duplicates[0].gotra} गोत्र, {duplicates[0].district})
              का वंश वृक्ष पहले से मौजूद है।
            </p>
            <div className="mt-4 rounded-lg bg-bg-muted p-3 text-sm">
              <p className="font-medium text-earth">{duplicates[0].familySurname} Family</p>
              <p className="text-earth/60">
                {duplicates[0].gotra} | {duplicates[0].village}, {duplicates[0].district}
              </p>
              <p className="text-earth/60">
                {duplicates[0].totalMembers} members | {duplicates[0].generations} generations
              </p>
            </div>
            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleDuplicateChoice("join")}
                className="w-full rounded-lg bg-gold px-4 py-3 font-semibold text-earth transition-colors hover:bg-gold/90"
              >
                हां, यह मेरा परिवार है / Yes, this is my family
              </button>
              <button
                onClick={() => handleDuplicateChoice("new")}
                className="w-full rounded-lg border border-border-warm px-4 py-3 font-medium text-earth transition-colors hover:bg-bg-muted"
              >
                नहीं, अलग परिवार है / No, different family
              </button>
              <button
                onClick={() => handleDuplicateChoice("later")}
                className="w-full px-4 py-2 text-sm text-earth/50 transition-colors hover:text-earth"
              >
                बाद में देखेंगे / Will check later
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
      <span className="text-earth/60">{label}</span>
      <span className="font-medium text-earth">{value || "—"}</span>
    </div>
  );
}
