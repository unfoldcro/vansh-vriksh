# 🌳 VANSH VRIKSH — वंश वृक्ष
# Master Build Document — Claude Code Max
## Hindu Family Tree | Free Seva Portal | Vansh-Vriksh.unfoldcro.in

---

## PROJECT IDENTITY

```
Name:       Vansh Vriksh (वंश वृक्ष)
Type:       Free Seva — 100% free, no ads, no premium, no data selling
Focus:      Hindu families (Sanatan Dharma)
Region:     Madhya Pradesh + All India
Languages:  Hindi + English (bilingual, switchable)
Stack:      Next.js 14 + TypeScript + Tailwind + Firebase
Hosting:    Vercel (free tier)
Domain:     Vansh-Vriksh.unfoldcro.in (free subdomain)
Dev Tool:   Claude Code Max (solo, no agency)
Cost:       ₹0/year (completely free)
```

---

## BUILD TODOS

### SPRINT 0: Landing Page + Search Existing Tree
**Estimated: Days 1–2 (Build FIRST — this is the front door)**

- [ ] **TODO-0.1:** Build landing page — full seva experience
  ```
  claude "Build the landing page at /app/page.tsx for Vansh-Vriksh.unfoldcro.in.
  Mobile-first, bilingual (Hindi primary, English secondary), warm gold/earth theme.
  
  SECTION 1 — HERO (above the fold):
  - Large tree icon (CSS animation, no images)
  - Title: '🌳 वंश वृक्ष' (large, decorative Devanagari font)
  - Subtitle: 'अपने पूर्वजों की विरासत को डिजिटल करें'
  - English: 'Digitize Your Ancestral Legacy'
  - Badge: '100% मुफ्त | कोई विज्ञापन नहीं | सेवा'
  - 2 CTA buttons:
    '🌳 मेरा वृक्ष खोजें / Find My Family Tree' → /search
    '✨ नया वृक्ष बनाएं / Create New Tree' → /verify
  - Language toggle top-right
  
  SECTION 2 — WHAT IS IT:
  - 'एक ऐसा मंच जहाँ आपका पूरा परिवार एक वृक्ष में जुड़ता है।
     दादा-दादी से लेकर परपोती तक — 7 पीढ़ियां, 38+ रिश्ते।
     WhatsApp पर लिंक भेजो, परिवार जुड़ता जाएगा।'
  - Animated tree growing with cards (CSS)
  
  SECTION 3 — 6 FEATURE CARDS (grid):
  Card 1: 👨‍👩‍👧‍👦 '38+ रिश्ते' — 'दादा-दादी, बुआ-फूफा, साला-साली, देवरानी-जेठानी — सब शामिल'
  Card 2: 🙏 'गोत्र + कुलदेवी' — 'आपकी पूरी हिंदू पहचान — गोत्र, कुलदेवी, जाति, नक्षत्र, राशि'
  Card 3: 💑 'विवाह से परिवार जुड़ें' — 'बेटी की शादी हुई? दोनों परिवार के वृक्ष जुड़ जाते हैं'
  Card 4: 🕊 'श्राद्ध सहायक' — 'पिता, दादा, परदादा — 3 पीढ़ी एक क्लिक में'
  Card 5: 🔒 'गोपनीयता' — 'आपका डेटा सिर्फ आपका। गोत्र के अनुसार दिखता है'
  Card 6: 👴 'बुज़ुर्गों के लिए' — 'बच्चे दादा-दादी का डेटा जोड़ सकते हैं'
  
  SECTION 4 — LIVE EXAMPLE (interactive mini tree):
  Render Patil family demo tree:
  Gen 1: 🕊 Ramji Patil (दादा) — 🕊 Savitri Patil (दादी)
  Gen 2: Suresh (पिता) — Kamla née Joshi | Lata née Patil (बुआ)
  Gen 3: Rajesh — Sunita née Sharma | Mahesh — Meena née Verma
  Gen 4: Arjun | Ananya → विवाहित: देशमुख | Vikram | Rohit | Neha
  Cards tappable, color coded, née tags, 🕊 markers.
  Note: 'यह उदाहरण है। अपना वृक्ष बनाने के लिए ऊपर क्लिक करें।'
  
  SECTION 5 — HOW IT WORKS (3 steps):
  Step 1: '📱 सत्यापन — Phone/Email OTP (30 सेकंड)'
  Step 2: '👨‍👩‍👧‍👦 परिवार जोड़ें (5 मिनट प्रति सदस्य)'
  Step 3: '📤 WhatsApp पर भेजें — परिवार जुड़ता जाएगा'
  
  SECTION 6 — SEVA DECLARATION (emotional):
  Large: 'सेवा परमो धर्मः — Service is the highest duty'
  4 promises: '🚫 कोई विज्ञापन नहीं' | '🆓 सब कुछ मुफ्त' | '🔒 डेटा सिर्फ आपका' | '🙏 सभी के लिए'
  
  SECTION 7 — LIVE STATS:
  3 animated counters: 'XXX परिवार | XXX सदस्य | XXX गोत्र'
  Initially: '0 — आप पहले बनें!'
  
  SECTION 8 — BOTTOM CTA (repeat both buttons):
  Plus tagline: 'पहले देखो, फिर बनाओ — First check, then create'
  
  SECTION 9 — FOOTER:
  About | Privacy | Contact | Admin | Built with ❤️ as Seva
  
  TECHNICAL: SSR for SEO, Intersection Observer animations,
  under 500KB, Lighthouse 90+"
  ```

- [ ] **TODO-0.2:** Build search existing tree page — 4 methods
  ```
  claude "Build /app/search/page.tsx — 'Find My Family Tree' page.
  
  Heading: '🔍 अपना वंश वृक्ष खोजें / Find Your Family Tree'
  Subtext: 'शायद आपके परिवार का वृक्ष पहले से बना हो!'
  
  4 TABS (horizontally scrollable on mobile):
  
  TAB 1 — 'लिंक / Link or ID':
  - Input: 'URL या Tree ID डालें'
  - Placeholder: 'Vansh-Vriksh.unfoldcro.in/tree/PATIL-1985-7X3K or PATIL-1985-7X3K'
  - Parse: extract treeId from URL or use raw ID
  - Query: tree-metadata/{treeId}
  - Found → show TreePreviewCard
  - Not found → 'यह Tree ID मौजूद नहीं है। दूसरे तरीके से खोजें।'
  
  TAB 2 — 'नाम से / By Name':
  - Input: 'परिवार का उपनाम / Family Surname'
  - Query: tree-metadata WHERE familySurname CONTAINS input
  - Case-insensitive, normalize Hindi/English: Patil = Paatil = पाटिल
  - Show all matching trees as TreePreviewCards
  
  TAB 3 — 'गांव से / By Location':
  - Input 1: 'गांव / Village' (text)
  - Input 2: 'जिला / District' (searchable dropdown: all Indian districts)
  - Query: tree-metadata WHERE village AND district match
  
  TAB 4 — 'विस्तृत खोज / Advanced Search':
  - All filters:
    Surname (text), Gotra (dropdown 100+ gotras), Kul Devta/Devi (text),
    Village (text), District (dropdown), State (dropdown, default: MP)
  - Results sorted by match score:
    4/4 match → 'Best Match ✅' (green badge)
    3/4 match → 'Possible Match 🟡' (yellow)
    2/4 match → 'Similar Family 🔵' (blue)
  
  RESULTS — TreePreviewCard for each:
  Shows: surname, gotra, kulDevta, village, district, members, generations
  2 buttons: [👁 View Tree] [🤝 Join This Tree]
  Privacy: only tree-metadata shown, no personal member data
  
  PARTIAL MATCH:
  If exact not found but similar exists:
  'सटीक नहीं मिला, पर ये मिलते-जुलते परिवार मिले:'
  Show results with 'Possible Match' badge
  Each has: [Yes This Is My Family] → join flow
  
  NO RESULTS — Show 3 options:
  
  Option 1: '✨ नया वृक्ष बनाएं'
  'आपके परिवार का वृक्ष अभी तक नहीं बना है। आप पहले बनाएं! 🌱'
  Button → /verify
  
  Option 2: '🔍 दूसरे तरीके से खोजें'
  'शायद दूसरे नाम, गांव, या गोत्र से खोजें'
  Button → clear form, switch to Advanced tab
  
  Option 3: '📲 परिवार से पूछें'
  Ready-made WhatsApp message:
  'क्या हमारे परिवार का वंश वृक्ष Vansh-Vriksh.unfoldcro.in पर बना है?
   अगर हां तो लिंक भेजो। अगर नहीं तो मैं बनाता/बनाती हूं!'
  Buttons: [Copy Message] [Share on WhatsApp]"
  ```

