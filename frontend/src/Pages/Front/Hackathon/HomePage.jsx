import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  ClipboardCheck,
  Code2,
  FileText,
  Gavel,
  Laptop,
  Lightbulb,
  ListOrdered,
  MapPin,
  MessageCircle,
  Presentation,
  Shield,
  Upload,
  Users,
  X,
} from "lucide-react";
import siteConfig from "../../../config/siteConfig";
import "../HomePage/HeroSection.css";
import "./Hackathon.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROUNDS = [
  {
    kicker: "Round 1",
    icon: Upload,
    title: "Online Idea Submission",
    text: "Register as a team and submit your idea presentation online. Only shortlisted teams move to the physical round.",
  },
  {
    kicker: "Round 2",
    icon: MapPin,
    title: "Physical Hackathon",
    text: "Venue: AdhigamAI Master Hub — Sri Sukhmani College, Dera Bassi. Build a working prototype and present to the jury.",
  },
];

const GUIDELINES = [
  {
    n: "01",
    icon: Users,
    title: "Team Formation",
    items: [
      "Each team must consist of exactly 5 students.",
      "Nominate one student as Team Leader for communication.",
      "Submit every member's details correctly during registration.",
      "Team members cannot be changed after the final submission.",
    ],
  },
  {
    n: "02",
    icon: FileText,
    title: "Online Registration",
    items: [
      "Register through the official AdhigamAI website.",
      "Submit team name, college name, course & year, team leader details, member details, and contact information.",
      "Incomplete or incorrect details may lead to rejection.",
    ],
  },
  {
    n: "03",
    icon: Lightbulb,
    title: "Problem Statement & Use Case",
    items: [
      "Select and work on an approved problem statement / challenge category.",
      "The solution should address a real-life problem.",
      "It must align with the hackathon theme and demonstrate the use of Artificial Intelligence.",
    ],
  },
  {
    n: "04",
    icon: Upload,
    title: "Idea Submission",
    items: [
      "Submit an idea presentation in the online round.",
      "Cover problem statement, problem understanding, proposed AI solution, technology stack, implementation approach, and expected impact.",
      "Format: PPT. Include an abstract / project summary if required.",
      "Only shortlisted ideas move to the next round.",
    ],
  },
  {
    n: "05",
    icon: ClipboardCheck,
    title: "Round 1 Evaluation",
    items: [
      "All ideas are evaluated by an expert jury panel.",
      "Scored on innovation & idea clarity, problem understanding, AI implementation approach, feasibility, and overall impact.",
      "Shortlisted teams are informed by the AdhigamAI team, who will coordinate the physical round.",
    ],
  },
  {
    n: "06",
    icon: Code2,
    title: "Project Development",
    items: [
      "Shortlisted teams develop their solution during the physical hackathon.",
      "Build a working model, prototype, or demo version during the program period.",
      "Focus on coding & development, AI implementation, and testing & improvement.",
    ],
  },
  {
    n: "07",
    icon: Presentation,
    title: "Presentation Format",
    items: [
      "Prepare the final presentation as per the format shared by the AdhigamAI team.",
      "Cover problem statement, proposed solution, AI implementation, technology used, working demo, and impact & future scope.",
      "Any format deviation may affect evaluation.",
    ],
  },
  {
    n: "08",
    icon: ListOrdered,
    title: "Presentation Sequence",
    items: [
      "Present strictly according to the sequence, Team ID, and schedule shared by the organizers.",
      "Late arrival or not following the sequence may mean losing the presentation slot.",
    ],
  },
  {
    n: "09",
    icon: ClipboardCheck,
    title: "Eligibility to Present",
    items: [
      "Only teams that complete all mandatory requirements can showcase.",
      "This may include registration, idea submission, required assessments/activities, mentor reviews, and hackathon milestones.",
      "Eligibility is verified before the final presentation.",
    ],
  },
  {
    n: "10",
    icon: Gavel,
    title: "Evaluation Criteria",
    items: [
      "Innovation & idea clarity",
      "Problem statement & use case relevance",
      "Technical implementation and AI integration",
      "Prototype / demo performance, presentation quality, and overall impact",
    ],
  },
  {
    n: "11",
    icon: Shield,
    title: "Discipline & Conduct",
    items: [
      "Follow instructions from AdhigamAI mentors, coordinators, and jury members.",
      "Maintain discipline and professional conduct throughout.",
      "Misconduct, plagiarism, or rule violations may lead to disqualification.",
    ],
  },
  {
    n: "12",
    icon: Laptop,
    title: "What to Carry & Awards",
    items: [
      "Bring a laptop & charger, required software/tools, project files, and your college ID card. Keep an internet/data backup.",
      "Certificates and awards follow AdhigamAI Hackathon guidelines.",
      "Winning teams are selected from the final jury evaluation and project performance.",
    ],
  },
];

