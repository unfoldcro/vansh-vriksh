"use client";

import OrgChartTree from "./OrgChartTree";
import type { OrgMember } from "./OrgChartTree";

const demoMembers: OrgMember[] = [
  { id: "1", name: "Ramji Patil", nameHi: "रामजी पाटिल", relation: "Grandfather", relationHi: "दादा", gender: "male", deceased: true, gen: -2 },
  { id: "2", name: "Savitri Patil", nameHi: "सावित्री पाटिल", relation: "Grandmother", relationHi: "दादी", gender: "female", deceased: true, gen: -2, spouseOf: "1" },
  { id: "3", name: "Suresh Patil", nameHi: "सुरेश पाटिल", relation: "Father", relationHi: "पिता", gender: "male", gen: -1, relationType: "blood" },
  { id: "4", name: "Kamla Patil", nameHi: "कमला पाटिल", relation: "Mother", relationHi: "माता", gender: "female", nee: "Joshi", gen: -1, relationType: "marriage", spouseOf: "3" },
  { id: "5", name: "Lata Gupta", nameHi: "लता गुप्ता", relation: "Aunt", relationHi: "बुआ", gender: "female", nee: "Patil", gen: -1, relationType: "blood" },
  { id: "6", name: "Rajesh Patil", nameHi: "राजेश पाटिल", relation: "Self", relationHi: "स्वयं", gender: "male", gen: 0, relationType: "blood" },
  { id: "7", name: "Sunita Patil", nameHi: "सुनीता पाटिल", relation: "Wife", relationHi: "पत्नी", gender: "female", nee: "Sharma", gen: 0, relationType: "marriage", spouseOf: "6" },
  { id: "8", name: "Mahesh Patil", nameHi: "महेश पाटिल", relation: "Brother", relationHi: "भाई", gender: "male", gen: 0, relationType: "blood" },
  { id: "9", name: "Meena Patil", nameHi: "मीना पाटिल", relation: "Sister-in-Law", relationHi: "भाभी", gender: "female", nee: "Verma", gen: 0, relationType: "marriage", spouseOf: "8" },
  { id: "10", name: "Arjun", nameHi: "अर्जुन", relation: "Son", relationHi: "पुत्र", gender: "male", gen: 1, relationType: "blood" },
  { id: "11", name: "Ananya", nameHi: "अनन्या", relation: "Daughter", relationHi: "पुत्री → विवाहित: देशमुख", gender: "female", gen: 1, relationType: "blood" },
  { id: "12", name: "Vikram", nameHi: "विक्रम", relation: "Son", relationHi: "पुत्र", gender: "male", gen: 1, relationType: "blood" },
];

export function DemoTree() {
  return (
    <OrgChartTree
      members={demoMembers}
      focusedMemberId="6"
      isDemo
    />
  );
}