- [ ] **TODO-0.3:** Build TreePreviewCard component
  ```
  claude "Build /components/TreePreviewCard.tsx — reusable card:
  Props: treeId, familySurname, gotra, kulDevta, village, district, state,
         totalMembers, generations, ownerFirstName, matchScore (optional)
  
  Layout:
  ┌────────────────────────────────────┐
  │ 🌳 Patil Family — पाटिल परिवार     │
  │ गोत्र: Kashyap (काश्यप)             │
  │ कुलदेवी: माँ शारदा                   │
  │ गांव: Doraha, Sehore, MP           │
  │ 👥 16 Members | 📊 4 Generations  │
  │ Created by: Rajesh P.              │
  │ [👁 View Tree] [🤝 Join This Tree]│
  └────────────────────────────────────┘
  
  Match score badge (if provided):
  90-100%: 'Best Match ✅' (green)
  60-89%: 'Possible Match 🟡' (yellow)
  Below 60%: 'Similar Family 🔵' (blue)
  
  Used in: search results, duplicate detection modals,
  gotra discovery, merge review screens."
  ```

---

### SPRINT 1: Foundation + Auth + i18n
**Estimated: Days 3–5**

- [ ] **TODO-1.1:** Init Next.js 14 project with TypeScript + Tailwind CSS
  ```
  claude "Create Next.js 14 project with TypeScript, Tailwind CSS, and Firebase SDK.
  Project structure:
  /app (pages), /components, /lib (firebase, auth, db helpers),
  /i18n (translations), /types (TypeScript interfaces), /hooks (custom hooks).
  Tailwind config: warm gold (#C9A84C), earth brown (#1A1207), 
  accent green (#2D5A1E), seva orange (#D4740E).
  Include Noto Sans Devanagari from Google Fonts."
  ```

- [ ] **TODO-1.2:** Build complete i18n system with 38+ relations
  ```
  claude "Build i18n system with /i18n/en.json and /i18n/hi.json.
  Include ALL these relation labels in both languages:
  
  PATERNAL: father(पिता), mother(माता), dada(दादा), dadi(दादी), 
  pardada(परदादा), pardadi(परदादी), tau(ताऊ), tai(ताई), chacha(चाचा),
  chachi(चाची), bua(बुआ), fufa(फूफा), paternal_cousin(चचेरा भाई/बहन)
  
  MATERNAL: nana(नाना), nani(नानी), mama(मामा), mami(मामी), 
  mausi(मौसी), mausa(मौसा), maternal_cousin(ममेरा भाई/बहन)
  
  SELF: self(स्वयं), wife(पत्नी), husband(पति), elder_brother(बड़ा भाई),
  younger_brother(छोटा भाई), elder_sister(दीदी), younger_sister(छोटी बहन),
  step_brother(सौतेला भाई), step_sister(सौतेली बहन)
  
  IN-LAWS: sasur(ससुर), saas(सास), sala(साला), sali(साली),
  jija(जीजा/बहनोई), bhabhi(भाभी), jeth(जेठ), devar(देवर),
  nanad(ननद), nandoi(नंदोई), jethani(जेठानी), devrani(देवरानी),
  samdhi(समधी), samdhan(समधन)
  
  CHILDREN: son(पुत्र), daughter(पुत्री), adopted_son(दत्तक पुत्र),
  adopted_daughter(दत्तक पुत्री), step_son(सौतेला पुत्र),
  step_daughter(सौतेली पुत्री), son_in_law(दामाद), daughter_in_law(बहू),
  bhatija(भतीजा), bhatiji(भतीजी), bhanja(भांजा), bhanji(भांजी),
  pota(पोता), poti(पोती), nati(नाती), natin(नातिन),
  parpota(परपोता), parpoti(परपोती)
  
  Also include ALL UI labels: buttons, headers, form fields, error messages,
  toasts, marriage status labels, DOB type labels, shraddh labels.
  
  Build a LanguageToggle component that switches entire UI.
  Store preference in localStorage. Default: Hindi."
  ```

- [ ] **TODO-1.3:** Firebase setup + Phone/Email OTP auth
  ```
  claude "Set up Firebase config in /lib/firebase.ts.
  Build /app/verify page with dual auth:
  - User chooses: Phone OTP or Email OTP (2 tabs)
  - Phone: enter number → Firebase sendSignInLinkToEmail or signInWithPhoneNumber → verify OTP
  - Email: enter email → Firebase sendSignInLinkToEmail → verify link/OTP
  - After verify: check Firestore users/ collection
    - If phone/email exists → redirect to dashboard (returning user)
    - If not exists → redirect to /profile (new user)
  - Show duplicate message in Hindi + English if account exists
  - Support shared phones: session-based auth, not device-locked
  All error messages bilingual."
  ```

- [ ] **TODO-1.4:** PWA manifest + service worker
  ```
  claude "Configure next-pwa:
  - manifest.json: name='Vansh Vriksh', short_name='वंश वृक्ष',
    theme_color='#C9A84C', background_color='#1A1207'
  - Service worker: cache all static assets + i18n JSONs
  - Offline fallback page showing cached tree data
  - 'Add to Home Screen' prompt after 2nd visit"
  ```

---

### SPRINT 2: Hindu Profile + Tree Creation + Duplicate Detection
**Estimated: Days 6–8**

- [ ] **TODO-2.1:** Build Hindu identity profile form
  ```
  claude "Build /app/profile page with complete Hindu family profile:
  
  IDENTITY SECTION:
  - fullName (text) + fullNameHi (auto-transliterate)
  - alsoKnownAs (text, optional)
  - dob with 5 input types:
    - Exact date (date picker)
    - Year only (number input: 1942)
    - Approximate decade (dropdown: 1920s, 1930s, 1940s, 1950s...)
    - Relative marker (dropdown: 'Before Independence 1947', 'During Emergency 1975')
    - Unknown (checkbox: 'DOB not known')
  - gotra (searchable dropdown with 100+ gotras)
  - kulDevta (text + autocomplete with common deities)
  - kulDevi (text + autocomplete)
  - jati (text, optional, with note: 'This is private, only your family sees it')
  - nakshatra (dropdown: 27 nakshatras)
  - rashi (dropdown: 12 rashis)
  - varna (dropdown: Brahmin/Kshatriya/Vaishya/Shudra, optional)
  - shakha (text, optional — for Brahmin families)
  - pravar (text, optional)
  
  LOCATION SECTION:
  - village (text + autocomplete)
  - tehsil (text)
  - district (searchable dropdown: all Indian districts)
  - state (dropdown: all Indian states, default: Madhya Pradesh)
  - currentCity (text, optional)
  - currentState (dropdown, optional)
  - migrationNote (text, optional: 'Moved to Indore in 1998')
  
  RITUAL SECTION (collapsible, optional):
  - teerthSthal (dropdown + text: Ujjain, Omkareshwar, Haridwar, Varanasi, Other)
  - familyPriest (text)
  
  All text fields: Roman-to-Devanagari transliteration.
  Use Google Input Tools API or built-in transliteration library.
  Form validates: gotra required, village required, district required."
  ```

- [ ] **TODO-2.2:** Duplicate tree detection during sign-up
  ```
  claude "After profile form submission, BEFORE creating tree:
  
  1. Query Firestore tree-metadata collection:
     WHERE familySurname LIKE profile.surname
     AND gotra == profile.gotra
     AND district == profile.district
  
  2. Also fuzzy match: Patil/Paatil/पाटिल (normalize spellings)
  
  3. Also check kulDevta match as secondary signal
  
  4. If match found: show modal with bilingual message:
     '{ownerName} ने पहले से {surname} परिवार ({gotra} गोत्र, {district}) 
     का वंश वृक्ष बनाया है। क्या यह आपका परिवार है?'
     
     3 buttons:
     - 'हाँ, यह मेरा परिवार है' → redirect to join flow for that tree
     - 'नहीं, अलग परिवार है' → create new tree
     - 'पता नहीं / बाद में देखेंगे' → create new tree + flag for ongoing alert
  
  5. If no match: create new tree directly"
  ```

