"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedTree } from "@/components/ui/AnimatedTree";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { DemoTree } from "@/components/tree/DemoTree";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { LanguageChooser } from "@/components/layout/LanguageChooser";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { t, setLang } = useTranslation();
  const { user } = useAuth();

  const handleEnterDemo = () => {
    localStorage.setItem("vansh-vriksh-demo", "true");
    router.push("/dashboard?demo=true");
  };


  // Relations for marquee — these are relation names, language-independent display
  const marqueeRelations = [
    "दादा", "दादी", "नाना", "नानी", "पिता", "माता", "ताऊ", "ताई", "चाचा", "चाची",
    "बुआ", "फूफा", "मामा", "मामी", "मौसी", "मौसा", "भाई", "बहन", "पति", "पत्नी",
    "पुत्र", "पुत्री", "दामाद", "बहू", "ससुर", "सास", "साला", "साली", "जीजा", "भाभी",
    "जेठ", "देवर", "ननद", "जेठानी", "देवरानी", "पोता", "पोती", "नाती", "नातिन",
  ];

  const featurePills = t("landing.featurePills").split(",");

  const beforeItems = [
    t("landing.before1"), t("landing.before2"), t("landing.before3"),
    t("landing.before4"), t("landing.before5"), t("landing.before6"),
  ];

  const afterItems = [
    t("landing.after1"), t("landing.after2"), t("landing.after3"),
    t("landing.after4"), t("landing.after5"), t("landing.after6"),
  ];

  const sevaCards = [
    { icon: "block", text: t("landing.seva1") },
    { icon: "volunteer_activism", text: t("landing.seva2") },
    { icon: "lock", text: t("landing.seva3") },
    { icon: "public", text: t("landing.seva4") },
  ];

  const faqs = [
    { q: t("landing.faq1Q"), a: t("landing.faq1A") },
    { q: t("landing.faq2Q"), a: t("landing.faq2A") },
    { q: t("landing.faq3Q"), a: t("landing.faq3A") },
    { q: t("landing.faq4Q"), a: t("landing.faq4A") },
    { q: t("landing.faq5Q"), a: t("landing.faq5A") },
    { q: t("landing.faq6Q"), a: t("landing.faq6A") },
  ];

  const steps = [
    {
      step: "01",
      icon: "mail",
      title: t("landing.step1Title"),
      detail: t("landing.step1Detail"),
      time: t("landing.step1Time"),
    },
    {
      step: "02",
      icon: "group_add",
      title: t("landing.step2Title"),
      detail: t("landing.step2Detail"),
      time: t("landing.step2Time"),
    },
    {
      step: "03",
      icon: "share",
      title: t("landing.step3Title"),
      detail: t("landing.step3Detail"),
      time: t("landing.step3Time"),
    },
  ];

  const demoCards = [
    { icon: "👴", name: t("landing.demoCard1Name"), rel: t("landing.demoCard1Rel"), gen: "Gen -3", bg: "bg-card-deceased/40" },
    { icon: "👨", name: t("landing.demoCard2Name"), rel: t("landing.demoCard2Rel"), gen: "Gen -1", bg: "bg-card-male/60" },
    { icon: "👤", name: t("landing.demoCard3Name"), rel: t("landing.demoCard3Rel"), gen: "Gen 0", bg: "bg-accent/10" },
    { icon: "👦", name: t("landing.demoCard4Name"), rel: t("landing.demoCard4Rel"), gen: "Gen +1", bg: "bg-card-male/40" },
    { icon: "👶", name: t("landing.demoCard5Name"), rel: t("landing.demoCard5Rel"), gen: "Gen +2", bg: "bg-bg-muted" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Language Chooser Modal — first visit only */}
      <LanguageChooser onSelect={(lang) => setLang(lang)} />

      {/* Language Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <LanguageToggle />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center hero-pattern">
        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] animate-float text-5xl opacity-20">🕉</div>
          <div className="absolute right-[12%] top-[20%] animate-float-delayed text-4xl opacity-15">🪷</div>
          <div className="absolute left-[20%] bottom-[25%] animate-float-slow text-3xl opacity-15">🙏</div>
          <div className="absolute right-[18%] bottom-[30%] animate-float text-4xl opacity-10">🌿</div>
          <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute -right-32 bottom-1/4 h-48 w-48 rounded-full bg-accent/8 blur-[80px]" />
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <AnimatedTree />

          <h1 className="mt-6 font-heading text-5xl font-bold text-dark md:text-8xl">
            {t("landing.heroTitle")}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-dark/60 md:text-2xl">
            {t("landing.heroSubtitle")}
          </p>
          <p className="mt-1 text-base text-dark/35">
            {t("landing.heroSubtitleSmall")}
          </p>

          {/* Seva badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 animate-glow">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="label-mono text-accent">{t("app.sevaBadge")}</span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/search" className="btn-secondary group">
              <span className="material-symbols-rounded icon-sm mr-2 transition-transform group-hover:-translate-x-0.5">search</span>
              {t("landing.findTree")}
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn-primary group">
                <span className="material-symbols-rounded icon-sm mr-2 transition-transform group-hover:scale-110">dashboard</span>
                {t("nav.dashboard")}
              </Link>
            ) : (
              <button onClick={() => router.push("/verify")} className="btn-primary group">
                <span className="material-symbols-rounded icon-sm mr-2 transition-transform group-hover:scale-110">add_circle</span>
                {t("landing.createTree")}
              </button>
            )}
          </div>

          {/* Demo link */}
          <div className="mt-4">
            <button onClick={handleEnterDemo} className="inline-flex items-center gap-1.5 text-sm text-dark/40 transition-colors hover:text-accent">
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>play_circle</span>
              {t("guide.tryDemoBtn")}
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-1 text-dark/20">
            <span className="text-xs">{t("landing.scroll")}</span>
            <svg width="16" height="24" viewBox="0 0 16 24" className="animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 4v12M4 12l4 4 4-4" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── RELATION MARQUEE ─── */}
      <section className="overflow-hidden border-y border-border-warm bg-white py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeRelations, ...marqueeRelations].map((rel, i) => (
            <span key={i} className="mx-4 font-hindi text-lg text-dark/20 transition-colors hover:text-accent">
              {rel}
            </span>
          ))}
        </div>
      </section>

      {/* ─── ABOUT — What Is It ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="label-mono text-accent">{t("landing.aboutLabel")}</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-dark md:text-4xl whitespace-pre-line">
                {t("landing.aboutTitle")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-dark/60">
                {t("landing.aboutDesc")} <span className="font-bold text-accent">{t("landing.aboutHighlight1")}</span>, <span className="font-bold text-accent">{t("landing.aboutHighlight2")}</span>
              </p>
              <p className="mt-2 text-dark/45">
                {t("landing.aboutDesc2")}
              </p>

              <div className="mt-8 flex gap-6">
                <div>
                  <div className="text-3xl font-bold text-gradient">7</div>
                  <div className="text-xs text-dark/40">{t("landing.generations")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">38+</div>
                  <div className="text-xs text-dark/40">{t("landing.relationsCount")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">100%</div>
                  <div className="text-xs text-dark/40">{t("landing.free")}</div>
                </div>
              </div>
            </div>

            {/* Right — visual card stack */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-accent/5 blur-xl" />
              <div className="relative space-y-3">
                {demoCards.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 rounded-card ${item.bg} border border-border-warm px-4 py-3 transition-all duration-300 hover:-translate-x-1 hover:shadow-md`}
                    style={{ marginLeft: `${i * 12}px` }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-hindi font-bold text-dark">{item.name}</p>
                      <p className="text-xs text-dark/50">{item.rel}</p>
                    </div>
                    <span className="label-mono text-accent">{item.gen}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES — Bento Grid ─── */}
      <section className="bg-bg-muted px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-center label-mono text-accent">{t("landing.featuresLabel")}</p>
          <h2 className="mt-3 mb-4 text-center font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-dark/50">
            {t("landing.featuresSubtitle")}
          </p>

          <div className="grid gap-4 md:grid-cols-3 stagger-children">
            <FeatureCard
              icon="👨‍👩‍👧‍👦"
              title={t("landing.feature1Title")}
              description={t("landing.feature1Desc")}
              accent
              className="md:col-span-2"
            />
            <FeatureCard
              icon="🙏"
              title={t("landing.feature2Title")}
              description={t("landing.feature2Desc")}
            />
            <FeatureCard
              icon="💑"
              title={t("landing.feature3Title")}
              description={t("landing.feature3Desc")}
            />
            <FeatureCard
              icon="🕊"
              title={t("landing.feature4Title")}
              description={t("landing.feature4Desc")}
              accent
            />
            <FeatureCard
              icon="🔒"
              title={t("landing.feature5Title")}
              description={t("landing.feature5Desc")}
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {featurePills.map((f) => (
              <span key={f} className="rounded-full border border-border-warm bg-white px-3 py-1.5 text-xs text-dark/50">
                {f.trim()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — Timeline ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-center label-mono text-accent">{t("landing.howLabel")}</p>
          <h2 className="mt-3 mb-14 text-center font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("landing.howTitle")}
          </h2>

          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-accent via-accent/40 to-transparent md:left-1/2 md:block" />

            <div className="space-y-12">
              {steps.map((s, i) => (
                <div key={s.step} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "" : "md:flex-row-reverse md:text-right"}`}>
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20">
                      <span className="material-symbols-rounded" style={{ fontSize: "24px" }}>{s.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1 rounded-card border border-border-warm bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="label-mono text-accent">{s.step}</span>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">{s.time}</span>
                    </div>
                    <h3 className="mt-2 font-heading text-xl font-bold text-dark">{s.title}</h3>
                    <p className="mt-1 text-sm text-dark/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSIDE LOOK — What You'll Fill ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-center label-mono text-accent">{t("landing.insideLabel")}</p>
          <h2 className="mt-3 mb-4 text-center font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("landing.insideTitle")}
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-dark/50">
            {t("landing.insideSubtitle")}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Preview */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>badge</span>
                <h3 className="font-heading font-bold text-dark">{t("landing.insideProfile")}</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: t("landing.insideFieldName"), example: "Rajesh Patil / राजेश पाटिल" },
                  { label: t("landing.insideFieldGotra"), example: "Kashyap (काश्यप)" },
                  { label: t("landing.insideFieldKulDevi"), example: "Maa Sharda (माँ शारदा)" },
                  { label: t("landing.insideFieldVillage"), example: "Doraha, Sehore, MP" },
                  { label: t("landing.insideFieldDob"), example: "1985 / ~1940s / Before 1947" },
                  { label: t("landing.insideFieldNakshatra"), example: "Rohini (रोहिणी)" },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between rounded-input bg-bg-muted px-3 py-2">
                    <span className="text-xs font-medium text-dark/60">{field.label}</span>
                    <span className="text-xs text-accent font-medium">{field.example}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-dark/30">{t("landing.insideProfileNote")}</p>
            </div>

            {/* Member Card Preview */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>group_add</span>
                <h3 className="font-heading font-bold text-dark">{t("landing.insideMember")}</h3>
              </div>
              <div className="space-y-2">
                {/* Simulated member cards */}
                {[
                  { name: "Ramji Patil (दादा)", color: "bg-card-deceased/30", icon: "🕊", badge: "Gen -2" },
                  { name: "Suresh Patil (पिता)", color: "bg-card-male/30", icon: "👨", badge: "Gen -1" },
                  { name: "Kamla née Joshi (माता)", color: "bg-card-female/30", icon: "👩", badge: "née tag" },
                  { name: "Rajesh Patil (स्वयं)", color: "bg-accent/10", icon: "👤", badge: "Gen 0" },
                  { name: "Arjun (पुत्र)", color: "bg-card-male/30", icon: "👦", badge: "Gen +1" },
                ].map((m) => (
                  <div key={m.name} className={`flex items-center gap-3 rounded-input ${m.color} px-3 py-2`}>
                    <span>{m.icon}</span>
                    <span className="flex-1 text-xs font-medium text-dark">{m.name}</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">{m.badge}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-dark/30">{t("landing.insideMemberNote")}</p>
            </div>

            {/* Marriage System */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>favorite</span>
                <h3 className="font-heading font-bold text-dark">{t("landing.insideMarriage")}</h3>
              </div>
              <div className="rounded-card border border-accent/10 bg-accent/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">💑</span>
                  <div>
                    <p className="text-xs font-bold text-dark">Ananya Patil → Deshmukh</p>
                    <p className="text-[10px] text-dark/40">née Patil (maiden name preserved forever)</p>
                  </div>
                </div>
                <div className="h-px bg-accent/10" />
                <div className="grid grid-cols-2 gap-2">
                  {[t("landing.insideKeepMaiden"), t("landing.insideHusbandName"), t("landing.insideBothNames"), t("landing.insideHyphenated")].map((opt) => (
                    <div key={opt} className="rounded bg-white px-2 py-1.5 text-center text-[10px] font-medium text-dark/60 border border-border-warm">
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-dark/30">{t("landing.insideMarriageNote")}</p>
            </div>

            {/* Shraddh + Privacy */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "20px" }}>lock</span>
                <h3 className="font-heading font-bold text-dark">{t("landing.insidePrivacy")}</h3>
              </div>
              <div className="space-y-3">
                <div className="rounded-card bg-bg-muted p-3">
                  <p className="text-xs font-bold text-dark mb-1">{t("landing.insidePrivLevel1")}</p>
                  <p className="text-[10px] text-dark/50">{t("landing.insidePrivLevel1Desc")}</p>
                </div>
                <div className="rounded-card bg-bg-muted p-3">
                  <p className="text-xs font-bold text-dark mb-1">{t("landing.insidePrivLevel2")}</p>
                  <p className="text-[10px] text-dark/50">{t("landing.insidePrivLevel2Desc")}</p>
                </div>
                <div className="rounded-card bg-bg-muted p-3">
                  <p className="text-xs font-bold text-dark mb-1">{t("landing.insidePrivLevel3")}</p>
                  <p className="text-[10px] text-dark/50">{t("landing.insidePrivLevel3Desc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guide CTA */}
          <div className="mt-8 text-center">
            <Link href="/guide" className="btn-ghost inline-flex items-center gap-2">
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>menu_book</span>
              {t("landing.insideGuideLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DEMO TREE — Interactive Org Chart ─── */}
      <section className="bg-bg-muted px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-center label-mono text-accent">{t("landing.demoLabel")}</p>
          <h2 className="mt-3 mb-2 text-center font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("landing.demoTitle")}
          </h2>
          <p className="mb-10 text-center text-dark/40">
            {t("landing.demoSubtitle")}
          </p>
          <div className="rounded-2xl border border-border-warm bg-white p-4 shadow-sm md:p-6">
            <DemoTree />
          </div>
          <p className="mt-6 text-center text-sm text-dark/35">
            {t("landing.demoFooter")}
          </p>
        </div>
      </section>

      {/* ─── BEFORE vs AFTER ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-center label-mono text-accent">{t("landing.whyLabel")}</p>
          <h2 className="mt-3 mb-12 text-center font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("landing.whyTitle")}
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Before */}
            <div className="rounded-card border-2 border-error/20 bg-error/5 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-error/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-error" />
                <span className="text-xs font-bold text-error">{t("landing.without")}</span>
              </div>
              <ul className="space-y-3">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-dark/60">
                    <span className="material-symbols-rounded mt-0.5 text-error" style={{ fontSize: "16px" }}>close</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-card border-2 border-accent/20 bg-accent/5 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-xs font-bold text-accent">{t("landing.withVV")}</span>
              </div>
              <ul className="space-y-3">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-dark/70">
                    <span className="material-symbols-rounded mt-0.5 text-accent" style={{ fontSize: "16px" }}>check</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEVA DECLARATION ─── */}
      <section className="relative overflow-hidden bg-dark px-4 py-20 text-center md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="material-symbols-rounded text-accent/60" style={{ fontSize: "48px" }}>self_improvement</span>
          <p className="mt-6 font-heading text-3xl font-bold text-accent md:text-5xl">
            {t("landing.sevaTitle")}
          </p>
          <p className="mt-3 text-xl text-white/50">
            {t("landing.sevaSubtitle")}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/30">
            {t("landing.sevaDesc")}
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {sevaCards.map((promise) => (
              <div
                key={promise.icon}
                className="rounded-card border border-accent/15 bg-accent/5 p-4 transition-all duration-300 hover:border-accent/30 hover:bg-accent/10"
              >
                <span className="material-symbols-rounded text-accent" style={{ fontSize: "32px" }}>{promise.icon}</span>
                <div className="mt-2 font-hindi text-sm font-bold text-accent">
                  {promise.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-center label-mono text-accent">{t("landing.faqLabel")}</p>
          <h2 className="mt-3 mb-10 text-center font-heading text-3xl font-bold text-dark md:text-4xl">
            {t("landing.faqTitle")}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE STATS ─── */}
      <section className="bg-bg-muted px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center label-mono text-accent mb-8">{t("landing.statsLabel")}</p>
          <div className="grid grid-cols-3 gap-6">
            <AnimatedCounter target={0} label={t("stats.families")} />
            <AnimatedCounter target={0} label={t("stats.members")} />
            <AnimatedCounter target={0} label={t("stats.gotras")} />
          </div>
          <p className="mt-6 text-center text-sm text-dark/35">
            {t("landing.statsBeFirst")}
          </p>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <span className="material-symbols-rounded text-accent" style={{ fontSize: "48px" }}>park</span>
          <h2 className="mt-6 font-heading text-3xl font-bold text-dark md:text-5xl">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mt-3 text-lg text-dark/50">
            {t("landing.ctaSubtitle")}
          </p>
          <p className="mt-1 text-sm text-dark/30">
            {t("landing.ctaSmall")}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/search" className="btn-secondary group">
              <span className="material-symbols-rounded icon-sm mr-2">search</span>
              {t("landing.findTree")}
            </Link>
            {user ? (
              <Link href="/dashboard" className="btn-primary group">
                <span className="material-symbols-rounded icon-sm mr-2">dashboard</span>
                {t("nav.dashboard")}
              </Link>
            ) : (
              <button onClick={() => router.push("/verify")} className="btn-primary group">
                <span className="material-symbols-rounded icon-sm mr-2">add_circle</span>
                {t("landing.createTree")}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border-warm bg-dark px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <p className="font-hindi text-xl font-bold text-accent">
                <span className="material-symbols-rounded mr-1 align-middle text-accent" style={{ fontSize: "24px" }}>park</span>
                {t("app.name")}
              </p>
              <p className="mt-1 text-xs text-white/30">Vansh-Vriksh.unfoldcro.in</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <Link href="/guide" className="transition-colors hover:text-accent">{t("nav.guide")}</Link>
              <Link href="/about" className="transition-colors hover:text-accent">{t("nav.about")}</Link>
              <Link href="/privacy" className="transition-colors hover:text-accent">{t("nav.privacy")}</Link>
              <Link href="/contact" className="transition-colors hover:text-accent">{t("nav.contact")}</Link>
              <Link href="/admin" className="transition-colors hover:text-accent">{t("nav.admin")}</Link>
            </div>

            <div className="h-px w-32 bg-white/10" />

            <div>
              <p className="font-hindi text-sm text-accent/80">{t("landing.footerSeva")}</p>
              <p className="mt-1 text-xs text-white/20">{t("landing.footerBuilt")}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ Accordion Item ───
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-card border transition-all duration-300 ${open ? "border-accent/30 bg-accent/5 shadow-sm" : "border-border-warm bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <p className="font-hindi font-bold text-dark">{q}</p>
        <span className={`mt-1 flex-shrink-0 text-lg text-accent transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 pb-5" : "max-h-0"}`}>
        <p className="px-5 text-sm leading-relaxed text-dark/60">{a}</p>
      </div>
    </div>
  );
}
