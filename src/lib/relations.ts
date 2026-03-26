import type { RelationGroup, RelationType, Gender } from "@/types";

export interface RelationConfig {
  key: string;
  labelHi: string;
  labelEn: string;
  group: RelationGroup;
  relationType: RelationType;
  generationLevel: number;
  gender: Gender;
  triggersMarriage?: boolean;
}

export const RELATION_GROUPS: { key: RelationGroup; labelHi: string; labelEn: string }[] = [
  { key: "paternal", labelHi: "पितृपक्ष", labelEn: "Paternal" },
  { key: "maternal", labelHi: "मातृपक्ष", labelEn: "Maternal" },
  { key: "self", labelHi: "स्वयं", labelEn: "Self / Siblings / Spouse" },
  { key: "inlaw", labelHi: "ससुराल", labelEn: "In-Laws" },
  { key: "children", labelHi: "संतान", labelEn: "Children & Descendants" },
];

export const RELATIONS: RelationConfig[] = [
  // ─── Paternal ───
  { key: "father", labelHi: "पिता", labelEn: "Father", group: "paternal", relationType: "blood", generationLevel: -1, gender: "male" },
  { key: "mother", labelHi: "माता", labelEn: "Mother", group: "paternal", relationType: "marriage", generationLevel: -1, gender: "female" },
  { key: "dada", labelHi: "दादा", labelEn: "Grandfather (Paternal)", group: "paternal", relationType: "blood", generationLevel: -2, gender: "male" },
  { key: "dadi", labelHi: "दादी", labelEn: "Grandmother (Paternal)", group: "paternal", relationType: "marriage", generationLevel: -2, gender: "female" },
  { key: "pardada", labelHi: "परदादा", labelEn: "Great-Grandfather", group: "paternal", relationType: "blood", generationLevel: -3, gender: "male" },
  { key: "pardadi", labelHi: "परदादी", labelEn: "Great-Grandmother", group: "paternal", relationType: "marriage", generationLevel: -3, gender: "female" },
  { key: "tau", labelHi: "ताऊ", labelEn: "Elder Uncle (Father's Elder Brother)", group: "paternal", relationType: "blood", generationLevel: -1, gender: "male" },
  { key: "tai", labelHi: "ताई", labelEn: "Elder Aunt (Tau's Wife)", group: "paternal", relationType: "marriage", generationLevel: -1, gender: "female" },
  { key: "chacha", labelHi: "चाचा", labelEn: "Uncle (Father's Younger Brother)", group: "paternal", relationType: "blood", generationLevel: -1, gender: "male" },
  { key: "chachi", labelHi: "चाची", labelEn: "Aunt (Chacha's Wife)", group: "paternal", relationType: "marriage", generationLevel: -1, gender: "female" },
  { key: "bua", labelHi: "बुआ", labelEn: "Aunt (Father's Sister)", group: "paternal", relationType: "blood", generationLevel: -1, gender: "female" },
  { key: "fufa", labelHi: "फूफा", labelEn: "Uncle (Bua's Husband)", group: "paternal", relationType: "marriage", generationLevel: -1, gender: "male" },
  { key: "paternal_cousin", labelHi: "चचेरा भाई/बहन", labelEn: "Paternal Cousin", group: "paternal", relationType: "blood", generationLevel: 0, gender: "male" },

  // ─── Maternal ───
  { key: "nana", labelHi: "नाना", labelEn: "Grandfather (Maternal)", group: "maternal", relationType: "blood", generationLevel: -2, gender: "male" },
  { key: "nani", labelHi: "नानी", labelEn: "Grandmother (Maternal)", group: "maternal", relationType: "marriage", generationLevel: -2, gender: "female" },
  { key: "mama", labelHi: "मामा", labelEn: "Uncle (Mother's Brother)", group: "maternal", relationType: "blood", generationLevel: -1, gender: "male" },
  { key: "mami", labelHi: "मामी", labelEn: "Aunt (Mama's Wife)", group: "maternal", relationType: "marriage", generationLevel: -1, gender: "female" },
  { key: "mausi", labelHi: "मौसी", labelEn: "Aunt (Mother's Sister)", group: "maternal", relationType: "blood", generationLevel: -1, gender: "female" },
  { key: "mausa", labelHi: "मौसा", labelEn: "Uncle (Mausi's Husband)", group: "maternal", relationType: "marriage", generationLevel: -1, gender: "male" },
  { key: "maternal_cousin", labelHi: "ममेरा भाई/बहन", labelEn: "Maternal Cousin", group: "maternal", relationType: "blood", generationLevel: 0, gender: "male" },

  // ─── Self / Siblings / Spouse ───
  { key: "wife", labelHi: "पत्नी", labelEn: "Wife", group: "self", relationType: "marriage", generationLevel: 0, gender: "female", triggersMarriage: true },
  { key: "husband", labelHi: "पति", labelEn: "Husband", group: "self", relationType: "marriage", generationLevel: 0, gender: "male", triggersMarriage: true },
  { key: "elder_brother", labelHi: "बड़ा भाई", labelEn: "Elder Brother", group: "self", relationType: "blood", generationLevel: 0, gender: "male" },
  { key: "younger_brother", labelHi: "छोटा भाई", labelEn: "Younger Brother", group: "self", relationType: "blood", generationLevel: 0, gender: "male" },
  { key: "elder_sister", labelHi: "दीदी", labelEn: "Elder Sister", group: "self", relationType: "blood", generationLevel: 0, gender: "female" },
  { key: "younger_sister", labelHi: "छोटी बहन", labelEn: "Younger Sister", group: "self", relationType: "blood", generationLevel: 0, gender: "female" },
  { key: "step_brother", labelHi: "सौतेला भाई", labelEn: "Step Brother", group: "self", relationType: "step", generationLevel: 0, gender: "male" },
  { key: "step_sister", labelHi: "सौतेली बहन", labelEn: "Step Sister", group: "self", relationType: "step", generationLevel: 0, gender: "female" },

  // ─── In-Laws ───
  { key: "sasur", labelHi: "ससुर", labelEn: "Father-in-Law", group: "inlaw", relationType: "marriage", generationLevel: -1, gender: "male" },
  { key: "saas", labelHi: "सास", labelEn: "Mother-in-Law", group: "inlaw", relationType: "marriage", generationLevel: -1, gender: "female" },
  { key: "sala", labelHi: "साला", labelEn: "Brother-in-Law (Wife's Brother)", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "male" },
  { key: "sali", labelHi: "साली", labelEn: "Sister-in-Law (Wife's Sister)", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "female" },
  { key: "jija", labelHi: "जीजा/बहनोई", labelEn: "Brother-in-Law (Sister's Husband)", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "male" },
  { key: "bhabhi", labelHi: "भाभी", labelEn: "Sister-in-Law (Brother's Wife)", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "female" },
  { key: "jeth", labelHi: "जेठ", labelEn: "Elder Brother-in-Law", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "male" },
  { key: "devar", labelHi: "देवर", labelEn: "Younger Brother-in-Law", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "male" },
  { key: "nanad", labelHi: "ननद", labelEn: "Sister-in-Law (Husband's Sister)", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "female" },
  { key: "nandoi", labelHi: "नंदोई", labelEn: "Nanad's Husband", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "male" },
  { key: "jethani", labelHi: "जेठानी", labelEn: "Jeth's Wife", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "female" },
  { key: "devrani", labelHi: "देवरानी", labelEn: "Devar's Wife", group: "inlaw", relationType: "marriage", generationLevel: 0, gender: "female" },
  { key: "samdhi", labelHi: "समधी", labelEn: "Samdhi (Co-in-law, Male)", group: "inlaw", relationType: "marriage", generationLevel: -1, gender: "male" },
  { key: "samdhan", labelHi: "समधन", labelEn: "Samdhan (Co-in-law, Female)", group: "inlaw", relationType: "marriage", generationLevel: -1, gender: "female" },

  // ─── Children & Descendants ───
  { key: "son", labelHi: "पुत्र", labelEn: "Son", group: "children", relationType: "blood", generationLevel: 1, gender: "male" },
  { key: "daughter", labelHi: "पुत्री", labelEn: "Daughter", group: "children", relationType: "blood", generationLevel: 1, gender: "female" },
  { key: "adopted_son", labelHi: "दत्तक पुत्र", labelEn: "Adopted Son", group: "children", relationType: "adopted", generationLevel: 1, gender: "male" },
  { key: "adopted_daughter", labelHi: "दत्तक पुत्री", labelEn: "Adopted Daughter", group: "children", relationType: "adopted", generationLevel: 1, gender: "female" },
  { key: "step_son", labelHi: "सौतेला पुत्र", labelEn: "Step Son", group: "children", relationType: "step", generationLevel: 1, gender: "male" },
  { key: "step_daughter", labelHi: "सौतेली पुत्री", labelEn: "Step Daughter", group: "children", relationType: "step", generationLevel: 1, gender: "female" },
  { key: "son_in_law", labelHi: "दामाद", labelEn: "Son-in-Law", group: "children", relationType: "marriage", generationLevel: 1, gender: "male", triggersMarriage: true },
  { key: "daughter_in_law", labelHi: "बहू", labelEn: "Daughter-in-Law", group: "children", relationType: "marriage", generationLevel: 1, gender: "female", triggersMarriage: true },
  { key: "bhatija", labelHi: "भतीजा", labelEn: "Nephew (Brother's Son)", group: "children", relationType: "blood", generationLevel: 1, gender: "male" },
  { key: "bhatiji", labelHi: "भतीजी", labelEn: "Niece (Brother's Daughter)", group: "children", relationType: "blood", generationLevel: 1, gender: "female" },
  { key: "bhanja", labelHi: "भांजा", labelEn: "Nephew (Sister's Son)", group: "children", relationType: "blood", generationLevel: 1, gender: "male" },
  { key: "bhanji", labelHi: "भांजी", labelEn: "Niece (Sister's Daughter)", group: "children", relationType: "blood", generationLevel: 1, gender: "female" },
  { key: "pota", labelHi: "पोता", labelEn: "Grandson (Son's Son)", group: "children", relationType: "blood", generationLevel: 2, gender: "male" },
  { key: "poti", labelHi: "पोती", labelEn: "Granddaughter (Son's Daughter)", group: "children", relationType: "blood", generationLevel: 2, gender: "female" },
  { key: "nati", labelHi: "नाती", labelEn: "Grandson (Daughter's Son)", group: "children", relationType: "blood", generationLevel: 2, gender: "male" },
  { key: "natin", labelHi: "नातिन", labelEn: "Granddaughter (Daughter's Daughter)", group: "children", relationType: "blood", generationLevel: 2, gender: "female" },
  { key: "parpota", labelHi: "परपोता", labelEn: "Great-Grandson", group: "children", relationType: "blood", generationLevel: 3, gender: "male" },
  { key: "parpoti", labelHi: "परपोती", labelEn: "Great-Granddaughter", group: "children", relationType: "blood", generationLevel: 3, gender: "female" },
];

export function getRelationConfig(key: string): RelationConfig | undefined {
  return RELATIONS.find((r) => r.key === key);
}

export function getRelationsByGroup(group: RelationGroup): RelationConfig[] {
  return RELATIONS.filter((r) => r.group === group);
}
