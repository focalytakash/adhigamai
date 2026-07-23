import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { faFacebookF, faLinkedinIn, faYoutube, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  Briefcase,
  Clock,
  FileUp,
  Home,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import axios from "axios";
import "./FrontFooter.css";
import siteConfig from "../../../../config/siteConfig";

const { logo, logoAlt, name } = siteConfig.branding;

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/people/Adhigam-AI/61591237036514/", icon: faFacebookF, label: "Facebook" },
  { href: "https://www.instagram.com/adhigamai/", icon: faInstagram, label: "Instagram" },
  { href: "linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2F109878489%2Fadmin%2Fdashboard%2F", icon: faLinkedinIn, label: "LinkedIn" },
  { href: "https://www.youtube.com/@AdhigamAI", icon: faYoutube, label: "YouTube" },
];

/** Same primary links as FrontHeader */
const NAV_LINKS = [
  { label: "Home", to: "/" },
];

const HOME_SECTION_SCROLL_OFFSET = 130;

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_MIPIE_BACKEND_URL;
  const isHomePage = (location.pathname.replace(/\/$/, "") || "/") === "/" || location.pathname === "/home";

  const goToSection = (sectionId) => (e) => {
    e.preventDefault();
    if (isHomePage) {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - HOME_SECTION_SCROLL_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      window.history.replaceState(null, "", `/#${sectionId}`);
      return;
    }
    navigate(`/#${sectionId}`);
  };

  const goToContact = goToSection("contact");
  const goToAbout = goToSection("about");
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    location: "",
    position: "",
    experience: "",
    cv: null,
    info: "",
    termsAccepted: false,
  });
  const [careerSubmitting, setCareerSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name: field, value, type, checked, files } = e.target;
    if (type === "file") setFormData({ ...formData, [field]: files[0] });
    else if (type === "checkbox") setFormData({ ...formData, [field]: checked });
    else setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cv) {
      alert("Please upload your CV before submitting the form.");
      return;
    }
    if (!formData.termsAccepted) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    setCareerSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.name);
      submissionData.append("email", formData.email);
      submissionData.append("number", formData.number);
      submissionData.append("location", formData.location);
      submissionData.append("position", formData.position);
      submissionData.append("experience", formData.experience);
      submissionData.append("cv", formData.cv);
      submissionData.append("info", formData.info);
      submissionData.append("termsAccepted", formData.termsAccepted);
      await axios.post(`${backendUrl}/career`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Career form error:", error);
      alert("Something went wrong while submitting.");
    } finally {
      setCareerSubmitting(false);
    }
  };

  return (
    <>
      <div
        id="mobile-footer-nav"
        className="d-xxl-none d-xl-none d-lg-none d-md-none d-sm-block d-block mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-4"
      >
        <div className="container">
          <div className="footer-nav position-relative">
            <ul className="h-100 d-flex align-items-center justify-content-between mb-0">
              <li>
                <Link to="/">
                  <span className="footer-nav-icon" aria-hidden>
                    <Home size={18} strokeWidth={2} />
                  </span>
                  <span className="footer-nav-label pt-1">Home</span>
                </Link>
              </li>
              <li>
                <button type="button" className="footer-nav-contact" onClick={goToAbout}>
                  <span className="footer-nav-icon" aria-hidden>
                    <Info size={18} strokeWidth={2} />
                  </span>
                  <span className="footer-nav-label pt-1">About Us</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-contact" onClick={goToContact}>
                  <span className="footer-nav-icon" aria-hidden>
                    <MessageCircle size={18} strokeWidth={2} />
                  </span>
                  <span className="footer-nav-label pt-1">Contact Us</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="footer-v2 footer-padding-default footer-l02 ftr-new ftr-theme" id="footer">
        <div className="container">
          <div className="ftr-grid ftr-grid--simple">
            <div className="ftr-brand-col">
              <Link to="/" className="ftr-brand">
                <img src={logo} alt={logoAlt} />
              </Link>
              <p className="ftr-tagline">
                AI Education as a Service — empowering schools with AI, Robotics &amp; IoT.
              </p>
              <ul className="list-social list-social--hvr-black ftr-social">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                      <FontAwesomeIcon icon={s.icon} size="lg" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ftr-col">
              <h4 className="ftr-heading">Quick Links</h4>
              <ul className="footer-list ftr-links p-0">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
                <li>
                  <button type="button" className="ftr-link-btn" onClick={goToAbout}>
                    About Us
                  </button>
                </li>
                <li>
                  <button type="button" className="ftr-link-btn" onClick={goToContact}>
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div className="ftr-col ftr-contact-col">
              <h4 className="ftr-heading">Get in Touch</h4>
              <p className="ftr-tagline">
                Partner with {name} and bring future skills to your school.
              </p>
              <button type="button" className="ftr-contact-cta" onClick={goToContact}>
                Contact Us →
              </button>
            </div>
          </div>
        </div>

        <div className="ftr-bottom">
          <div className="container">
            <p className="ftr-copy">
              © Copyright {new Date().getFullYear()}, All Rights Reserved by{" "}
              <span className="ftr-copy-brand">{name}</span>
            </p>
          </div>
        </div>
      </footer>

      <div className="modal fade" id="careerModal" tabIndex="-1" aria-labelledby="careerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable career-modal-dialog">
          <div className="modal-content career-modal-content">
            <div className="modal-header career-modal-header">
              <div className="career-modal-header-inner">
                <span className="career-modal-emoji" aria-hidden="true">
                  💼
                </span>
                <div>
                  <h5 className="career-modal-title" id="careerModalLabel">
                    Career Opportunities
                  </h5>
                  <p className="career-modal-tagline">Build the future of skills and employability with us</p>
                </div>
              </div>
              <button type="button" className="btn-close career-modal-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body career-modal-body">
              <p className="career-modal-intro">
                Share your details below. Our team will review your application and get in touch if there is a suitable opening.
              </p>
              <section id="current-openings">
                <form method="post" id="careerForm" onSubmit={handleSubmit}>
                  <h4 className="career-section-title">
                    <span className="career-section-accent">Personal</span> Information
                  </h4>
                  <div className="row g-2">
                    <div className="col-sm-6 career-field">
                      <label className="career-label career-label-required" htmlFor="career-name">
                        <User size={14} aria-hidden /> Full Name
                      </label>
                      <input
                        id="career-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="col-sm-6 career-field">
                      <label className="career-label career-label-required" htmlFor="career-email">
                        <Mail size={14} aria-hidden /> Email
                      </label>
                      <input
                        id="career-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@email.com"
                      />
                    </div>
                    <div className="col-sm-6 career-field">
                      <label className="career-label career-label-required" htmlFor="career-phone">
                        <Phone size={14} aria-hidden /> Phone
                      </label>
                      <input
                        id="career-phone"
                        type="tel"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        required
                        placeholder="10-digit mobile"
                      />
                    </div>
                    <div className="col-sm-6 career-field">
                      <label className="career-label career-label-required" htmlFor="career-location">
                        <MapPin size={14} aria-hidden /> Location
                      </label>
                      <input
                        id="career-location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="City, state"
                      />
                    </div>
                    <div className="col-12 career-field">
                      <label className="career-label career-label-required" htmlFor="career-position">
                        <Briefcase size={14} aria-hidden /> Position Applied For
                      </label>
                      <input
                        id="career-position"
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        placeholder="Role you are applying for"
                      />
                    </div>
                    <div className="col-12 career-field">
                      <label className="career-label career-label-required" htmlFor="career-experience">
                        <Clock size={14} aria-hidden /> Years of Experience
                      </label>
                      <select id="career-experience" name="experience" value={formData.experience} onChange={handleChange} required>
                        <option value="" disabled>
                          Select experience
                        </option>
                        <option value="fresher">Fresher</option>
                        <option value="1-3">1–3 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>
                    <div className="col-12 career-field">
                      <label className="career-label career-label-required" htmlFor="career-cv">
                        <FileUp size={14} aria-hidden /> Upload CV
                      </label>
                      <input id="career-cv" type="file" name="cv" onChange={handleChange} accept=".pdf,.doc,.docx" required />
                      <p className="career-hint">PDF, DOC, or DOCX — max 5MB</p>
                      {formData.cv && <p className="career-file-name">Selected: {formData.cv.name}</p>}
                    </div>
                    <div className="col-12 career-field">
                      <label className="career-label" htmlFor="career-info">
                        Additional Information
                      </label>
                      <textarea
                        id="career-info"
                        name="info"
                        value={formData.info}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself and why you would be a great fit"
                      />
                    </div>
                    <div className="col-12">
                      <div className="career-terms">
                        <input
                          id="career-terms"
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="career-terms">
                          I agree to the processing of my personal data according to the privacy policy
                        </label>
                      </div>
                    </div>
                    <div className="col-12 career-modal-footer">
                      <button type="submit" className="career-modal-submit" disabled={careerSubmitting}>
                        {careerSubmitting ? "Submitting…" : "Submit Application"}
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
