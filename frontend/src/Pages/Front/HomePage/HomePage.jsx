import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FrontLayout from "../../../Component/Layouts/Front/index";
import './HeroSection.css';
import { resolveMediaUrl } from "../../../utils/resolveMediaUrl";
import axios from "axios";
import moment from "moment";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import {Award,BarChart3,Bot,Brain,Briefcase,Building,Car,Check,Cloud,Code,Cpu,Droplet,Factory,FlaskConical,Glasses,Globe,Handshake,Mail,Image as ImageIcon,Laptop,Leaf,Lightbulb,LineChart,MapPin,Plane,Radio,Recycle,School, Settings2,Shield,Smartphone,Sparkles, MessageCircle,Sprout, Star, Sun,Target,Trees,TrendingUp,Tractor,User, Users,Wifi,Zap,} from "lucide-react";

const HERO_GIF = "/Assets/images/homepage/adhigamai.gif";
const HERO_LOADER_HOLD_MS = 1800;
const HERO_LOADER_SETTLE_MS = 1200;

function shouldPlayHeroLoader() {
  return false;
}

const CONTACT_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Puducherry",
];

function ContactSection() {
  const backendUrl = process.env.REACT_APP_MIPIE_BACKEND_URL;
  const [form, setForm] = useState({
    name: "",
    organization: "",
    state: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        `${backendUrl}/partner`,
        {
          name: form.name,
          organization: form.organization,
          state: form.state,
          mobile: form.mobile,
          email: form.email,
          message: form.message,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        setForm({ name: "", organization: "", state: "", mobile: "", email: "", message: "" });
        setSuccess("Thank you! Our team will contact you shortly.");
      }
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact" aria-label="Contact Us">
      <div className="contact-inner">
        <div className="contact-head">
          <div className="contact-eyebrow">Get in Touch</div>
          <h2 className="contact-title">
            Contact <span className="accent">Us</span>
          </h2>
          <p className="contact-lead">
            Have a question about bringing AI, Robotics &amp; IoT to your school? Send us a message — we typically respond within 1–2 business days.
          </p>
        </div>

        <div className="contact-grid">
          <aside className="contact-info">
            <div className="contact-info-card">
              <span className="contact-info-ico" aria-hidden>
                <Mail size={20} strokeWidth={2} />
              </span>
              <div>
                <h3>Email</h3>
                <a href="mailto:info@adhigamai.com">info@adhigamai.in</a>
              </div>
            </div>
            {/* <div className="contact-info-card">
              <span className="contact-info-ico" aria-hidden>
                <Smartphone size={20} strokeWidth={2} />
              </span>
               <div>
                <h3>Phone</h3>
                <a href="tel:+918699011108">+91 86990 11108</a>
              </div> 
            </div> */}
            <div className="contact-info-card">
              <span className="contact-info-ico" aria-hidden>
                <MapPin size={20} strokeWidth={2} />
              </span>
              <div>
                <h3>Location</h3>
                <p>Zirakpur, Punjab, India</p>
              </div>
            </div>
            <div className="contact-info-card contact-info-card--note">
              <span className="contact-info-ico" aria-hidden>
                <MessageCircle size={20} strokeWidth={2} />
              </span>
              <div>
                <h3>Partnerships</h3>
                <p>Schools, colleges &amp; education partners welcome.</p>
              </div>
            </div>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <label className="contact-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </label>
              <label className="contact-field">
                <span>Organization</span>
                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="School / institution"
                />
              </label>
            </div>
            <div className="contact-form-row">
              <label className="contact-field">
                <span>State</span>
                <select name="state" value={form.state} onChange={handleChange} required>
                  <option value="" disabled>
                    Select state
                  </option>
                  {CONTACT_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label className="contact-field">
                <span>Phone</span>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  placeholder="10-digit mobile"
                />
              </label>
            </div>
            <label className="contact-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
              />
            </label>
            <label className="contact-field">
              <span>Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell us about your school and how we can help"
              />
            </label>
            {error ? <p className="contact-form-status contact-form-status--error">{error}</p> : null}
            {success ? <p className="contact-form-status contact-form-status--success">{success}</p> : null}
            <button type="submit" className="btn btn-primary contact-submit" disabled={loading}>
              {loading ? "Sending…" : "Send Message →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  const [phase, setPhase] = useState(() => (shouldPlayHeroLoader() ? "intro" : "ready"));
  const flyerRef = useRef(null);
  const slotRef = useRef(null);

  useEffect(() => {
    if (!shouldPlayHeroLoader()) return undefined;

    document.body.classList.add("adhigam-gif-loader-active");
    document.body.style.overflow = "hidden";

    const settleTimer = window.setTimeout(() => {
      document.body.classList.remove("adhigam-gif-loader-active");
      document.body.classList.add("adhigam-gif-loader-settle");
      document.body.style.overflow = "";
      setPhase("settle");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const flyer = flyerRef.current;
          const slot = slotRef.current;
          if (!flyer || !slot) return;
          const from = flyer.getBoundingClientRect();
          const to = slot.getBoundingClientRect();
          const dx = to.left + to.width / 2 - (from.left + from.width / 2);
          const dy = to.top + to.height / 2 - (from.top + from.height / 2);
          const scale = Math.max(0.15, to.width / from.width);
          flyer.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        });
      });
    }, HERO_LOADER_HOLD_MS);

    const readyTimer = window.setTimeout(() => {
      setPhase("ready");
      document.body.classList.remove("adhigam-gif-loader-active");
      document.body.classList.remove("adhigam-gif-loader-settle");
      document.body.style.overflow = "";
    }, HERO_LOADER_HOLD_MS + HERO_LOADER_SETTLE_MS);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(readyTimer);
      document.body.classList.remove("adhigam-gif-loader-active");
      document.body.classList.remove("adhigam-gif-loader-settle");
      document.body.style.overflow = "";
    };
  }, []);

  const showFlyer = phase === "intro" || phase === "settle";

  return (
    <>
    <section className={`hero hero--${phase}`} aria-label="Hero">
      {showFlyer ? (
        <div className="hero-gif-loader" aria-hidden={phase !== "intro"}>
          <div className="hero-gif-loader-fly" ref={flyerRef}>
            <img src={HERO_GIF} alt="" className="hero-gif-loader-img" />
          </div>
        </div>
      ) : null}

      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">AI EDUCATION ECOSYSTEM</div>
          <h1>Empowering Every School with <span className="accent">Future Ready Skills</span></h1>
          <p className="lead">AdhigamAI (AI Education as a Service) is a platform providing AI, Robotics, and IoT technologies to schools through an affordable, scalable and technology-enabled ecosystem.</p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary">
              Contact Us →
            </a>
            <a href="#programs" className="btn btn-outline">Explore Technologies →</a>
          </div>
          <div className="feature-row">
            <div className="f"><span className="ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v5.5L4 20h16l-5-11.5V3"/><path d="M9 3h6"/></svg></span>Zero Lab Investment</div>
            <div className="f"><span className="ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>Industry Aligned Curriculum</div>
            <div className="f"><span className="ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><circle cx="19" cy="8" r="2.5"/></svg></span>Hands-on Learning</div>
            <div className="f"><span className="ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg></span>Technology Driven Execution</div>
          </div>
        </div>
        <div className="hero-visual">
          <div
            className={`ring-wrap${phase === "ready" ? " ring-wrap--visible" : " ring-wrap--slot"}`}
            ref={slotRef}
          >
            <img src={HERO_GIF} alt="AdhigamAI" />
          </div>
        </div>
      </div>
    </section>

{/* STAT BAR  */}
<div className="statbar-outer">
  <div className="statbar">
    <div className="wrap">
      <div className="stat">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg></span>
        <div><div className="num">14+</div><div className="label">Schools Onboarded</div></div>
      </div>
      <span className="stat-divider"></span>
      <div className="stat">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
        <div><div className="num">1000+</div><div className="label">Students Impacted</div></div>
      </div>
      <span className="stat-divider"></span>
      <div className="stat">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg></span>
        <div><div className="num">AI • Robotics • IoT</div><div className="label">Future Skills Education</div></div>
      </div>
      <span className="stat-divider"></span>
      <div className="stat">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg></span>
        <div><div className="num">Market Validated</div><div className="label">MVP</div></div>
      </div>
    </div>
  </div>
</div>

{/* ABOUT US */}
<section className="about-section" id="about" aria-label="About Us">
  <div className="about-inner">
    <div className="about-copy">
      <div className="about-eyebrow">About AdhigamAI</div>
      <h2 className="about-title">
        Building Future-Ready Schools with <span className="accent">AI Education</span>
      </h2>
      <p className="about-lead">
        AdhigamAI (AI Education as a Service) helps schools deliver AI, Robotics, and IoT learning through an affordable, scalable, and technology-enabled ecosystem — without heavy lab investment.
      </p>
      <p className="about-text">
        We combine industry-aligned curriculum, teacher enablement, hands-on kits, and a digital platform so every learner can build real skills for tomorrow.
      </p>
      <div className="about-ctas">
        <a href="#programs" className="btn btn-primary">Explore Technologies →</a>
        <a href="#contact" className="btn btn-outline about-btn-outline">Contact Us →</a>
      </div>
    </div>

    <div className="about-panels">
      <article className="about-panel">
        <span className="about-panel-ico" aria-hidden>
          <Target size={22} strokeWidth={2} />
        </span>
        <h3>Our Mission</h3>
        <p>Make future skills education accessible to every school through a simple subscription model.</p>
      </article>
      <article className="about-panel">
        <span className="about-panel-ico" aria-hidden>
          <Sparkles size={22} strokeWidth={2} />
        </span>
        <h3>Our Vision</h3>
        <p>Empower a generation of innovators ready for AI-driven careers and real-world problem solving.</p>
      </article>
      <article className="about-panel">
        <span className="about-panel-ico" aria-hidden>
          <School size={22} strokeWidth={2} />
        </span>
        <h3>What We Deliver</h3>
        <p>Curriculum, teacher training, kits, competitions, and outcome tracking — end to end.</p>
      </article>
      <article className="about-panel">
        <span className="about-panel-ico" aria-hidden>
          <Handshake size={22} strokeWidth={2} />
        </span>
        <h3>Who We Serve</h3>
        <p>Schools, educators, and partners building future-ready learning ecosystems across India.</p>
      </article>
    </div>
  </div>
</section>

{/* WHY SCHOOLS CHOOSE  */}
<section className="section" style={{ paddingTop: 96 }}>
  <div className="wrap">
    <h2 className="section-title">Why Schools Choose <span className="accent">AdhigamAI</span></h2>
    <div className="why-grid">
      <div className="why-card">
        <span className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg></span>
        <h3>AI Curriculum</h3>
        <p>Industry-aligned curriculum designed for K–12 learners.</p>
      </div>
      <div className="why-card">
        <span className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 21h8M12 16v5"/></svg></span>
        <h3>Teacher Training</h3>
        <p>Empowering educators through certification and hands-on support.</p>
      </div>
      <div className="why-card">
        <span className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="6" r="2"/><path d="M12 8v4l3 3M12 12l-3 3"/><path d="M6 21h12"/></svg></span>
        <h3>Hands-on Learning</h3>
        <p>Project-based learning with robotics and IoT kits.</p>
      </div>
      <div className="why-card">
        <span className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m7 12 3-3 3 2 4-5"/></svg></span>
        <h3>Technology Platform</h3>
        <p>Track implementation, progress and outcomes digitally.</p>
      </div>
      <div className="why-card">
        <span className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"/></svg></span>
        <h3>Events &amp; Competitions</h3>
        <p>AI Summits, Workshops, Hackathons and Student Clubs.</p>
      </div>
      <div className="why-card">
        <span className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h3.6a1.9 1.9 0 0 1 0 3.8H10a1.9 1.9 0 0 0 0 3.8h4"/></svg></span>
        <h3>Affordable Subscription</h3>
        <p>Future skills education starting from <span className="price">₹100 per student/month.</span></p>
      </div>
    </div>
  </div>
</section>

{/* <!-- TECHNOLOGIES WE OFFER --> */}
<section className="tech-section" id="programs">
  <div className="tech-inner">
    <div className="tech-title">Technologies We Offer</div>
    <div className="tech-grid">
      <div className="tech-card">
        <div className="tech-media ai">
          <img src="/Assets/images/homepage/ai.png" alt="Artificial Intelligence" />
        </div>
        <div className="tech-body">
          <h4>Artificial Intelligence</h4>
          <p>Explore the power of AI and Machine Learning.</p>
          <span className="tech-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </div>
      <div className="tech-card">
        <div className="tech-media">
          <img src="/Assets/images/homepage/robotics.png" alt="Robotics" />
        </div>
        <div className="tech-body">
          <h4>Robotics</h4>
          <p>Build, code and create intelligent robotic systems.</p>
          <span className="tech-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </div>
      <div className="tech-card">
        <div className="tech-media">
          <img src="/Assets/images/homepage/iot.png" alt="Internet of Things" />
        </div>
        <div className="tech-body">
          <h4>Internet of Things</h4>
          <p>Connect, automate and innovate with smart devices.</p>
          <span className="tech-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

{/* <!-- HOW IT WORKS --> */}
<section className="section">
  <div className="wrap">
    <div className="how-title">How It Works</div>
    <div className="how-steps">
      <div className="how-step">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg></span>
        <div className="label">Schools<br/>Partner</div>
      </div>
      <div className="how-arrow"></div>
      <div className="how-step">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 21h8M12 16v5"/></svg></span>
        <div className="label">Teacher<br/>Training</div>
      </div>
      <div className="how-arrow"></div>
      <div className="how-step">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg></span>
        <div className="label">Student<br/>Learning</div>
      </div>
      <div className="how-arrow"></div>
      <div className="how-step">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"/></svg></span>
        <div className="label">Projects &amp;<br/>Competitions</div>
      </div>
      <div className="how-arrow"></div>
      <div className="how-step">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></svg></span>
        <div className="label">Performance<br/>Analytics</div>
      </div>
      <div className="how-arrow"></div>
      <div className="how-step">
        <span className="circle"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 10-10-5-10 5 10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg></span>
        <div className="label">Future Ready<br/>Students</div>
      </div>
    </div>
  </div>
</section>

{/* <!-- CTA BANNER --> */} 
<section className="cta-banner" aria-label="Partner with AdhigamAI">
  <div className="cta-inner">
    <div className="cta-content">
      <h2>Bring <span className="accent">Future Skills</span> to Your School Today</h2>
      <p>Join schools across India and empower your students with AI, Robotics, IoT &amp; Future Skills education.</p>
      <div className="cta-ctas">
        <a href="#contact" className="btn btn-primary">
          Book a Workshop →
        </a>
        <button type="button" className="btn btn-dark-outline">
          Download Brochure ⬇
        </button>
      </div>
    </div>
  </div>
</section>

      <ContactSection />
    </>
  );
}




