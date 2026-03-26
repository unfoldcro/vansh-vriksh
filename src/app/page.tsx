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

      {/* ─── SECTION 1: HERO ─── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-fade-in-up">
        <AnimatedTree />
        <h1 className="mt-6 font-hindi text-5xl font-bold text-dark md:text-7xl">
          🌳 वंश वृक्ष
        </h1>
        <p className="mt-3 max-w-lg text-lg text-dark/60">
          अपने पूर्वजों की विरासत को डिजिटल करें
        </p>
        <p className="text-base text-dark/40">
          Digitize Your Ancestral Legacy
        </p>
        <div className="mt-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 label-mono text-accent">
          100% FREE | NO ADS | SEVA
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/search" className="btn-secondary">
            🌳 मेरा वृक्ष खोजें / Find My Tree
          </Link>
          <Link href="/verify" className="btn-primary">
            ✨ नया वृक्ष बनाएं / Create Tree
          </Link>
        </div>
      </section>

      {/* ─── SECTION 2: WHAT IS IT ─── */}
      <section className="bg-bg-muted px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-mono text-accent">ABOUT</p>
          <h2 className="mt-3 font-hindi text-2xl font-bold text-dark md:text-3xl">
            यह क्या है? / What Is It?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-dark/70">
            एक ऐसा मंच जहाँ आपका पूरा परिवार एक वृक्ष में जुड़ता है।
          </p>
          <p className="mt-2 leading-relaxed text-dark/50">
            दादा-दादी से लेकर परपोती तक — 7 पीढ़ियां, 38+ रिश्ते।
            <br />
            WhatsApp पर लिंक भेजो, परिवार जुड़ता जाएगा।
          </p>
          <p className="mt-1 text-sm text-dark/35">
            A platform where your entire family connects in one tree — 7 generations, 38+ relations.
            Share on WhatsApp, family keeps growing.
          </p>
        </div>
      </section>

      {/* ─── SECTION 3: 6 FEATURE CARDS ─── */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center label-mono text-accent">FEATURES</p>
          <h2 className="mt-3 mb-10 text-center font-hindi text-2xl font-bold text-dark md:text-3xl">
            विशेषताएं / Features
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="👨‍👩‍👧‍👦"
              title="38+ रिश्ते"
              description="दादा-दादी, बुआ-फूफा, साला-साली, देवरानी-जेठानी — सब शामिल"
            />
            <FeatureCard
              icon="🙏"
              title="गोत्र + कुलदेवी"
              description="आपकी पूरी हिंदू पहचान — गोत्र, कुलदेवी, जाति, नक्षत्र, राशि"
            />
            <FeatureCard
              icon="💑"
              title="विवाह से परिवार जुड़ें"
              description="बेटी की शादी हुई? दोनों परिवार के वृक्ष जुड़ जाते हैं"
            />
            <FeatureCard
              icon="🕊"
              title="श्राद्ध सहायक"
              description="पिता, दादा, परदादा — 3 पीढ़ी एक क्लिक में"
            />
            <FeatureCard
              icon="🔒"
              title="गोपनीयता"
              description="आपका डेटा सिर्फ आपका। गोत्र के अनुसार दिखता है"
            />
            <FeatureCard
              icon="👴"
              title="बुज़ुर्गों के लिए"
              description="बच्चे दादा-दादी का डेटा जोड़ सकते हैं"
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: LIVE EXAMPLE (Demo Tree) ─── */}
      <section className="bg-bg-muted px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center label-mono text-accent">EXAMPLE</p>
          <h2 className="mt-3 mb-2 text-center font-hindi text-2xl font-bold text-dark md:text-3xl">
            उदाहरण / Example Tree
          </h2>
          <p className="mb-8 text-center text-sm text-dark/40">
            पाटिल परिवार — Patil Family (tap cards to expand)
          </p>
          <DemoTree />
          <p className="mt-6 text-center text-xs text-dark/35">
            यह उदाहरण है। अपना वृक्ष बनाने के लिए ऊपर क्लिक करें।
            <br />
            This is an example. Click above to create your own tree.
          </p>
        </div>
      </section>

      {/* ─── SECTION 5: HOW IT WORKS ─── */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center label-mono text-accent">HOW IT WORKS</p>
          <h2 className="mt-3 mb-10 text-center font-hindi text-2xl font-bold text-dark md:text-3xl">
            कैसे काम करता है?
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                icon: "📱",
                hi: "सत्यापन — Phone/Email OTP (30 सेकंड)",
                en: "Verification — Phone/Email OTP (30 seconds)",
              },
              {
                step: "2",
                icon: "👨‍👩‍👧‍👦",
                hi: "परिवार जोड़ें (5 मिनट प्रति सदस्य)",
                en: "Add Family (5 minutes per member)",
              },
              {
                step: "3",
                icon: "📤",
                hi: "WhatsApp पर भेजें — परिवार जुड़ता जाएगा",
                en: "Share on WhatsApp — Family keeps growing",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl font-bold text-white">
                  {s.step}
                </div>
                <div>
                  <div className="text-lg font-medium text-dark">
                    {s.icon} {s.hi}
                  </div>
                  <div className="text-sm text-dark/40">{s.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: SEVA DECLARATION ─── */}
      <section className="bg-dark px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-hindi text-2xl font-bold text-accent md:text-4xl">
            सेवा परमो धर्मः
          </p>
          <p className="mt-2 text-lg text-white/60">
            Service is the highest duty
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: "🚫", text: "कोई विज्ञापन नहीं" },
              { icon: "🆓", text: "सब कुछ मुफ्त" },
              { icon: "🔒", text: "डेटा सिर्फ आपका" },
              { icon: "🙏", text: "सभी के लिए" },
            ].map((promise) => (
              <div
                key={promise.text}
                className="rounded-card border border-accent/20 bg-accent/5 px-3 py-4"
              >
                <div className="text-2xl">{promise.icon}</div>
                <div className="mt-1 text-sm font-medium text-accent/90">
                  {promise.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: LIVE STATS ─── */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center label-mono text-accent mb-6">LIVE STATS</p>
          <div className="grid grid-cols-3 gap-6">
            <AnimatedCounter target={0} label="परिवार / Families" />
            <AnimatedCounter target={0} label="सदस्य / Members" />
            <AnimatedCounter target={0} label="गोत्र / Gotras" />
          </div>
          <p className="mt-4 text-center text-sm text-dark/35">
            आप पहले बनें! — Be the first!
          </p>
        </div>
      </section>

      {/* ─── SECTION 8: BOTTOM CTA ─── */}
      <section className="bg-bg-muted px-4 py-16 text-center md:py-24">
        <p className="mb-6 text-lg text-dark/50">
          पहले देखो, फिर बनाओ — First check, then create
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/search" className="btn-secondary">
            🌳 मेरा वृक्ष खोजें / Find My Tree
          </Link>
          <Link href="/verify" className="btn-primary">
            ✨ नया वृक्ष बनाएं / Create Tree
          </Link>
        </div>
      </section>

      {/* ─── SECTION 9: FOOTER ─── */}
      <footer className="border-t border-border-warm bg-bg-primary px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-dark/50">
            <Link href="/about" className="transition-colors hover:text-accent">
              About / परिचय
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-accent">
              Privacy / गोपनीयता
            </Link>
            <Link href="/contact" className="transition-colors hover:text-accent">
              Contact / संपर्क
            </Link>
            <Link href="/admin" className="transition-colors hover:text-accent">
              Admin
            </Link>
          </div>
          <p className="text-xs text-dark/30">
            Built with ❤️ as Seva | सेवा परमो धर्मः
          </p>
          <p className="text-xs text-dark/20">
            Vansh-Vriksh.unfoldcro.in
          </p>
        </div>
      </footer>
    </div>
  );
}