- [ ] **TODO-2.3:** Tree creation + ID generation
  ```
  claude "When creating new tree:
  1. Generate unique treeId: SURNAME-BIRTHYEAR-4RANDOMCHARS
     Example: PATIL-1985-7X3K (uppercase, alphanumeric)
     Ensure uniqueness: check Firestore before assigning
  
  2. Create documents:
     - tree-metadata/{treeId}: ownerUid, familySurname, gotra, kulDevta,
       kulDevi, village, tehsil, district, state, totalMembers:1,
       generations:1, createdAt, isPublicToSameGotra:true
     
     - gotra-index/{gotra}/{treeId}: treeId, familySurname, village,
       district, kulDevta, generations:1, memberCount:1
     
     - users/{uid}: all profile fields + treeId + role:'owner'
     
     - users/{uid}/members/{selfId}: self member document
     
     - users/{uid}/settings/: language, treeLayout:'generation',
       ultraLightMode:false, shareEnabled:true
  
  3. Redirect to dashboard"
  ```

- [ ] **TODO-2.4:** Ongoing duplicate alert system
  ```
  claude "Build a background check that runs when any NEW tree is created:
  1. Compare new tree against all existing trees in same gotra + district
  2. If potential match found, store alert in:
     duplicate-alerts/{alertId}: newTreeId, existingTreeId, matchScore,
     matchFields (surname, gotra, district, kulDevta), status:'pending', createdAt
  3. Show alert banner on dashboard of BOTH tree owners:
     'एक और {surname} परिवार वृक्ष ({gotra} गोत्र, {district}) मिला है'
  4. Dismiss or act on the alert"
  ```

---

### SPRINT 3: Member CRUD + Marriage + Surname + Roles
**Estimated: Days 9–13**

- [ ] **TODO-3.1:** Add Member form with 38+ relations
  ```
  claude "Build /components/AddMemberForm.tsx:
  
  STEP 1 — RELATION SELECTOR:
  Grouped dropdown with sections:
  - पितृपक्ष (Paternal): father, mother, dada, dadi, pardada, pardadi,
    tau, tai, chacha, chachi, bua, fufa, paternal_cousin
  - मातृपक्ष (Maternal): nana, nani, mama, mami, mausi, mausa, maternal_cousin
  - स्वयं (Self): wife, husband, elder_brother, younger_brother,
    elder_sister, younger_sister, step_brother, step_sister
  - ससुराल (In-Laws): sasur, saas, sala, sali, jija, bhabhi,
    jeth, devar, nanad, nandoi, jethani, devrani, samdhi, samdhan
  - संतान (Children): son, daughter, adopted_son, adopted_daughter,
    step_son, step_daughter, son_in_law, daughter_in_law,
    bhatija, bhatiji, bhanja, bhanji, pota, poti, nati, natin, parpota, parpoti
  
  Each relation has:
  - relationType tag: 'blood' | 'marriage' | 'adopted' | 'step' | 'dharma'
  - generationLevel: -3 to +3 (pardada=-3, dada=-2, parent=-1, self=0, child=+1, pota=+2, parpota=+3)
  
  STEP 2 — MEMBER DETAILS:
  - name (text, required)
  - nameHi (auto-transliterated from name)
  - alsoKnownAs (text, optional)
  - gender: male/female/other (required)
  - dob: 5 input types (same as profile)
  - alive: living/deceased (required)
  - IF deceased:
    - deathYear (number)
    - deathTithi (text, optional: 'Bhadrapada Krishna Amavasya')
    - teerthSthal (dropdown: Ujjain/Omkareshwar/Haridwar/Varanasi/Other)
  - occupation (text, optional)
  - notes (textarea, optional)
  - oralHistory (textarea, optional: 'Record stories, memories')
  
  STEP 3 — MARRIAGE FORM (auto-appears for spouse relations):
  Only shows when relation is: wife, husband, son_in_law, daughter_in_law,
  or when user taps 'Record Marriage' on an existing member.
  See TODO-3.2 for marriage form details.
  
  Save to Firestore: users/{uid}/members/{auto-id}
  Include: addedBy: currentUser.uid
  Include: status: 'active'
  Update tree-metadata: totalMembers++, recalculate generations"
  ```

- [ ] **TODO-3.2:** Marriage form + surname system + visibility
  ```
  claude "Build /components/MarriageForm.tsx:
  
  This form appears as Step 3 inside AddMemberForm when adding a spouse,
  or as a standalone modal when tapping 'Record Marriage' on existing member.
  
  FIELDS:
  - spouseName (text, required)
  - spouseFatherName (text, required)
  - spouseGotra (searchable dropdown, required)
  - spouseKulDevta (text, optional)
  - spouseKulDevi (text, optional)
  - spouseJati (text, optional)
  - spouseVillage (text, required)
  - spouseDistrict (searchable dropdown)
  - marriageDate (date or year, optional)
  - marriageStatus: 'active' | 'divorced' | 'widowed' | 'separated' | 'annulled'
  - endDate (shown only if status != active)
  
  SURNAME SECTION:
  - maidenName: auto-filled from member's current surname (READONLY, cannot be deleted ever)
  - maidenFullName: auto-generated (READONLY)
  - displayPreference: radio buttons:
    - 'Keep Maiden Name / मायके का नाम रखें' (e.g., Ananya Patil)
    - 'Husband Surname / पति का उपनाम' (e.g., Ananya Deshmukh)
    - 'Both Names / दोनों नाम' (e.g., Ananya Patil Deshmukh)
    - 'Hyphenated / संयुक्त' (e.g., Ananya Patil-Deshmukh)
  - displayName: auto-generated preview showing result
  - surnameSetBy: auto-set to current user's uid
  
  VISIBILITY SECTION:
  - visibility: radio buttons:
    - 'Visible to All / सभी को दिखे' (default)
    - 'Branch Only / केवल शाखा को' (spouse, children, parents)
    - 'Hidden / छुपा हुआ' (only person + tree owner)
  - Warning text for Hidden: 'Children will always be visible. Only the marriage link is hidden.'
  
  CROSS-TREE LINK (optional):
  - linkedTreeId: text input
  - 'Search' button: search by spouse surname + gotra in tree-metadata
  - If found: show match and offer to send connection request
  
  MULTIPLE MARRIAGES:
  - A person can have multiple marriage records
  - Each stored as separate doc: users/{uid}/members/{memberId}/marriages/{marriageId}
  - Children linked to specific marriage via: childrenFromThisMarriage[] array
  
  Save marriage document with all fields.
  If linkedTreeId provided: create connection request in connections/ collection."
  ```

- [ ] **TODO-3.3:** Role-based permission system
  ```
  claude "Implement role-based access control:
  
  ROLES stored in: users/{uid}/members-access/{memberUid}
  - role: 'owner' | 'branch_editor' | 'viewer'
  - approvedAt: timestamp
  - approvedBy: uid
  
  PERMISSION RULES:
  Tree Owner (role='owner'):
  - Can add ANY relation type
  - Can edit ANY member
  - Can delete ANY member (soft delete)
  - Can approve/reject join requests
  - Can approve/reject merge requests
  - Can hide ANY marriage
  - Can view recycle bin (all items)
  - Can recover any deleted item
  
  Branch Editor (role='branch_editor'):
  - Can ONLY add: wife/husband, son, daughter, adopted_son, adopted_daughter
    (i.e., their spouse and children only)
  - Can ONLY edit: themselves + members where addedBy == their uid
  - Can ONLY delete: members where addedBy == their uid (soft delete)
  - Can hide ONLY their own marriages
  - Can view recycle bin (only their items)
  - Can recover only items they deleted
  - Person themselves can ALWAYS override their own surname preference
  
  Viewer (no role / link visitor):
  - Read-only access to tree
  - Can request to join
  - Cannot add/edit/delete anything
  
  ENFORCEMENT:
  - Firestore security rules: match /users/{uid}/members/{memberId}
    allow write: if isOwner() || (isBranchEditor() && resource.data.addedBy == request.auth.uid)
  - UI: grey out / hide buttons based on role
  - API: validate on server before write"
  ```

