"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const DISMISSED_KEY = "vansh-vriksh-guide-dismissed";

export function OnboardingGuide() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="card border-accent/20 bg-accent/5 p-4 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
          <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>info</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-dark text-sm">
            {t("guide.onboardTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-dark/50">
            {t("guide.onboardDesc")}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Link
              href="/guide"
              className="inline-flex items-center gap-1 rounded-btn bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent-hover"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>menu_book</span>
              {t("guide.viewGuide")}
            </Link>
            <button
              onClick={dismiss}
              className="text-xs text-dark/40 hover:text-dark transition-colors"
            >
              {t("guide.dismiss")}
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="text-dark/30 hover:text-dark transition-colors flex-shrink-0">
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>close</span>
        </button>
      </div>
    </div>
  );
}
