"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { api } from "@/lib/api-client";
import { RELATIONS, RELATION_GROUPS } from "@/lib/relations";
import { DOB_DECADES, DOB_MARKERS, TEERTH_STHALS } from "@/lib/data";
import type { Member, Marriage, DobType, Gender, RelationGroup, MarriageStatus, SurnamePreference, MarriageVisibility } from "@/types";

interface MemberModalProps {
  member: Member;
  treeId: string;
  onClose: () => void;
  onUpdated: (member: Member) => void;
  onDeleted: (memberId: string) => void;
}

type Tab = "details" | "marriage";

const MARRIAGE_STATUSES: { value: MarriageStatus; labelHi: string; labelEn: string }[] = [
  { value: "active", labelHi: "सक्रिय", labelEn: "Active" },
  { value: "widowed", labelHi: "विधवा/विधुर", labelEn: "Widowed" },
  { value: "divorced", labelHi: "तलाकशुदा", labelEn: "Divorced" },
  { value: "separated", labelHi: "अलग", labelEn: "Separated" },
  { value: "annulled", labelHi: "रद्द", labelEn: "Annulled" },
];

const SURNAME_PREFS: { value: SurnamePreference; labelHi: string; labelEn: string }[] = [
  { value: "keep_maiden", labelHi: "मायके का नाम रखें", labelEn: "Keep Maiden Name" },
  { value: "husband", labelHi: "पति का उपनाम", labelEn: "Husband's Surname" },
  { value: "both", labelHi: "दोनों नाम", labelEn: "Both Names" },
  { value: "hyphenated", labelHi: "संयुक्त", labelEn: "Hyphenated" },
];

const VISIBILITY_OPTS: { value: MarriageVisibility; labelHi: string; labelEn: string }[] = [
  { value: "visible_all", labelHi: "सभी को दिखे", labelEn: "Visible to All" },
  { value: "branch_only", labelHi: "केवल शाखा को", labelEn: "Branch Only" },
  { value: "hidden", labelHi: "छुपा हुआ", labelEn: "Hidden" },
];