- [ ] **TODO-3.4:** Soft delete system + recycle bin
  ```
  claude "Implement soft delete for ALL delete operations:
  
  When user taps delete on any member/marriage/tree:
  1. Show confirmation modal: 'क्या आप पक्के हैं? 30 दिन तक रिकवर कर सकते हैं।'
  2. On confirm: DO NOT delete from Firestore
  3. Instead, update the document:
     status: 'deleted'
     deletedAt: serverTimestamp()
     deletedBy: currentUser.uid
     recoverableUntil: serverTimestamp() + 30 days
  4. Document becomes invisible in tree view and list view
     (query: WHERE status == 'active')
  
  RECYCLE BIN PAGE (/app/settings/recycle-bin):
  - Query: all documents where status == 'deleted' AND recoverableUntil > now
  - Show each item with:
    - Name and type (member/marriage/tree)
    - Who deleted + when
    - Countdown: 'X days left to recover'
    - [Recover] button → sets status back to 'active', clears delete fields
    - [Delete Permanently] button (owner only) → actually removes from Firestore
  
  MERGE UNDO:
  - When trees merge, save full snapshot of abandoned tree:
    recycle-bin/{treeId}/merge-snapshot: { full tree data as JSON }
  - Show in recycle bin with [Undo Merge] button
  - Undo: restore tree from snapshot, move transferred members back
  
  CRON JOB (Vercel cron or Firebase Cloud Function):
  - Runs daily at 00:00 UTC
  - Query: WHERE status == 'deleted' AND recoverableUntil < now
  - Actually delete those documents from Firestore
  - Log action count"
  ```

- [ ] **TODO-3.5:** List view with search + role-based edit/delete
  ```
  claude "Build /app/tree/list page:
  
  - Show all members as cards (query WHERE status == 'active')
  - Each card shows: name, nameHi, relation label, DOB, gender icon,
    deceased marker (🕊), adopted badge (दत्तक), step badge (सौतेला),
    née tag for married members
  - Search bar: search by name, maiden name, relation, gotra
  - Filters: generation dropdown, household, living/deceased
  - Sort: by name, by generation, by date added
  
  ACTIONS per card (based on role):
  - Owner sees: [✏️ Edit] [🗑️ Delete] on ALL cards
  - Branch Editor sees: [✏️ Edit] [🗑️ Delete] ONLY on cards where addedBy == their uid
  - Viewer sees: no action buttons
  
  Edit flow: tap edit → navigate to /app/member/edit/{memberId} → pre-filled form → save
  Delete flow: tap delete → confirmation modal → soft delete → toast: 'Deleted. Recover within 30 days from Recycle Bin'"
  ```

---

### SPRINT 4: Tree Visualization + Shraddh + Households
**Estimated: Days 14–17**

- [ ] **TODO-4.1:** Visual family tree component
  ```
  claude "Build /components/FamilyTree.tsx:
  
  LAYOUT: Vertical, generation-by-generation, centered:
  
  Gen -3: परदादा-परदादी (Great-grandparents)
  Gen -2: दादा-दादी / नाना-नानी (Grandparents)
  Gen -1: माता-पिता + ताऊ/चाचा + बुआ + मामा + मौसी (Parents + Uncles/Aunts)
  Gen  0: स्वयं + भाई-बहन + पत्नी/पति + जीजा + भाभी (Self + Siblings + Spouses)
  Gen +1: पुत्र/पुत्री + भतीजा + भांजा + दामाद/बहू (Children)
  Gen +2: पोता-पोती / नाती-नातिन (Grandchildren)
  Gen +3: परपोता-परपोती (Great-grandchildren)
  
  GROUP members by generationLevel from member's relation config.
  
  MEMBER CARDS:
  - Background: Blue (#E8F0FE) for male, Pink (#FDE8F0) for female, Green (#E8F0E8) for other
  - Deceased: grey/muted card + 🕊 icon
  - Adopted: small 'दत्तक' badge top-right
  - Step: small 'सौतेला' badge top-right
  - Married women: show 'née Patil' or 'née पाटिल' tag below name
  - Tap card → expand to show full details
  
  CONNECTIONS:
  - Vertical lines between parent → child
  - Horizontal lines between siblings
  - Dotted marriage lines between spouses
  - Multiple wives: parallel horizontal connections to same person
  - Cross-tree marriage bridge: dotted line going off-screen with small tag:
    'विवाहित: देशमुख परिवार, उज्जैन' (natal tree)
    'मायका: पाटिल परिवार, सीहोर' (marital tree)
  
  GENERATION LABELS:
  Each row has a label pill: 'दादा-दादी', 'माता-पिता', 'स्वयं', etc.
  
  HIDDEN MARRIAGES:
  - If visibility='hidden': only person + owner see the spouse card
  - Others see children listed as 'from previous relationship'
  
  RESPONSIVE:
  - Mobile: horizontal scroll, pinch-to-zoom (CSS transform: scale)
  - Desktop: auto-fit, scroll if tree is large
  - Touch targets: minimum 44px for all tap areas"
  ```

- [ ] **TODO-4.2:** Ultra-light mode for 2G
  ```
  claude "Build ultra-light tree view:
  Toggle in settings: 'Ultra-Light Mode / हल्का मोड'
  When enabled:
  - No card backgrounds, no shadows, no animations
  - Text-only tree: indented list format
  - No images, no icons (use text symbols: ♂ ♀ 🕊)
  - Total page size under 200KB
  - Works on 2G network
  - CSS: prefers-reduced-motion: reduce
  
  Example render:
  ├── 🕊 Ramji Patil (दादा, ~1947)
  │   ├── Suresh Patil (पिता, 1955)
  │   │   ├── 👤 Rajesh Patil (स्वयं) ── Sunita née Sharma (पत्नी)
  │   │   │   ├── Arjun (पुत्र, 2010)
  │   │   │   ├── Ananya (पुत्री, 2012) → विवाहित: देशमुख
  │   │   │   └── Vikram (पुत्र, 2015)
  │   │   └── Mahesh Patil (भाई) ── Meena née Verma (पत्नी)
  │   └── Lata Gupta née Patil (बुआ)"
  ```

- [ ] **TODO-4.3:** Shraddh helper view
  ```
  claude "Build /components/ShraddhView.tsx:
  
  Toggle button on dashboard: '🙏 Shraddh View / श्राद्ध दृश्य'
  
  When activated:
  1. Find the current user's member record
  2. Trace paternal line UP: father → grandfather → great-grandfather
  3. Highlight these 3 members in the tree with golden border
  4. Show info card for each:
     - Name (Hindi + English)
     - Birth year (approximate okay)
     - Death year + cause if known
     - Death Tithi (Hindu calendar date)
     - Teerth Sthal (where last rites were performed)
     - Shraddh date reminder
  
  5. If 7 paternal + 5 maternal generations available:
     Show full sapindi chart (advanced view)
  
  6. Show message if data is missing:
     'परदादा की जानकारी उपलब्ध नहीं है। बुज़ुर्गों से पूछकर जोड़ें।'
     'Great-grandfather info not available. Ask elders and add.'"
  ```

- [ ] **TODO-4.4:** Household grouping
  ```
  claude "Build household system:
  
  - New collection: users/{uid}/households/{householdId}
    Fields: name ('Patil House, Indore'), address, headOfHousehold (memberId),
    memberIds[] (array of member IDs)
  
  - In AddMemberForm: optional 'Household / घर' dropdown
    showing existing households + 'Create New Household'
  
  - Tree view toggle: [Generation View] [Household View]
    Household View groups members by which house they live in
    
  - Household head marked with 🏠 icon"
  ```

---

### SPRINT 5: Share + Join + Cross-Tree + Gotra Discovery + Merge
**Estimated: Days 18–21**

- [ ] **TODO-5.1:** WhatsApp share + read-only public tree view
  ```
  claude "Build share system:
  
  1. Share button on dashboard → generates WhatsApp message:
     '🌳 {familySurname} परिवार का वंश वृक्ष देखें!\n
      {familySurname} Family Tree\n
      Vansh-Vriksh.unfoldcro.in/tree/{treeId}'
  
  2. Build /app/tree/[treeId]/page.tsx (public route):
     - No auth required
     - Shows full tree in read-only mode
     - Bottom bar: [Just Browsing] [Join This Tree]
     - SEO: Open Graph tags for WhatsApp preview:
       og:title = '{surname} Family Tree | वंश वृक्ष'
       og:description = '{gotra} Gotra, {village}, {district}'
  
  3. Print-friendly: /app/tree/[treeId]/print
     - Clean CSS, no navigation, page-break-friendly"
  ```

- [ ] **TODO-5.2:** Join tree flow + approval system
  ```
  claude "Build join flow:
  
  1. User taps 'Join This Tree' on public tree view
  2. Redirect to /app/join/[treeId]:
     - Verify via Phone or Email OTP
     - DUPLICATE CHECK (Layer 3): is this phone/email already a member?
       If yes → 'You are already part of this tree. Login.'
     - If new: show form:
       - Your name
       - Your relation to tree owner (dropdown: filtered to relevant relations)
     - Submit → creates join-request document:
       join-requests/{autoId}: treeId, requesterUid, requesterName,
       claimedRelation, status:'pending', requestedAt
  
  3. Tree owner notification:
     - Show badge on dashboard: '🔔 1 pending join request'
     - Notification page: shows requester name + claimed relation
     - [Approve ✅] → set role='branch_editor' in members-access
     - [Reject ❌] → set status='rejected' on join request
  
  4. On approval:
     - Requester's self-member linked to existing unverified member (if exists)
     - Or new member created with role='branch_editor'
     - Requester sees dashboard with tree"
  ```

