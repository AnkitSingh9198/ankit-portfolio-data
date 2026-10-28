/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — single source of truth
 *  Every fact here comes from Ankit Singh's resume.
 *  Anything marked `TODO:` is a placeholder that needs your input.
 * ─────────────────────────────────────────────────────────────
 */
import type {
  Education,
  Flow,
  MinorProject,
  Principle,
  Profile,
  Project,
  Role,
  Skill,
  SkillLayer,
  WorkshopNode,
} from "./types";

export const profile: Profile = {
  name: "Ankit Singh",
  firstName: "Ankit",
  role: "Full Stack Developer",
  headline: ["I build", "digital", "experiences", "that move", "people."],
  tagline:
    "Full Stack Developer crafting performant, scalable and beautifully engineered web experiences — from MongoDB schema to the pixel on screen.",
  location: "Noida, Uttar Pradesh, India",
  timezone: "Asia/Kolkata",
  coordinates: "28.5355° N, 77.3910° E",
  email: "ankitsingh110198@gmail.com",
  phone: "+91 8586846184",
  showPhone: true,
  // Set `show: false` if you are not currently looking.
  availability: { show: true, label: "Open to opportunities" },
  resumeUrl: "/Ankit_Singh_Resume.pdf",
  photo: {
    src: "/images/ankit-singh.jpg",
    alt: "Ankit Singh in a light grey three-piece suit and black shirt, standing in front of a neon light installation",
    width: 1200,
    height: 1600,
  },
  photo3d: {
    plate: "/images/ankit-3d-plate.webp",
    subject: "/images/ankit-3d-subject.webp",
    plateRatio: 1.2391,
    subjectRatio: 1.5217,
  },

  intro:
    "I'm Ankit — a full stack developer in Noida who turns product ideas into production software. For about two years I've shipped web and mobile apps across healthcare, insurance, e-commerce and hospitality: real-time video consultations, insurer integrations, booking systems and the admin panels that keep them running.",
  summary: [
    "I work end to end. On a typical feature I'll design the MongoDB schema, write the Express routes with JWT auth and role-based access, then build the React interface that sits on top — and deploy it myself.",
    "The work I enjoy most is the messy middle: negotiating a WebRTC call across flaky networks, or making four insurance providers with four different APIs look like one clean comparison table.",
  ],
  facts: [
    { label: "Based in", value: "Noida, India" },
    { label: "Currently", value: "LYB Technology" },
    { label: "Experience", value: "~2 years, production" },
    { label: "Domains", value: "Healthcare · Insurance · E-commerce · Hospitality" },
  ],
  numbers: [
    { value: "04", label: "insurer APIs", note: "Zuno, SBI General, ICICI Lombard, GoDigit" },
    { value: "02", label: "React Native apps", note: "Dr Dermat Clinic App & User App" },
    { value: "04", label: "role dashboards", note: "Patients, doctors, clinics, partners" },
  ],
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ankit-singh-32371a167",
      handle: "in/ankit-singh-32371a167",
    },
    { label: "GitHub", href: "https://github.com/AnkitSingh9198", handle: "@AnkitSingh9198" },
  ],
};

/* ───────────────────────── Skills ───────────────────────── */

export const skillLayers: SkillLayer[] = [
  { id: "client", index: "L1", title: "Client", caption: "What people touch — web and mobile interfaces" },
  { id: "realtime", index: "L2", title: "Real-time", caption: "Live channels between people" },
  { id: "api", index: "L3", title: "API & Server", caption: "Business logic, auth and integrations" },
  { id: "data", index: "L4", title: "Data", caption: "Models, queries and aggregation" },
  { id: "ship", index: "L5", title: "Ship", caption: "Tooling, delivery and deployment" },
];