export function MemberModal({ member, treeId, onClose, onUpdated, onDeleted }: MemberModalProps) {
  const { t, lang } = useTranslation();
  const isHindi = lang === "hi" || lang === "hinglish";

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("details");

  // ── Member edit state ──
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

  // ── Relation edit state ──
  const [relation, setRelation] = useState(member.relation);
  const [selectedGroup, setSelectedGroup] = useState<RelationGroup | "">(member.relationGroup || "");
  const [relationSearch, setRelationSearch] = useState("");

  // ── Marriage state ──
  const [marriageList, setMarriageList] = useState<Marriage[]>([]);
  const [marriageLoading, setMarriageLoading] = useState(false);
  const [editingMarriage, setEditingMarriage] = useState<Marriage | null>(null);
  const [savingMarriage, setSavingMarriage] = useState(false);

  // Marriage form state
  const [mSpouseName, setMSpouseName] = useState("");
  const [mSpouseFatherName, setMSpouseFatherName] = useState("");
  const [mSpouseGotra, setMSpouseGotra] = useState("");
  const [mSpouseKulDevta, setMSpouseKulDevta] = useState("");
  const [mSpouseVillage, setMSpouseVillage] = useState("");
  const [mSpouseDistrict, setMSpouseDistrict] = useState("");
  const [mDate, setMDate] = useState("");
  const [mStatus, setMStatus] = useState<MarriageStatus>("active");
  const [mEndDate, setMEndDate] = useState("");
  const [mMaidenName, setMMaidenName] = useState("");
  const [mDisplayPref, setMDisplayPref] = useState<SurnamePreference>("keep_maiden");
  const [mVisibility, setMVisibility] = useState<MarriageVisibility>("visible_all");

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

  // Load marriages when tab switches
  const loadMarriages = useCallback(async () => {
    setMarriageLoading(true);
    try {
      const res = await api.get<{ marriages: Marriage[] }>(`/api/trees/${treeId}/members/${member.id}/marriages`);
      setMarriageList(res.marriages || []);
    } catch { /* ignore */ }
    setMarriageLoading(false);
  }, [treeId, member.id]);

  useEffect(() => {
    if (tab === "marriage") loadMarriages();
  }, [tab, loadMarriages]);

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
      const rel = RELATIONS.find((r) => r.key === relation);
      const data = {
        name: name || nameHi,
        nameHi: nameHi || undefined,
        alsoKnownAs: alsoKnownAs || undefined,
        gender,
        alive,
        relation,
        relationGroup: rel?.group || member.relationGroup,
        relationType: rel?.relationType || member.relationType,
        generationLevel: rel?.generationLevel ?? member.generationLevel,
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

  // ── Marriage save ──
  const resetMarriageForm = () => {
    setMSpouseName(""); setMSpouseFatherName(""); setMSpouseGotra("");
    setMSpouseKulDevta(""); setMSpouseVillage(""); setMSpouseDistrict("");
    setMDate(""); setMStatus("active"); setMEndDate(""); setMMaidenName("");
    setMDisplayPref("keep_maiden"); setMVisibility("visible_all");
    setEditingMarriage(null);
  };

  const loadMarriageIntoForm = (m: Marriage) => {
    setEditingMarriage(m);
    setMSpouseName(m.spouseName || "");
    setMSpouseFatherName(m.spouseFatherName || "");
    setMSpouseGotra(m.spouseGotra || "");
    setMSpouseKulDevta(m.spouseKulDevta || "");
    setMSpouseVillage(m.spouseVillage || "");
    setMSpouseDistrict(m.spouseDistrict || "");
    setMDate(m.marriageDate || "");
    setMStatus((m.marriageStatus as MarriageStatus) || "active");
    setMEndDate(m.endDate || "");
    setMMaidenName(m.maidenName || "");
    setMDisplayPref((m.displayPreference as SurnamePreference) || "keep_maiden");
    setMVisibility((m.visibility as MarriageVisibility) || "visible_all");
  };

  const handleSaveMarriage = async () => {
    setSavingMarriage(true);
    setError("");
    try {
      const payload = {
        spouseName: mSpouseName || undefined,
        spouseFatherName: mSpouseFatherName || undefined,
        spouseGotra: mSpouseGotra || undefined,
        spouseKulDevta: mSpouseKulDevta || undefined,
        spouseVillage: mSpouseVillage || undefined,
        spouseDistrict: mSpouseDistrict || undefined,
        marriageDate: mDate || undefined,
        marriageStatus: mStatus,
        endDate: mStatus !== "active" ? mEndDate || undefined : undefined,
        maidenName: mMaidenName || undefined,
        displayPreference: mDisplayPref,
        visibility: mVisibility,
      };

      if (editingMarriage) {
        await api.put(`/api/trees/${treeId}/members/${member.id}/marriages`, {
          marriageId: editingMarriage.id,
          ...payload,
        });
      } else {
        await api.post(`/api/trees/${treeId}/members/${member.id}/marriages`, payload);
      }
      resetMarriageForm();
      loadMarriages();
    } catch {
      setError("Failed to save marriage");
    } finally {
      setSavingMarriage(false);
    }
  };

  const getRelationLabel = () => {
    const rel = RELATIONS.find((r) => r.key === member.relation);
    if (!rel) return member.relation;
    return isHindi ? rel.labelHi : rel.labelEn;
  };

  const getDobDisplay = () => {
    if (member.dobType === "exact" && member.dob) return member.dob;
    if (member.dobType === "year" && member.dob) return member.dob;
    if (member.dobType === "decade" && member.dobApproximate) return `~${member.dobApproximate}`;
    if (member.dobType === "marker" && member.dobApproximate) return member.dobApproximate;
    return isHindi ? "अज्ञात" : "Unknown";
  };

  const genderBg = member.gender === "male" ? "bg-card-male" : member.gender === "female" ? "bg-card-female" : "bg-card-other";

  // Filter relations for edit dropdown
  const filteredRelations = RELATIONS.filter((r) => {
    if (selectedGroup && r.group !== selectedGroup) return false;
    if (relationSearch) {
      const q = relationSearch.toLowerCase();
      return r.labelEn.toLowerCase().includes(q) || r.labelHi.includes(q) || r.key.includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-bg-primary rounded-t-2xl sm:rounded-2xl animate-fade-in-up"
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
            {/* Header */}
            <div className={`${!member.alive ? "bg-card-deceased" : genderBg} px-5 py-4 rounded-t-2xl`}>
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

            {/* Tabs */}
            <div className="flex border-b border-border-warm">
              <button onClick={() => setTab("details")}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === "details" ? "border-b-2 border-accent text-accent" : "text-dark/40"}`}>
                {isHindi ? "विवरण" : "Details"}
              </button>
              <button onClick={() => setTab("marriage")}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === "marriage" ? "border-b-2 border-accent text-accent" : "text-dark/40"}`}>
                {isHindi ? "विवाह" : "Marriage"} 💑
              </button>
            </div>

            {tab === "details" ? (
              <div className="px-5 py-4 space-y-2.5">
                <Row label={isHindi ? "रिश्ता" : "Relation"} value={getRelationLabel()} />
                <Row label={isHindi ? "पीढ़ी" : "Generation"} value={`Gen ${member.generationLevel >= 0 ? "+" : ""}${member.generationLevel}`} />
                <Row label={isHindi ? "प्रकार" : "Type"} value={member.relationType} badge />
                <Row label={isHindi ? "लिंग" : "Gender"} value={t(`member.${member.gender}`)} />
                <Row label={isHindi ? "जन्म तिथि" : "DOB"} value={getDobDisplay()} />
                {!member.alive && member.deathYear && <Row label={isHindi ? "मृत्यु वर्ष" : "Death Year"} value={String(member.deathYear)} />}
                {!member.alive && member.deathTithi && <Row label={isHindi ? "मृत्यु तिथि" : "Death Tithi"} value={member.deathTithi} />}
                {!member.alive && member.teerthSthal && <Row label={isHindi ? "तीर्थ स्थल" : "Teerth Sthal"} value={member.teerthSthal} />}
                {member.occupation && <Row label={isHindi ? "व्यवसाय" : "Occupation"} value={member.occupation} />}
                {member.notes && <Row label={isHindi ? "नोट्स" : "Notes"} value={member.notes} />}
                {member.oralHistory && <Row label={isHindi ? "मौखिक इतिहास" : "Oral History"} value={member.oralHistory} />}
              </div>
            ) : (
              /* Marriage tab */
              <div className="px-5 py-4">
                {marriageLoading ? (
                  <p className="text-sm text-dark/40 text-center py-4">{t("common.loading")}</p>
                ) : marriageList.length === 0 && !editingMarriage ? (
                  <div className="text-center py-6">
                    <span className="material-symbols-rounded text-dark/20" style={{ fontSize: "40px" }}>favorite</span>
                    <p className="mt-2 text-sm text-dark/40">
                      {isHindi ? "कोई विवाह रिकॉर्ड नहीं" : "No marriage records"}
                    </p>
                    <button onClick={() => { resetMarriageForm(); setEditingMarriage({} as Marriage); }}
                      className="btn-primary mt-3 text-xs">
                      {isHindi ? "विवाह जोड़ें" : "Add Marriage"} 💑
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Existing marriages */}
                    {marriageList.map((m) => (
                      <div key={m.id} className="mb-3 rounded-card border border-border-warm bg-bg-muted p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-earth">{m.spouseName || (isHindi ? "अज्ञात" : "Unknown")}</p>
                            {m.spouseGotra && <p className="text-xs text-dark/40">{m.spouseGotra} गोत्र</p>}
                            {m.spouseVillage && <p className="text-xs text-dark/40">📍 {m.spouseVillage}{m.spouseDistrict ? `, ${m.spouseDistrict}` : ""}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] rounded px-1.5 py-0.5 font-medium ${
                              m.marriageStatus === "active" ? "bg-success/10 text-success" :
                              m.marriageStatus === "widowed" ? "bg-dark/10 text-dark/50" :
                              "bg-warning/10 text-warning"
                            }`}>
                              {MARRIAGE_STATUSES.find((s) => s.value === m.marriageStatus)?.[isHindi ? "labelHi" : "labelEn"] || m.marriageStatus}
                            </span>
                            <button onClick={() => loadMarriageIntoForm(m)}
                              className="p-1 rounded hover:bg-black/10">
                              <span className="material-symbols-rounded text-dark/40" style={{ fontSize: "16px" }}>edit</span>
                            </button>
                          </div>
                        </div>
                        {m.marriageDate && <p className="mt-1 text-xs text-dark/30">📅 {m.marriageDate}</p>}
                        {m.maidenName && <p className="mt-0.5 text-xs text-dark/30 italic">née {m.maidenName}</p>}
                      </div>
                    ))}

                    {/* Marriage form (add or edit) */}
                    {editingMarriage !== null && (
                      <div className="mt-3 rounded-card border border-accent/30 bg-accent/5 p-4 space-y-3">
                        <h3 className="text-sm font-bold text-earth">
                          {editingMarriage?.id ? (isHindi ? "विवाह संपादित करें" : "Edit Marriage") : (isHindi ? "नया विवाह जोड़ें" : "Add Marriage")}
                        </h3>

                        <Field label={isHindi ? "जीवनसाथी का नाम" : "Spouse Name"}>
                          <input type="text" value={mSpouseName} onChange={(e) => setMSpouseName(e.target.value)} className="input-field" />
                        </Field>
                        <Field label={isHindi ? "जीवनसाथी के पिता" : "Spouse's Father"}>
                          <input type="text" value={mSpouseFatherName} onChange={(e) => setMSpouseFatherName(e.target.value)} className="input-field" />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label={isHindi ? "गोत्र" : "Gotra"}>
                            <input type="text" value={mSpouseGotra} onChange={(e) => setMSpouseGotra(e.target.value)} className="input-field" />
                          </Field>
                          <Field label={isHindi ? "कुलदेवता" : "Kul Devta"}>
                            <input type="text" value={mSpouseKulDevta} onChange={(e) => setMSpouseKulDevta(e.target.value)} className="input-field" />
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label={isHindi ? "गांव" : "Village"}>
                            <input type="text" value={mSpouseVillage} onChange={(e) => setMSpouseVillage(e.target.value)} className="input-field" />
                          </Field>
                          <Field label={isHindi ? "जिला" : "District"}>
                            <input type="text" value={mSpouseDistrict} onChange={(e) => setMSpouseDistrict(e.target.value)} className="input-field" />
                          </Field>
                        </div>
                        <Field label={isHindi ? "विवाह तिथि" : "Marriage Date"}>
                          <input type="date" value={mDate} onChange={(e) => setMDate(e.target.value)} className="input-field" />
                        </Field>

                        <Field label={isHindi ? "स्थिति" : "Status"}>
                          <select value={mStatus} onChange={(e) => setMStatus(e.target.value as MarriageStatus)} className="input-field">
                            {MARRIAGE_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>{isHindi ? s.labelHi : s.labelEn}</option>
                            ))}
                          </select>
                        </Field>

                        {mStatus !== "active" && (
                          <Field label={isHindi ? "समाप्ति तिथि" : "End Date"}>
                            <input type="date" value={mEndDate} onChange={(e) => setMEndDate(e.target.value)} className="input-field" />
                          </Field>
                        )}

                        <Field label={isHindi ? "मायके का नाम (née)" : "Maiden Name (née)"}>
                          <input type="text" value={mMaidenName} onChange={(e) => setMMaidenName(e.target.value)} className="input-field" placeholder="Patil" />
                        </Field>

                        <Field label={isHindi ? "नाम प्रदर्शन" : "Name Display"}>
                          <select value={mDisplayPref} onChange={(e) => setMDisplayPref(e.target.value as SurnamePreference)} className="input-field">
                            {SURNAME_PREFS.map((p) => (
                              <option key={p.value} value={p.value}>{isHindi ? p.labelHi : p.labelEn}</option>
                            ))}
                          </select>
                        </Field>

                        <Field label={isHindi ? "दृश्यता" : "Visibility"}>
                          <select value={mVisibility} onChange={(e) => setMVisibility(e.target.value as MarriageVisibility)} className="input-field">
                            {VISIBILITY_OPTS.map((v) => (
                              <option key={v.value} value={v.value}>{isHindi ? v.labelHi : v.labelEn}</option>
                            ))}
                          </select>
                        </Field>

                        <div className="flex gap-2 pt-1">
                          <button onClick={resetMarriageForm}
                            className="flex-1 rounded-btn border border-border-warm py-2 text-xs font-medium text-dark/50 hover:bg-bg-muted">
                            {isHindi ? "रद्द" : "Cancel"}
                          </button>
                          <button onClick={handleSaveMarriage} disabled={savingMarriage}
                            className="btn-primary flex-1 text-xs">
                            {savingMarriage ? "..." : isHindi ? "सेव" : "Save"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Add another button */}
                    {editingMarriage === null && (
                      <button onClick={() => { resetMarriageForm(); setEditingMarriage({} as Marriage); }}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-btn border border-dashed border-accent/30 py-2 text-xs font-medium text-accent hover:bg-accent/5">
                        <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
                        {isHindi ? "विवाह जोड़ें" : "Add Marriage"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

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
              {/* Names */}
              <Field label={isHindi ? "नाम (English)" : "Name (English)"}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              </Field>
              <Field label={isHindi ? "नाम (हिंदी)" : "Name (Hindi)"}>
                <input type="text" value={nameHi} onChange={(e) => setNameHi(e.target.value)} className="input-field font-hindi" />
              </Field>
              <Field label={isHindi ? "उर्फ" : "Also Known As"}>
                <input type="text" value={alsoKnownAs} onChange={(e) => setAlsoKnownAs(e.target.value)} className="input-field" />
              </Field>

              {/* ── Relation Selector ── */}
              <div className="rounded-card border border-border-warm bg-bg-muted p-3 space-y-2">
                <p className="text-sm font-medium text-dark">{isHindi ? "रिश्ता बदलें" : "Change Relation"}</p>

                {/* Group pills */}
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setSelectedGroup("")}
                    className={`rounded-btn px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      !selectedGroup ? "bg-accent text-white" : "border border-border-warm text-dark/40 hover:bg-bg-muted"
                    }`}>
                    {isHindi ? "सभी" : "All"}
                  </button>
                  {RELATION_GROUPS.map((g) => (
                    <button key={g.key} onClick={() => setSelectedGroup(g.key)}
                      className={`rounded-btn px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        selectedGroup === g.key ? "bg-accent text-white" : "border border-border-warm text-dark/40 hover:bg-bg-muted"
                      }`}>
                      {isHindi ? g.labelHi : g.labelEn}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <input
                  type="text"
                  value={relationSearch}
                  onChange={(e) => setRelationSearch(e.target.value)}
                  placeholder={isHindi ? "खोजें..." : "Search..."}
                  className="input-field text-xs"
                />

                {/* Relation list */}
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filteredRelations.map((r) => (
                    <button key={r.key} onClick={() => { setRelation(r.key); setRelationSearch(""); }}
                      className={`w-full text-left rounded-btn px-3 py-1.5 text-xs transition-colors ${
                        relation === r.key ? "bg-accent/10 text-accent font-medium" : "text-dark/60 hover:bg-bg-muted"
                      }`}>
                      {isHindi ? r.labelHi : r.labelEn}
                      <span className="ml-1 text-[9px] text-dark/30">({isHindi ? r.labelEn : r.labelHi})</span>
                      {r.relationType !== "blood" && (
                        <span className="ml-1 rounded bg-accent/15 px-1 text-[9px] text-accent">{r.relationType}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

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
              <textarea value={oralHistory} onChange={(e) => setOralHistory(e.target.value)} rows={2} placeholder={isHindi ? "मौखिक इतिहास / कहानियां" : "Oral History / Stories"} className="input-field" />
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-dark/60">{label}</span>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}

function Row({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-dark/40 shrink-0">{label}</span>
      {badge ? (
        <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">{value}</span>
      ) : (
        <span className="text-sm font-medium text-earth text-right">{value}</span>
      )}
    </div>
  );
}