- [ ] **TODO-5.3:** Cross-tree marriage connection
  ```
  claude "Build cross-tree connection system:
  
  1. When marriage form has linkedTreeId filled:
     - Create: connections/{autoId}:
       fromTreeId, toTreeId, fromMemberId, toMemberId,
       relationType:'marriage', status:'pending', requestedAt
  
  2. Other tree owner gets notification: 
     '{fromSurname} परिवार ने विवाह कनेक्शन का अनुरोध किया है'
  
  3. On approval:
     - status → 'approved'
     - Both trees show marriage bridge on the relevant member
     - Surname data syncs: née tag appears in both trees
  
  4. Auto-suggest future connections:
     - When a NEW tree is created, check all pending marriage details
       across all trees where spouseName + spouseGotra + spouseVillage
       match the new tree's owner
     - Show suggestion: 'Are you Vikram Deshmukh? Patil family has
       requested a marriage connection.'"
  ```

- [ ] **TODO-5.4:** Gotra-based discovery
  ```
  claude "Build /app/discover page:
  
  - Search form: Gotra (dropdown) + District (dropdown) + Village (optional)
  - Query gotra-index/{gotra} collection
  - PRIVACY: only show results if searcher's gotra matches queried gotra
  - Results show: familySurname, village, district, kulDevta, generations, memberCount
  - NO personal data: no names, no DOBs, no phone numbers
  - Each result has [Send Connection Request] button
  - Request goes to that tree's owner for approval"
  ```

- [ ] **TODO-5.5:** Tree merge + abandon system
  ```
  claude "Build tree merge system:
  
  ABANDON FLOW (simple):
  1. User discovers existing family tree (via link, search, or alert)
  2. Taps 'Join This Tree Instead'
  3. System: 'You have an existing tree. Transfer your unique members?'
  4. On confirm:
     - Query user's tree members
     - For each: check if name+DOB match exists in target tree
     - Matching members: skip (already there)
     - Unique members: copy to target tree with addedBy=user's uid
     - Save full snapshot of old tree to recycle bin (30-day recovery)
     - Delete old tree (soft delete)
     - Set user's role to 'branch_editor' in target tree
  
  MERGE FLOW (detailed):
  1. User taps 'Request to Merge Trees'
  2. Target tree owner gets merge request with side-by-side comparison:
     - YELLOW: duplicate members (matched by name + approximate DOB)
     - GREEN: unique members from requesting tree
  3. Owner reviews + approves
  4. On approve:
     - Duplicates: keep version with more data (more fields filled)
     - Unique members: transfer to target tree
     - Marriage records: transfer
     - Households: transfer
     - Save full snapshot of merged tree in recycle bin
     - Soft delete merged tree
  5. [Undo Merge] available for 30 days in recycle bin"
  ```

---

### SPRINT 6: Privacy Rules + Admin Panel + Elder Features
**Estimated: Days 22–24**

- [ ] **TODO-6.1:** Firestore security rules
  ```
  claude "Write comprehensive Firestore security rules:
  
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      
      // Users can read/write their own profile
      match /users/{uid} {
        allow read, write: if request.auth.uid == uid;
      }
      
      // Members: owner can do everything, branch editor own branch only
      match /users/{uid}/members/{memberId} {
        allow read: if isTreeMember(uid);
        allow create: if isOwner(uid) || (isBranchEditor(uid) && isAllowedRelation());
        allow update: if isOwner(uid) || (isBranchEditor(uid) && resource.data.addedBy == request.auth.uid);
        allow delete: if isOwner(uid) || (isBranchEditor(uid) && resource.data.addedBy == request.auth.uid);
      }
      
      // Marriages: same as members + person can always update own surname
      match /users/{uid}/members/{memberId}/marriages/{marriageId} {
        allow read: if isTreeMember(uid) && checkMarriageVisibility();
        allow write: if isOwner(uid) || isOwnMarriage();
      }
      
      // Gotra index: readable by same gotra only
      match /gotra-index/{gotra}/{treeId} {
        allow read: if getUserGotra() == gotra;
        allow write: if false; // only written by cloud functions
      }
      
      // Public tree view: readable by anyone (for WhatsApp links)
      match /tree-metadata/{treeId} {
        allow read: if true;
        allow write: if isTreeOwner(treeId);
      }
      
      // Join requests: requester can create, owner can update
      match /join-requests/{requestId} {
        allow create: if request.auth != null;
        allow read, update: if isTargetTreeOwner();
      }
      
      // Connections: both tree owners can read/update
      match /connections/{connectionId} {
        allow read: if isEitherTreeOwner();
        allow create: if request.auth != null;
        allow update: if isTargetTreeOwner();
      }
      
      // Recycle bin: owner + admin
      match /recycle-bin/{treeId}/{itemId} {
        allow read: if isTreeOwner(treeId) || isAdmin();
        allow write: if isTreeOwner(treeId) || isAdmin();
      }
      
      // Admin actions: admin only
      match /admin-actions/{actionId} {
        allow read, write: if isAdmin();
      }
    }
  }
  
  Write helper functions: isOwner(), isBranchEditor(), isTreeMember(),
  isAdmin(), getUserGotra(), checkMarriageVisibility(), isAllowedRelation()"
  ```

- [ ] **TODO-6.2:** Admin panel
  ```
  claude "Build /app/admin page (separate auth):
  
  ADMIN AUTH:
  - Separate Firebase auth for admin (email + password, not OTP)
  - Admin UIDs hardcoded in environment variable
  - Middleware: check if user.uid is in ADMIN_UIDS
  
  ADMIN DASHBOARD:
  - Stats: total trees, total members, total connections
  - Support Requests: list of user messages
  - Global Recycle Bin: all deleted items across all trees (metadata only)
  - Merge History: all merges with undo option
  
  ADMIN ACTIONS (each creates audit log in admin-actions/):
  - Recover Deleted Tree: find by treeId → restore
  - Undo Merge: find merge snapshot → restore
  - Transfer Ownership: change owner uid on tree-metadata
  - Restore Branch: recover branch editor + their members
  - Link New Credentials: update auth record
  - Permanent Delete: immediately remove (for privacy requests)
  - Lock Tree: set tree status to 'locked' (for abuse cases)
  
  PRIVACY: admin sees treeId, memberCount, timestamps, action types
  Admin CANNOT see: names, DOBs, phone numbers, gotra, personal data"
  ```

- [ ] **TODO-6.3:** Roman-to-Devanagari transliteration
  ```
  claude "Add transliteration to all text input fields:
  
  Options (pick best):
  - Google Input Tools API (free, reliable)
  - OR built-in library: 'sanscript' npm package
  - OR custom mapping for common names
  
  Behavior:
  - User types 'Rajesh' in name field
  - Below the field, show suggestion: 'राजेश'
  - User can accept (tap suggestion) or keep English
  - nameHi field auto-populated
  - Works on all text fields: name, village, notes, etc."
  ```

- [ ] **TODO-6.4:** Daily cron job for permanent deletion
  ```
  claude "Create a Vercel cron job OR Firebase Cloud Function:
  
  Schedule: daily at 00:00 UTC
  
  Logic:
  1. Query all collections for: status=='deleted' AND recoverableUntil < now
  2. For each document: actually delete from Firestore
  3. Also delete merge snapshots past 30 days
  4. Log: 'Permanently deleted {count} items from {treeCount} trees'
  5. No user notification (30 days already passed)
  
  Vercel cron: vercel.json → { crons: [{ path: '/api/cron/cleanup', schedule: '0 0 * * *' }] }
  OR Firebase: exports.dailyCleanup = functions.pubsub.schedule('0 0 * * *')"
  ```

---

### SPRINT 7: Deploy + SEO + Test + Launch
**Estimated: Days 25–27**

- [ ] **TODO-7.1:** Vercel deployment + custom domain
  ```
  claude "Deploy to Vercel:
  1. Connect GitHub repo to Vercel
  2. Set environment variables:
     NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
     NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_SDK (for cloud functions)
     ADMIN_UIDS (comma-separated admin UIDs)
  3. Configure custom domain: Vansh-Vriksh.unfoldcro.in
  4. SSL auto-configured by Vercel
  5. GitHub Actions: auto-deploy on push to main branch"
  ```

