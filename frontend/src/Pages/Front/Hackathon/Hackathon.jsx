import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Minus, Plus, Upload } from "lucide-react";
import axios from "axios";
import siteConfig from "../../../config/siteConfig";
import { PROBLEM_GROUPS } from "./problemStatements";
import "../HomePage/HeroSection.css";
import "./Hackathon.css";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const STEPS = [
  { n: 1, label: "Team" },
  { n: 2, label: "Members" },
  { n: 3, label: "Project" },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[0-9]{10}$/;
const PPT_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

function emptyMember() {
  return { name: "", mobile: "", email: "", roll: "" };
}

function makeMembers(count, previous = []) {
  return Array.from({ length: count }, (_, i) => previous[i] || emptyMember());
}

function generateTeamId(teamName) {
  const prefix = teamName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  return `ADHIGAM-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function Field({ label, error, children }) {
  return (
    <div className="hackathon-field">
      <span className="hackathon-label">
        {label} <span className="req">*</span>
      </span>
      {children}
      {error ? <div className="hackathon-err">{error}</div> : null}
    </div>
  );
}

const Hackathon = () => {
  const { logo, logoAlt, name } = siteConfig.branding;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  const backendUrl = process.env.REACT_APP_ADHIGAM_BACKEND_URL;
  const bucketUrl = process.env.REACT_APP_ADHIGAM_BUCKET_URL;
  const fileRef = useRef(null);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [teamId, setTeamId] = useState("");
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);

  const [team, setTeam] = useState({
    teamName: "",
    leaderName: "",
    collegeName: "",
    course: "",
    yearOfStudy: "",
  });
  const [memberCount, setMemberCount] = useState(3);
  const [members, setMembers] = useState(() => makeMembers(3));
  const [project, setProject] = useState({
    problemGroup: "",
    category: "",
    projectTitle: "",
    problemDesc: "",
    solution: "",
    techUsed: "",
  });
  const [pptFile, setPptFile] = useState(null);
  const [decl1, setDecl1] = useState(false);
  const [decl2, setDecl2] = useState(false);

  const selectedGroup = useMemo(
    () => PROBLEM_GROUPS.find((group) => group.group === project.problemGroup) || null,
    [project.problemGroup]
  );
  const selectedProblem = useMemo(
    () => selectedGroup?.items.find((item) => item.value === project.category) || null,
    [selectedGroup, project.category]
  );

  const updateTeam = (key, value) => {
    setTeam((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const updateMember = (index, key, value) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
    setErrors((prev) => ({ ...prev, [`member-${index}-${key}`]: undefined }));
  };

  const updateProject = (key, value) => {
    setProject((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setCount = (next) => {
    const count = Math.min(5, Math.max(3, next));
    setMemberCount(count);
    setMembers((prev) => makeMembers(count, prev));
  };

  const setPpt = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const okType = PPT_TYPES.includes(file.type) || ["ppt", "pptx", "pdf"].includes(ext);
    if (!okType) {
      setErrors((prev) => ({ ...prev, ppt: "Please upload a .ppt, .pptx, or .pdf file." }));
      return;
    }
    setPptFile(file);
    setErrors((prev) => ({ ...prev, ppt: undefined }));
  };

  const validateStep = (n) => {
    const next = {};

    if (n === 1) {
      if (!team.teamName.trim()) next.teamName = "Please enter your team name.";
      if (!team.leaderName.trim()) next.leaderName = "Please enter the team leader's name.";
      if (!team.collegeName.trim()) next.collegeName = "Please enter your college name.";
      if (!team.course.trim()) next.course = "Please enter your course.";
      if (!team.yearOfStudy) next.yearOfStudy = "Please select a year.";
    }

    if (n === 2) {
      members.forEach((member, i) => {
        if (!member.name.trim()) next[`member-${i}-name`] = "Please enter full name.";
        if (!MOBILE_RE.test(member.mobile.trim())) next[`member-${i}-mobile`] = "Enter a valid mobile number.";
        if (!EMAIL_RE.test(member.email.trim())) next[`member-${i}-email`] = "Enter a valid email.";
        if (!member.roll.trim()) next[`member-${i}-roll`] = "Please enter roll number.";
      });
    }

    if (n === 3) {
      if (!project.problemGroup) next.problemGroup = "Please select a category.";
      if (!project.category) next.category = "Please select a problem statement.";
      if (!project.projectTitle.trim()) next.projectTitle = "Please enter a project title.";
      if (!project.problemDesc.trim()) next.problemDesc = "Please describe the problem.";
      if (!project.solution.trim()) next.solution = "Please describe your solution.";
      if (!project.techUsed.trim()) next.techUsed = "Please list the technologies you're using.";
      if (!pptFile) next.ppt = "Please upload your PPT.";
      if (!decl1) next.decl1 = true;
      if (!decl2) next.decl2 = true;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goStep = (nextStep) => {
    if (nextStep > step && !validateStep(step)) return;
    if (nextStep === 2 && !members[0].name.trim() && team.leaderName.trim()) {
      setMembers((prev) => prev.map((m, i) => (i === 0 ? { ...m, name: team.leaderName } : m)));
    }
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    if (!backendUrl) {
      setSubmitError("Backend URL is not configured.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const formData = new FormData();
    formData.append("teamName", team.teamName.trim());
    formData.append("leaderName", team.leaderName.trim());
    formData.append("collegeName", team.collegeName.trim());
    formData.append("course", team.course.trim());
    formData.append("yearOfStudy", team.yearOfStudy);
    formData.append("category", project.problemGroup);
    formData.append("problemStatement", selectedProblem?.label || "");
    formData.append("projectTitle", project.projectTitle.trim());
    formData.append("problemDesc", project.problemDesc.trim());
    formData.append("solution", project.solution.trim());
    formData.append("techUsed", project.techUsed.trim());
    formData.append("decl1", String(decl1));
    formData.append("decl2", String(decl2));
    formData.append(
      "members",
      JSON.stringify(
        members.map((member) => ({
          name: member.name.trim(),
          mobile: member.mobile.trim(),
          email: member.email.trim(),
          roll: member.roll.trim(),
        }))
      )
    );
    formData.append("ppt", pptFile);
    if (bucketUrl) formData.append("bucketUrl", bucketUrl);

    try {
      const response = await axios.post(`${backendUrl}/api/v1/hackathon`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const savedId = response.data?.data?.teamId;
      if (response.status === 200 || response.status === 201) {
        setTeamId(savedId || generateTeamId(team.teamName));
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const railClass = useMemo(
    () => (n) => {
      if (submitted || n < step) return "is-done";
      if (n === step) return "is-active";
      return "";
    },
    [step, submitted]
  );

  return (
      <div className="foc-cyber-home hackathon-page">
        <div className="hackathon-wrap">
          <div className="hackathon-header">
            <img className="hackathon-logo" src={logo} alt={logoAlt} />
            <div className="hackathon-kicker">
              <span className="dot" />
              {name} AI Hackathon — Team Registration
            </div>
            <h1>
              Register your <span className="accent">team</span>
            </h1>
            <div className="hackathon-sub">
              Three quick steps: team details, each member&apos;s info, and your project pitch. Takes about five minutes.
            </div>
          </div>

          {!submitted ? (
            <div className="hackathon-rail" aria-label="Registration progress">
              {STEPS.map((item) => (
                <div key={item.n} className={`hackathon-rail-step ${railClass(item.n)}`}>
                  <div className="hackathon-rail-bar">
                    <div className="hackathon-rail-fill" />
                  </div>
                  <div className="hackathon-rail-label">
                    <span className="hackathon-rail-num">{item.n}</span>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <form className="hackathon-panel" onSubmit={handleSubmit} noValidate>
            {submitted ? (
              <div className="hackathon-success">
                <div className="hackathon-success-icon" aria-hidden>
                  <Check size={28} strokeWidth={2.4} />
                </div>
                <h2>You&apos;re registered</h2>
                <p>
                  Your team has been entered into the {name} AI Hackathon. A confirmation will be sent to your team
                  leader&apos;s email shortly.
                </p>
                <div className="hackathon-team-id">{teamId}</div>
              </div>
            ) : null}

            {!submitted && step === 1 ? (
              <div>
                <div className="hackathon-step-title">Team details</div>
                <div className="hackathon-step-desc">Tell us who&apos;s competing.</div>

                <Field label="Team name" error={errors.teamName}>
                  <input
                    type="text"
                    className={errors.teamName ? "err" : ""}
                    value={team.teamName}
                    onChange={(e) => updateTeam("teamName", e.target.value)}
                    placeholder="e.g. Neural Nomads"
                  />
                </Field>

                <Field label="Team leader name" error={errors.leaderName}>
                  <input
                    type="text"
                    className={errors.leaderName ? "err" : ""}
                    value={team.leaderName}
                    onChange={(e) => updateTeam("leaderName", e.target.value)}
                    placeholder="Full name"
                  />
                </Field>

                <div className="hackathon-field">
                  <span className="hackathon-label">
                    Number of team members <span className="req">*</span>
                  </span>
                  <div className="hackathon-stepper">
                    <button type="button" onClick={() => setCount(memberCount - 1)} disabled={memberCount <= 3} aria-label="Decrease members">
                      <Minus size={16} />
                    </button>
                    <div className="count">{memberCount}</div>
                    <button type="button" onClick={() => setCount(memberCount + 1)} disabled={memberCount >= 5} aria-label="Increase members">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="hackathon-stepper-hint">Minimum 3, maximum 5 members (including team leader).</div>
                </div>

                <div className="hackathon-grid2">
                  <Field label="College name" error={errors.collegeName}>
                    <input
                      type="text"
                      className={errors.collegeName ? "err" : ""}
                      value={team.collegeName}
                      onChange={(e) => updateTeam("collegeName", e.target.value)}
                      placeholder="Your institution"
                    />
                  </Field>
                  <Field label="Course" error={errors.course}>
                    <input
                      type="text"
                      className={errors.course ? "err" : ""}
                      value={team.course}
                      onChange={(e) => updateTeam("course", e.target.value)}
                      placeholder="e.g. B.Tech CSE"
                    />
                  </Field>
                </div>

                <Field label="Year of study" error={errors.yearOfStudy}>
                  <select
                    className={errors.yearOfStudy ? "err" : ""}
                    value={team.yearOfStudy}
                    onChange={(e) => updateTeam("yearOfStudy", e.target.value)}
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="hackathon-nav">
                  <div className="spacer" />
                  <button type="button" className="btn btn-primary" onClick={() => goStep(2)}>
                    Continue to members
                  </button>
                </div>
              </div>
            ) : null}

            {!submitted && step === 2 ? (
              <div>
                <div className="hackathon-step-title">Student details</div>
                <div className="hackathon-step-desc">Fill in details for each team member.</div>

                {members.map((member, i) => (
                  <div className="hackathon-member" key={i}>
                    <div className="hackathon-member-title">
                      Member {i + 1}
                      {i === 0 ? <span className="hackathon-badge">Team Leader</span> : null}
                    </div>
                    <Field label="Full name" error={errors[`member-${i}-name`]}>
                      <input
                        type="text"
                        className={errors[`member-${i}-name`] ? "err" : ""}
                        value={member.name}
                        onChange={(e) => updateMember(i, "name", e.target.value)}
                        placeholder="Full name"
                      />
                    </Field>
                    <div className="hackathon-grid2">
                      <Field label="Mobile number" error={errors[`member-${i}-mobile`]}>
                        <input
                          type="tel"
                          className={errors[`member-${i}-mobile`] ? "err" : ""}
                          value={member.mobile}
                          onChange={(e) => updateMember(i, "mobile", e.target.value)}
                          placeholder="10-digit number"
                        />
                      </Field>
                      <Field label="Email" error={errors[`member-${i}-email`]}>
                        <input
                          type="email"
                          className={errors[`member-${i}-email`] ? "err" : ""}
                          value={member.email}
                          onChange={(e) => updateMember(i, "email", e.target.value)}
                          placeholder="name@email.com"
                        />
                      </Field>
                    </div>
                    <Field label="College roll number" error={errors[`member-${i}-roll`]}>
                      <input
                        type="text"
                        className={errors[`member-${i}-roll`] ? "err" : ""}
                        value={member.roll}
                        onChange={(e) => updateMember(i, "roll", e.target.value)}
                        placeholder="Roll no."
                      />
                    </Field>
                  </div>
                ))}

                <div className="hackathon-nav">
                  <button type="button" className="btn btn-outline" onClick={() => goStep(1)}>
                    Back
                  </button>
                  <div className="spacer" />
                  <button type="button" className="btn btn-primary" onClick={() => goStep(3)}>
                    Continue to project
                  </button>
                </div>
              </div>
            ) : null}

            {!submitted && step === 3 ? (
              <div>
                <div className="hackathon-step-title">Project details</div>
                <div className="hackathon-step-desc">Give us a sense of what you&apos;re building.</div>

                <Field label="Category" error={errors.problemGroup}>
                  <select
                    className={errors.problemGroup ? "err" : ""}
                    value={project.problemGroup}
                    onChange={(e) => {
                      const group = e.target.value;
                      setProject((prev) => ({ ...prev, problemGroup: group, category: "" }));
                      setErrors((prev) => ({ ...prev, problemGroup: undefined, category: undefined }));
                    }}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {PROBLEM_GROUPS.map((group) => (
                      <option key={group.group} value={group.group}>
                        {group.group}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Problem statement" error={errors.category}>
                  <select
                    className={errors.category ? "err" : ""}
                    value={project.category}
                    onChange={(e) => updateProject("category", e.target.value)}
                    disabled={!selectedGroup}
                  >
                    <option value="" disabled>
                      {selectedGroup ? "Select a problem statement" : "Select a category first"}
                    </option>
                    {(selectedGroup?.items || []).map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {selectedProblem ? <div className="hackathon-ps-hint">{selectedProblem.hint}</div> : null}
                </Field>

                <Field label="Project title" error={errors.projectTitle}>
                  <input
                    type="text"
                    className={errors.projectTitle ? "err" : ""}
                    value={project.projectTitle}
                    onChange={(e) => updateProject("projectTitle", e.target.value)}
                    placeholder="Name your project"
                  />
                </Field>

                <Field label="Problem description" error={errors.problemDesc}>
                  <textarea
                    className={errors.problemDesc ? "err" : ""}
                    value={project.problemDesc}
                    onChange={(e) => updateProject("problemDesc", e.target.value)}
                    placeholder="What problem are you solving?"
                  />
                </Field>

                <Field label="Proposed solution" error={errors.solution}>
                  <textarea
                    className={errors.solution ? "err" : ""}
                    value={project.solution}
                    onChange={(e) => updateProject("solution", e.target.value)}
                    placeholder="How does your project solve it?"
                  />
                </Field>

                <Field label="Technology used" error={errors.techUsed}>
                  <input
                    type="text"
                    className={errors.techUsed ? "err" : ""}
                    value={project.techUsed}
                    onChange={(e) => updateProject("techUsed", e.target.value)}
                    placeholder="e.g. Python, React, TensorFlow"
                  />
                </Field>

                <div className="hackathon-field">
                  <span className="hackathon-label">
                    PPT upload <span className="req">*</span>
                  </span>
                  <div
                    className={`hackathon-file-drop${pptFile ? " has-file" : ""}${dragging ? " is-drag" : ""}${errors.ppt ? " is-invalid" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      setPpt(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <div className="hackathon-file-icon">
                      <Upload size={22} />
                    </div>
                    <div className="hackathon-file-text">
                      <strong>Click to upload</strong> your presentation (.ppt, .pptx, .pdf)
                    </div>
                    {pptFile ? <div className="hackathon-file-name">{pptFile.name}</div> : null}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".ppt,.pptx,.pdf"
                    hidden
                    onChange={(e) => setPpt(e.target.files?.[0])}
                  />
                  {errors.ppt ? <div className="hackathon-err">{errors.ppt}</div> : null}
                </div>

                <div className="hackathon-decl-heading">Declaration</div>
                <label className={`hackathon-decl${decl1 ? " is-checked" : ""}${errors.decl1 && !decl1 ? " is-invalid" : ""}`}>
                  <input
                    type="checkbox"
                    checked={decl1}
                    onChange={(e) => {
                      setDecl1(e.target.checked);
                      setErrors((prev) => ({ ...prev, decl1: undefined }));
                    }}
                  />
                  <span className="hackathon-decl-text">We confirm that all information provided is correct.</span>
                </label>
                <label className={`hackathon-decl${decl2 ? " is-checked" : ""}${errors.decl2 && !decl2 ? " is-invalid" : ""}`}>
                  <input
                    type="checkbox"
                    checked={decl2}
                    onChange={(e) => {
                      setDecl2(e.target.checked);
                      setErrors((prev) => ({ ...prev, decl2: undefined }));
                    }}
                  />
                  <span className="hackathon-decl-text">
                    Our team agrees to participate in all rounds of the {name} AI Hackathon.
                  </span>
                </label>

                {submitError ? <p className="hackathon-submit-error">{submitError}</p> : null}

                <div className="hackathon-nav">
                  <button type="button" className="btn btn-outline" onClick={() => goStep(2)} disabled={submitting}>
                    Back
                  </button>
                  <div className="spacer" />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit registration"}
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>
  );
};

export default Hackathon;
