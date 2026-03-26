"use client";

import { useState, useEffect, useCallback } from "react";
import { hindiToRoman, romanToHindi } from "@/lib/transliterate";
import { useTranslation } from "@/hooks/useTranslation";

interface TransliterateInputProps {
  /** The primary value (in whatever language the user types) */
  value: string;
  onChange: (value: string) => void;
  /** The auto-generated other-language value */
  transliteratedValue: string;
  onTransliteratedChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

/**
 * A smart input that auto-transliterates between Hindi and English.
 * When the user's language is Hindi, they type Hindi and English is auto-generated.
 * When English, they type English and Hindi is auto-generated.
 * The auto-generated text is shown below and is editable.
 */
export default function TransliterateInput({
  value,
  onChange,
  transliteratedValue,
  onTransliteratedChange,
  placeholder,
  required,
  className = "",
}: TransliterateInputProps) {
  const { t, lang } = useTranslation();
  const [manualOverride, setManualOverride] = useState(false);

  const isHindiMode = lang === "hi" || lang === "hinglish";

  // Auto-transliterate when primary value changes (unless user manually overrode)
  const autoTransliterate = useCallback(
    (text: string) => {
      if (manualOverride || !text.trim()) return;

      if (isHindiMode) {
        // User types Hindi → auto-generate English
        const roman = hindiToRoman(text);
        onTransliteratedChange(roman);
      } else {
        // User types English → auto-generate Hindi
        const hindi = romanToHindi(text);
        onTransliteratedChange(hindi);
      }
    },
    [isHindiMode, manualOverride, onTransliteratedChange]
  );

  // Debounced transliteration
  useEffect(() => {
    if (!value.trim()) {
      if (!manualOverride) onTransliteratedChange("");
      return;
    }
    const timer = setTimeout(() => autoTransliterate(value), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualOverride(false);
    onChange(e.target.value);
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualOverride(true);
    onTransliteratedChange(e.target.value);
  };

  return (
    <div className={className}>
      {/* Primary input */}
      <input
        type="text"
        value={value}
        onChange={handlePrimaryChange}
        placeholder={placeholder}
        required={required}
        className={`input-field w-full ${isHindiMode ? "font-hindi" : ""}`}
      />

      {/* Auto-transliterated preview */}
      {value.trim() && (
        <div className="mt-1.5 flex items-center gap-2">
          <span className="material-symbols-rounded text-dark/30" style={{ fontSize: "14px" }}>
            translate
          </span>
          <input
            type="text"
            value={transliteratedValue}
            onChange={handleSecondaryChange}
            placeholder={isHindiMode ? "English auto" : "हिंदी auto"}
            className={`w-full border-0 bg-transparent px-0 py-1 text-sm text-dark/50 placeholder:text-dark/20 focus:outline-none focus:text-dark/70 ${
              !isHindiMode ? "font-hindi" : ""
            }`}
          />
          {manualOverride && (
            <button
              type="button"
              onClick={() => {
                setManualOverride(false);
                autoTransliterate(value);
              }}
              className="shrink-0 text-xs text-accent hover:underline"
            >
              {t("common.auto")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