const PAST_EVENTS = [
  // { src: "/Assets/public_assets/images/event/aidayevent2.jpg", title: "Campus AI Day" },
  { src: "/Assets/public_assets/images/event/aisummit.jpg", title: "AI Summit" },
  { src: "/Assets/public_assets/images/event/workshop.jpeg", title: "Innovation Workshop" },
  { src: "/Assets/public_assets/images/event/workshop2.jpeg", title: "Hands-on Lab" },
  { src: "/Assets/public_assets/images/event/teachers-workshop.jpg", title: "Faculty Workshop" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { logo, logoAlt, name } = siteConfig.branding;
  const backendUrl = process.env.REACT_APP_ADHIGAM_BACKEND_URL;
  const [queryOpen, setQueryOpen] = useState(false);
  const [querySent, setQuerySent] = useState(false);
  const [querySubmitting, setQuerySubmitting] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [query, setQuery] = useState({ name: "", email: "", message: "" });
  const [queryErrors, setQueryErrors] = useState({});
  const [queryError, setQueryError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const eventsPinRef = useRef(null);

  const closeQuery = () => {
    setQueryOpen(false);
    setQuerySent(false);
    setQuerySubmitting(false);
    setQuery({ name: "", email: "", message: "" });
    setQueryErrors({});
    setQueryError("");
  };

  useEffect(() => {
    if (!queryOpen && !lightbox) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setLightbox(null);
      setQueryOpen(false);
      setQuerySent(false);
      setQuerySubmitting(false);
      setQuery({ name: "", email: "", message: "" });
      setQueryErrors({});
      setQueryError("");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [queryOpen, lightbox]);

  useEffect(() => {
    const pin = eventsPinRef.current;
    if (!pin) return undefined;

    let ticking = false;
    const lastIndex = PAST_EVENTS.length - 1;

    const updateFromScroll = () => {
      ticking = false;
      const range = pin.offsetHeight - window.innerHeight;
      if (range <= 0) {
        setActiveIndex(0);
        return;
      }
      const progress = Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / range));
      const next = Math.round(progress * lastIndex);
      setActiveIndex((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateFromScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitQuery = async (e) => {
    e.preventDefault();
    const next = {};
    if (!query.name.trim()) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(query.email.trim())) next.email = "Enter a valid email.";
    if (!query.message.trim()) next.message = "Please write your question.";
    setQueryErrors(next);
    setQueryError("");
    if (Object.keys(next).length) return;
    if (!backendUrl) {
      setQueryError("Backend URL is not configured.");
      return;
    }

    setQuerySubmitting(true);
    try {
      await axios.post(`${backendUrl}/api/v1/hackathon/query`, {
        name: query.name.trim(),
        email: query.email.trim(),
        message: query.message.trim(),
      });
      setQuerySent(true);
    } catch (err) {
      setQueryError(err.response?.data?.message || "Failed to send. Please try again.");
    } finally {
      setQuerySubmitting(false);
    }
  };

  return (
    <div className="foc-cyber-home hackathon-page">
          <style>
            {`
     /* Home layout only. Fonts and colours come from siteConfig / Hackathon.css:
   Inter + Orbitron, navy, #1ba7ff, #2563eb, #ff2daa. */

.hackathon-page {
  --bp-navy: var(--navy);
  --bp-panel: var(--navy-3);
  --bp-panel-line: var(--line);
  --bp-cyan: var(--blue);
  --bp-cyan-dim: var(--blue-light);
  --bp-amber: var(--accent);
  --bp-amber-hover: var(--blue-light);
  --bp-paper: var(--text);
  --bp-slate: var(--text-dim);
  --bp-danger: var(--error);
  --bp-radius: 10px;
  font-family: var(--font-sans);
  color: var(--text);
  background:
    radial-gradient(1100px 600px at 78% 12%, rgba(37, 120, 235, 0.28), transparent 60%),
    radial-gradient(900px 480px at 12% 0%, rgba(27, 167, 255, 0.16), transparent 55%),
    linear-gradient(180deg, var(--navy) 0%, var(--navy-2) 100%);
  min-height: 100vh;
  position: relative;
}

/* faint drafting grid, confined behind the content so it reads as texture, not noise */
.hackathon-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--bp-panel-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--bp-panel-line) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.35;
  mask-image: linear-gradient(to bottom, black, black 60%, transparent 100%);
  pointer-events: none;
}

.hack-home-wrap {
  position: relative;
  z-index: 1;
}

.hackathon-page * {
  box-sizing: border-box;
}

.hack-home-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 64px 24px 96px;
}

/* ---------------------------------- Header --------------------------- */

.hack-home-header {
  max-width: 640px;
  margin-bottom: 72px;
}

/* logo badge: a soft glass panel that sits naturally on the dark blueprint
   background instead of a hard white box cut into the page. */
.hackathon-logo-badge {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  margin-bottom: 32px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(27, 167, 255, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px -10px rgba(4, 8, 30, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.hackathon-logo {
  display: block;
  height: 34px;
  width: auto;
}

.hackathon-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--blue-light);
  margin-bottom: 18px;
}

.hackathon-kicker .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue-glow);
  box-shadow: 0 0 8px var(--blue-glow);
  flex-shrink: 0;
}

.hack-home-header h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
  color: var(--text);
}

.hack-home-header h1 .accent {
  background: linear-gradient(90deg, var(--blue-light), var(--blue-glow) 60%, #5ad1ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hackathon-sub {
  font-size: 17px;
  line-height: 1.6;
  color: var(--bp-slate);
  max-width: 52ch;
}

/* ---------------------------------- Sections --------------------------- */

.hack-home-section {
  margin-bottom: 72px;
}

.hack-home-section-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--bp-panel-line);
}

.hack-home-section-head h2 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  margin: 2px 0 0;
  color: var(--text);
}

.hack-home-section-head p {
  margin: 0;
  color: var(--bp-slate);
  font-size: 15px;
}

/* ---------------------------------- Guideline cards --------------------------- */

.hack-home-guidelines {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.hack-home-card {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  border-radius: var(--bp-radius);
  padding: 26px 22px;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.hack-home-card:hover {
  border-color: var(--bp-cyan-dim);
  transform: translateY(-3px);
  box-shadow: 0 16px 32px -16px rgba(0, 0, 0, 0.6);
}

/* schematic corner brackets instead of shadow/rounded-card default */
.hack-home-card::before,
.hack-home-card::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--bp-cyan-dim);
  border-style: solid;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.hack-home-card::before {
  top: 8px;
  left: 8px;
  border-width: 1px 0 0 1px;
}

.hack-home-card::after {
  bottom: 8px;
  right: 8px;
  border-width: 0 1px 1px 0;
}

.hack-home-card:hover::before,
.hack-home-card:hover::after {
  opacity: 1;
  border-color: var(--bp-cyan);
}

.hack-home-card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(27, 167, 255, 0.12);
  border: 1px solid rgba(27, 167, 255, 0.28);
  border-radius: 8px;
  color: var(--blue-light);
  margin-bottom: 18px;
  transition: background 0.15s ease, transform 0.15s ease;
}

.hack-home-card:hover .hack-home-card-icon {
  background: rgba(27, 167, 255, 0.22);
  transform: translateY(-2px);
}

.hack-home-card h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text);
}

.hack-home-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--bp-slate);
}

.hack-home-rounds {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.hack-home-round-kicker {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--blue-light);
  margin-bottom: 8px;
}

.hack-home-guide-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.hack-home-guide .hack-home-card-icon {
  margin-bottom: 12px;
}

.hack-home-guide-n {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--blue-light);
  margin-bottom: 6px;
}

.hack-home-guide ul {
  margin: 8px 0 0;
  padding-left: 18px;
  color: var(--bp-slate);
  font-size: 13.5px;
  line-height: 1.55;
}

.hack-home-guide li {
  margin-bottom: 6px;
  color: var(--text-dim);
}

.hack-home-guide li:last-child {
  margin-bottom: 0;
}

/* ---------------------------------- Carousel --------------------------- */

.hack-home-events-pin {
  --slides: 6;
  height: calc(90vh + (var(--slides) - 1) * 55vh);
  margin-bottom: 72px;
}

.hack-home-events-sticky {
  position: sticky;
  top: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px 0 36px;
}

.hack-home-events-sticky .hack-home-section-head {
  margin-bottom: 24px;
}

.hack-home-carousel {
  display: block;
}

/* Stack: every slide occupies the exact same box. At rest (i <= activeIndex)
   a slide sits at translateY(0); slides not yet reached sit just off to the
   bottom at translateY(100%). Scrolling down brings the next slide up over
   the current one; scrolling up slides it back down. */
.hack-home-stack {
  position: relative;
  flex: 1;
  min-width: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--bp-radius);
  overflow: hidden;
  border: 1px solid var(--bp-panel-line);
  background: var(--bp-panel);
  isolation: isolate;
}

.hackathon-page .hack-home-stack-slide {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  background: var(--bp-panel);
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}

.hackathon-page .hack-home-stack-slide img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
  filter: saturate(0.85) brightness(0.9);
  transition: filter 0.2s ease;
  pointer-events: none;
}

.hack-home-stack-slide:hover img {
  filter: saturate(1) brightness(1);
}

.hack-home-stack-slide span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 18px;
  font-size: 14px;
  color: var(--bp-paper);
  background: linear-gradient(to top, rgba(14, 22, 38, 0.92), transparent);
  text-align: left;
}

.hack-home-stack-slide:focus-visible {
  outline: 2px solid var(--bp-cyan);
  outline-offset: -2px;
}

.hack-home-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.hack-home-carousel-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bp-panel-line);
  transition: background 0.15s ease, transform 0.15s ease;
}

.hack-home-carousel-dots span.active {
  background: var(--bp-cyan);
  transform: scale(1.3);
}

.hack-home-carousel-hint {
  margin: 12px 0 0;
  text-align: center;
  font-size: 13px;
  color: var(--bp-slate);
}

/* ---------------------------------- Actions / buttons --------------------------- */

.hack-home-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 8px;
}

.hackathon-page .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  padding: 14px 24px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
}

.hackathon-page .btn:active {
  transform: translateY(1px);
}

.hackathon-page .btn-primary {
  background: var(--blue-deep);
  color: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}

.hackathon-page .btn-primary:hover {
  background: #1d55d6;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}

.hackathon-page .btn-outline {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.hackathon-page .btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.6);
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.hackathon-page .btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

/* ---------------------------------- Overlays --------------------------- */

.hack-home-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 10, 18, 0.86);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.hack-home-overlay img {
  max-width: min(90vw, 960px);
  max-height: 85vh;
  border-radius: var(--bp-radius);
  border: 1px solid var(--bp-panel-line);
}

.hack-home-overlay-close {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bp-panel);
  border: 1px solid var(--bp-panel-line);
  border-radius: var(--bp-radius);
  color: var(--bp-paper);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.hack-home-overlay-close:hover {
  border-color: var(--bp-cyan);
  color: var(--bp-cyan);
}

/* ---------------------------------- Query modal --------------------------- */

.hack-home-modal {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: var(--bp-panel);
  border: 1px solid var(--bp-panel-line);
  border-radius: var(--bp-radius);
  padding: 36px 32px 28px;
}

.hack-home-modal h2 {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--text);
}

.hack-home-modal-sub {
  margin: 0 0 24px;
  font-size: 14px;
  color: var(--bp-slate);
}

.hackathon-page .hackathon-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--bp-paper);
  margin: 16px 0 6px;
}

.hackathon-label .req {
  color: var(--blue-light);
  font-weight: 500;
}

.hack-home-modal input,
.hack-home-modal textarea {
  width: 100%;
  background: var(--bp-navy);
  border: 1px solid var(--bp-panel-line);
  border-radius: var(--bp-radius);
  padding: 11px 13px;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--bp-paper);
  transition: border-color 0.15s ease;
}

.hack-home-modal input::placeholder,
.hack-home-modal textarea::placeholder {
  color: #7f8cb0;
}

.hack-home-modal input:focus,
.hack-home-modal textarea:focus {
  outline: none;
  border-color: var(--bp-cyan);
}

.hack-home-modal input.err,
.hack-home-modal textarea.err {
  border-color: var(--bp-danger);
}

.hack-home-modal textarea {
  resize: vertical;
  min-height: 90px;
}

.hackathon-err {
  font-size: 12.5px;
  color: var(--bp-danger);
  margin-top: 5px;
}

.hackathon-submit-error {
  font-size: 13px;
  color: var(--bp-danger);
  margin: 16px 0 0;
}

.hack-home-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 26px;
}

.hack-home-query-done h2 {
  font-family: var(--font-display);
  font-size: 22px;
  margin: 0 0 10px;
}

.hack-home-query-done p {
  color: var(--bp-slate);
  font-size: 14.5px;
  line-height: 1.6;
  margin: 0 0 24px;
}

/* ---------------------------------- Responsive --------------------------- */

@media (max-width: 860px) {
  .hack-home-guidelines,
  .hack-home-rounds,
  .hack-home-guide-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .hack-home-wrap {
    padding: 40px 18px 72px;
  }
  .hack-home-guidelines,
  .hack-home-rounds,
  .hack-home-guide-list {
    grid-template-columns: 1fr;
  }
  .hack-home-actions {
    flex-direction: column;
  }
  .hackathon-page .btn {
    justify-content: center;
    width: 100%;
  }
  .hack-home-modal {
    padding: 28px 20px 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hackathon-page * {
    transition: none !important;
    animation: none !important;
  }
}
            `}
          </style>
      <div className="hack-home-wrap">
        <header className="hackathon-header hack-home-header">
          <div className="hackathon-logo-badge">
            <img className="hackathon-logo" src={logo} alt={logoAlt} />
          </div>
          <div className="hackathon-kicker">
            <span className="dot" />
            {name} AI Hackathon
          </div>
          <h1>
            Build. Pitch. <span className="accent">Ship.</span>
          </h1>
          <div className="hackathon-sub">
            AdhigamAI Inter-College AI Hackathon. Read the student instructions, see past events, then register
            your team — or send us a question if anything is unclear.
          </div>
        </header>

        <section className="hack-home-section" aria-labelledby="hack-guidelines-title">
          <div className="hack-home-section-head">
            <div className="hackathon-kicker">
              <span className="dot" />
              Instructions to Students
            </div>
            <h2 id="hack-guidelines-title">Guidelines</h2>
            <p>
              The hackathon runs in two rounds. Only shortlisted teams from the online idea round join the
              physical hackathon at AdhigamAI Master Hub, Sri Sukhmani College, Dera Bassi.
            </p>
          </div>

          <div className="hack-home-rounds">
            {ROUNDS.map((round) => {
              const Icon = round.icon;
              return (
                <article key={round.kicker} className="hack-home-card">
                  <div className="hack-home-card-icon" aria-hidden>
                    <Icon size={20} />
                  </div>
                  <div className="hack-home-round-kicker">{round.kicker}</div>
                  <h3>{round.title}</h3>
                  <p>{round.text}</p>
                </article>
              );
            })}
          </div>

          <div className="hack-home-guide-list">
            {GUIDELINES.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.n} className="hack-home-card hack-home-guide">
                  <div className="hack-home-card-icon" aria-hidden>
                    <Icon size={20} />
                  </div>
                  <div className="hack-home-guide-n">{item.n}</div>
                  <h3>{item.title}</h3>
                  <ul>
                    {item.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section
          ref={eventsPinRef}
          className="hack-home-section hack-home-events-pin"
          aria-labelledby="hack-events-title"
          style={{ "--slides": PAST_EVENTS.length }}
        >
          <div className="hack-home-events-sticky">
            <div className="hack-home-section-head">
              <div className="hackathon-kicker">
                <span className="dot" />
                From the campus
              </div>
              <h2 id="hack-events-title">Previous events</h2>
              <p>Scroll through earlier AI days, summits, and workshops.</p>
            </div>

            <div className="hack-home-carousel">
              <div className="hack-home-stack">
                {PAST_EVENTS.map((event, i) => (
                  <button
                    type="button"
                    className="hack-home-stack-slide"
                    key={event.src}
                    style={{
                      zIndex: i,
                      transform: `translateY(${i <= activeIndex ? "0%" : "100%"})`,
                    }}
                    onClick={() => setLightbox(event)}
                  >
                    <img src={event.src} alt={event.title} />
                    <span>{event.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hack-home-carousel-dots" aria-hidden="true">
              {PAST_EVENTS.map((event, i) => (
                <span key={event.src} className={activeIndex === i ? "active" : ""} />
              ))}
            </div>
            
          </div>
        </section>

        <div className="hack-home-actions">
          <button type="button" className="btn btn-outline" onClick={() => setQueryOpen(true)}>
            <MessageCircle size={16} />
            Have a query
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/hackathon/register");
            }}
          >
            Register now
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {lightbox ? (
        <div
          className="hack-home-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <button type="button" className="hack-home-overlay-close" aria-label="Close image" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <img src={lightbox.src} alt={lightbox.title} onClick={(e) => e.stopPropagation()} />
        </div>
      ) : null}

      {queryOpen ? (
        <div className="hack-home-overlay" role="dialog" aria-modal="true" aria-labelledby="hack-query-title" onClick={closeQuery}>
          <div className="hack-home-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hack-home-overlay-close" aria-label="Close query form" onClick={closeQuery}>
              <X size={18} />
            </button>
            {querySent ? (
              <div className="hack-home-query-done">
                <h2 id="hack-query-title">Query received</h2>
                <p>Thanks, {query.name.trim()}. We'll get back to you at {query.email.trim()} shortly.</p>
                <button type="button" className="btn btn-primary" onClick={closeQuery}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitQuery} noValidate>
                <h2 id="hack-query-title">Have a query</h2>
                <p className="hack-home-modal-sub">Ask anything about eligibility, teams, or the pitch format.</p>
                <label className="hackathon-label" htmlFor="hack-query-name">
                  Name <span className="req">*</span>
                </label>
                <input
                  id="hack-query-name"
                  type="text"
                  className={queryErrors.name ? "err" : ""}
                  value={query.name}
                  onChange={(e) => setQuery((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
                {queryErrors.name ? <div className="hackathon-err">{queryErrors.name}</div> : null}
                <label className="hackathon-label" htmlFor="hack-query-email">
                  Email <span className="req">*</span>
                </label>
                <input
                  id="hack-query-email"
                  type="email"
                  className={queryErrors.email ? "err" : ""}
                  value={query.email}
                  onChange={(e) => setQuery((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@email.com"
                />
                {queryErrors.email ? <div className="hackathon-err">{queryErrors.email}</div> : null}
                <label className="hackathon-label" htmlFor="hack-query-message">
                  Question <span className="req">*</span>
                </label>
                <textarea
                  id="hack-query-message"
                  className={queryErrors.message ? "err" : ""}
                  value={query.message}
                  onChange={(e) => setQuery((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="How can we help?"
                  rows={4}
                />
                {queryErrors.message ? <div className="hackathon-err">{queryErrors.message}</div> : null}
                {queryError ? <p className="hackathon-submit-error">{queryError}</p> : null}
                <div className="hack-home-modal-actions">
                  <button type="button" className="btn btn-outline" onClick={closeQuery} disabled={querySubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={querySubmitting}>
                    {querySubmitting ? "Sending…" : "Send query"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomePage;