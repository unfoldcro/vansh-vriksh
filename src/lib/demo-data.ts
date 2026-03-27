import type { Member, TreeMetadata } from "@/types";

export const DEMO_TREE_ID = "PATIL-1985-DEMO";

// Helper to reduce boilerplate
const ts = new Date().toISOString();
function m(
  id: string, name: string, nameHi: string, relation: string,
  relationGroup: "paternal" | "maternal" | "self" | "inlaw" | "children",
  relationType: "blood" | "marriage" | "adopted" | "step" | "dharma",
  gen: number, gender: "male" | "female" | "other", alive: boolean,
  extra?: Partial<Member>
): Member {
  return {
    id, name, nameHi, relation, relationGroup, relationType,
    generationLevel: gen, gender, alive, dobType: "unknown",
    status: "active", addedBy: "demo", createdAt: ts, updatedAt: ts,
    ...extra,
  };
}

// ─── Full 5-generation Patil family ───
// Gen -3: Great-grandparents (pardada/pardadi)
// Gen -2: Grandparents (dada/dadi) + Grand-uncle (tau)
// Gen -1: Parents + Uncle (chacha) + Aunt (bua)
// Gen  0: Self + Wife + Brother + Bhabhi + Cousin
// Gen +1: Children + Nephew
// Gen +2: Grandchild

