/**
 * Basic Hindi ↔ Roman transliteration mapping.
 * This handles common name patterns. For production, consider
 * integrating Google Input Tools API for better accuracy.
 */

const HINDI_TO_ROMAN: Record<string, string> = {
  "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo",
  "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऋ": "ri",
  "क": "ka", "ख": "kha", "ग": "ga", "घ": "gha", "ङ": "nga",
  "च": "cha", "छ": "chha", "ज": "ja", "झ": "jha", "ञ": "nya",
  "ट": "ta", "ठ": "tha", "ड": "da", "ढ": "dha", "ण": "na",
  "त": "ta", "थ": "tha", "द": "da", "ध": "dha", "न": "na",
  "प": "pa", "फ": "pha", "ब": "ba", "भ": "bha", "म": "ma",
  "य": "ya", "र": "ra", "ल": "la", "व": "va", "श": "sha",
  "ष": "sha", "स": "sa", "ह": "ha",
  "क्ष": "ksha", "त्र": "tra", "ज्ञ": "gya",
  "ा": "a", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo",
  "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ं": "n",
  "ः": "h", "्": "", "ँ": "n",
};

const ROMAN_TO_HINDI: Record<string, string> = {
  "ksha": "क्ष", "tra": "त्र", "gya": "ज्ञ",
  "kha": "ख", "gha": "घ", "cha": "च", "chha": "छ",
  "jha": "झ", "tha": "ठ", "dha": "ध", "pha": "फ",
  "bha": "भ", "sha": "श", "shri": "श्री",
  "ka": "क", "ga": "ग", "ja": "ज",
  "ta": "त", "da": "द", "na": "न",
  "pa": "प", "ba": "ब", "ma": "म",
  "ya": "य", "ra": "र", "la": "ल", "va": "व",
  "sa": "स", "ha": "ह",
  "aa": "ा", "ee": "ी", "oo": "ू",
  "ai": "ै", "au": "ौ", "ri": "ृ",
  "a": "अ", "i": "इ", "u": "उ",
  "e": "े", "o": "ो",
};

// Common Indian names mapping for better accuracy
const COMMON_NAMES: Record<string, string> = {
  "राजेश": "Rajesh", "सुरेश": "Suresh", "महेश": "Mahesh",
  "रामजी": "Ramji", "सावित्री": "Savitri", "कमला": "Kamla",
  "सुनीता": "Sunita", "अर्जुन": "Arjun", "विक्रम": "Vikram",
  "अनन्या": "Ananya", "लता": "Lata", "मीना": "Meena",
  "पाटिल": "Patil", "शर्मा": "Sharma", "गुप्ता": "Gupta",
  "वर्मा": "Verma", "जोशी": "Joshi", "देशमुख": "Deshmukh",
  "सिंह": "Singh", "कुमार": "Kumar", "पटेल": "Patel",
  "यादव": "Yadav", "चौहान": "Chauhan", "राजपूत": "Rajput",
  "ठाकुर": "Thakur", "मिश्रा": "Mishra", "त्रिपाठी": "Tripathi",
  "दुबे": "Dubey", "पांडे": "Pandey", "तिवारी": "Tiwari",
  "श्रीवास्तव": "Srivastava", "अग्रवाल": "Agarwal",
};

// Reverse mapping
const COMMON_NAMES_REVERSE: Record<string, string> = {};
for (const [hi, en] of Object.entries(COMMON_NAMES)) {
  COMMON_NAMES_REVERSE[en.toLowerCase()] = hi;
}

/**
 * Transliterate Hindi text to Roman (English) approximation.
 */
export function hindiToRoman(hindi: string): string {
  if (!hindi) return "";

  // Check common names first (split by spaces)
  const words = hindi.split(/\s+/);
  const transliterated = words.map((word) => {
    if (COMMON_NAMES[word]) return COMMON_NAMES[word];

    let result = "";
    let i = 0;
    while (i < word.length) {
      // Try 3-char sequences first, then 2-char, then 1-char
      let found = false;
      for (const len of [3, 2, 1]) {
        const substr = word.substring(i, i + len);
        if (HINDI_TO_ROMAN[substr] !== undefined) {
          result += HINDI_TO_ROMAN[substr];
          i += len;
          found = true;
          break;
        }
      }
      if (!found) {
        result += word[i];
        i++;
      }
    }

    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
  });

  return transliterated.join(" ");
}

/**
 * Transliterate Roman (English) text to Hindi approximation.
 */
export function romanToHindi(roman: string): string {
  if (!roman) return "";

  const words = roman.split(/\s+/);
  const transliterated = words.map((word) => {
    if (COMMON_NAMES_REVERSE[word.toLowerCase()]) {
      return COMMON_NAMES_REVERSE[word.toLowerCase()];
    }

    const lower = word.toLowerCase();
    let result = "";
    let i = 0;
    while (i < lower.length) {
      let found = false;
      for (const len of [4, 3, 2, 1]) {
        const substr = lower.substring(i, i + len);
        if (ROMAN_TO_HINDI[substr] !== undefined) {
          result += ROMAN_TO_HINDI[substr];
          i += len;
          found = true;
          break;
        }
      }
      if (!found) {
        result += lower[i];
        i++;
      }
    }

    return result;
  });

  return transliterated.join(" ");
}