- [ ] **TODO-7.2:** SEO + Open Graph
  ```
  claude "Add SEO to all pages:
  
  Homepage:
  - title: 'Vansh Vriksh | वंश वृक्ष | Free Hindu Family Tree'
  - description: 'Build your family tree for free. 38+ Indian relations,
    Hindi-English bilingual, gotra-based connections. सेवा — 100% free.'
  - keywords: वंश वृक्ष, परिवार वृक्ष, family tree Hindi, gotra, कुल वृक्ष, श्राद्ध
  
  Public tree page (/tree/[treeId]):
  - og:title: '{surname} Family Tree | वंश वृक्ष'
  - og:description: '{gotra} Gotra | {village}, {district} | {generations} Generations'
  - og:image: auto-generated tree preview image (or static branded image)
  
  All pages: proper Hindi + English meta tags, canonical URLs,
  structured data (Schema.org for Family/Person)"
  ```

- [ ] **TODO-7.3:** Cross-browser + device testing
  ```
  claude "Test checklist:
  
  BROWSERS:
  - [ ] Chrome Android (primary)
  - [ ] Samsung Internet (many MP users)
  - [ ] Firefox Android
  - [ ] Safari iOS
  - [ ] Chrome Desktop
  
  DEVICES:
  - [ ] Budget Android (₹3,000-5,000 phone)
  - [ ] Mid-range Android
  - [ ] iPhone
  - [ ] Tablet
  - [ ] Desktop
  
  NETWORKS:
  - [ ] 4G: normal mode, full features
  - [ ] 3G: acceptable speed, all features work
  - [ ] 2G: ultra-light mode, under 200KB, usable
  
  FEATURES TO TEST:
  - [ ] OTP: phone + email on all browsers
  - [ ] Hindi toggle: all labels switch correctly
  - [ ] Transliteration: Roman to Devanagari works
  - [ ] Add 50+ members: tree still renders smoothly
  - [ ] Join flow: WhatsApp link → join → approve
  - [ ] Cross-tree: marriage connection works both directions
  - [ ] Soft delete: member deleted → visible in recycle bin → recoverable
  - [ ] Merge: two trees merge correctly, duplicates removed
  - [ ] Undo merge: old tree restored from recycle bin
  - [ ] Shraddh view: highlights correct 3 generations
  - [ ] Print view: clean, readable, no navigation
  - [ ] PWA: installable, works offline after first load
  - [ ] Lighthouse: score 90+ on all metrics
  
  Fix all issues found."
  ```

- [ ] **TODO-7.4:** Launch checklist
  ```
  LAUNCH:
  - [ ] Domain Vansh-Vriksh.unfoldcro.in pointing to Vercel
  - [ ] SSL working (https)
  - [ ] Firebase security rules deployed
  - [ ] Admin panel working at /admin
  - [ ] Cron job running daily
  - [ ] PWA installable
  - [ ] Lighthouse 90+ on mobile
  - [ ] Beta tested with 10 families
  - [ ] Bug fixes from beta
  - [ ] WhatsApp share message finalized
  - [ ] Demo video recorded in Hindi
  - [ ] Public launch on WhatsApp groups
  ```

---

## DATABASE SCHEMA — COMPLETE

```
Firestore Collections:

users/{uid}
├── fullName, fullNameHi, alsoKnownAs
├── dob, dobType (exact/year/decade/marker/unknown), dobApproximate
├── phone, email, authMethod (phone/email)
├── gotra, kulDevta, kulDevi, jati, varna, nakshatra, rashi, shakha, pravar
├── village, tehsil, district, state, currentCity, currentState, migrationNote
├── teerthSthal, familyPriest
├── treeId, role (owner/branch_editor)
├── verified, createdAt, lang
│
├── /members/{memberId}
│   ├── name, nameHi, alsoKnownAs
│   ├── relation, relationGroup (paternal/maternal/self/inlaw/children)
│   ├── relationType (blood/marriage/adopted/step/dharma)
│   ├── generationLevel (-3 to +3)
│   ├── gender, alive, dob, dobType, dobApproximate
│   ├── deathYear, deathTithi, teerthSthal
│   ├── occupation, notes, oralHistory
│   ├── householdId
│   ├── addedBy, status (active/deleted), deletedAt, recoverableUntil
│   ├── createdAt, updatedAt
│   │
│   └── /marriages/{marriageId}
│       ├── spouseName, spouseFatherName, spouseGotra, spouseKulDevta, spouseKulDevi
│       ├── spouseJati, spouseVillage, spouseDistrict
│       ├── marriageDate, marriageStatus (active/divorced/widowed/separated/annulled), endDate
│       ├── maidenName, maidenFullName (NEVER deletable)
│       ├── marriedSurname, displayPreference (keep_maiden/husband/both/hyphenated)
│       ├── displayName, surnameSetBy, surnameHistory[]
│       ├── visibility (visible_all/branch_only/hidden)
│       ├── linkedTreeId, connectionStatus
│       ├── childrenFromThisMarriage[]
│       ├── status (active/deleted), deletedAt, recoverableUntil
│       └── createdAt, updatedAt
│
├── /households/{householdId}
│   ├── name, address, headOfHousehold, memberIds[]
│   └── createdAt
│
├── /members-access/{memberUid}
│   ├── role (owner/branch_editor)
│   └── approvedAt, approvedBy
│
└── /settings/
    └── language, treeLayout, ultraLightMode, shareEnabled

tree-metadata/{treeId}
├── treeId, ownerUid, familySurname, gotra, kulDevta, kulDevi
├── village, tehsil, district, state
├── totalMembers, generations
├── createdAt, isPublicToSameGotra
└── status (active/deleted/merged)

gotra-index/{gotra}/{treeId}
├── treeId, familySurname, village, district
├── kulDevta, generations, memberCount
└── (readable by same-gotra users ONLY)

connections/{connectionId}
├── fromTreeId, toTreeId, fromMemberId, toMemberId
├── relationType (marriage)
├── status (pending/approved/rejected)
└── requestedAt, approvedAt

join-requests/{requestId}
├── treeId, requesterUid, requesterName, claimedRelation
├── status (pending/approved/rejected)
└── requestedAt

duplicate-alerts/{alertId}
├── newTreeId, existingTreeId, matchScore, matchFields[]
├── status (pending/dismissed/merged)
└── createdAt

recycle-bin/{treeId}/items/{itemId}
├── itemType (member/marriage/tree/branch)
├── originalData (full JSON snapshot)
├── deletedAt, deletedBy, recoverableUntil
└── mergeSnapshot (if from merge)

admin-actions/{actionId}
├── adminUid, actionType, targetTreeId, targetMemberId
├── reason, requestedBy, performedAt
└── notes
```

---

## COST

| Item | Annual | Notes |
|------|--------|-------|
| Domain | ₹0 | Vansh-Vriksh.unfoldcro.in (free subdomain) |
| Everything else | ₹0 | All free tiers |
| Development | ₹0 | You + Claude Code Max |
| **TOTAL YEAR 1** | **₹0** | Completely free |

---

## LAUNCH TIMING

Best launch: **Pitru Paksha (September)** — families already thinking about ancestors, shraddh, and pitra.

Pre-launch message for WhatsApp:

> 🌳 इस पितृ पक्ष अपने पूर्वजों को डिजिटल श्रद्धांजलि दें!
>
> वंश वृक्ष — अपने परिवार का वंश वृक्ष बनाएं, मुफ्त में।
> 38+ भारतीय रिश्ते | गोत्र + कुलदेवी | श्राद्ध सहायक
>
> Vansh-Vriksh.unfoldcro.in
>
> 🙏 सेवा परमो धर्मः

---

*सेवा परमो धर्मः — Service is the highest duty*
*॥ पितृ देवो भव ॥ — May you honor your ancestors*

**Vansh Vriksh वंश वृक्ष | Vansh-Vriksh.unfoldcro.in**

---

## DESIGN SYSTEM RULES

> These rules define how every UI component, page, and visual element must be built.
> Follow them exactly to maintain visual consistency across the entire application.

---

### Color Tokens

IMPORTANT: Never hardcode hex colors in components. Always use Tailwind theme tokens defined in `tailwind.config.ts`.