export const DEMO_MEMBERS: Member[] = [
  // ── Gen -3: Great-grandparents ──
  m("d01", "Ramji Patil", "रामजी पाटिल", "pardada", "paternal", "blood", -3, "male", false,
    { deathYear: 1978, deathTithi: "भाद्रपद कृष्ण अमावस्या", teerthSthal: "Ujjain" }),
  m("d02", "Savitri Patil", "सावित्री पाटिल", "pardadi", "paternal", "blood", -3, "female", false,
    { deathYear: 1982 }),

  // ── Gen -2: Grandparents + Grand-uncle ──
  m("d03", "Govind Patil", "गोविंद पाटिल", "dada", "paternal", "blood", -2, "male", false,
    { dob: "1935", dobType: "year", deathYear: 2005, teerthSthal: "Omkareshwar", occupation: "Farmer" }),
  m("d04", "Laxmi Patil", "लक्ष्मी पाटिल", "dadi", "paternal", "blood", -2, "female", false,
    { deathYear: 2012, alsoKnownAs: "née Sharma / नी शर्मा" }),
  m("d05", "Bhagwan Patil", "भगवान पाटिल", "tau", "paternal", "blood", -2, "male", false,
    { dob: "1932", dobType: "year", deathYear: 2001, occupation: "Teacher" }),
  m("d06", "Kamal Patil", "कमल पाटिल", "tai", "paternal", "marriage", -2, "female", true,
    { alsoKnownAs: "née Joshi / नी जोशी" }),

  // ── Gen -1: Parents + Uncle + Aunt ──
  m("d07", "Suresh Patil", "सुरेश पाटिल", "father", "paternal", "blood", -1, "male", true,
    { dob: "1958", dobType: "year", occupation: "Government Service" }),
  m("d08", "Kamla Patil", "कमला पाटिल", "mother", "paternal", "marriage", -1, "female", true,
    { dob: "1962", dobType: "year", alsoKnownAs: "née Joshi / नी जोशी" }),
  m("d09", "Dinesh Patil", "दिनेश पाटिल", "chacha", "paternal", "blood", -1, "male", true,
    { dob: "1963", dobType: "year", occupation: "Shop Owner" }),
  m("d10", "Saroj Patil", "सरोज पाटिल", "chachi", "paternal", "marriage", -1, "female", true,
    { alsoKnownAs: "née Verma / नी वर्मा" }),
  m("d11", "Lata Gupta", "लता गुप्ता", "bua", "paternal", "blood", -1, "female", true,
    { alsoKnownAs: "née Patil / नी पाटिल", occupation: "Homemaker" }),
  m("d12", "Ramesh Gupta", "रमेश गुप्ता", "fufa", "inlaw", "marriage", -1, "male", true,
    { occupation: "Businessman" }),

  // ── Gen 0: Self + Wife + Siblings ──
  m("d13", "Rajesh Patil", "राजेश पाटिल", "self", "self", "blood", 0, "male", true,
    { dob: "1985-06-15", dobType: "exact", occupation: "Software Engineer" }),
  m("d14", "Sunita Patil", "सुनीता पाटिल", "wife", "self", "marriage", 0, "female", true,
    { dob: "1988", dobType: "year", alsoKnownAs: "née Sharma / नी शर्मा", occupation: "Teacher" }),
  m("d15", "Mahesh Patil", "महेश पाटिल", "elderBrother", "self", "blood", 0, "male", true,
    { dob: "1982", dobType: "year", occupation: "Doctor" }),
  m("d16", "Meena Patil", "मीना पाटिल", "bhabhi", "self", "marriage", 0, "female", true,
    { alsoKnownAs: "née Deshmukh / नी देशमुख" }),
  m("d17", "Priya Saxena", "प्रिया सक्सेना", "youngerSister", "self", "blood", 0, "female", true,
    { dob: "1990", dobType: "year", alsoKnownAs: "née Patil / नी पाटिल" }),
  m("d18", "Amit Saxena", "अमित सक्सेना", "jija", "inlaw", "marriage", 0, "male", true,
    { occupation: "CA" }),
  m("d19", "Vikram Patil", "विक्रम पाटिल", "paternal_cousin", "paternal", "blood", 0, "male", true,
    { dob: "1987", dobType: "year", notes: "Chacha Dinesh's son" }),

  // ── Gen +1: Children + Nephew + Niece ──
  m("d20", "Arjun Patil", "अर्जुन पाटिल", "son", "children", "blood", 1, "male", true,
    { dob: "2010-03-22", dobType: "exact" }),
  m("d21", "Ananya Deshmukh", "अनन्या देशमुख", "daughter", "children", "blood", 1, "female", true,
    { dob: "2012-11-05", dobType: "exact", alsoKnownAs: "née Patil / नी पाटिल" }),
  m("d22", "Vivek Deshmukh", "विवेक देशमुख", "sonInLaw", "inlaw", "marriage", 1, "male", true,
    { occupation: "Engineer" }),
  m("d23", "Kavya Patil", "काव्या पाटिल", "daughter", "children", "blood", 1, "female", true,
    { dob: "2015-07-18", dobType: "exact" }),
  m("d24", "Rohit Patil", "रोहित पाटिल", "bhatija", "children", "blood", 1, "male", true,
    { dob: "2008", dobType: "year", notes: "Mahesh bhai's son" }),
  m("d25", "Nisha Patil", "निशा पाटिल", "bhatiji", "children", "blood", 1, "female", true,
    { dob: "2011", dobType: "year", notes: "Mahesh bhai's daughter" }),
  m("d26", "Aarav Saxena", "आरव सक्सेना", "bhanja", "children", "blood", 1, "male", true,
    { dob: "2014", dobType: "year", notes: "Priya didi's son" }),

  // ── Gen +2: Grandchild ──
  m("d27", "Veer Deshmukh", "वीर देशमुख", "nati", "children", "blood", 2, "male", true,
    { dob: "2032", dobType: "year", notes: "Ananya's son" }),
];

export const DEMO_TREE: TreeMetadata = {
  treeId: DEMO_TREE_ID,
  ownerId: "demo",
  familySurname: "Patil",
  gotra: "Kashyap",
  kulDevta: "Shri Vishwanath",
  kulDevi: "Maa Sharda",
  village: "Doraha",
  tehsil: "Sehore",
  district: "Sehore",
  state: "Madhya Pradesh",
  totalMembers: 27,
  generations: 6,
  createdAt: ts,
  isPublic: true,
  status: "active",
};

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("vansh-vriksh-demo") === "true";
}

export function isDemoTreeId(treeId: string): boolean {
  return treeId === DEMO_TREE_ID;
}