export const skills: Skill[] = [
  // Client
  { name: "React.js", layer: "client", use: "Component-driven interfaces: quote comparison, multi-step proposal forms, dashboards.", seenIn: ["Dr Dermat", "Zanifest", "RS Galaxy"] },
  { name: "TypeScript", layer: "client", use: "Typed props, API contracts and data models so refactors stay safe across front and back end.", seenIn: ["LYB Technology"] },
  { name: "JavaScript (ES6+)", layer: "client", use: "The language under everything — async flows, modules and modern syntax on client and server." },
  { name: "React Native", layer: "client", use: "Companion mobile apps sharing the same REST APIs and auth layer as the web platform.", seenIn: ["Dr Dermat Clinic App", "Dr Dermat User App"] },
  { name: "Redux Toolkit", layer: "client", use: "Predictable global state for carts, sessions and multi-profile accounts." },
  { name: "Context API & Hooks", layer: "client", use: "Lightweight shared state and reusable logic without extra dependencies." },
  { name: "React Router", layer: "client", use: "Role-based routing that sends patients, doctors, clinics and partners to their own dashboards.", seenIn: ["Dr Dermat"] },
  { name: "HTML5 & CSS3", layer: "client", use: "Semantic, accessible markup and responsive layouts that hold up on any screen." },
  { name: "Bootstrap", layer: "client", use: "Fast, consistent responsive grids for client sites and admin panels." },
  { name: "Figma-to-Code", layer: "client", use: "Translating Figma designs into pixel-accurate, responsive interfaces wired to real APIs.", seenIn: ["Aeron Digital Solution"] },
  // Real-time
  { name: "WebRTC", layer: "realtime", use: "Peer-to-peer chat, audio and video: offer/answer negotiation, ICE exchange, media streams.", seenIn: ["Dr Dermat"] },
  { name: "Socket.IO", layer: "realtime", use: "The signalling channel for calls — ringing, accept, reject, end — plus live chat events.", seenIn: ["Dr Dermat"] },
  // API
  { name: "Node.js", layer: "api", use: "The runtime for APIs, batch processing and third-party integrations." },
  { name: "Express.js", layer: "api", use: "REST services with middleware for auth, validation and structured error handling." },
  { name: "REST API Design", layer: "api", use: "Resource-oriented endpoints shared by web and mobile clients." },
  { name: "JWT Auth & RBAC", layer: "api", use: "Token-based sign-in with role-based access control and separate B2C / B2B flows.", seenIn: ["Dr Dermat", "LYB Technology"] },
  { name: "Third-party & Payments", layer: "api", use: "Insurer APIs, payment gateways and KYC — with retries, validation and logging.", seenIn: ["Zanifest", "Dr Dermat"] },
  // Data
  { name: "MongoDB", layer: "data", use: "Document models for consultations, chat history, call logs, policies and bookings." },
  { name: "Mongoose", layer: "data", use: "Schemas, validation and relationships between appointments, users and records." },
  { name: "Schema Design", layer: "data", use: "Designing collections around how the product reads data, not just how it's stored." },
  { name: "Aggregation Pipelines", layer: "data", use: "Server-side search, filters and reporting for policy and admin dashboards." },
  // Ship
  { name: "Git & GitHub", layer: "ship", use: "Branching, code review and Git-based release workflows." },
  { name: "Vercel · Render · Hostinger", layer: "ship", use: "Deployments and environment configuration across platforms.", seenIn: ["LYB Technology"] },
  { name: "Postman", layer: "ship", use: "Exploring, documenting and testing APIs — including third-party insurer endpoints." },
  { name: "Performance", layer: "ship", use: "Lazy loading, code splitting and query optimisation.", seenIn: ["LYB Technology"] },
  { name: "Agile & Code Review", layer: "ship", use: "Shipping with designers, backend engineers and QA in short iterations." },
  { name: "VS Code · Cursor · npm", layer: "ship", use: "Daily tooling, including AI-assisted development to speed up delivery and review." },
];

/* ───────────────────────── Projects ───────────────────────── */