const HOME_HASH_SCROLL_OFFSET = 130;

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("skills");
  const [hoveredAreaItemIdx, setHoveredAreaItemIdx] = useState(null);
  const [activeGovtArea, setActiveGovtArea] = useState("mobilization");
  const [hoveredGovtAreaItemIdx, setHoveredGovtAreaItemIdx] = useState(null);
  const [events, setEvents] = useState([]);
  const [expiredEvents, setExpiredEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [uniqueSectors, setUniqueSectors] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [coursesError, setCoursesError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    mobile: "",
    email: "",
    message: "",
    courseName: "",
    sectorName: "",
    projectName: "",
    typeOfProject: "",
  });
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState("");
  const [callbackError, setCallbackError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobsError, setJobsError] = useState("");
  const bucketUrl = process.env.REACT_APP_MIPIE_BUCKET_URL;
  const backendUrl = process.env.REACT_APP_MIPIE_BACKEND_URL;
  
  /** Scroll down → CSR strip RTL (right-to-left); scroll up → LTR. Govt strip uses the opposite. */
  const [marqueeScrollDown, setMarqueeScrollDown] = useState(true);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  // const [focTheme, setFocTheme] = useState(getInitialFocHomeTheme);
  // const [themePanelOpen, setThemePanelOpen] = useState(false);
  // const themeFabRef = useRef(null);
  const courseCarouselRef = useRef(null);
  const jobCarouselRef = useRef(null);
  const eventsCarouselRef = useRef(null);
  const expiredEventsCarouselRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [feeFilter, setFeeFilter] = useState("all");
  
  const scrollCourseCarousel = (direction) => {
    const el = courseCarouselRef.current;
    if (!el) return;
    const step = Math.max(240, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollJobCarousel = (direction) => {
    const el = jobCarouselRef.current;
    if (!el) return;
    const step = Math.max(240, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollEventsCarousel = (direction) => {
    const el = eventsCarouselRef.current;
    if (!el) return;
    const step = Math.max(240, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollExpiredEventsCarousel = (direction) => {
    const el = expiredEventsCarouselRef.current;
    if (!el) return;
    const step = Math.max(240, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const getJobThumbnailUrl = (job) => {
    if (job?.jobVideoThumbnail) {
      return resolveMediaUrl(bucketUrl, job.jobVideoThumbnail);
    }
    if (job?.thumbnail) {
      if (bucketUrl && !job.thumbnail.startsWith("http://") && !job.thumbnail.startsWith("https://")) {
        const thumbPath = job.thumbnail.startsWith("/") ? job.thumbnail.slice(1) : job.thumbnail;
        return `${bucketUrl}/${thumbPath}`;
      }
      return job.thumbnail;
    }
    if (job?._company?.logo) {
      if (bucketUrl && !job._company.logo.startsWith("http://") && !job._company.logo.startsWith("https://")) {
        const logoPath = job._company.logo.startsWith("/") ? job._company.logo.slice(1) : job._company.logo;
        return `${bucketUrl}/${logoPath}`;
      }
      return job._company.logo;
    }
    return "/Assets/public_assets/images/newjoblisting/course_img.svg";
  };

  const handleShare = async (course, courseId, courseName) => {
    const courseUrl = `${window.location.origin}/coursedetails/${courseId}`;
    const detailText = course
      ? [course.duration && `Duration: ${course.duration}`, course.trainingMode && course.trainingMode, course.courseType === "coursejob" ? "Course + Jobs" : "Course"].filter(Boolean).join(" • ")
      : "";
    const shareText = detailText ? `${courseName} — ${detailText}` : `Check out this course: ${courseName}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: courseName, text: shareText, url: courseUrl });
        return;
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }

    navigator.clipboard?.writeText(`${shareText}\n${courseUrl}`).then(() => {
      alert("Course link copied! You can paste it anywhere.");
    });
  };

  const handleCourseShare = (course) => {
    handleShare(course, course._id, course.name);
  };

  const handleCourseRequestCallback = (course) => {
    setFormData((prev) => ({
      ...prev,
      courseName: course.name ?? "",
      sectorName: course.sectorNames ?? "",
      projectName: course.projectName ?? "",
      typeOfProject: course.typeOfProject ?? "",
    }));
  };

  const handleShareJob = async (jobId, jobTitle) => {
    const jobUrl = `${window.location.origin}/jobdetailsmore/${jobId}`;
    const shareText = jobTitle ? `Check out this job: ${jobTitle}` : "Check out this job";
    if (navigator.share) {
      try {
        await navigator.share({ title: jobTitle || "Job", text: shareText, url: jobUrl });
        return;
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
    navigator.clipboard?.writeText(`${shareText}\n${jobUrl}`).then(() => {
      alert("Job link copied! You can paste it anywhere.");
    });
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (delta > 4) setMarqueeScrollDown(true);
      else if (delta < -4) setMarqueeScrollDown(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // useEffect(() => {
  //   const root = document.documentElement;
  //   root.setAttribute("data-foc-theme", FOC_HOME_THEME);
  //   root.style.setProperty("--front-layout-bg", "var(--bg)");
  //   try {
  //     window.localStorage.setItem(FOC_HOME_THEME_STORAGE_KEY, FOC_HOME_THEME);
  //   } catch {
  //     /* ignore */
  //   }
  //   return () => {
  //     root.removeAttribute("data-foc-theme");
  //     root.style.removeProperty("--front-layout-bg");
  //   };
  // }, []);

  /* Theme picker panel (disabled)
  useEffect(() => {
    if (!themePanelOpen) return undefined;
    ...
  }, [themePanelOpen]);
  */

  useEffect(() => {
    setHoveredAreaItemIdx(null);
  }, [activeArea]);

  useEffect(() => {
    setHoveredGovtAreaItemIdx(null);
  }, [activeGovtArea]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setCoursesError("");
        let response;
        try {
          response = await axios.get(`${backendUrl}/courses`);
        } catch (error) {
          response = await axios.get("/courses");
        }

        setCourses(Array.isArray(response.data.courses) ? response.data.courses : []);
        setUniqueSectors(Array.isArray(response.data.uniqueSectors) ? response.data.uniqueSectors : []);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCoursesError("Failed to load courses.");
        setCourses([]);
        setUniqueSectors([]);
      }
    };
    fetchData();
  }, [backendUrl]);
  const getFilteredCourses = () => {
    if (!Array.isArray(courses)) return [];
    // Start with all courses
    let filtered = [...courses];

    // Then filter by sector if not "all"
    if (activeFilter !== "all") {
      const sectorId = activeFilter.replace("id_", "");
      console.log("Filtering by sector ID:", sectorId);

      filtered = filtered.filter(course => {
        if (!course.sectors || !Array.isArray(course.sectors)) {
          return false;
        }

        const hasMatchingSector = course.sectors.some(s => s && s.toString() === sectorId);
        return hasMatchingSector;
      });

      console.log("After sector filter, courses count:", filtered.length);
    }

    // Then filter by search term if it exists
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      // console.log("Filtering by search term:", term);

      filtered = filtered.filter(course => {
        const nameMatch = course.name && course.name?.toLowerCase().includes(term);
        const qualificationMatch = course.qualification && course.qualification?.toLowerCase().includes(term);
        const durationMatch = course.duration && course.duration?.toLowerCase().includes(term);
        const cityMatch = course.city && course.city?.toLowerCase().includes(term);
        const stateMatch = course.state && course.state?.toLowerCase().includes(term);
        const modeMatch = course.trainingMode && course.trainingMode?.toLowerCase().includes(term);
        const typeMatch = course.courseType && course.courseType?.toLowerCase().includes(term);
        const sectorMatch = course.sectorNames && course.sectorNames?.some(name =>
          name.toLowerCase().includes(term)
        );

        return nameMatch || qualificationMatch || durationMatch || cityMatch ||
          stateMatch || modeMatch || typeMatch || sectorMatch;
      });

      console.log("After search filter, courses count:", filtered.length);
    }
    // ✅ Filter by Fee Type (Paid/Free)
    if (feeFilter !== "all") {
      filtered = filtered.filter(course => course.courseFeeType?.toLowerCase() === feeFilter);
    }

    console.log("Final filtered courses count:", filtered.length);
    return filtered;
  };


  const filteredCourses = getFilteredCourses();
  console.log("filteredCourses",filteredCourses)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setJobsError("");
        let response;
        try {
          response = await axios.get(`${backendUrl}/joblisting`);
        } catch (err) {
          response = await axios.get("/joblisting");
        }
        setJobs(Array.isArray(response.data.recentJobs) ? response.data.recentJobs : []);
        console.log("Response", response.data.recentJobs);
      } catch (error) {
        console.error("Error fetching job listing:", error);
        setJobsError("Failed to load jobs.");
        setJobs([]);
      }
    };
    fetchData();
  }, [backendUrl]);

  useEffect(() => {
    const videoModal = document.getElementById("videoModal");
    if (videoModal) {
      videoModal.addEventListener("hidden.bs.modal", () => {
        setVideoSrc(""); // ✅ Resets video when modal is fully closed
      });
    }
    return () => {
      if (videoModal) {
        videoModal.removeEventListener("hidden.bs.modal", () => setVideoSrc(""));
      }
    };
  }, []);

  const checkRegistrationStatus = (eventDate) => {
    const today = moment();
    const eventEndDate = moment(eventDate);
    return eventEndDate.isBefore(today);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/event`);
        const all = response.data.events ?? [];
        setEvents(all.filter((e) => !checkRegistrationStatus(e.timing?.to)));
        setExpiredEvents(all.filter((e) => checkRegistrationStatus(e.timing?.to)));

      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };
    fetchData();
  }, []);


  const scrollToCoreArea = (areaKey) => {
    if (areaKey) setActiveArea(areaKey);
    scrollToSection("core");
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HOME_HASH_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return undefined;
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - HOME_HASH_SCROLL_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 200);
    return () => clearTimeout(timer);
  }, [location.hash]);



  return (
    <FrontLayout>
      <div className="foc-cyber-home hp-theme">
       
        <HeroSection />

  
      

<style>
          {
            `
            .video-fluid {
    width: 100%;
}
            
.bg-img {
    position: relative;
    border-radius: 11px;
    border: 1px solid var(--foc-color-surface);
    box-shadow: rgb(227, 59, 22, 77%) 0px 0px 0.25em, rgba(24, 86, 201, 0.05) 0px 0.25em 1em;
}
img.group1 {
    width: 75px !important;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.course_card_footer img {
    width: 20px;
}
.courses_features p {
    line-height: normal;
    font-size: 16px;
}
.color-yellow {
    color: #FFD542;
}
.btn.shr--width{
  width: 100%;
}
.foc-cyber-home #future-courses .btn.cta-callnow,
.foc-cyber-home #future-jobs .btn.cta-callnow {
    width: 100%;
    letter-spacing: 0.02em;
}
.foc-cyber-home #future-courses .learnn,
.foc-cyber-home #future-jobs .learnn {
  padding: 4px 0;
}
.foc-cyber-home #future-courses .course_card_footer,
.foc-cyber-home #future-jobs .course_card_footer {
    background: var(--home-card-cta, var(--foc-navy-deep, #0d2146));
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.jobs h1 {
    color: var(--foc-color-cta);
    font-size: 45px;
    font-weight: 700;
    font-family: var(--foc-font-display);
}

.courseCard{
  border-radius: 12px!important;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}
video#courseVid {
    width: 100%;
    height: 100%;
    border-radius: 6px;
}
.smallText{
  color: var(--foc-color-text-inverse);
  background-color: var(--foc-color-cta)!important;
}
button.close {
    z-index: 9;
    background: var(--foc-color-surface);
    border: 2px solid var(--foc-color-cta) !important;
    font-size: 19px;
    border-radius: 100px;
    height: 38px;
    opacity: 1;
    padding: 0;
    position: absolute;
    right: -13px;
    top: -12px;
    width: 38px;
    -webkit-appearance: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-weight: 400;
    transition: .3s;
    font-weight: 900;
}
button.close span {
    font-size: 30px;
    line-height: 30px;
    color: var(--foc-color-cta);
    font-weight: 400;
}
.sector--select{
  display: flex;
  align-items: center;

}

@media only screen and (max-width: 1199px) {
    .card {
        width: 100%;
    }
    .card-padd {
        display: flex
;
        justify-content: center;
        padding-left: 0 !important;
    }
}
@media only screen and (max-width: 768px) {
.sector--select{
  display: none;
}
  .jobs-heading {
        font-size: 30px !important;
    }
    .card {
        width: 95% !important;
    }
    
    .jobs-heading {
        font-size: 22px;
    }
}
@media only screen and (max-width: 700px) {
    .card {
        width: 95% !important;
    }
}
@media (max-width: 578px) {
 
    .jobs-heading {
        font-size: 27px !important;
    }
}
@media (max-width: 432px) {
    .jobs-heading {
        font-size: 25px !important;
    }
}
@media (max-width: 392px) {
   
    .courses_features p{
        font-size: 14px;
    }
}
@media (max-width: 375px) {
   
    
}


/* Course.css */

/* Filter Styles */
.filter-container {
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
  
  .filter-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: var(--foc-gray-500);
    font-weight: 500;
  }
  
  .filter-buttonss {
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    gap: 12px;
    /* scrollbar-width: none; */
    /* -ms-overflow-style: none; */
    padding-bottom: 8px;
  } 
  /* .filter-buttons{
    
    scrollbar-width: 1px;
    -ms-overflow-style: none;
    padding-bottom: 8px;

    
  } */
  
 
  /* .filter-buttons::-webkit-scrollbar {
    display: none;
  } */
  .filter-button {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: var(--foc-radius-xl);
    font-weight: 500;
    border: 1px solid var(--foc-color-border-ui);
    background: white;
    color: var(--foc-color-text-strong);
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  
  .filter-button:hover {
    border-color: var(--foc-pink-500);
  }
  
  .filter-button.active {
    background: var(--foc-pink-500);
    color: white;
    transform: scale(1.05);
  }
  
  .count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 12px;
    border-radius: 50%;
    background: var(--foc-chip-bg);
    color: var(--foc-color-text-strong);
  }
  .verified-badge-container {
    position: relative;
    display: inline-block;
}
    .wave-ring {
    position: absolute;
    top: 0%;
    left: 100%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px solid rgba(76, 175, 80, 0.6);
    width: 60px;
    height: 60px;
    pointer-events: none;
    z-index: 1001;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
    animation: wave-expand 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}
.wave-ring.wave-1 {
    animation-delay: 0s;
    border-color: rgba(76, 175, 80, 0.6);
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
}
.wave-ring.wave-2 {
    animation-delay: 0.7s;
    border-color: rgba(76, 175, 80, 0.4);
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}
.wave-ring.wave-3 {
    animation-delay: 1.4s;
    border-color: rgba(76, 175, 80, 0.3);
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.2);
}
.verified-badge {
    width: 50% !important;
    height: 50% !important;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    z-index: 1002;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(76, 175, 80, 0.5);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
    object-fit: cover;
    right: -41px;
    top: -10px;
    transform-origin: center center;
}
 @keyframes wave-expand {
    0% {
      width: 60px;
      height: 60px;
      opacity: 0.7;
      transform: translate(-50%, -50%) scale(1);
      border-width: 2px;
    }
    100% {
      width: 60px;
      height: 60px;
      opacity: 0;
      transform: translate(-50%, -50%) scale(3);
      border-width: 1px;
    }
  }
    @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 
        0 8px 32px rgba(236, 72, 153, 0.5),
        0 0 0 0 rgba(236, 72, 153, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    50% {
      box-shadow: 
        0 12px 40px rgba(58, 52, 55, 0.7),
        0 0 0 8px rgba(236, 72, 153, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  }
  .filter-button.active .count {
    background: var(--foc-magenta-deep);
    color: white;
  }
  
  .active-indicator {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: var(--foc-pink-500);
  }
  
  /* Course Card Styles */
  .courseCard {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease;
    /* height: 100%; */
  }
  
  .courseCard:hover {
    transform: translateY(-5px);
  }
  
  .bg-img {
    position: relative;
    overflow: hidden;
  }
  
  .bg-img img.digi {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
    
  .group1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    opacity: 0.8;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .bg-img:hover .group1 {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .para_ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .courses_features {
    font-size: 0.85rem;
  }
  
  .sub_head {
    opacity: 0.8;
    font-size: 0.75rem;
  }
  
  .color-yellow {
    color: #ffc107;
  }
  
  
  .btn-bg-color {
    background-color: var(--foc-pink-500);
    color: white;
    border: none;
  }
  
  .btn-bg-color:hover {
    background-color: var(--foc-magenta-deep);
    color: white;
  }
  
  .cta-callnow {
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .cta-callnow:hover {
    transform: translateY(-2px);
  }
  
  /* Section Styles */
  .section-padding-60 {
    padding: 60px 0;
  }
  
  .jobs-heading {
    color: #333;
    font-weight: 700;
    position: relative;
  }
  .search-container{
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 5px;
    top: 8px;
    font-size: 16px;
  }
  /* .jobs-heading:after {
    content: '';
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: var(--foc-pink-500);
    border-radius: 2px;
  }
   */
  /* Modal Styles */
  .modal-content {
    border: none;
    border-radius: 12px;
    /* overflow: hidden; */
  }
  
  .modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .submit_btn {
    background-color: var(--foc-pink-500);
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .submit_btn:hover {
    background-color: var(--foc-magenta-deep);
  }
.new_img{
    width: 20px!important;
}
.apply_date{
    font-size: 16px;
}

#callbackForm input , #callbackForm select{
  background-color: transparent;
  padding: 7px 12px;
  border: 1px solid ;
  height: 37px;
}
#callbackForm textarea{
  margin-bottom: 20px;
  border: 1px solid ;
}
#callbackForm button{
  border: 1px solid var(--foc-color-cta);
  transition: 0.4s ease-in-out;
}
#callbackForm button:hover{
  border: 1px solid var(--foc-color-cta);
  color: var(--foc-color-cta);
  font-weight: bold;
  background: transparent!important;
  scale: 1.1;
}

.newWidth{
  width: 30%!important;
}
.shadow-new{
  right: 0px!important;
}
  .btn-close {
  --bs-btn-close-bg: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23fff%27%3e%3cpath d=%27M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414%27/%3e%3c/svg%3e");
}

@media (max-width:992px){
  .newWidth{
    width: 100%!important;
  }
}
@media (max-width:768px){
  .bg-img img.digi {
    object-fit: fill;
  }
}

.foc-cyber-home #future-jobs .future-jobs-row {
  row-gap: 6px;
}

.foc-cyber-home #future-jobs .card-padd {
  display: flex;
}

.foc-cyber-home #future-jobs .job-live-card {
  width: 100% !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.16) !important;
  border-radius: 14px !important;
  background:
    linear-gradient(180deg, rgba(28,31,43,.98), rgba(16,18,28,.98)) !important;
  box-shadow: 0 18px 48px rgba(15, 23, 42, .16);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}

.foc-cyber-home #future-jobs .job-live-card:hover {
  transform: translateY(-6px);
  border-color: rgba(252,43,90,.46) !important;
  box-shadow: 0 24px 56px rgba(15, 23, 42, .24);
}

.foc-cyber-home #future-jobs .job-live-card .bg-img {
  // margin: 12px 12px 0;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255,255,255,.20);
  border-radius: 12px;
  box-shadow: none;
  background: #101827;
}

.foc-cyber-home #future-jobs .job-live-card .bg-img a,
.foc-cyber-home #future-jobs .job-live-card .bg-img img.digi {
  display: block;
  width: 100%;
  height: 100%;
}

.foc-cyber-home #future-jobs .job-live-card .bg-img img.digi {
  object-fit: cover;
}

.foc-cyber-home #future-jobs .job-live-card img.group1 {
  width: 58px !important;
  filter: drop-shadow(0 8px 18px rgba(0,0,0,.45));
}

.foc-cyber-home #future-jobs .job-live-card .verified-badge-container {
  top: 8px !important;
  right: 8px !important;
  transform: scale(.82);
  transform-origin: top right;
}

.foc-cyber-home #future-jobs .job-live-card .right_obj {
  top: 16px;
  right: 12px !important;
  border-radius: 999px;
  border: 1px solid rgba(255,213,66,.72);
  outline: 0;
  padding: 5px 12px;
  font-size: 11px;
  line-height: 1;
  letter-spacing: .02em;
  background: rgba(255,255,255,.95);
}

.foc-cyber-home #future-jobs .job-live-card .card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.foc-cyber-home #future-jobs .job-live-card .course-title,
.foc-cyber-home #future-courses .course-carousel-item .course-card-title {
  display: block;
  width: 100%;
  max-width: 100%;
  margin-bottom: 6px;
  font-family: var(--foc-font-sans) !important;
  font-size: clamp(19px, 2vw, 23px) !important;
  font-weight: 700 !important;
  line-height: 1.18;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.foc-cyber-home #future-jobs .job-live-card .job-qualification-text,
.foc-cyber-home #future-courses .course-carousel-item .course-qualification-text {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 0;
  font-family: var(--foc-font-sans) !important;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.88) !important;
}

.foc-cyber-home #future-jobs .job-live-card .courses_features,
.foc-cyber-home #future-courses .course-carousel-item .courses_features {
  min-width: 0;
}

.foc-cyber-home #future-jobs .ellipsis-wrapper,
.foc-cyber-home #future-courses .ellipsis-wrapper {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.foc-cyber-home #future-jobs .job-live-card .companyname {
  max-width: 100%;
  min-height: 20px;
  color: rgba(255,255,255,.74) !important;
  font-size: 14px;
  font-weight: 600;
}

.foc-cyber-home #future-jobs .job-live-card .digi-price {
  margin: 10px 0 14px !important;
}

.foc-cyber-home #future-jobs .job-live-card .r-price,
.foc-cyber-home #future-jobs .job-live-card .rupee {
  font-size: 18px;
  font-weight: 800;
}

.foc-cyber-home #future-jobs .job-detail-wrap {
  width: 100%;
  max-width: 100%;
  flex: 1;
}

.foc-cyber-home #future-jobs .job-meta-grid {
  margin-left: -5px;
  margin-right: -5px;
}

.foc-cyber-home #future-jobs .job-feature {
  padding-left: 5px;
  padding-right: 5px;
}

.foc-cyber-home #future-jobs .job-feature > .row {
  height: 100%;
  min-height: 42px;
  align-items: center;
  margin: 0;
  padding: 8px 6px;
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 10px;
  background: rgba(255,255,255,.055);
}

.foc-cyber-home #future-jobs .job-feature figure {
  margin: 0;
}

.foc-cyber-home #future-jobs .job-feature .new_img {
  width: 18px !important;
  max-height: 18px;
  object-fit: contain;
}

.foc-cyber-home #future-jobs .job-feature .courses_features p {
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  line-height: 1.25;
  color: rgba(255,255,255,.88) !important;
}

.foc-cyber-home #future-jobs .job-deadline {
  margin-top: 2px;
}

.foc-cyber-home #future-jobs .job-deadline > .row {
  align-items: center;
  margin: 0;
  padding: 9px 10px;
  border-radius: 10px;
  background: rgba(252,43,90,.12);
}

.foc-cyber-home #future-jobs .job-deadline p {
  margin: 0;
}

.foc-cyber-home #future-jobs .apply_date {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,.78) !important;
}

.foc-cyber-home #future-jobs .job-action {
  padding-left: 5px;
  padding-right: 5px;
}

.foc-cyber-home #future-jobs .job-action .btn.cta-callnow {
  width: 100% !important;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border: 1px solid var(--home-card-cta, var(--foc-navy-deep, #0d2146));
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.foc-cyber-home #future-jobs .job-action .btn-bg-color {
  background: var(--home-card-cta, var(--foc-navy-deep, #0d2146)) !important;
  color: var(--foc-color-text-inverse) !important;
}

.foc-cyber-home #future-jobs .job-action .btn.cta-callnow:not(.btn-bg-color) {
  background: rgba(255,255,255,.96);
  color: var(--home-card-cta, var(--foc-navy-deep, #0d2146)) !important;
}

.foc-cyber-home #future-jobs .course_card_footer a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-decoration: none;
}

.foc-cyber-home #future-jobs .course_card_footer .learnn {
  padding: 4px 0;
  font-weight: 700;
  letter-spacing: .03em;
}

@media (max-width: 575.98px) {
  .foc-cyber-home #future-jobs .card-padd {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  // .foc-cyber-home #future-jobs .job-live-card .card-body {
  //   padding-left: 14px !important;
  //   padding-right: 14px !important;
  // }

  .foc-cyber-home #future-jobs .job-live-card .course-title,
  .foc-cyber-home #future-courses .course-carousel-item .course-card-title {
    font-size: 20px !important;
  }

  .foc-cyber-home #future-jobs .job-feature > .row {
    min-height: 40px;
    padding: 7px 4px;
  }

  .foc-cyber-home #future-jobs .job-feature .courses_features p,
  .foc-cyber-home #future-jobs .apply_date {
    font-size: 12px;
  }
}
}

          .op-Reg{
    color: var(--foc-color-text-inverse);
}
.flag{
    position: absolute;
    top: 2px;
    left: 10px;
}
.flag h4{
  font-size: 15px;
}
.share-Event{
    position: absolute;
    top: 5px;
    right: 10px;
}
.openRegistration{
    position: absolute;
    bottom: 20px;
    text-align: center;
    color: var(--foc-color-text-inverse);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
}
.op-Reg-p{
    color: var(--foc-color-text-inverse);
    font-weight: 500;
    font-size: 16px;
}

/* From Uiverse.io by Mohammad-Rahme-576 */ 
/* Container Styles */
.share-Event .tooltip-container {
    position: relative;
    display: inline-block;
    font-family: var(--foc-font-display);
    overflow: visible;
  }
  
  /* Button Styles */
 .share-Event  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    padding: 5px 10px;
    border-radius: 50px;
    cursor: pointer;
    transition:
      background 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      transform 0.3s ease,
      box-shadow 0.4s ease;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
    overflow: hidden;
  }
  
 .share-Event  .button-content::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(110, 142, 251, 0.4),
      rgba(167, 119, 227, 0.4)
    );
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: -1;
  }
  
  .share-Event .button-content::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.6s ease-out;
    z-index: -1;
  }
  
  .share-Event .button-content:hover::before {
    opacity: 1;
  }
  
  .share-Event .button-content:hover::after {
    transform: scale(1);
  }
  
  .share-Event .button-content:hover {
    background: linear-gradient(135deg, #a777e3, #6e8efb);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-4px) scale(1.03);
  }
  
  .share-Event .button-content:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
  
  .share-Event .text {
    font-size: 13px;
    font-weight: 600;
    margin-right: 2px;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: letter-spacing 0.3s ease;
  }
  
  .share-Event .button-content:hover .text {
    letter-spacing: 1px;
  }
  
  .share-Event .share-icon {
    fill: white;
    transition:
      transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      fill 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
  
  .share-Event .button-content:hover .share-icon {
    transform: rotate(180deg) scale(1.1);
    fill: var(--foc-color-surface);
  }
  
  /* Tooltip Styles */
  /* .share-Event .tooltip-content {
    position: absolute;
    top: 71%;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    background: white;
    border-radius: 15px;
    padding: 22px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      visibility 0.5s ease;
    z-index: 100;
    pointer-events: none;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  } */
  
  .share-Event .tooltip-content {
    position: absolute;
    top: 71%;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 22px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transition: 
      opacity 0.4s ease,
      transform 0.4s ease,
      visibility 0.4s;
    pointer-events: none;
    z-index: 100;
  }
  
  .share-Event .tooltip-container:hover .tooltip-content {
    opacity: 1;
    visibility: visible;
    left: 0;
    transform: translateX(-50%) scale(0.8);
    pointer-events: auto;
    transition-delay: 0s;
  }
  .share-Event .tooltip-content {
    transition:  opacity 0.4s ease,
    visibility 0.4s;
    transition-delay: 0s;
  }
  /* Social Icons Styles */
  .share-Event .social-icons {
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
  
  .share-Event .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f0f0f0;
    transition:
      transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      background 0.3s ease,
      box-shadow 0.4s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .share-Event .social-icon::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .share-Event .social-icon:hover::before {
    opacity: 1;
  }
  
  .share-Event .social-icon svg {
    width: 24px;
    height: 24px;
    fill: #333;
    transition:
      transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      fill 0.3s ease;
    z-index: 1;
  }
  
  .share-Event .social-icon:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .share-Event .social-icon:active {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  .share-Event .social-icon:hover svg {
    transform: scale(1.2);
    fill: white;
  }
  
  .share-Event .social-icon.twitter:hover {
    background: linear-gradient(135deg, #1da1f2, #1a91da);
  }
  
  .share-Event .social-icon.facebook:hover {
    background: linear-gradient(135deg, #1877f2, #165ed0);
  }
  
  .share-Event .social-icon.linkedin:hover {
    background: linear-gradient(135deg, #0077b5, #005e94);
  }
  
  /* Animation for Pulse Effect */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(110, 142, 251, 0.4);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(110, 142, 251, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(110, 142, 251, 0);
    }
  }
  
  .share-Event .button-content {
    animation: pulse 3s infinite;
  }
  
  /* Hover Ripple Effect */
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .share-Event .button-content::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: inherit;
    transform: scale(0);
    opacity: 0;
  }
  
  .share-Event .button-content:active::before {
    animation: ripple 0.6s linear;
  }
  
  /* Tooltip Arrow */
  .share-Event .tooltip-content::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent rgba(255, 255, 255, 0.9) transparent;
    filter: drop-shadow(0 -3px 3px rgba(0, 0, 0, 0.1));
  }
  
  /* Accessibility */
  .share-Event .button-content:focus {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(110, 142, 251, 0.5),
      0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  .share-Event .button-content:focus:not(:focus-visible) {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .share-Event .button-content {
      padding: 12px 24px;
      border-radius: 40px;
    }
  
    .text {
      font-size: 16px;
    }
  
    .share-Event .tooltip-content {
      width: 240px;
      padding: 18px;
    }
  
    .share-Event .social-icon {
      width: 44px;
      height: 44px;
    }
  
    .share-Event .social-icon svg {
      width: 20px;
      height: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .share-Event .button-content {
      padding: 10px 20px;
    }
  
    .share-Event .text {
      font-size: 14px;
    }
  
    .share-Event .tooltip-content {
      width: 200px;
      padding: 15px;
    }
  
    .share-Event .social-icon {
      width: 40px;
      height: 40px;
    }
  
    .share-Event .social-icon svg {
      width: 18px;
      height: 18px;
    }
  }
  
  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .share-Event .tooltip-content {
      background: rgba(30, 30, 30, 0.9);
      color: white;
    }
  
    .share-Event .tooltip-content::before {
      border-color: transparent transparent rgba(30, 30, 30, 0.9) transparent;
    }
  
    .share-Event .social-icon {
      background: #2a2a2a;
    }
  
    .share-Event .social-icon svg {
      fill: #e0e0e0;
    }
  }
  
  /* Print Styles */
  @media print {
    .share-Event .tooltip-container {
      display: none;
    }
  }
  
  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .share-Event .button-content,
    .share-Event .share-icon,
    .share-Event .social-icon,
    .share-Event .tooltip-content {
      transition: none;
    }
  
    .share-Event .button-content {
      animation: none;
    }
  }
  
  /* Custom Scrollbar for Tooltip Content */
  .share-Event .tooltip-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .share-Event .tooltip-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .share-Event .tooltip-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .share-Event .tooltip-content::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
        
`
          }
        </style>

<style>
  {

    `
    
.modal-width{
width:25rem;
height:15rem;
}
.shadow {
    box-shadow: 0 .5rem 1rem #00000026 !important;
    box-shadow: var(--bs-box-shadow) !important;
}
.right_obj {
    background: var(--foc-color-surface);
    border: 1px dashed var(--foc-gold);
    border-bottom-left-radius: 15px;
    border-right: 0;
    box-shadow: .5px 0 2px #0000004d;
    color: var(--foc-color-cta);
    font-family: var(--foc-font-display);
    font-weight: 700;
    outline: 3px solid #fff;
    padding: 2px 10px;
    position: absolute;
    right: 17px;
    top: 30px;
    width: -webkit-fit-content;
    width: fit-content;
    z-index: 1;
}
    .modal-header {
  background-color: var(--foc-color-cta);
  border-bottom: none;
}
    
    `
  }
</style>
<style>
{
  `
  .w{width:100%;font-family:var(--foc-font-display);color:var(--color-text-primary)}

.hero{background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1.5rem;margin-bottom:1.25rem}
.hero-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;padding:3px 10px;border-radius:999px;margin-bottom:.75rem;background:var(--color-background-success);color:var(--color-text-success)}
.hero-grid{display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center}
.hero-h{font-size:22px;font-weight:500;line-height:1.2;margin-bottom:.4rem}
.hero-h span{color:var(--foc-brand-deep)}
.hero-sub{font-size:13px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:.9rem;max-width:500px}
.tpills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem}
.tp{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);font-size:12px}
.tp i{font-size:13px}
.hbtns{display:flex;gap:8px;flex-wrap:wrap}
.bp{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;background:var(--foc-brand-deep);color:#EEEDFE;border:none;border-radius:var(--border-radius-md);font-size:12px;font-weight:500;cursor:pointer}
.bg{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;background:transparent;color:var(--color-text-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);font-size:12px;cursor:pointer}
.hex-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.hex{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:10px 8px;text-align:center}
.hex i{font-size:20px;display:block;margin-bottom:3px}
.hex-lbl{font-size:10px;font-weight:500;color:var(--color-text-secondary)}


.inst-tabs{display:flex;gap:8px;margin-bottom:1.25rem}
.itb{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-lg);font-family:var(--foc-font-sans);font-size:13px;font-weight:500;color:var(--color-text-secondary);cursor:pointer;background:var(--color-background-primary);transition:all .15s}
.itb.on{border-color:var(--foc-brand-deep);color:var(--foc-brand-deep);background:var(--color-background-secondary)}
.itb:hover:not(.on){color:var(--color-text-primary);border-color:var(--color-border-primary)}
.itb i{font-size:18px}


.sub-tabs{display:flex;border-bottom:0.5px solid var(--color-border-tertiary);margin-bottom:1.25rem;gap:0;overflow-x:auto;scrollbar-width:none}
.sub-tabs::-webkit-scrollbar{display:none}
.stb{flex-shrink:0;display:flex;align-items:center;gap:6px;padding:9px 16px;border:none;background:transparent;font-family:var(--foc-font-sans);font-size:12px;font-weight:500;color:var(--color-text-secondary);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-0.5px}
.stb.on{color:var(--foc-brand-deep);border-bottom-color:var(--foc-brand-deep)}
.stb:hover:not(.on){color:var(--color-text-primary)}
.stb i{font-size:14px}

.inst-pane{display:none}.inst-pane.on{display:block}
.sub-pane{display:none}.sub-pane.on{display:block}


.main-layout{display:grid;grid-template-columns:1fr 220px;gap:1.25rem;align-items:start}
.grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.grid-6{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}


.card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);}
.card-sm{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);padding:.75rem}
.ico-wrap{width:32px;height:32px;border-radius:var(--border-radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.card-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.card h3{font-size:13px;font-weight:500}
.card p,.card-sm p{font-size:12px;color:var(--color-text-secondary);line-height:1.5}
.dot-list{display:flex;flex-direction:column;gap:4px;margin-top:6px}
.dl{display:flex;align-items:flex-start;gap:7px;font-size:12px;color:var(--color-text-secondary);line-height:1.4}
.dl::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--foc-brand-deep);flex-shrink:0;margin-top:5px}
.check-list{display:flex;flex-direction:column;gap:5px}
.cl{display:flex;align-items:flex-start;gap:7px;font-size:12px;color:var(--color-text-secondary);line-height:1.4}
.cl i{font-size:13px;color:#1D9E75;flex-shrink:0;margin-top:1px}

.snap-card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem;position:sticky;top:0}
.snap-title{font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:.75rem}
.snap-row{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:.5px solid var(--color-border-tertiary)}
.snap-row:last-child{border-bottom:none}
.snap-num{font-size:17px;font-weight:500;line-height:1}
.snap-lbl{font-size:11px;color:var(--color-text-secondary);line-height:1.3}

.process-bar{display:grid;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);overflow:hidden;margin-bottom:1rem}
.ps{padding:.9rem .75rem;text-align:center;position:relative;border-right:.5px solid var(--color-border-tertiary)}
.ps:last-child{border-right:none}
.ps-ni{display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:6px}
.ps-num{font-size:10px;color:var(--color-text-tertiary);font-weight:500}
.ps-ico{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.ps i{font-size:13px}
.ps h4{font-size:11px;font-weight:500;margin-bottom:3px}
.ps p{font-size:10px;color:var(--color-text-secondary);line-height:1.4}


.prog-item{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);padding:.75rem;text-align:center}
.prog-item i{font-size:18px;display:block;margin-bottom:4px}
.prog-label{font-size:11px;font-weight:500;margin-bottom:2px}
.prog-sub{font-size:10px;color:var(--color-text-secondary);line-height:1.3}


.ticker{display:flex;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);overflow:hidden;margin-bottom:1.25rem}
.ti-item{display:flex;align-items:center;gap:6px;padding:9px 12px;border-right:.5px solid var(--color-border-tertiary);font-size:11px;color:var(--color-text-secondary);flex:1;justify-content:center;white-space:nowrap}
.ti-item:last-child{border-right:none}
.ti-item i{font-size:13px;color:var(--foc-brand-deep)}


.sec-head{font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:.75rem;display:flex;align-items:center;gap:8px}
.sec-head i{font-size:14px;color:var(--foc-brand-deep)}
.sec-head::after{content:'';flex:1;height:.5px;background:var(--color-border-tertiary)}


.approach-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}


.partner-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:7px;margin-bottom:1.25rem}
.pchip{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md)}
.pi{width:28px;height:28px;border-radius:var(--border-radius-md);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500;flex-shrink:0}
.pn{font-size:11px;font-weight:500;line-height:1.3}


.cta{background:#3C3489;border-radius:var(--border-radius-lg);padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1.25rem}
.cta-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.12);color:#EEEDFE;font-size:10px;padding:3px 9px;border-radius:999px;margin-bottom:6px}
.cta-h{font-size:16px;font-weight:500;color:var(--foc-color-text-inverse);margin-bottom:3px}
.cta-sub{font-size:12px;color:#AFA9EC}
.cta-btns{display:flex;gap:7px;flex-wrap:wrap}
.cta-bw{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;background:var(--foc-color-surface);color:#3C3489;border:none;border-radius:var(--border-radius-md);font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap}
.cta-bg{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;background:transparent;color:var(--foc-color-text-inverse);border:.5px solid rgba(255,255,255,.35);border-radius:var(--border-radius-md);font-size:12px;cursor:pointer;white-space:nowrap}

  `
}

</style>

      </div>

 
    </FrontLayout>
  );
}

export default HomePage;