```
Primary Palette:
  --color-gold:        #C9A84C   → 'gold'         (primary brand, CTAs, highlights)
  --color-earth:       #1A1207   → 'earth'         (backgrounds, text)
  --color-green:       #2D5A1E   → 'green-seva'    (accents, success states, tree lines)
  --color-orange:      #D4740E   → 'orange-seva'   (secondary CTAs, badges, warmth)

Gender Colors (tree cards):
  --color-male:        #E8F0FE   → 'card-male'     (blue tint for male members)
  --color-female:      #FDE8F0   → 'card-female'   (pink tint for female members)
  --color-other:       #E8F0E8   → 'card-other'    (green tint for other gender)
  --color-deceased:    #D1D5DB   → 'card-deceased'  (grey/muted for deceased members)

Semantic Colors:
  --color-success:     #16A34A   → 'success'       (approvals, best match)
  --color-warning:     #EAB308   → 'warning'       (possible match, alerts)
  --color-info:        #3B82F6   → 'info'          (similar family, tips)
  --color-error:       #DC2626   → 'error'         (validation errors, rejections)

Surfaces:
  --color-bg-primary:  #FFFBF0   → 'bg-primary'    (warm off-white page background)
  --color-bg-card:     #FFFFFF   → 'bg-card'        (card surfaces)
  --color-bg-muted:    #F5F0E8   → 'bg-muted'      (section backgrounds, alternating rows)
  --color-border:      #E8DCC8   → 'border-warm'    (warm borders matching theme)
```

### Typography

IMPORTANT: Always use `next/font` for font loading. Never use `<link>` tags for Google Fonts.

```
Font Stack:
  Primary (UI):       'Noto Sans Devanagari', 'Inter', system-ui, sans-serif
  Hindi Display:       'Noto Sans Devanagari' weight 700 (headings, hero text)
  English Display:     'Inter' weight 600-700 (headings)
  Body:                'Noto Sans Devanagari' / 'Inter' weight 400
  Mono (IDs, codes):   'JetBrains Mono', monospace

Type Scale (Tailwind classes):
  Hero title:          text-4xl md:text-6xl  font-bold    (वंश वृक्ष main heading)
  Section heading:     text-2xl md:text-3xl  font-semibold
  Card title:          text-lg md:text-xl    font-semibold
  Body:                text-base             font-normal
  Caption/label:       text-sm               font-medium
  Badge/tag:           text-xs               font-medium uppercase

Line Heights:
  Hindi text:          leading-relaxed (1.625) — Devanagari needs more vertical space
  English text:        leading-normal (1.5)
```

### Spacing System

```
Use Tailwind's default 4px base scale. Project conventions:
  Section gap:         py-16 md:py-24      (between page sections)
  Card padding:        p-4 md:p-6          (inside cards)
  Form field gap:      space-y-4           (between form fields)
  Button padding:      px-6 py-3           (standard buttons)
  Icon + text gap:     gap-2               (inline icon-text pairs)
  Grid gap:            gap-4 md:gap-6      (card grids)
  Page max-width:      max-w-7xl mx-auto   (content container)
  Mobile padding:      px-4                (page horizontal padding on mobile)
```

### Component Organization

```
/app                    → Pages (App Router)
/app/api                → API routes
/components             → Shared UI components
/components/ui          → Base primitives (Button, Input, Card, Badge, Modal, Toast)
/components/tree        → Tree-specific (FamilyTree, MemberCard, TreePreviewCard, ShraddhView)
/components/forms       → Form components (AddMemberForm, MarriageForm, ProfileForm)
/components/layout      → Layout (Header, Footer, LanguageToggle, MobileNav)
/lib                    → Utilities (firebase.ts, auth.ts, db.ts, i18n.ts, transliterate.ts)
/i18n                   → Translation files (en.json, hi.json)
/types                  → TypeScript interfaces
/hooks                  → Custom React hooks
/public                 → Static assets
```

### Component Conventions

```
Naming:
  - PascalCase for component files: MemberCard.tsx, AddMemberForm.tsx
  - camelCase for utility files: firebase.ts, transliterate.ts
  - kebab-case for route folders: /app/tree/[treeId]/page.tsx

Structure:
  - One component per file (exceptions: small tightly-coupled helpers)
  - All components accept className prop for composition
  - Export as named exports, not default exports
  - Co-locate component-specific types in the same file

Props Pattern:
  interface MemberCardProps {
    member: Member;
    role: UserRole;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
  }
```

### Bilingual (Hindi/English) Rules

IMPORTANT: Every user-facing string MUST come from the i18n system. Never hardcode Hindi or English text in components.

```
Pattern:
  - Import: import { useTranslation } from '@/hooks/useTranslation'
  - Usage: const { t, lang } = useTranslation()
  - Display: {t('section.key')}
  - Hindi is PRIMARY language (shown first, larger)
  - English is SECONDARY (shown below or after /)
  - Format: 'हिंदी टेक्स्ट / English Text' for dual display
  - Language toggle stored in localStorage, default: 'hi'
  - Font: when lang === 'hi', ensure Noto Sans Devanagari is active
```

### Member Card Design

IMPORTANT: All member cards in tree views and lists must follow this pattern exactly.

```
┌─────────────────────────────────────┐
│ [Gender Color BG]                    │
│ 🕊 (if deceased)     [दत्तक] badge  │
│ Name (nameHi)                        │
│ Name (English)                       │
│ née Maiden (if married woman)        │
│ Relation Label (Hindi / English)     │
│ DOB or ~Decade                       │
│ ─────────────────────────────────── │
│ [✏️ Edit] [🗑️ Delete]  (role-based) │
└─────────────────────────────────────┘

Colors:
  Male:     bg-card-male (blue #E8F0FE)
  Female:   bg-card-female (pink #FDE8F0)
  Other:    bg-card-other (green #E8F0E8)
  Deceased: bg-card-deceased (grey #D1D5DB) + 🕊 marker

Badges:
  Adopted:  'दत्तक' small badge, top-right, bg-orange-seva
  Step:     'सौतेला/सौतेली' small badge, top-right, bg-info
  Married:  'née {maidenName}' tag below name, text-sm italic
```

### Tree Visualization Rules

```
Layout:
  - Vertical, generation-by-generation, centered horizontally
  - Each generation row has a label pill (e.g., 'दादा-दादी', 'माता-पिता')
  - Generations: -3 (pardada) to +3 (parpota)

Connections:
  - Solid vertical lines:  parent → child (stroke: green-seva, 2px)
  - Solid horizontal lines: siblings (stroke: border-warm, 1px)
  - Dotted horizontal:     marriage link (stroke: gold, 2px, dashed)
  - Dotted off-screen:     cross-tree marriage bridge

Responsive:
  - Mobile: horizontal scroll, pinch-to-zoom via CSS transform
  - Desktop: auto-fit with scroll for large trees
  - Minimum touch target: 44px on all interactive elements
```

### Button Hierarchy

```
Primary CTA:    bg-gold text-earth font-semibold rounded-lg px-6 py-3
                hover:bg-gold/90 transition-colors
                Example: 'नया वृक्ष बनाएं / Create New Tree'

Secondary CTA:  bg-earth text-gold border-2 border-gold rounded-lg px-6 py-3
                hover:bg-earth/80
                Example: 'मेरा वृक्ष खोजें / Find My Family Tree'

Danger:         bg-error text-white rounded-lg px-4 py-2
                hover:bg-error/90
                Example: 'Delete / हटाएं'

Ghost:          bg-transparent text-earth underline
                hover:text-gold
                Example: 'Skip / छोड़ें'

Icon Button:    p-2 rounded-full hover:bg-bg-muted
                Example: language toggle, close modal
```

### Form Design

```
Input Fields:
  - border border-border-warm rounded-lg px-4 py-3 w-full
  - focus:ring-2 focus:ring-gold focus:border-gold
  - Label above field (Hindi primary, English secondary)
  - Error message below: text-error text-sm

Dropdown/Select:
  - Same styling as input
  - Searchable dropdowns for: gotra (100+), district, nakshatra, rashi

Form Layout:
  - Single column on mobile
  - 2-column grid on desktop for related fields (village + district)
  - Section dividers with Hindi headings
  - Collapsible sections for optional fields (ritual info)
```

### Accessibility & Performance

```
Accessibility:
  - All interactive elements: aria-label in Hindi
  - Color contrast: WCAG AA minimum (4.5:1 for text)
  - Focus indicators: ring-2 ring-gold on all focusable elements
  - Form labels: associated via htmlFor, not placeholder-only
  - Images: alt text in current language

Performance:
  - Page size budget: <500KB (standard mode), <200KB (ultra-light mode)
  - Lighthouse target: 90+ on all metrics
  - SSR for SEO-critical pages (landing, public tree view)
  - Intersection Observer for scroll animations
  - Lazy load below-the-fold sections
  - next/image for all images with proper width/height
```