export const projects: Project[] = [
  {
    slug: "dr-dermat",
    index: "01",
    title: "Dr Dermat",
    category: "Healthcare · Real-time consultation",
    summary:
      "A healthcare platform where patients consult doctors over live chat, audio and video — with e-commerce, a clinic portal and companion mobile apps.",
    role: "Full stack developer — built from the ground up at Aeron Digital Solution; leading ongoing development at LYB Technology.",
    context:
      "Patients, doctors, clinics and business partners all use the same platform but need very different tools. The core of it is a one-to-one consultation that has to keep working when a network doesn't.",
    built: [
      "WebRTC chat, audio and video consultation portal: signalling layer, peer connection lifecycle, offer/answer negotiation, ICE candidate exchange and media stream handling.",
      "Full call state handling — ringing, accept, reject, end, mute, camera toggle — with reconnection and network-failure recovery.",
      "E-commerce module: catalogue, search and filters, cart, checkout, payments and order tracking.",
      "Doctor / clinic portal covering onboarding, appointments, patient records and prescriptions.",
      "Multi-profile accounts so one user can create and switch between family or patient profiles under one login.",
      "Separate B2C and B2B authentication flows with role-based routing and dashboards for patients, doctors, clinics and partners.",
      "Companion Clinic App and User App in React Native, sharing the web platform's REST APIs and auth layer.",
      "Role-based admin panel and MongoDB models for consultations, chat history, call logs and appointment linkage.",
    ],
    challenges: [
      { title: "Calls that survive bad networks", detail: "Modelled the full call state machine and added reconnection and network-failure recovery so a dropped connection doesn't end a consultation." },
      { title: "One login, many patients", detail: "Multi-profile account management lets a single user manage family members' consultations without separate accounts." },
      { title: "Four audiences, one codebase", detail: "Split B2C and B2B authentication with role-based routing so every role lands on the right dashboard." },
    ],
    stack: ["React.js", "React Native", "Node.js", "Express.js", "MongoDB", "WebRTC", "Socket.IO", "JWT"],
    liveUrl: "https://drdermat.com/",
    visual: "realtime",
    accent: "#c8ff2e",
    highlights: [
      { value: "P2P", label: "WebRTC chat · audio · video" },
      { value: "4", label: "role-based dashboards" },
      { value: "2", label: "React Native apps" },
    ],
  },
  {
    slug: "zanifest",
    index: "02",
    title: "Zanifest",
    category: "Insurance · API aggregation",
    summary:
      "An insurance aggregator that turns several insurers' very different APIs into one consistent quote-to-policy journey.",
    role: "Full stack developer — built from the ground up at Aeron Digital Solution; leading insurer API integrations at LYB Technology.",
    context:
      "Every insurer speaks its own dialect: different request shapes, auth schemes and failure modes. Users should never notice.",
    built: [
      "Integrated insurer APIs including Zuno, SBI General, ICICI Lombard and GoDigit — quote generation, proposal submission, KYC, payment and policy issuance.",
      "A unified data layer that normalises each insurer's request/response format so quotes compare in one consistent interface.",
      "Auth-token handling, retries, validation, failure scenarios and logging to keep the quote-to-policy journey stable.",
      "Policy management dashboards with search, filters, status tracking, renewals and downloadable policy documents.",
      "Bulk policy upload with file validation, error reporting and batch processing.",
      "Responsive React interfaces for quote comparison, multi-step proposal forms and payment confirmation.",
    ],
    challenges: [
      { title: "Many formats, one table", detail: "Normalised varied insurer payloads into a single internal shape, so the UI compares quotes without caring who they came from." },
      { title: "Graceful failure", detail: "Token refresh, retries, validation and logging per provider keep one insurer's outage from breaking the whole journey." },
      { title: "Bulk without bad data", detail: "Batch policy uploads validate every row and report errors clearly instead of failing silently." },
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Payment gateway"],
    liveUrl: "https://zanifestinsurance.com/",
    visual: "aggregator",
    accent: "#7cf4ff",
    highlights: [
      { value: "4", label: "insurer APIs integrated" },
      { value: "1", label: "unified data layer" },
      { value: "Bulk", label: "policy upload pipeline" },
    ],
  },
  {
    slug: "rs-galaxy",
    index: "03",
    title: "RS Galaxy",
    category: "Hospitality · Booking system",
    summary:
      "A hotel website and booking system delivered end to end — public site, booking engine and the admin dashboard behind it.",
    role: "Full stack developer — delivered the complete site end to end.",
    context:
      "A hotel brand with properties in Goa and Rishikesh needs to be found on search, take bookings without double-selling rooms, and let staff manage it all without a developer.",
    built: [
      "Responsive, SEO-friendly public pages.",
      "Booking and enquiry flow with availability handling and date selection.",
      "Secure admin dashboard for rooms, rates, bookings and enquiries.",
    ],
    challenges: [
      { title: "Availability you can trust", detail: "Booking flow checks availability for the selected dates before an enquiry or booking goes through." },
      { title: "Hand-off to the hotel", detail: "A secure admin dashboard puts rooms, rates and bookings in the hands of the people running the hotel." },
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://rsgalaxyhotels.in/",
    visual: "booking",
    accent: "#ffb86b",
    highlights: [
      { value: "E2E", label: "delivered end to end" },
      { value: "SEO", label: "friendly public pages" },
      { value: "Admin", label: "rooms · rates · bookings" },
    ],
  },
];

export const moreProjects: MinorProject[] = [
  // Descriptions below say what each product is. Add your own role/contributions if you want more detail.
  { title: "Homwisor", category: "Real estate", description: "Residential and commercial property investment platform, Gurgaon to Dubai.", url: "https://homwisor.com/" },
  { title: "Conceive IVF", category: "Healthcare", description: "Website for a fertility clinic offering IVF treatment.", url: "https://conceive-ivf.com/" },
  { title: "Facebook Leadflow", category: "Lead management", description: "Lead capture, assignment, status tracking and an admin panel." },
  { title: "Jewellery E-Commerce", category: "E-commerce", description: "Catalogue, cart, checkout and order management." },
  { title: "Tadoba National Park", category: "Travel", description: "Listing, package and enquiry flows." },
  { title: "Minisafar", category: "Travel", description: "Listing, package and enquiry flows." },
  { title: "Seven Safar", category: "Travel", description: "Listing, package and enquiry flows." },
];

/* ───────────────────────── Experience ───────────────────────── */

export const experience: Role[] = [
  {
    company: "LYB Technology",
    location: "Noida",
    title: "Full Stack Developer",
    start: "Feb 2026",
    end: "Present",
    current: true,
    points: [
      "Own end-to-end features across React.js, TypeScript, Node.js, Express.js and MongoDB — from schema design to production deployment.",
      "Lead ongoing development of the Dr Dermat and Zanifest platforms, focused on WebRTC real-time communication and insurer API integrations.",
      "Design REST APIs with JWT authentication, role-based access control and structured error handling; improve performance through lazy loading, code splitting and query optimisation.",
      "Manage deployments and environment configuration on Vercel, Render and Hostinger with Git-based release workflows.",
    ],
    stack: ["React.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "WebRTC"],
  },
  {
    company: "Aeron Digital Solution",
    location: "Noida",
    title: "Full Stack Developer",
    start: "Oct 2024",
    end: "Jan 2026",
    points: [
      "Built the Dr Dermat and Zanifest platforms from the ground up, plus client products across healthcare, insurance, e-commerce and travel.",
      "Translated Figma designs into pixel-accurate responsive interfaces wired to REST APIs and third-party services.",
      "Worked with designers, backend engineers and QA in an Agile workflow; used AI-assisted tooling to speed up delivery and code review.",
    ],
    stack: ["React.js", "React Native", "Node.js", "Express.js", "MongoDB", "Figma"],
  },
];

export const education: Education[] = [
  { qualification: "Master of Computer Applications (MCA)", institution: "RD Engineering College", year: "2022" },
  { qualification: "Bachelor of Computer Applications (BCA)", institution: "Hierank Business School", year: "2019" },
];

export const certifications: Education[] = [
  { qualification: "Front End Developer", institution: "Ducat, Noida", year: "2023–24" },
  { qualification: "React and Redux Certification", institution: "TODO: issuing organisation", year: "2024" },
];

/* ───────────────────────── Working approach ───────────────────────── */

export const principles: Principle[] = [
  { index: "01", title: "Schema first.", body: "I start with the data. A well-shaped MongoDB model makes the API obvious and the interface simple — a bad one leaks into every screen." },
  { index: "02", title: "APIs that fail politely.", body: "Third-party services go down. Tokens expire. I build in validation, retries, structured errors and logs so users see a clear message instead of a broken page." },
  { index: "03", title: "Pixel-accurate, then responsive.", body: "I translate Figma faithfully, then make sure it still works on the smallest phone and the widest monitor." },
  { index: "04", title: "Performance is a feature.", body: "Lazy loading, code splitting and lean queries aren't polish at the end — they're part of shipping." },
  { index: "05", title: "Own it to production.", body: "Environment config, deployments, release workflows. A feature isn't done until it's live and someone can use it." },
];

/* ───────────────────────── Workshop lab ───────────────────────── */

export const workshopNodes: WorkshopNode[] = [
  { id: "user", label: "User", sub: "Browser / phone", role: "A patient, doctor, policy buyer or admin — each with different permissions." },
  { id: "ui", label: "Interface", sub: "React · React Native", role: "Renders state, validates input early and calls the API. Same API serves web and mobile." },
  { id: "api", label: "API layer", sub: "REST · JWT · RBAC", role: "Verifies the token, checks the role, validates the payload and returns structured errors." },
  { id: "server", label: "Server", sub: "Node.js · Express", role: "Business logic: orchestrates database work and third-party calls." },
  { id: "db", label: "Database", sub: "MongoDB · Mongoose", role: "Documents for users, consultations, call logs, policies and bookings." },
  { id: "socket", label: "Signalling", sub: "Socket.IO", role: "A live channel that relays call events and WebRTC offers, answers and ICE candidates." },
  { id: "peer", label: "Peer", sub: "WebRTC", role: "The other side of the call. Once negotiated, media flows peer-to-peer." },
  { id: "external", label: "Third-party", sub: "Insurers · Payments", role: "External APIs with their own formats, auth and failure modes." },
];

export const flows: Flow[] = [
  {
    id: "auth",
    title: "Sign in with roles",
    project: "Dr Dermat · B2C & B2B auth",
    steps: [
      { from: "user", to: "ui", label: "submit(email, password)", detail: "The form validates input before anything leaves the browser." },
      { from: "ui", to: "api", label: "POST /api/auth/login", detail: "Credentials go to the auth endpoint over HTTPS." },
      { from: "api", to: "server", label: "validate → authService.login()", detail: "Payload validated; the service decides whether this is a B2C or B2B account." },
      { from: "server", to: "db", label: "users.findOne({ email })", detail: "Look up the user, verify the password hash, load role and linked profiles." },
      { from: "db", to: "server", label: "{ user, role: 'doctor' }", detail: "The document comes back with the role attached." },
      { from: "server", to: "ui", label: "200 { token: JWT }", detail: "A signed JWT carries the user id and role for later requests." },
      { from: "ui", to: "user", label: "navigate('/doctor/dashboard')", detail: "Role-based routing sends each role to its own dashboard." },
    ],
  },
  {
    id: "call",
    title: "Start a video consult",
    project: "Dr Dermat · WebRTC",
    steps: [
      { from: "user", to: "ui", label: "startCall(doctorId)", detail: "The patient taps call; the app requests camera and microphone." },
      { from: "ui", to: "socket", label: "emit('call:ring', offer)", detail: "An SDP offer is created and sent through the signalling channel." },
      { from: "socket", to: "peer", label: "ringing…", detail: "The doctor's device rings — they can accept or reject." },
      { from: "peer", to: "socket", label: "emit('call:accept', answer)", detail: "The doctor accepts and returns an SDP answer." },
      { from: "socket", to: "ui", label: "ICE candidates ⇄", detail: "Both sides trade ICE candidates to find a network path between them." },
      { from: "ui", to: "peer", label: "media: peer-to-peer", detail: "Audio and video now flow directly. Mute, camera toggle and reconnection are handled in call state." },
      { from: "ui", to: "api", label: "POST /api/calls/log", detail: "When the call ends, the client reports duration and outcome." },
      { from: "api", to: "server", label: "callService.save()", detail: "The server links the call to its appointment and consultation." },
      { from: "server", to: "db", label: "callLogs.insertOne()", detail: "Stored alongside chat history for the doctor and the admin panel." },
    ],
  },
  {
    id: "quote",
    title: "Compare insurance quotes",
    project: "Zanifest · Insurer aggregation",
    steps: [
      { from: "user", to: "ui", label: "submit(coverDetails)", detail: "A multi-step form collects what the insurers need." },
      { from: "ui", to: "api", label: "POST /api/quotes", detail: "One request from the client — the fan-out happens on the server." },
      { from: "api", to: "server", label: "quoteService.fetchAll()", detail: "The server prepares a request per insurer in that insurer's own format." },
      { from: "server", to: "external", label: "Zuno · SBI General · ICICI Lombard · GoDigit", detail: "Each call handles its own auth token, retries and validation." },
      { from: "external", to: "server", label: "normalise(responses)", detail: "Different response shapes are mapped into one unified quote model; failures are logged, not fatal." },
      { from: "server", to: "db", label: "quotes.insertMany()", detail: "Quotes are stored so the proposal and policy steps can pick them up." },
      { from: "server", to: "ui", label: "200 [ unified quotes ]", detail: "The interface gets one consistent list to compare side by side." },
    ],
  },
];

export const navItems = [
  { id: "profile", label: "Profile" },
  { id: "toolkit", label: "Toolkit" },
  { id: "workshop", label: "Workshop" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
