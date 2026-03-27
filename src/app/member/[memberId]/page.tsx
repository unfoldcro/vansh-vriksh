"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
import { RELATIONS } from "@/lib/relations";
import { DOB_DECADES, DOB_MARKERS, TEERTH_STHALS } from "@/lib/data";
import TransliterateInput from "@/components/ui/TransliterateInput";
import type { Member, DobType, Gender } from "@/types";

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.memberId as string;
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useTranslation();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
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

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/verify"); return; }
    if (!user.treeId) { router.replace("/profile"); return; }
    loadMember(user.treeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadMember = async (treeId: string) => {
    try {
      const res = await api.get<{ members: Member[] }>(`/api/trees/${treeId}/members`);
      const found = res.members?.find((m) => m.id === memberId);
      if (found) {
        setMember(found);
        populateForm(found);
      } else {
        setError("Member not found");
      }
    } catch {
      setError("Failed to load member");
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (m: Member) => {
    setName(m.name || "");
    setNameHi(m.nameHi || "");
    setAlsoKnownAs(m.alsoKnownAs || "");
    setGender(m.gender);
    setAlive(m.alive);
    setDobType(m.dobType || "unknown");
    setDobExact(m.dobType === "exact" ? m.dob || "" : "");
    setDobYear(m.dobType === "year" ? m.dob || "" : "");
    setDobDecade(m.dobType === "decade" ? m.dobApproximate || "" : "");
    setDobMarker(m.dobType === "marker" ? m.dobApproximate || "" : "");
    setDeathYear(m.deathYear ? String(m.deathYear) : "");
    setDeathTithi(m.deathTithi || "");
    setTeerthSthal(m.teerthSthal || "");
    setOccupation(m.occupation || "");
    setNotes(m.notes || "");
    setOralHistory(m.oralHistory || "");
  };

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
    if (!user?.treeId || !member) return;
    setSaving(true);
    setError("");
    try {
      const data = {
        name: name || nameHi,
        nameHi: nameHi || undefined,
        alsoKnownAs: alsoKnownAs || undefined,
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
      const res = await api.put<{ member: Member }>(`/api/trees/${user.treeId}/members/${memberId}`, data);
      setMember(res.member);
      setEditing(false);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.treeId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/trees/${user.treeId}/members/${memberId}`);
      router.push("/dashboard");
    } catch {
      setError("Failed to delete member");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getRelationLabel = () => {
    if (!member) return "";
    const rel = RELATIONS.find((r) => r.key === member.relation);
    if (!rel) return member.relation;
    return lang === "en" ? rel.labelEn : rel.labelHi;
  };

  const getDobDisplay = () => {
    if (!member) return "";
    if (member.dobType === "exact" && member.dob) return member.dob;
    if (member.dobType === "year" && member.dob) return member.dob;
    if (member.dobType === "decade" && member.dobApproximate) return `~${member.dobApproximate}`;
    if (member.dobType === "marker" && member.dobApproximate) return member.dobApproximate;
    return t("member.status") === "Status" ? "Unknown" : "अज्ञात";
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-dark/60"><span className="loading-dot" />{t("common.loading")}</div>
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
        <div className="card p-6 text-center">
          <p className="text-error">{error}</p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block text-sm">{t("common.back")}</Link>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const genderBg = member.gender === "male" ? "bg-card-male" : member.gender === "female" ? "bg-card-female" : "bg-card-other";
  const isHindi = lang === "hi" || lang === "hinglish";

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-dark/40 hover:text-accent mb-4">
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
          {t("common.back")}
        </Link>

        {error && (
          <div className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="card w-full max-w-sm p-6 text-center animate-fade-in-up">
              <span className="material-symbols-rounded text-error" style={{ fontSize: "48px" }}>delete_forever</span>
              <h3 className="mt-3 text-lg font-bold text-dark">
                {isHindi ? "क्या आप पक्के हैं?" : "Are you sure?"}
              </h3>
              <p className="mt-2 text-sm text-dark/60">
                {isHindi
                  ? `"${member.nameHi || member.name}" को हटाया जाएगा। 30 दिन तक रिकवर कर सकते हैं।`
                  : `"${member.name}" will be deleted. You can recover within 30 days.`}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-btn border border-border-warm py-2 text-sm font-medium text-dark/60 hover:bg-bg-muted"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-btn bg-error py-2 text-sm font-medium text-white hover:bg-error/90"
                >
                  {deleting
                    ? (isHindi ? "हटा रहे हैं..." : "Deleting...")
                    : (isHindi ? "हाँ, हटाएं" : "Yes, Delete")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member View Card */}
        {!editing ? (
          <div className="card overflow-hidden">
            {/* Colored header bar */}
            <div className={`${!member.alive ? "bg-card-deceased" : genderBg} px-6 py-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-dark/50" style={{ fontSize: "28px" }}>
                      {!member.alive ? "spa" : member.gender === "male" ? "person" : member.gender === "female" ? "face_3" : "person"}
                    </span>
                    <div>
                      <h1 className="text-xl font-bold text-earth">
                        {member.name}
                      </h1>
                      {member.nameHi && (
                        <p className="text-sm text-earth/60">{member.nameHi}</p>
                      )}
                    </div>
                  </div>
                  {member.alsoKnownAs && (
                    <p className="mt-1 text-xs text-earth/40 italic">
                      {isHindi ? "उर्फ" : "aka"} {member.alsoKnownAs}
                    </p>
                  )}
                </div>
                {!member.alive && (
                  <span className="text-2xl">🕊</span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-4 space-y-3">
              <DetailRow label={isHindi ? "रिश्ता" : "Relation"} value={getRelationLabel()} />
              <DetailRow label={isHindi ? "पीढ़ी" : "Generation"} value={`Gen ${member.generationLevel >= 0 ? "+" : ""}${member.generationLevel}`} />
              <DetailRow label={isHindi ? "लिंग" : "Gender"} value={t(`member.${member.gender}`)} />
              <DetailRow label={isHindi ? "जन्म तिथि" : "Date of Birth"} value={getDobDisplay()} />
              {!member.alive && member.deathYear && (
                <DetailRow label={isHindi ? "मृत्यु वर्ष" : "Death Year"} value={String(member.deathYear)} />
              )}
              {!member.alive && member.deathTithi && (
                <DetailRow label={isHindi ? "मृत्यु तिथि" : "Death Tithi"} value={member.deathTithi} />
              )}
              {!member.alive && member.teerthSthal && (
                <DetailRow label={isHindi ? "तीर्थ स्थल" : "Teerth Sthal"} value={member.teerthSthal} />
              )}
              {member.occupation && (
                <DetailRow label={isHindi ? "व्यवसाय" : "Occupation"} value={member.occupation} />
              )}
              {member.notes && (
                <DetailRow label={isHindi ? "नोट्स" : "Notes"} value={member.notes} />
              )}
              {member.oralHistory && (
                <DetailRow label={isHindi ? "मौखिक इतिहास" : "Oral History"} value={member.oralHistory} />
              )}
              {member.relationType && member.relationType !== "blood" && (
                <DetailRow label={isHindi ? "रिश्ते का प्रकार" : "Relation Type"} value={member.relationType} />
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-border-warm px-6 py-4 flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>edit</span>
                {t("member.editMember")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-btn border border-error/30 bg-error/5 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>delete</span>
                {t("member.deleteMember")}
              </button>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <div className="card p-6">
            <h2 className="text-lg font-bold text-earth mb-4">{t("member.editMember")}</h2>

            <div className="space-y-4">
              {/* Name */}
              <label className="block">
                <span className="text-sm font-medium text-dark">
                  {isHindi ? "नाम (English)" : "Name (English)"}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field mt-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-dark">
                  {isHindi ? "नाम (हिंदी)" : "Name (Hindi)"}
                </span>
                <TransliterateInput
                  value={nameHi}
                  onChange={setNameHi}
                  placeholder={isHindi ? "हिंदी में नाम" : "Name in Hindi"}
                  className="input-field mt-1"
                />
              </label>

              {/* Also Known As */}
              <label className="block">
                <span className="text-sm font-medium text-dark">
                  {isHindi ? "उर्फ / Also Known As" : "Also Known As"}
                </span>
                <input
                  type="text"
                  value={alsoKnownAs}
                  onChange={(e) => setAlsoKnownAs(e.target.value)}
                  className="input-field mt-1"
                />
              </label>

              {/* Gender */}
              <div>
                <span className="text-sm font-medium text-dark">{t("member.gender")}</span>
                <div className="mt-1 flex gap-2">
                  {(["male", "female", "other"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 rounded-btn border py-2 text-sm font-medium transition-colors ${
                        gender === g
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-warm text-dark/50 hover:bg-bg-muted"
                      }`}
                    >
                      {t(`member.${g}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alive/Deceased */}
              <div>
                <span className="text-sm font-medium text-dark">{t("member.status")}</span>
                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() => setAlive(true)}
                    className={`flex-1 rounded-btn border py-2 text-sm font-medium transition-colors ${
                      alive ? "border-success bg-success/10 text-success" : "border-border-warm text-dark/50 hover:bg-bg-muted"
                    }`}
                  >
                    {t("member.alive")}
                  </button>
                  <button
                    onClick={() => setAlive(false)}
                    className={`flex-1 rounded-btn border py-2 text-sm font-medium transition-colors ${
                      !alive ? "border-dark/30 bg-dark/5 text-dark/70" : "border-border-warm text-dark/50 hover:bg-bg-muted"
                    }`}
                  >
                    🕊 {t("member.deceased")}
                  </button>
                </div>
              </div>

              {/* DOB Type */}
              <div>
                <span className="text-sm font-medium text-dark">{isHindi ? "जन्म तिथि का प्रकार" : "DOB Type"}</span>
                <select
                  value={dobType}
                  onChange={(e) => setDobType(e.target.value as DobType)}
                  className="input-field mt-1"
                >
                  <option value="unknown">{isHindi ? "अज्ञात" : "Unknown"}</option>
                  <option value="exact">{isHindi ? "सटीक तारीख" : "Exact Date"}</option>
                  <option value="year">{isHindi ? "केवल वर्ष" : "Year Only"}</option>
                  <option value="decade">{isHindi ? "अनुमानित दशक" : "Approximate Decade"}</option>
                  <option value="marker">{isHindi ? "ऐतिहासिक संदर्भ" : "Historical Marker"}</option>
                </select>
              </div>

              {dobType === "exact" && (
                <label className="block">
                  <span className="text-sm font-medium text-dark">{isHindi ? "जन्म तिथि" : "Date of Birth"}</span>
                  <input type="date" value={dobExact} onChange={(e) => setDobExact(e.target.value)} className="input-field mt-1" />
                </label>
              )}
              {dobType === "year" && (
                <label className="block">
                  <span className="text-sm font-medium text-dark">{isHindi ? "जन्म वर्ष" : "Birth Year"}</span>
                  <input type="number" value={dobYear} onChange={(e) => setDobYear(e.target.value)} placeholder="1965" className="input-field mt-1" />
                </label>
              )}
              {dobType === "decade" && (
                <label className="block">
                  <span className="text-sm font-medium text-dark">{isHindi ? "दशक" : "Decade"}</span>
                  <select value={dobDecade} onChange={(e) => setDobDecade(e.target.value)} className="input-field mt-1">
                    <option value="">--</option>
                    {DOB_DECADES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
              )}
              {dobType === "marker" && (
                <label className="block">
                  <span className="text-sm font-medium text-dark">{isHindi ? "ऐतिहासिक संदर्भ" : "Historical Marker"}</span>
                  <select value={dobMarker} onChange={(e) => setDobMarker(e.target.value)} className="input-field mt-1">
                    <option value="">--</option>
                    {DOB_MARKERS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </label>
              )}

              {/* Deceased details */}
              {!alive && (
                <div className="rounded-card border border-border-warm bg-bg-muted p-4 space-y-3">
                  <p className="text-sm font-medium text-dark/70">🕊 {t("member.deceasedDetails")}</p>
                  <label className="block">
                    <span className="text-xs text-dark/50">{t("member.deathYear")}</span>
                    <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} placeholder="2010" className="input-field mt-1" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-dark/50">{t("member.deathTithi")}</span>
                    <input type="text" value={deathTithi} onChange={(e) => setDeathTithi(e.target.value)} className="input-field mt-1" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-dark/50">{isHindi ? "तीर्थ स्थल" : "Teerth Sthal"}</span>
                    <select value={teerthSthal} onChange={(e) => setTeerthSthal(e.target.value)} className="input-field mt-1">
                      <option value="">--</option>
                      {TEERTH_STHALS.map((ts) => <option key={ts} value={ts}>{ts}</option>)}
                    </select>
                  </label>
                </div>
              )}

              {/* Occupation */}
              <label className="block">
                <span className="text-sm font-medium text-dark">{t("member.occupation")}</span>
                <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="input-field mt-1" />
              </label>

              {/* Notes */}
              <label className="block">
                <span className="text-sm font-medium text-dark">{t("member.notes")}</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field mt-1" />
              </label>

              {/* Oral History */}
              <label className="block">
                <span className="text-sm font-medium text-dark">{t("member.oralHistory")}</span>
                <textarea value={oralHistory} onChange={(e) => setOralHistory(e.target.value)} rows={3} className="input-field mt-1" />
              </label>
            </div>

            {/* Save/Cancel */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setEditing(false); if (member) populateForm(member); }}
                className="flex-1 rounded-btn border border-border-warm py-2.5 text-sm font-medium text-dark/60 hover:bg-bg-muted"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || (!name && !nameHi)}
                className="btn-primary flex-1"
              >
                {saving ? (isHindi ? "सेव हो रहा है..." : "Saving...") : (isHindi ? "सेव करें" : "Save Changes")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-dark/40 shrink-0">{label}</span>
      <span className="text-sm font-medium text-earth text-right">{value}</span>
    </div>
  );
}
