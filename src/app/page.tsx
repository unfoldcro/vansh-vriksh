"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatedTree } from "@/components/ui/AnimatedTree";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { DemoTree } from "@/components/tree/DemoTree";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
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
          <div className="absolute left-[5%] top-[55%] animate-float-delayed text-2xl opacity-10">✨</div>
          <div className="absolute right-[8%] top-[60%] animate-float-slow text-3xl opacity-10">🍃</div>
          {/* Gradient orbs */}
          <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute -right-32 bottom-1/4 h-48 w-48 rounded-full bg-accent/8 blur-[80px]" />
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <AnimatedTree />

          <h1 className="mt-6 font-hindi text-5xl font-bold text-dark md:text-8xl">
            वंश वृक्ष
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-dark/60 md:text-2xl">
            अपने पूर्वजों की विरासत को डिजिटल करें
          </p>
          <p className="mt-1 text-base text-dark/35">
            Digitize Your Ancestral Legacy — Free Forever
          </p>

          {/* Seva badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 animate-glow">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="label-mono text-accent">100% FREE &middot; NO ADS &middot; PURE SEVA</span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/search" className="btn-secondary group">
              <span className="mr-2 transition-transform group-hover:-translate-x-0.5">🔍</span>
              मेरा वृक्ष खोजें / Find My Tree
            </Link>
            <Link href="/verify" className="btn-primary group">
              <span className="mr-2 transition-transform group-hover:scale-110">✨</span>
              नया वृक्ष बनाएं / Create Tree
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-1 text-dark/20">
            <span className="text-xs">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" className="animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 4v12M4 12l4 4 4-4" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── RELATION MARQUEE ─── */}
      <section className="overflow-hidden border-y border-border-warm bg-white py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            "दादा", "दादी", "नाना", "नानी", "पिता", "माता", "ताऊ", "ताई", "चाचा", "चाची",
            "बुआ", "फूफा", "मामा", "मामी", "मौसी", "मौसा", "भाई", "बहन", "पति", "पत्नी",
            "पुत्र", "पुत्री", "दामाद", "बहू", "ससुर", "सास", "साला", "साली", "जीजा", "भाभी",
            "जेठ", "देवर", "ननद", "जेठानी", "देवरानी", "पोता", "पोती", "नाती", "नातिन",
            "दादा", "दादी", "नाना", "नानी", "पिता", "माता", "ताऊ", "ताई", "चाचा", "चाची",
            "बुआ", "फूफा", "मामा", "मामी", "मौसी", "मौसा", "भाई", "बहन", "पति", "पत्नी",
            "पुत्र", "पुत्री", "दामाद", "बहू", "ससुर", "सास", "साला", "साली", "जीजा", "भाभी",
            "जेठ", "देवर", "ननद", "जेठानी", "देवरानी", "पोता", "पोती", "नाती", "नातिन",
          ].map((rel, i) => (
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
            {/* Left — text */}
            <div>
              <p className="label-mono text-accent">ABOUT</p>
              <h2 className="mt-3 font-hindi text-3xl font-bold text-dark md:text-4xl">
                एक वृक्ष,<br />पूरा परिवार
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-dark/60">
                दादा-दादी से लेकर परपोती तक — <span className="font-bold text-accent">7 पीढ़ियां</span>, <span className="font-bold text-accent">38+ रिश्ते</span>।
              </p>
              <p className="mt-2 text-dark/45">
                WhatsApp पर लिंक भेजो, परिवार जुड़ता जाएगा। A platform where your entire family connects in one tree.
              </p>

              {/* Mini stats inline */}
              <div className="mt-8 flex gap-6">
                <div>
                  <div className="text-3xl font-bold text-gradient">7</div>
                  <div className="text-xs text-dark/40">Generations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">38+</div>
                  <div className="text-xs text-dark/40">Relations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">100%</div>
                  <div className="text-xs text-dark/40">Free</div>
                </div>
              </div>
            </div>

            {/* Right — visual card stack */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-accent/5 blur-xl" />
              <div className="relative space-y-3">
                {[
                  { icon: "👴", name: "रामजी पाटिल", rel: "परदादा", gen: "Gen -3", bg: "bg-card-deceased/40" },
                  { icon: "👨", name: "सुरेश पाटिल", rel: "पिता", gen: "Gen -1", bg: "bg-card-male/60" },
                  { icon: "👤", name: "राजेश पाटिल", rel: "स्वयं", gen: "Gen 0", bg: "bg-accent/10" },
                  { icon: "👦", name: "अर्जुन पाटिल", rel: "पुत्र", gen: "Gen +1", bg: "bg-card-male/40" },
                  { icon: "👶", name: "...", rel: "पोता / पोती", gen: "Gen +2", bg: "bg-bg-muted" },
                ].map((item, i) => (
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
          <p className="text-center label-mono text-accent">FEATURES</p>
          <h2 className="mt-3 mb-4 text-center font-hindi text-3xl font-bold text-dark md:text-4xl">
            विशेषताएं
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-dark/50">
            भारतीय परिवारों के लिए, भारतीय रिश्तों के साथ / Built for Indian families, with Indian relations
          </p>

          {/* Bento Grid */}
          <div className="grid gap-4 md:grid-cols-3 stagger-children">
            {/* Large card spanning 2 cols */}
            <FeatureCard
              icon="👨‍👩‍👧‍👦"
              title="38+ भारतीय रिश्ते"
              description="दादा-दादी, बुआ-फूफा, साला-साली, देवरानी-जेठानी, भतीजा-भतीजी, नाती-नातिन — हर रिश्ता शामिल है। No Western app covers these."
              accent
              className="md:col-span-2"
            />
            <FeatureCard
              icon="🙏"
              title="गोत्र + कुलदेवी"
              description="गोत्र, कुलदेवी, जाति, नक्षत्र, राशि — पूरी हिंदू पहचान एक जगह"
            />
            <FeatureCard
              icon="💑"
              title="विवाह से जुड़ें"
              description="बेटी की शादी हुई? दोनों परिवार के वृक्ष आपस में जुड़ जाते हैं — cross-tree marriage links"
            />
            <FeatureCard
              icon="🕊"
              title="श्राद्ध सहायक"
              description="पिता, दादा, परदादा — 3 पीढ़ी की तिथि और तीर्थ स्थल एक क्लिक में"
              accent
            />
            <FeatureCard
              icon="🔒"
              title="गोपनीयता"
              description="आपका डेटा सिर्फ आपका। गोत्र के अनुसार ही दिखता है — no public exposure"
            />
          </div>

          {/* Extra feature pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              "WhatsApp Share", "Bilingual Hindi/English", "Offline Ready (PWA)",
              "Elder-Friendly", "Multiple Marriages", "Recycle Bin",
              "Soft Delete", "7 Generations", "Gotra Discovery",
            ].map((f) => (
              <span key={f} className="rounded-full border border-border-warm bg-white px-3 py-1.5 text-xs text-dark/50">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — Timeline ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-center label-mono text-accent">HOW IT WORKS</p>
          <h2 className="mt-3 mb-14 text-center font-hindi text-3xl font-bold text-dark md:text-4xl">
            सिर्फ 3 कदम
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-accent via-accent/40 to-transparent md:left-1/2 md:block" />

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  icon: "📱",
                  hi: "ईमेल सत्यापन",
                  detail: "अपना ईमेल डालें, मैजिक लिंक आएगा। क्लिक करें — बस!",
                  en: "Enter email, click magic link — done in 30 seconds",
                  time: "30 sec",
                },
                {
                  step: "02",
                  icon: "👨‍👩‍👧‍👦",
                  hi: "परिवार जोड़ें",
                  detail: "दादा-दादी से शुरू करें, एक-एक करके सदस्य जोड़ें। गोत्र, कुलदेवी, सब भरें।",
                  en: "Add members one by one — name, relation, gotra, everything",
                  time: "5 min/member",
                },
                {
                  step: "03",
                  icon: "📤",
                  hi: "WhatsApp पर भेजें",
                  detail: "लिंक भेजो, परिवार देखेगा और जुड़ता जाएगा। वृक्ष बढ़ता रहेगा!",
                  en: "Share link — family joins and tree keeps growing",
                  time: "Instant",
                },
              ].map((s, i) => (
                <div key={s.step} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "" : "md:flex-row-reverse md:text-right"}`}>
                  {/* Step circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-white shadow-lg shadow-accent/20">
                      {s.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-card border border-border-warm bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="label-mono text-accent">{s.step}</span>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">{s.time}</span>
                    </div>
                    <h3 className="mt-2 font-hindi text-xl font-bold text-dark">{s.hi}</h3>
                    <p className="mt-1 text-sm text-dark/60">{s.detail}</p>
                    <p className="mt-1 text-xs text-dark/35">{s.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEMO TREE — Interactive ─── */}
      <section className="bg-bg-muted px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-center label-mono text-accent">LIVE DEMO</p>
          <h2 className="mt-3 mb-2 text-center font-hindi text-3xl font-bold text-dark md:text-4xl">
            पाटिल परिवार
          </h2>
          <p className="mb-10 text-center text-dark/40">
            Interactive example — tap cards to expand details
          </p>
          <div className="rounded-2xl border border-border-warm bg-white p-4 shadow-sm md:p-6">
            <DemoTree />
          </div>
          <p className="mt-6 text-center text-sm text-dark/35">
            यह उदाहरण है। अपना वृक्ष इससे भी बड़ा बनाएं! / This is a demo. Your tree can be even bigger!
          </p>
        </div>
      </section>

      {/* ─── BEFORE vs AFTER ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-center label-mono text-accent">WHY VANSH VRIKSH</p>
          <h2 className="mt-3 mb-12 text-center font-hindi text-3xl font-bold text-dark md:text-4xl">
            पहले और अब
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Before */}
            <div className="rounded-card border-2 border-error/20 bg-error/5 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-error/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-error" />
                <span className="text-xs font-bold text-error">WITHOUT</span>
              </div>
              <ul className="space-y-3">
                {[
                  "बच्चों को दादा-परदादा के नाम नहीं पता",
                  "श्राद्ध की तिथि भूल जाते हैं",
                  "कागज़ के रिकॉर्ड खो जाते हैं",
                  "शादी के बाद मायके का नाम मिट जाता है",
                  "पीढ़ियों की जानकारी सिर्फ बुज़ुर्गों तक",
                  "कुलदेवी-गोत्र नई पीढ़ी को पता नहीं",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-dark/60">
                    <span className="mt-0.5 text-error">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-card border-2 border-accent/20 bg-accent/5 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-xs font-bold text-accent">WITH VANSH VRIKSH</span>
              </div>
              <ul className="space-y-3">
                {[
                  "7 पीढ़ियों का पूरा रिकॉर्ड — डिजिटल, हमेशा सुरक्षित",
                  "श्राद्ध सहायक — तिथि, तीर्थ स्थल एक क्लिक में",
                  "ऑनलाइन + ऑफलाइन — कभी नहीं खोएगा",
                  "maiden name हमेशा संरक्षित (née tag)",
                  "WhatsApp से पूरा परिवार जुड़ सकता है",
                  "गोत्र, कुलदेवी, नक्षत्र — सब दर्ज़",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-dark/70">
                    <span className="mt-0.5 text-accent">✓</span>
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
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="text-5xl">🙏</div>
          <p className="mt-6 font-hindi text-3xl font-bold text-accent md:text-5xl">
            सेवा परमो धर्मः
          </p>
          <p className="mt-3 text-xl text-white/50">
            Service is the highest duty
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/30">
            यह कोई बिज़नेस नहीं है। यह सेवा है। कोई विज्ञापन नहीं, कोई प्रीमियम नहीं, कोई डेटा बेचना नहीं। बस परिवार को जोड़ना।
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: "🚫", title: "कोई विज्ञापन नहीं", en: "Zero Ads" },
              { icon: "🆓", title: "सब कुछ मुफ्त", en: "Totally Free" },
              { icon: "🔒", title: "डेटा सिर्फ आपका", en: "Your Data, Only Yours" },
              { icon: "🌍", title: "सभी के लिए", en: "For Everyone" },
            ].map((promise) => (
              <div
                key={promise.title}
                className="rounded-card border border-accent/15 bg-accent/5 p-4 transition-all duration-300 hover:border-accent/30 hover:bg-accent/10"
              >
                <div className="text-3xl">{promise.icon}</div>
                <div className="mt-2 font-hindi text-sm font-bold text-accent">
                  {promise.title}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/30">
                  {promise.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-center label-mono text-accent">FAQ</p>
          <h2 className="mt-3 mb-10 text-center font-hindi text-3xl font-bold text-dark md:text-4xl">
            अक्सर पूछे जाने वाले सवाल
          </h2>
          <div className="space-y-3">
            <FAQItem
              q="क्या यह सच में मुफ्त है?"
              qEn="Is it really free?"
              a="हाँ, 100% मुफ्त। कोई छुपा हुआ शुल्क नहीं, कोई प्रीमियम प्लान नहीं, कोई विज्ञापन नहीं। यह सेवा है, बिज़नेस नहीं।"
            />
            <FAQItem
              q="मेरा डेटा कौन देख सकता है?"
              qEn="Who can see my data?"
              a="सिर्फ आपके परिवार के सदस्य। गोत्र-आधारित गोपनीयता — बाहरी लोग सिर्फ tree metadata (उपनाम, गांव) देख सकते हैं, कोई व्यक्तिगत जानकारी नहीं।"
            />
            <FAQItem
              q="बुज़ुर्गों को फोन चलाना नहीं आता — क्या करें?"
              qEn="What about elderly family members?"
              a="बच्चे या पोते दादा-दादी का डेटा जोड़ सकते हैं। बुज़ुर्गों को खुद अकाउंट बनाने की ज़रूरत नहीं है।"
            />
            <FAQItem
              q="अगर मेरा वृक्ष पहले से बना हो?"
              qEn="What if my tree already exists?"
              a="पहले खोजें! नाम, गोत्र, गांव से search करें। अगर मिल जाए तो Join करें — duplicate नहीं बनेगा।"
            />
            <FAQItem
              q="शादी के बाद मायके का नाम मिट जाएगा?"
              qEn="Will maiden name be lost after marriage?"
              a="कभी नहीं! Maiden name (née tag) हमेशा संरक्षित रहता है। विवाहित महिलाएं अपना display name चुन सकती हैं — मायके का, ससुराल का, या दोनों।"
            />
            <FAQItem
              q="क्या ऑफलाइन काम करता है?"
              qEn="Does it work offline?"
              a="PWA (Progressive Web App) — एक बार खुलने के बाद ऑफलाइन भी काम करता है। Add to Home Screen करें!"
            />
          </div>
        </div>
      </section>

      {/* ─── LIVE STATS ─── */}
      <section className="bg-bg-muted px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center label-mono text-accent mb-8">LIVE STATS</p>
          <div className="grid grid-cols-3 gap-6">
            <AnimatedCounter target={0} label="परिवार / Families" />
            <AnimatedCounter target={0} label="सदस्य / Members" />
            <AnimatedCounter target={0} label="गोत्र / Gotras" />
          </div>
          <p className="mt-6 text-center text-sm text-dark/35">
            आप पहले बनें! — Be the first!
          </p>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="text-5xl">🌳</div>
          <h2 className="mt-6 font-hindi text-3xl font-bold text-dark md:text-5xl">
            आज ही शुरू करें
          </h2>
          <p className="mt-3 text-lg text-dark/50">
            पहले देखो, फिर बनाओ — First check, then create
          </p>
          <p className="mt-1 text-sm text-dark/30">
            No signup needed to search. Create your tree in 5 minutes.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/search" className="btn-secondary group">
              <span className="mr-2">🔍</span>
              मेरा वृक्ष खोजें / Find My Tree
            </Link>
            <Link href="/verify" className="btn-primary group">
              <span className="mr-2">✨</span>
              नया वृक्ष बनाएं / Create Tree
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border-warm bg-dark px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Logo */}
            <div>
              <p className="font-hindi text-xl font-bold text-accent">🌳 वंश वृक्ष</p>
              <p className="mt-1 text-xs text-white/30">Vansh-Vriksh.unfoldcro.in</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              <Link href="/about" className="transition-colors hover:text-accent">About</Link>
              <Link href="/privacy" className="transition-colors hover:text-accent">Privacy</Link>
              <Link href="/contact" className="transition-colors hover:text-accent">Contact</Link>
              <Link href="/admin" className="transition-colors hover:text-accent">Admin</Link>
            </div>

            {/* Divider */}
            <div className="h-px w-32 bg-white/10" />

            {/* Sanskrit */}
            <div>
              <p className="font-hindi text-sm text-accent/80">सेवा परमो धर्मः</p>
              <p className="mt-1 text-xs text-white/20">Built with ❤️ as Seva by UnfoldCRO</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ Accordion Item ───
function FAQItem({ q, qEn, a }: { q: string; qEn: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-card border transition-all duration-300 ${open ? "border-accent/30 bg-accent/5 shadow-sm" : "border-border-warm bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <div>
          <p className="font-hindi font-bold text-dark">{q}</p>
          <p className="text-xs text-dark/35">{qEn}</p>
        </div>
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
