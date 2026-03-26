"use client";

import { useState, useEffect } from "react";

type Lang = "hi" | "en" | "hinglish";

const languages: { code: Lang; flag: string; label: string; sublabel: string }[] = [
  { code: "hi", flag: "🙏", label: "हिंदी", sublabel: "Hindi" },
  { code: "en", flag: "🌍", label: "English", sublabel: "English" },
  { code: "hinglish", flag: "🤝", label: "हिंglish", sublabel: "Mix of both" },
];

interface LanguageChooserProps {
  onSelect: (lang: Lang) => void;
}

export function LanguageChooser({ onSelect }: LanguageChooserProps) {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<Lang | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vansh-vriksh-lang");
    if (!stored) {
      // Small delay so page paints first
      const timer = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const handleSelect = (lang: Lang) => {
    setSelected(lang);
  };

  const handleConfirm = () => {
    if (!selected) return;
    localStorage.setItem("vansh-vriksh-lang", selected);
    onSelect(selected);
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-sm animate-fade-in-up">
      <div className="mx-4 w-full max-w-sm rounded-card border border-border-warm bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block text-4xl">🌳</span>
          <h2 className="mt-3 font-heading text-2xl font-bold text-dark">
            Choose Your Language
          </h2>
          <p className="mt-1 font-hindi text-lg text-dark/60">
            अपनी भाषा चुनें
          </p>
        </div>

        {/* Language options */}
        <div className="mt-6 space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full items-center gap-4 rounded-input border-2 px-4 py-4 text-left transition-all duration-200 ${
                selected === lang.code
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border-warm bg-white hover:border-accent/30 hover:bg-bg-muted"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <p className={`text-lg font-bold ${selected === lang.code ? "text-accent" : "text-dark"}`}>
                  {lang.label}
                </p>
                <p className="text-xs text-dark/40">{lang.sublabel}</p>
              </div>
              {selected === lang.code && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="btn-primary mt-6 w-full disabled:opacity-40"
        >
          {selected === "hi" ? "आगे बढ़ें" : selected === "hinglish" ? "Aage Badho" : "Continue"}
        </button>

        <p className="mt-3 text-center text-xs text-dark/30">
          You can change this anytime from the top-right toggle
        </p>
      </div>
    </div>
  );
}
