"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import type { TreeMetadata } from "@/types";

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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TreeMetadata[]>([]);

  const tabs: { key: SearchTab; label: string }[] = [
    { key: "link", label: "लिंक / Link or ID" },
    { key: "name", label: "नाम से / By Name" },
    { key: "location", label: "गांव से / By Location" },
    { key: "advanced", label: "विस्तृत खोज / Advanced" },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      if (activeTab === "link") {
        // Extract tree ID from URL or use raw input
        let treeId = linkInput.trim();
        const urlMatch = treeId.match(/tree\/([A-Z0-9-]+)/i);
        if (urlMatch) treeId = urlMatch[1];

        // Direct lookup by tree ID
        const res = await api.get<{ tree: TreeMetadata }>(`/api/trees/${treeId}`);
        if (res.tree) {
          setResults([res.tree]);
        }
      } else if (activeTab === "name") {
        // Search by surname
        const res = await api.get<{ trees: TreeMetadata[] }>(
          `/api/trees/search?q=${encodeURIComponent(nameInput.trim())}`
        );
        setResults(res.trees || []);
      } else if (activeTab === "location") {
        // Search by location — use the search endpoint with village/district
        const params = new URLSearchParams();
        if (villageInput.trim()) params.set("q", villageInput.trim());
        if (districtInput.trim()) params.set("district", districtInput.trim());
        const res = await api.get<{ trees: TreeMetadata[] }>(
          `/api/trees/search?${params.toString()}`
        );
        setResults(res.trees || []);
      } else if (activeTab === "advanced") {
        // Advanced search with multiple fields
        const params = new URLSearchParams();
        if (nameInput.trim()) params.set("q", nameInput.trim());
        if (gotraInput.trim()) params.set("gotra", gotraInput.trim());
        if (villageInput.trim()) params.set("village", villageInput.trim());
        if (districtInput.trim()) params.set("district", districtInput.trim());
        const res = await api.get<{ trees: TreeMetadata[] }>(
          `/api/trees/search?${params.toString()}`
        );
        setResults(res.trees || []);
      }
    } catch {
      // No results or error
      setResults([]);
    } finally {
      setLoading(false);
    }
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
              onClick={() => { setActiveTab(tab.key); setSearched(false); setResults([]); }}
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
                  placeholder="PATIL-1985-7X3K"
                  className="input-field mt-1"
                  onKeyDown={(e) => e.key === "Enter" && linkInput.trim() && handleSearch()}
                />
              </label>
              <button onClick={handleSearch} disabled={loading || !linkInput.trim()} className="btn-primary w-full">
                {loading ? "खोज रहे हैं..." : "खोजें / SEARCH"}
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
                  className="input-field mt-1"
                  onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && handleSearch()}
                />
              </label>
              <button onClick={handleSearch} disabled={loading || !nameInput.trim()} className="btn-primary w-full">
                {loading ? "खोज रहे हैं..." : "खोजें / SEARCH"}
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
                  className="input-field mt-1"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-earth">जिला / District</span>
                <input
                  type="text"
                  value={districtInput}
                  onChange={(e) => setDistrictInput(e.target.value)}
                  placeholder="Sehore"
                  className="input-field mt-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </label>
              <button onClick={handleSearch} disabled={loading} className="btn-primary w-full">
                {loading ? "खोज रहे हैं..." : "खोजें / SEARCH"}
              </button>
            </div>
          )}

          {/* TAB 4: Advanced */}
          {activeTab === "advanced" && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-earth">उपनाम / Surname</span>
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Patil" className="input-field mt-1" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-earth">गोत्र / Gotra</span>
                <input type="text" value={gotraInput} onChange={(e) => setGotraInput(e.target.value)}
                  placeholder="Kashyap" className="input-field mt-1" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-earth">कुल देवता/देवी / Kul Devta/Devi</span>
                <input type="text" value={kulDevtaInput} onChange={(e) => setKulDevtaInput(e.target.value)}
                  placeholder="माँ शारदा" className="input-field mt-1" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-earth">गांव / Village</span>
                  <input type="text" value={villageInput} onChange={(e) => setVillageInput(e.target.value)}
                    placeholder="Doraha" className="input-field mt-1" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-earth">जिला / District</span>
                  <input type="text" value={districtInput} onChange={(e) => setDistrictInput(e.target.value)}
                    placeholder="Sehore" className="input-field mt-1" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-earth">राज्य / State</span>
                <input type="text" value={stateInput} onChange={(e) => setStateInput(e.target.value)}
                  className="input-field mt-1" />
              </label>
              <button onClick={handleSearch} disabled={loading} className="btn-primary w-full">
                {loading ? "खोज रहे हैं..." : "खोजें / SEARCH"}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && !loading && results.length > 0 && (
          <div className="mt-8 space-y-4">
            <p className="text-sm font-medium text-earth/60">
              {results.length} परिणाम मिले / {results.length} result{results.length > 1 ? "s" : ""} found
            </p>
            {results.map((tree) => (
              <div key={tree.treeId} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-earth">
                      🌳 {tree.familySurname} Family — {tree.familySurname} परिवार
                    </p>
                    {tree.gotra && (
                      <p className="mt-1 text-sm text-earth/60">गोत्र: {tree.gotra}</p>
                    )}
                    {tree.kulDevta && (
                      <p className="text-sm text-earth/60">कुलदेवता: {tree.kulDevta}</p>
                    )}
                    <p className="mt-1 text-sm text-earth/50">
                      {[tree.village, tree.district, tree.state].filter(Boolean).join(", ")}
                    </p>
                    <div className="mt-2 flex gap-4 text-xs text-earth/40">
                      <span>👥 {tree.totalMembers || 1} Members</span>
                      <span>📊 {tree.generations || 1} Generations</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/tree/${tree.treeId}`}
                    className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                  >
                    👁 View Tree
                  </Link>
                  <Link
                    href={`/join/${tree.treeId}`}
                    className="rounded-lg bg-gold/10 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
                  >
                    🤝 Join This Tree
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {searched && !loading && results.length === 0 && (
          <div className="mt-8 space-y-6">
            <p className="text-center text-earth/60">
              कोई परिणाम नहीं मिला / No results found
            </p>

            <div className="card p-5 text-center">
              <div className="text-2xl">✨</div>
              <h3 className="mt-2 font-semibold text-earth">नया वृक्ष बनाएं</h3>
              <p className="mt-1 text-sm text-earth/60">
                आपके परिवार का वृक्ष अभी तक नहीं बना है। आप पहले बनाएं! 🌱
              </p>
              <Link href="/verify" className="btn-primary mt-3 inline-block text-sm">
                Create New Tree
              </Link>
            </div>

            <div className="card p-5 text-center">
              <div className="text-2xl">🔍</div>
              <h3 className="mt-2 font-semibold text-earth">दूसरे तरीके से खोजें</h3>
              <p className="mt-1 text-sm text-earth/60">
                शायद दूसरे नाम, गांव, या गोत्र से खोजें
              </p>
              <button
                onClick={() => { setSearched(false); setActiveTab("advanced"); }}
                className="btn-ghost mt-3 text-sm"
              >
                Try Advanced Search
              </button>
            </div>

            <div className="card p-5 text-center">
              <div className="text-2xl">📲</div>
              <h3 className="mt-2 font-semibold text-earth">परिवार से पूछें</h3>
              <p className="mt-1 text-sm text-earth/60">
                WhatsApp पर परिवार को पूछें कि क्या वृक्ष बना है
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(decodeURIComponent(whatsappMessage))}
                  className="btn-ghost text-sm"
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

        {/* Loading */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="text-earth/40">खोज रहे हैं / Searching...</div>
          </div>
        )}
      </div>
    </div>
  );
}
