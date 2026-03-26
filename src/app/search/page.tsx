"use client";

import { useState } from "react";
import Link from "next/link";

type SearchTab = "link" | "name" | "location" | "advanced";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<SearchTab>("link");
  const [linkInput, setLinkInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [villageInput, setVillageInput] = useState("");
  const [districtInput, setDistrictInput] = useState("");
  const [gotraInput, setGotraInput] = useState("");
  const [kulDevtaInput, setKulDevtaInput] = useState("");
  const [stateInput, setStateInput] = useState("Madhya Pradesh");
  const [searched, setSearched] = useState(false);

  const tabs: { key: SearchTab; label: string }[] = [
    { key: "link", label: "लिंक / Link or ID" },
    { key: "name", label: "नाम से / By Name" },
    { key: "location", label: "गांव से / By Location" },
    { key: "advanced", label: "विस्तृत खोज / Advanced" },
  ];

  const handleSearch = () => {
    setSearched(true);
    // TODO: Query Firestore for matching trees
  };

  const whatsappMessage = encodeURIComponent(
    "क्या हमारे परिवार का वंश वृक्ष Vansh-Vriksh.unfoldcro.in पर बना है?\nअगर हां तो लिंक भेजो। अगर नहीं तो मैं बनाता/बनाती हूं!"
  );

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <Link href="/" className="mb-6 inline-block text-sm text-earth/50 hover:text-gold">
          ← वापस / Back
        </Link>
        <h1 className="font-hindi text-2xl font-bold text-earth md:text-3xl">
          🔍 अपना वंश वृक्ष खोजें
        </h1>
        <p className="text-base text-earth/50">Find Your Family Tree</p>
        <p className="mt-1 text-sm text-earth/40">
          शायद आपके परिवार का वृक्ष पहले से बना हो!
        </p>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg bg-bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearched(false); }}
              className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-bg-card text-earth shadow-sm"
                  : "text-earth/60 hover:text-earth"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* TAB 1: Link / ID */}
          {activeTab === "link" && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">URL या Tree ID डालें</span>
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Vansh-Vriksh.unfoldcro.in/tree/PATIL-1985-7X3K or PATIL-1985-7X3K"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <button onClick={handleSearch} className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90">
                खोजें / Search
              </button>
            </div>
          )}

          {/* TAB 2: By Name */}
          {activeTab === "name" && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">परिवार का उपनाम / Family Surname</span>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Patil / पाटिल"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <button onClick={handleSearch} className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90">
                खोजें / Search
              </button>
            </div>
          )}

          {/* TAB 3: By Location */}
          {activeTab === "location" && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">गांव / Village</span>
                <input
                  type="text"
                  value={villageInput}
                  onChange={(e) => setVillageInput(e.target.value)}
                  placeholder="Doraha"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-earth">जिला / District</span>
                <input
                  type="text"
                  value={districtInput}
                  onChange={(e) => setDistrictInput(e.target.value)}
                  placeholder="Sehore"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <button onClick={handleSearch} className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90">
                खोजें / Search
              </button>
            </div>
          )}

          {/* TAB 4: Advanced */}
          {activeTab === "advanced" && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">उपनाम / Surname</span>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Patil"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-earth">गोत्र / Gotra</span>
                <input
                  type="text"
                  value={gotraInput}
                  onChange={(e) => setGotraInput(e.target.value)}
                  placeholder="Kashyap"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-earth">कुल देवता/देवी / Kul Devta/Devi</span>
                <input
                  type="text"
                  value={kulDevtaInput}
                  onChange={(e) => setKulDevtaInput(e.target.value)}
                  placeholder="माँ शारदा"
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">गांव / Village</span>
                  <input
                    type="text"
                    value={villageInput}
                    onChange={(e) => setVillageInput(e.target.value)}
                    placeholder="Doraha"
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">जिला / District</span>
                  <input
                    type="text"
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                    placeholder="Sehore"
                    className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-earth">राज्य / State</span>
                <input
                  type="text"
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-warm bg-bg-card px-4 py-3 text-earth placeholder:text-earth/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <button onClick={handleSearch} className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-earth transition-colors hover:bg-gold/90">
                खोजें / Search
              </button>
            </div>
          )}
        </div>

        {/* No Results (shown after search) */}
        {searched && (
          <div className="mt-8 space-y-6">
            <p className="text-center text-earth/60">
              कोई परिणाम नहीं मिला / No results found
            </p>

            {/* Option 1: Create New */}
            <div className="rounded-xl border border-border-warm bg-bg-card p-5 text-center">
              <div className="text-2xl">✨</div>
              <h3 className="mt-2 font-semibold text-earth">नया वृक्ष बनाएं</h3>
              <p className="mt-1 text-sm text-earth/60">
                आपके परिवार का वृक्ष अभी तक नहीं बना है। आप पहले बनाएं! 🌱
              </p>
              <Link
                href="/verify"
                className="mt-3 inline-block rounded-lg bg-gold px-6 py-2 text-sm font-semibold text-earth transition-colors hover:bg-gold/90"
              >
                Create New Tree
              </Link>
            </div>

            {/* Option 2: Try again */}
            <div className="rounded-xl border border-border-warm bg-bg-card p-5 text-center">
              <div className="text-2xl">🔍</div>
              <h3 className="mt-2 font-semibold text-earth">दूसरे तरीके से खोजें</h3>
              <p className="mt-1 text-sm text-earth/60">
                शायद दूसरे नाम, गांव, या गोत्र से खोजें
              </p>
              <button
                onClick={() => { setSearched(false); setActiveTab("advanced"); }}
                className="mt-3 rounded-lg border border-border-warm px-6 py-2 text-sm font-medium text-earth transition-colors hover:bg-bg-muted"
              >
                Try Advanced Search
              </button>
            </div>

            {/* Option 3: Ask family */}
            <div className="rounded-xl border border-border-warm bg-bg-card p-5 text-center">
              <div className="text-2xl">📲</div>
              <h3 className="mt-2 font-semibold text-earth">परिवार से पूछें</h3>
              <p className="mt-1 text-sm text-earth/60">
                WhatsApp पर परिवार को पूछें कि क्या वृक्ष बना है
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(decodeURIComponent(whatsappMessage))}
                  className="rounded-lg border border-border-warm px-4 py-2 text-sm font-medium text-earth transition-colors hover:bg-bg-muted"
                >
                  Copy Message
                </button>
                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-seva px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-seva/90"
                >
                  Share on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