### Seva Theme Emotional Design

```
The app serves Hindu families as a free seva (service). The visual tone should be:
  - WARM: gold/earth tones, not cold corporate blue
  - RESPECTFUL: Sanskrit shlokas, 🙏 iconography, 🕊 for deceased
  - INCLUSIVE: never show premium/paid UI, no ads, no upsells
  - TRUSTWORTHY: clear privacy messaging, gotra-based access controls
  - ELDER-FRIENDLY: large touch targets (44px+), clear labels, simple navigation

Every page should subtly reinforce:
  'सेवा परमो धर्मः — Service is the highest duty'
```

### Figma MCP Integration Rules

> For when Figma MCP server is connected in the future.

```
Required Flow:
  1. Run get_design_context for the node being implemented
  2. Run get_screenshot for visual reference
  3. Map Figma colors to Tailwind tokens defined above
  4. Reuse components from /components/ui/ and /components/tree/
  5. Validate against Figma screenshot for 1:1 visual parity

Asset Handling:
  - IMPORTANT: If Figma MCP returns a localhost source for images/SVGs, use it directly
  - IMPORTANT: DO NOT install new icon packages — use assets from Figma payload
  - Store downloaded assets in /public/assets/
  - Prefer CSS-based icons and animations over image files
```

### Figma Architecture Reference

```
FigJam Board: https://www.figma.com/board/5qCDVndUKcuHOiWpPU0C6k/
```

> The following user flows and system structure are extracted from the FigJam board.
> IMPORTANT: All implementations MUST follow these exact flows. Do not invent alternative paths.

#### Flow 1: Entry Point (Vansh-Vriksh.unfoldcro.in)

```
Landing Page → Decision: New or Returning?
  ├── Returning User → Login OTP → Dashboard
  └── New User → Decision: Find or Create?
      ├── Find → Search (Link/Name/Location/Advanced)
      │   ├── Found → Tree Preview → [View] or [Join]
      │   ├── Partial Results → "Similar Families → Is This Yours?"
      │   └── No Results → [Create New] | [Try Again] | [Ask Family WhatsApp]
      └── Create → Phone or Email OTP → Account Check
          ├── Existing Account → Redirect to Dashboard
          └── New Account → Profile Form → Duplicate Detection → Tree Creation
```

#### Flow 2: Profile + Duplicate Detection

```
Profile Form: Name, DOB, Gotra, KulDevi, Jati, Village, District
  → Duplicate Check: Same Surname + Gotra + District?
    ├── Match Found → "Your Family Tree Exists → Join Instead?"
    │   ├── "Yes, My Family" → Join flow for existing tree
    │   ├── "No, Different Family" → Create new tree
    │   └── "Don't Know" → Create new tree + flag for ongoing alert
    └── No Match → Create tree: ID format SURNAME-BIRTHYEAR-4CHARS (e.g., PATIL-1985-7X3K)
```

#### Flow 3: Dashboard Hub

```
Dashboard offers:
  ├── ➕ Add Member → Member Addition Workflow
  ├── 🌳 View Tree → Tree Visualization (Generation or Household view)
  ├── 📋 List View → Searchable card list with role-based actions
  ├── 📤 Share WhatsApp → Generate link + pre-made message
  ├── 🙏 Shraddh View → Highlight 3 paternal generations + death tithi + teerth
  ├── 🗑️ Recycle Bin → Recover deleted items (30-day window)
  └── ⚙️ Settings → Language, layout, ultra-light mode
```

#### Flow 4: Add Member

```
Step 1 — Relation Selector:
  38+ types grouped: पितृपक्ष(13) | मातृपक्ष(7) | स्वयं(9) | ससुराल(14) | संतान(18)

Step 2 — Member Details:
  Name, DOB (5 types: Exact/Year/Decade/Before1947/Unknown), Gender, Living/Deceased
  If Deceased: Death Year, Death Tithi, Teerth Sthal
  Optional: Occupation, Notes, Oral History

Step 3 — Marriage Form (auto-appears for spouse relations):
  Spouse: Name, Father Name, Gotra, KulDevi, Village
  Status: Active / Divorced / Widowed / Separated
  Surname: Keep Maiden / Husband / Both / Hyphenated
  RULE: Maiden Name NEVER Deleted
  Visibility: All / Branch Only / Hidden
  Cross-Tree: Spouse Tree ID → Connection Request
  Multiple Marriages: Each separate + children tagged per marriage
  Hidden Marriages: Person + Owner only see link; Children NEVER hidden
```

#### Flow 5: Tree Visualization

```
7 Generations: परदादा → दादा → Parents → Self → Children → पोता → परपोता
Card Colors: Blue=Male, Pink=Female, Grey=Deceased
Badges: née (maiden name) + दत्तक (adopted) + सौतेला (step)
Lines: Solid=Parent→Child | Horizontal=Sibling | Dotted=Marriage | Bridge=Cross-Tree
Toggles: Generation ↔ Household | Normal ↔ UltraLight (200KB)
Shraddh: Highlight 3 paternal generations + death tithi + teerth sthal
```

#### Flow 6: Share + Join

```
Share: Owner taps Share → WhatsApp message with link → Recipient sees read-only tree
Join:  Recipient taps "Join This Tree" → OTP verify → Select relation → Submit request
       → Owner gets notification → [Approve ✅] or [Reject ❌]
       → Approved = role: branch_editor
```

#### Flow 7: Role-Based Permissions

```
Owner:         ALL actions | Approve joins/merges | Hide ANY marriage | View ALL recycle bin
BranchEditor:  Own branch only | Add spouse+kids | Edit own additions | Hide own marriage
Viewer:        Read-only | Can request to join | No add/edit/delete
```

#### Flow 8: Cross-Tree Connections

```
Marriage Connection:
  Tree A member married to Tree B member
  → Request sent → Other tree owner approves
  → Marriage bridge appears in both trees
  → Labels: Natal tree: "विवाहित: देशमुख" | Marital tree: "मायका: पाटिल"
  → Auto-suggest: when spouse family creates tree later, system suggests connection
```

#### Flow 9: Gotra Discovery

```
Search: Gotra (dropdown) + District (dropdown) + Village (optional)
Privacy: Results visible ONLY to same-gotra users
Display: Surname, Village, KulDevi, Generations (NO personal data — no names, DOBs, phones)
Action: [Send Connection Request] → requires owner approval
```

#### Flow 10: Duplicate Prevention (4 Walls)

```
Wall 1 (Sign-up): Search existing trees before creating new one
Wall 2 (Smart Match): Surname + Gotra + District auto-check during profile creation
Wall 3 (Ongoing Alerts): Background check when new trees are created
Wall 4 (Merge): Manual merge with duplicate review
  → Review: Yellow = duplicate members | Green = unique members
  → Combine: keep version with more data
  → Abandon option: delete small tree → transfer members → join other tree
  → Undo: snapshot saved → undo merge within 30 days
```

#### Flow 11: Soft Delete + Recovery

```
Delete → status='deleted' → 30-day recovery window
Recycle Bin: Recover Member | Undo Merge | Restore Branch
After 30 days → Cron job permanently deletes → Gone forever
Merge snapshots also saved in recycle bin for 30 days
```

#### Flow 12: Admin Emergency Panel

```
Actions: Recover Tree | Undo Merge | Transfer Ownership | Restore Branch | Link New Creds
Privacy: Admin sees metadata ONLY — no personal data (no names, DOBs, phones, gotra)
Auth: Separate email+password auth, admin UIDs in environment variable
Audit: Every action logged in admin-actions/ collection
```

#### Flow 13: Privacy Levels

```
Same Tree members:  See everything (all member data)
Same Gotra users:   See Name + Village + KulDevi only (via gotra-index)
Different Gotra:    See nothing (tree-metadata public, but no gotra-index access)
```

#### Flow 14: Special Features

```
DOB Input:         5 types (Exact date / Year only / Approximate decade / Relative marker / Unknown)
Transliteration:   Type "Rajesh" → shows "राजेश" suggestion → accept or keep English
Shared Access:     Multiple family members access same tree via their own OTP
Elder Entry:       Children/grandchildren add elder's data — elders don't need phone/account
Household Groups:  Group members by where they live | Head = मुखिया (mukhiya)
```
