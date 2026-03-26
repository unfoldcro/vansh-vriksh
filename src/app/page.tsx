export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4">
      <div className="text-center">
        <h1 className="font-hindi text-5xl font-bold text-earth md:text-7xl">
          वंश वृक्ष
        </h1>
        <p className="mt-2 text-lg text-earth/70">
          Vansh Vriksh
        </p>
        <p className="mt-4 max-w-md text-base text-earth/60">
          अपने पूर्वजों की विरासत को डिजिटल करें
          <br />
          <span className="text-sm">Digitize Your Ancestral Legacy</span>
        </p>
        <div className="mt-6 inline-flex items-center rounded-full border border-border-warm bg-bg-muted px-4 py-1.5 text-sm text-earth/80">
          100% मुफ्त | कोई विज्ञापन नहीं | सेवा
        </div>
        <p className="mt-8 text-xs text-earth/40">
          Coming soon...
        </p>
      </div>
    </main>
  );
}
