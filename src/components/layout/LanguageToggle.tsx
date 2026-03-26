"use client";

import { useTranslation } from "@/hooks/useTranslation";

const langs = [
  { code: "hi" as const, label: "हिंदी" },
  { code: "en" as const, label: "En" },
  { code: "hinglish" as const, label: "हिंglish" },
];

export function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="inline-flex items-center rounded-full border border-border-warm bg-bg-card shadow-sm">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1.5 text-xs font-medium transition-all first:rounded-l-full last:rounded-r-full ${
            lang === l.code
              ? "bg-accent text-white"
              : "text-dark/50 hover:text-dark hover:bg-bg-muted"
          }`}
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
