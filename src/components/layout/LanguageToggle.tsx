"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function LanguageToggle() {
  const { lang, toggleLang } = useTranslation();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 rounded-full border border-border-warm bg-bg-card px-3 py-1.5 text-sm font-medium text-earth transition-colors hover:bg-bg-muted"
      aria-label={lang === "hi" ? "Switch to English" : "हिंदी में बदलें"}
    >
      {lang === "hi" ? (
        <>
          <span className="text-xs opacity-60">हि</span>
          <span>/</span>
          <span className="font-semibold">En</span>
        </>
      ) : (
        <>
          <span className="font-semibold">हि</span>
          <span>/</span>
          <span className="text-xs opacity-60">En</span>
        </>
      )}
    </button>
  );
}
