"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
import { RELATIONS } from "@/lib/relations";
import { DOB_DECADES, DOB_MARKERS, TEERTH_STHALS } from "@/lib/data";
import type { Member, DobType, Gender } from "@/types";

interface MemberModalProps {
  member: Member;
  treeId: string;
  onClose: () => void;
  onUpdated: (member: Member) => void;
  onDeleted: (memberId: string) => void;
}

export function MemberModal({ member, treeId, onClose, onUpdated, onDeleted }: MemberModalProps) {
  const { t, lang } = useTranslation();
  const isHindi = lang === "hi" || lang === "hinglish";

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
  const [name, setName] = useState(member.name || "");
  const [nameHi, setNameHi] = useState(member.nameHi || "");
  const [alsoKnownAs, setAlsoKnownAs] = useState(member.alsoKnownAs || "");
  const [gender, setGender] = useState<Gender>(member.gender);
  const [alive, setAlive] = useState(member.alive);
  const [dobType, setDobType] = useState<DobType>(member.dobType || "unknown");
  const [dobExact, setDobExact] = useState(member.dobType === "exact" ? member.dob || "" : "");
  const [dobYear, setDobYear] = useState(member.dobType === "year" ? member.dob || "" : "");
  const [dobDecade, setDobDecade] = useState(member.dobType === "decade" ? member.dobApproximate || "" : "");
  const [dobMarker, setDobMarker] = useState(member.dobType === "marker" ? member.dobApproximate || "" : "");
  const [deathYear, setDeathYear] = useState(member.deathYear ? String(member.deathYear) : "");
  const [deathTithi, setDeathTithi] = useState(member.deathTithi || "");
  const [teerthSthal, setTeerthSthal] = useState(member.teerthSthal || "");
  const [occupation, setOccupation] = useState(member.occupation || "");
  const [notes, setNotes] = useState(member.notes || "");
  const [oralHistory, setOralHistory] = useState(member.oralHistory || "");

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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
      const res = await api.put<{ member: Member }>(`/api/trees/${treeId}/members/${member.id}`, data);
      onUpdated(res.member);
      setEditing(false);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/trees/${treeId}/members/${member.id}`);
      onDeleted(member.id);
    } catch {
      setError("Failed to delete member");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getRelationLabel = () => {
    const rel = RELATIONS.find((r) => r.key === member.relation);
    if (!rel) return member.relation;
    return lang === "en" ? rel.labelEn : rel.labelHi;
  };

  const getDobDisplay = () => {
    if (member.dobType === "exact" && member.dob) return member.dob;
    if (member.dobType === "year" && member.dob) return member.dob;
    if (member.dobType === "decade" && member.dobApproximate) return `~${member.dobApproximate}`;
    if (member.dobType === "marker" && member.dobApproximate) return member.dobApproximate;
    return isHindi ? "अज्ञात" : "Unknown";
  };

  const genderBg = member.gender === "male" ? "bg-card-male" : member.gender === "female" ? "bg-card-female" : "bg-card-other";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-bg-primary rounded-t-2xl sm:rounded-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-2xl">
            <div className="bg-white rounded-xl p-6 mx-4 text-center max-w-sm animate-fade-in-up">
              <span className="material-symbols-rounded text-error" style={{ fontSize: "40px" }}>delete_forever</span>
              <h3 className="mt-2 text-lg font-bold text-dark">
                {isHindi ? "क्या आप पक्के हैं?" : "Are you sure?"}
              </h3>
              <p className="mt-1 text-sm text-dark/60">
                {isHindi
                  ? `"${member.nameHi || member.name}" को हटाया जाएगा। 30 दिन तक रिकवर कर सकते हैं।`
                  : `"${member.name}" will be deleted. Recoverable for 30 days.`}
              </p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-btn border border-border-warm py-2 text-sm font-medium text-dark/60 hover:bg-bg-muted">
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 rounded-btn bg-error py-2 text-sm font-medium text-white hover:bg-error/90">
                  {deleting ? "..." : isHindi ? "हाँ, हटाएं" : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</div>
        )}

        {!editing ? (
          /* ─── VIEW MODE ─── */
          <>
            {/* Header with close */}
            <div className={`${!member.alive ? "bg-card-deceased" : genderBg} px-5 py-4 rounded-t-2xl sm:rounded-t-2xl`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-dark/50" style={{ fontSize: "28px" }}>
                    {!member.alive ? "spa" : member.gender === "male" ? "person" : member.gender === "female" ? "face_3" : "person"}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-earth">{member.name}</h2>
                    {member.nameHi && <p className="text-sm text-earth/60">{member.nameHi}</p>}
                    {member.alsoKnownAs && <p className="text-xs text-earth/40 italic">{isHindi ? "उर्फ" : "aka"} {member.alsoKnownAs}</p>}
                  </div>
                </div>
                <button onClick={onClose} className="rounded-full p-1 hover:bg-black/10 transition-colors">
                  <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "22px" }}>close</span>
                </button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-2.5">
              <Row label={isHindi ? "रिश्ता" : "Relation"} value={getRelationLabel()} />
              <Row label={isHindi ? "पीढ़ी" : "Generation"} value={`Gen ${member.generationLevel >= 0 ? "+" : ""}${member.generationLevel}`} />
              <Row label={isHindi ? "लिंग" : "Gender"} value={t(`member.${member.gender}`)} />
              <Row label={isHindi ? "जन्म तिथि" : "DOB"} value={getDobDisplay()} />
              {!member.alive && member.deathYear && <Row label={isHindi ? "मृत्यु वर्ष" : "Death Year"} value={String(member.deathYear)} />}
              {!member.alive && member.deathTithi && <Row label={isHindi ? "मृत्यु तिथि" : "Death Tithi"} value={member.deathTithi} />}
              {!member.alive && member.teerthSthal && <Row label={isHindi ? "तीर्थ स्थल" : "Teerth Sthal"} value={member.teerthSthal} />}
              {member.occupation && <Row label={isHindi ? "व्यवसाय" : "Occupation"} value={member.occupation} />}
              {member.notes && <Row label={isHindi ? "नोट्स" : "Notes"} value={member.notes} />}
              {member.oralHistory && <Row label={isHindi ? "मौखिक इतिहास" : "Oral History"} value={member.oralHistory} />}
            </div>

            {/* Actions */}
            <div className="border-t border-border-warm px-5 py-4 flex gap-3">
              <button onClick={() => setEditing(true)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>edit</span>
                {t("member.editMember")}
              </button>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-btn border border-error/30 bg-error/5 py-2.5 text-sm font-medium text-error hover:bg-error/10">
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>delete</span>
                {t("member.deleteMember")}
              </button>
            </div>
          </>
        ) : (
          /* ─── EDIT MODE ─── */
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-earth">{t("member.editMember")}</h2>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-black/10">
                <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "22px" }}>close</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-dark">{isHindi ? "नाम (English)" : "Name (English)"}</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-dark">{isHindi ? "नाम (हिंदी)" : "Name (Hindi)"}</span>
                <input type="text" value={nameHi} onChange={(e) => setNameHi(e.target.value)} className="input-field mt-1 font-hindi" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-dark">{isHindi ? "उर्फ" : "Also Known As"}</span>
                <input type="text" value={alsoKnownAs} onChange={(e) => setAlsoKnownAs(e.target.value)} className="input-field mt-1" />
              </label>

              {/* Gender */}
              <div>
                <span className="text-sm font-medium text-dark">{t("member.gender")}</span>
                <div className="mt-1 flex gap-2">
                  {(["male", "female", "other"] as Gender[]).map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 rounded-btn border py-2 text-sm font-medium transition-colors ${
                        gender === g ? "border-accent bg-accent/10 text-accent" : "border-border-warm text-dark/50 hover:bg-bg-muted"
                      }`}>
                      {t(`member.${g}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alive/Deceased */}
              <div>
                <span className="text-sm font-medium text-dark">{t("member.status")}</span>
                <div className="mt-1 flex gap-2">
                  <button onClick={() => setAlive(true)}
                    className={`flex-1 rounded-btn border py-2 text-sm font-medium ${alive ? "border-success bg-success/10 text-success" : "border-border-warm text-dark/50"}`}>
                    {t("member.alive")}
                  </button>
                  <button onClick={() => setAlive(false)}
                    className={`flex-1 rounded-btn border py-2 text-sm font-medium ${!alive ? "border-dark/30 bg-dark/5 text-dark/70" : "border-border-warm text-dark/50"}`}>
                    🕊 {t("member.deceased")}
                  </button>
                </div>
              </div>

              {/* DOB */}
              <div>
                <span className="text-sm font-medium text-dark">{isHindi ? "जन्म तिथि" : "Date of Birth"}</span>
                <select value={dobType} onChange={(e) => setDobType(e.target.value as DobType)} className="input-field mt-1">
                  <option value="unknown">{isHindi ? "अज्ञात" : "Unknown"}</option>
                  <option value="exact">{isHindi ? "सटीक तारीख" : "Exact Date"}</option>
                  <option value="year">{isHindi ? "केवल वर्ष" : "Year Only"}</option>
                  <option value="decade">{isHindi ? "अनुमानित दशक" : "Approximate Decade"}</option>
                  <option value="marker">{isHindi ? "ऐतिहासिक संदर्भ" : "Historical Marker"}</option>
                </select>
              </div>
              {dobType === "exact" && (
                <input type="date" value={dobExact} onChange={(e) => setDobExact(e.target.value)} className="input-field" />
              )}
              {dobType === "year" && (
                <input type="number" value={dobYear} onChange={(e) => setDobYear(e.target.value)} placeholder="1965" className="input-field" />
              )}
              {dobType === "decade" && (
                <select value={dobDecade} onChange={(e) => setDobDecade(e.target.value)} className="input-field">
                  <option value="">--</option>
                  {DOB_DECADES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
              {dobType === "marker" && (
                <select value={dobMarker} onChange={(e) => setDobMarker(e.target.value)} className="input-field">
                  <option value="">--</option>
                  {DOB_MARKERS.map((m) => <option key={m.value} value={m.value}>{isHindi ? m.label.hi : m.label.en}</option>)}
                </select>
              )}

              {/* Deceased details */}
              {!alive && (
                <div className="rounded-card border border-border-warm bg-bg-muted p-3 space-y-3">
                  <p className="text-sm font-medium text-dark/70">🕊 {t("member.deceasedDetails")}</p>
                  <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} placeholder={isHindi ? "मृत्यु वर्ष" : "Death Year"} className="input-field" />
                  <input type="text" value={deathTithi} onChange={(e) => setDeathTithi(e.target.value)} placeholder={isHindi ? "मृत्यु तिथि" : "Death Tithi"} className="input-field" />
                  <select value={teerthSthal} onChange={(e) => setTeerthSthal(e.target.value)} className="input-field">
                    <option value="">{isHindi ? "तीर्थ स्थल" : "Teerth Sthal"}</option>
                    {TEERTH_STHALS.map((ts) => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>
              )}

              <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder={isHindi ? "व्यवसाय" : "Occupation"} className="input-field" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={isHindi ? "नोट्स" : "Notes"} className="input-field" />
              <textarea value={oralHistory} onChange={(e) => setOralHistory(e.target.value)} rows={2} placeholder={isHindi ? "मौखिक इतिहास" : "Oral History"} className="input-field" />
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={() => setEditing(false)}
                className="flex-1 rounded-btn border border-border-warm py-2.5 text-sm font-medium text-dark/60 hover:bg-bg-muted">
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button onClick={handleSave} disabled={saving || (!name && !nameHi)}
                className="btn-primary flex-1">
                {saving ? "..." : isHindi ? "सेव करें" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-dark/40 shrink-0">{label}</span>
      <span className="text-sm font-medium text-earth text-right">{value}</span>
    </div>
  );
}
