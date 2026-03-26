"use client";

import { useState, useEffect, useCallback } from "react";
import hi from "@/i18n/hi.json";
import en from "@/i18n/en.json";

type Lang = "hi" | "en";

const translations: Record<Lang, Record<string, unknown>> = { hi, en };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function useTranslation() {
  const [lang, setLangState] = useState<Lang>("hi");

  useEffect(() => {
    const stored = localStorage.getItem("vansh-vriksh-lang") as Lang | null;
    if (stored && (stored === "hi" || stored === "en")) {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("vansh-vriksh-lang", newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[lang], key);
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang(lang === "hi" ? "en" : "hi");
  }, [lang, setLang]);

  return { t, lang, setLang, toggleLang };
}
