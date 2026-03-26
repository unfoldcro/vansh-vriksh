// ─── Gotra List (100+) ───
export const GOTRAS = [
  "Kashyap", "Bharadwaj", "Vashishtha", "Vishwamitra", "Gautam",
  "Jamadagni", "Atri", "Agastya", "Angiras", "Bhrigu",
  "Kaushik", "Sandilya", "Parashar", "Vatsa", "Mudgal",
  "Garg", "Maudgalya", "Kanva", "Katyayan", "Shandilya",
  "Harit", "Kaundinya", "Dhananjay", "Shaunak", "Mandavya",
  "Upamanyu", "Bhargav", "Chyavan", "Galav", "Kapil",
  "Kasyap", "Kutsa", "Lohit", "Maitreya", "Markandeya",
  "Naidhruva", "Parashara", "Pulastya", "Pulaha", "Kratu",
  "Daksha", "Marichi", "Narada", "Shringi", "Lomash",
  "Jabali", "Kanada", "Patanjali", "Panini", "Vyasa",
  "Valmiki", "Sukra", "Brihaspati", "Durvasa", "Dadhichi",
  "Kakshivan", "Vishrava", "Aurva", "Richika", "Saunaka",
  "Taittiriya", "Aapastamba", "Baudhayana", "Kaushitaki", "Ashvalayana",
  "Shankhayana", "Gobhila", "Khadira", "Manava", "Varaha",
  "Salankayana", "Nidruva", "Rebha", "Viswamitra", "Sumedha",
  "Suparna", "Baijavap", "Savarna", "Dalabhya", "Dalbhya",
  "Dhanvantari", "Madhyandina", "Praachina", "Shaunaka", "Sthulaksha",
  "Uddalaka", "Yagnavalkya", "Ashtaputra", "Devala", "Durvas",
  "Alambayan", "Koushik", "Maandukya", "Pippalada", "Shakala",
  "Agnivesha", "Harita", "Kalapin", "Samkriti", "Upanishad",
].sort();

// ─── Nakshatras (27) ───
export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

// ─── Rashis (12) ───
export const RASHIS = [
  "Mesh (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)",
  "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
  "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)",
  "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
];

// ─── Varnas ───
export const VARNAS = ["Brahmin", "Kshatriya", "Vaishya", "Shudra"];

// ─── Indian States ───
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh",
  "Puducherry", "Dadra & Nagar Haveli", "Lakshadweep",
  "Andaman & Nicobar Islands",
];

// ─── MP Districts (default state) ───
export const MP_DISTRICTS = [
  "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat",
  "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur",
  "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas",
  "Dhar", "Dindori", "Guna", "Gwalior", "Harda",
  "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni",
  "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena",
  "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh",
  "Ratlam", "Rewa", "Sagar", "Satna", "Sehore",
  "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri",
  "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria",
  "Vidisha",
];

// ─── Approximate DOB Options ───
export const DOB_DECADES = [
  "1900s", "1910s", "1920s", "1930s", "1940s",
  "1950s", "1960s", "1970s", "1980s", "1990s",
  "2000s", "2010s", "2020s",
];

export const DOB_MARKERS = [
  { value: "before_independence_1947", label: { hi: "आज़ादी से पहले (1947)", en: "Before Independence (1947)" } },
  { value: "around_independence_1947", label: { hi: "आज़ादी के आसपास (1947)", en: "Around Independence (1947)" } },
  { value: "after_independence_1947", label: { hi: "आज़ादी के बाद (1947-55)", en: "After Independence (1947-55)" } },
  { value: "during_emergency_1975", label: { hi: "आपातकाल के दौरान (1975)", en: "During Emergency (1975)" } },
  { value: "before_partition_1947", label: { hi: "विभाजन से पहले (1947)", en: "Before Partition (1947)" } },
  { value: "during_war_1962", label: { hi: "चीन युद्ध के समय (1962)", en: "During China War (1962)" } },
  { value: "during_war_1965", label: { hi: "पाक युद्ध के समय (1965)", en: "During Pak War (1965)" } },
  { value: "during_war_1971", label: { hi: "बांग्लादेश युद्ध (1971)", en: "During Bangladesh War (1971)" } },
];

// ─── Common Kul Devtas ───
export const COMMON_KUL_DEVTAS = [
  "Lord Shiva", "Lord Vishnu", "Lord Ganesh", "Lord Hanuman",
  "Lord Ram", "Lord Krishna", "Lord Dattatreya", "Lord Bhairav",
  "Lord Khandoba", "Lord Vitthal", "Lord Venkateswara",
  "Lord Narsimha", "Lord Parshuram", "Lord Kartikeya",
];

// ─── Common Kul Devis ───
export const COMMON_KUL_DEVIS = [
  "Maa Sharda", "Maa Durga", "Maa Lakshmi", "Maa Saraswati",
  "Maa Parvati", "Maa Kali", "Maa Ambika", "Maa Jogeshwari",
  "Maa Tulja Bhavani", "Maa Renuka", "Maa Vindhyavasini",
  "Maa Chamunda", "Maa Bhagwati", "Maa Shakambhari",
  "Maa Vaishno Devi", "Maa Santoshi", "Maa Gayatri",
  "Maa Narmada", "Maa Ahilya", "Maa Annapurna",
];

// ─── Teerth Sthals ───
export const TEERTH_STHALS = [
  "Ujjain", "Omkareshwar", "Haridwar", "Varanasi (Kashi)",
  "Prayagraj (Allahabad)", "Gaya", "Nashik", "Mathura-Vrindavan",
  "Ayodhya", "Dwarka", "Rameswaram", "Badrinath", "Kedarnath",
  "Amarnath", "Tirupati", "Somnath", "Mahakaleshwar",
];
