"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

const steps = [
  {
    num: "01",
    icon: "how_to_reg",
    titleKey: "guide.step1Title",
    descKey: "guide.step1Desc",
    tipsKey: "guide.step1Tips",
  },
  {
    num: "02",
    icon: "person_edit",
    titleKey: "guide.step2Title",
    descKey: "guide.step2Desc",
    tipsKey: "guide.step2Tips",
  },
  {
    num: "03",
    icon: "group_add",
    titleKey: "guide.step3Title",
    descKey: "guide.step3Desc",
    tipsKey: "guide.step3Tips",
  },
  {
    num: "04",
    icon: "account_tree",
    titleKey: "guide.step4Title",
    descKey: "guide.step4Desc",
    tipsKey: "guide.step4Tips",
  },
  {
    num: "05",
    icon: "share",
    titleKey: "guide.step5Title",
    descKey: "guide.step5Desc",
    tipsKey: "guide.step5Tips",
  },
];

export default function GuidePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6">
      {/* Language Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <LanguageToggle />
      </div>

      <div className="mx-auto max-w-2xl animate-fade-in-up">
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-dark/40 transition-colors hover:text-accent">
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>arrow_back</span>
          {t("common.back")}
        </Link>

        {/* Header */}
        <div className="text-center">
          <span className="material-symbols-rounded text-accent" style={{ fontSize: "48px" }}>menu_book</span>
          <h1 className="mt-4 font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("guide.title")}
          </h1>
          <p className="mt-2 text-dark/50">
            {t("guide.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 space-y-6">
          {steps.map((step) => (
            <div key={step.num} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <span className="material-symbols-rounded text-accent" style={{ fontSize: "24px" }}>{step.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="label-mono text-accent">{step.num}</span>
                  </div>
                  <h3 className="mt-1 font-heading text-lg font-bold text-dark">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm text-dark/60">
                    {t(step.descKey)}
                  </p>
                  <div className="mt-3 rounded-input bg-accent/5 border border-accent/10 px-3 py-2">
                    <p className="text-xs font-medium text-accent">
                      <span className="material-symbols-rounded mr-1 align-middle" style={{ fontSize: "14px" }}>lightbulb</span>
                      {t(step.tipsKey)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo CTA */}
        <div className="mt-10 card border-accent/20 bg-accent/5 p-6 text-center">
          <span className="material-symbols-rounded text-accent" style={{ fontSize: "36px" }}>play_circle</span>
          <h3 className="mt-2 font-heading text-xl font-bold text-dark">
            {t("guide.tryDemo")}
          </h3>
          <p className="mt-1 text-sm text-dark/50">
            {t("guide.tryDemoDesc")}
          </p>
          <Link href="/verify?demo=true" className="btn-primary mt-4 inline-block">
            {t("guide.tryDemoBtn")}
          </Link>
        </div>

        {/* Ready CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-dark/40">{t("guide.readyText")}</p>
          <div className="mt-3 flex justify-center gap-3">
            <Link href="/verify" className="btn-primary">
              {t("landing.createTree")}
            </Link>
            <Link href="/search" className="btn-secondary">
              {t("landing.findTree")}
            </Link>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
