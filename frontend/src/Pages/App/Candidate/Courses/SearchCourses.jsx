import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  FileText,
  Layers,
  MapPin,
  Play,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { resolveMediaUrl } from "../../../../utils/resolveMediaUrl";

const MOCK_COURSE = {
  _id: "demo-course-1",
  name: "Retail Sales Associate",
  thumbnail: "",
  batchName: "RSA-APR-25-01",
  center: "Jaipur Training Center",
  trainerName: "Mr. Amit Verma",
  duration: "Jan 2025 - Jun 2025",
  status: "Active",
  overallProgress: 68,
  sessionsCompleted: 32,
  totalSessions: 48,
  totalUnits: 5,
  totalChapters: 10,
  courseDurationLabel: "6 Months",
  trainingMode: "Classroom",
  about:
    "This course is designed to build essential skills for a successful career in retail sales. You will learn about customer handling, product knowledge, sales techniques and more.",

  units: [
    {
      id: "u1",
      name: "Unit 1: Foundation Skills",
      status: "completed",
      sessionsDone: 4,
      sessionsTotal: 4,
      chapters: [
        {
          id: "u1c1",
          name: "Chapter 1: Introduction to Retail Industry",
          sessionsDone: 2,
          sessionsTotal: 2,
          status: "completed",
          sessions: [
            { id: "s1", name: "Session 1: Overview of Retail Industry", date: "20 Apr 2025", status: "completed" },
            { id: "s2", name: "Session 2: Roles and Responsibilities", date: "21 Apr 2025", status: "completed" },
          ],
        },
        {
          id: "u1c2",
          name: "Chapter 2: Workplace Communication",
          sessionsDone: 2,
          sessionsTotal: 2,
          status: "completed",
          sessions: [
            { id: "s2a", name: "Session 1: Verbal Communication", date: "22 Apr 2025", status: "completed" },
            { id: "s2b", name: "Session 2: Email and Workplace Etiquette", date: "23 Apr 2025", status: "completed" },
          ],
        },
      ],
    },
    {
      id: "u2",
      name: "Unit 2: Customer Handling",
      status: "in-progress",
      sessionsDone: 3,
      sessionsTotal: 6,
      chapters: [
        {
          id: "u2c1",
          name: "Chapter 1: Understanding Customers",
          sessionsDone: 1,
          sessionsTotal: 3,
          status: "in-progress",
          sessions: [
            { id: "s3", name: "Session 1: Customer Needs & Expectations", date: "28 Apr 2025", status: "completed" },
            { id: "s4", name: "Session 2: Effective Communication", date: "30 Apr 2025", status: "today" },
            { id: "s5", name: "Session 3: Handling Customer Complaints", date: "02 May 2025", status: "not-started" },
          ],
        },
        {
          id: "u2c2",
          name: "Chapter 2: Sales Techniques",
          sessionsDone: 1,
          sessionsTotal: 3,
          status: "in-progress",
          sessions: [
            { id: "s6", name: "Session 1: Consultative Selling", date: "05 May 2025", status: "completed" },
            { id: "s7", name: "Session 2: Closing a Sale", date: "07 May 2025", status: "upcoming" },
            { id: "s8", name: "Session 3: Upselling and Cross-selling", date: "09 May 2025", status: "not-started" },
          ],
        },
      ],
    },
    {
      id: "u3",
      name: "Unit 3: Product Knowledge",
      status: "not-started",
      sessionsDone: 0,
      sessionsTotal: 5,
      chapters: [
        {
          id: "u3c1",
          name: "Chapter 1: Product Awareness",
          sessionsDone: 0,
          sessionsTotal: 2,
          status: "not-started",
          sessions: [],
        },
        {
          id: "u3c2",
          name: "Chapter 2: Product Demonstration",
          sessionsDone: 0,
          sessionsTotal: 3,
          status: "not-started",
          sessions: [],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Status style maps (keeps Tailwind class names static so JIT can find them)
// "missed" and "today" match the vocabulary used on Session Calendar so a
// session carries the same look wherever it's shown.
// ---------------------------------------------------------------------------
const PILL_STYLES = {
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  "in-progress": "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  "not-started": "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  upcoming: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  today: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
  missed: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
};

const PILL_LABEL = {
  completed: "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
  upcoming: "Upcoming",
  today: "Today",
  missed: "Missed",
};

const ICON_STYLES = {
  completed: "bg-emerald-500 text-white shadow-sm shadow-emerald-200",
  "in-progress": "bg-sky-500 text-white shadow-sm shadow-sky-200",
  upcoming: "bg-indigo-500 text-white shadow-sm shadow-indigo-200",
  "not-started": "bg-slate-200 text-slate-500",
  today: "bg-violet-500 text-white shadow-sm shadow-violet-200",
  missed: "bg-rose-500 text-white shadow-sm shadow-rose-200",
};

const SESSION_TEXT_STYLES = {
  completed: "text-emerald-600",
  "in-progress": "text-sky-600",
  upcoming: "text-indigo-600",
  "not-started": "text-slate-400",
  today: "text-violet-600",
  missed: "text-rose-600",
};

const UNIT_ACCENT = {
  completed: "from-emerald-400 to-emerald-500",
  "in-progress": "from-sky-400 to-indigo-500",
  "not-started": "from-slate-300 to-slate-400",
};

const StatusPill = ({ status }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${PILL_STYLES[status]}`}>
    {PILL_LABEL[status]}
  </span>
);

const StatusIcon = ({ status, size = "w-6 h-6" }) => (
  <span className={`inline-flex items-center justify-center rounded-full shrink-0 ${size} ${ICON_STYLES[status]}`}>
    {status === "completed" ? (
      <Check size={12} strokeWidth={3} />
    ) : status === "missed" ? (
      <X size={12} strokeWidth={3} />
    ) : status === "not-started" ? (
      <Circle size={10} />
    ) : (
      <Play size={11} fill="currentColor" />
    )}
  </span>
);

const ProgressDonut = ({ segments, centerLabel, centerSub }) => {
  let cumulative = 0;
  const stops = (segments || [])
    .map((seg) => {
      const start = cumulative;
      cumulative += seg.value;
      return `${seg.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className="flex justify-center mb-4">
      <div
        className="w-[152px] h-[152px] rounded-full grid place-items-center"
        style={{
          background: `conic-gradient(${stops})`,
          boxShadow: "0 12px 28px rgba(47,111,237,0.12), inset 0 0 0 8px #fff",
        }}
      >
        <div className="w-[100px] h-[100px] rounded-full bg-white flex flex-col items-center justify-center shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
          <div className="text-[22px] leading-none font-extrabold text-slate-900">{centerLabel}</div>
          <div className="text-[11px] text-slate-400 mt-1">{centerSub}</div>
        </div>
      </div>
    </div>
  );
};

const MetaChip = ({ icon, label, value }) => (
  <div className="flex items-start gap-2.5 min-w-0">
    <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 grid place-items-center shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 m-0">{label}</p>
      <p className="text-[13px] font-semibold text-slate-800 m-0 truncate">{value}</p>
    </div>
  </div>
);

const AccordionPanel = ({ open, children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateRows: open ? "1fr" : "0fr",
      transition: "grid-template-rows 0.35s ease-in-out",
    }}
  >
    <div style={{ overflow: "hidden", minHeight: 0 }}>
      {children}
    </div>
  </div>
);

const normalizeCourse = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return MOCK_COURSE;
  return {
    ...MOCK_COURSE,
    ...data,
    units: Array.isArray(data.units) && data.units.length ? data.units : MOCK_COURSE.units,
    outcomes: Array.isArray(data.outcomes) && data.outcomes.length ? data.outcomes : MOCK_COURSE.outcomes,
    progressByUnit:
      Array.isArray(data.progressByUnit) && data.progressByUnit.length
        ? data.progressByUnit
        : MOCK_COURSE.progressByUnit,
  };
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const MyCourse = () => {
  const { courseId } = useParams();
  const backendUrl = process.env.REACT_APP_MIPIE_BACKEND_URL;
  const bucketUrl = process.env.REACT_APP_MIPIE_BUCKET_URL;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUnitId, setOpenUnitId] = useState("u1");
  const [openChapterId, setOpenChapterId] = useState("u1c1");

  useEffect(() => {
    fetchMyCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchMyCourse = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/candidate/mycourse/${courseId || ""}`,
        { headers: { "x-auth": token } }
      );
      const apiCourse = response.data?.course || response.data;
      setCourse(normalizeCourse(apiCourse));
    } catch (error) {
      console.error("Error fetching course progress:", error);
      setCourse(MOCK_COURSE);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = (unitId) => {
    if (openUnitId === unitId) {
      setOpenUnitId(null);
      return;
    }
    const unit = course?.units?.find((item) => item.id === unitId);
    setOpenUnitId(unitId);
    setOpenChapterId(unit?.chapters?.[0]?.id || null);
  };

  const toggleChapter = (chapterId) => {
    setOpenChapterId((prev) => (prev === chapterId ? null : chapterId));
  };

  const getCourseImageUrl = (c) => {
    if (!c?.thumbnail) return "/Assets/public_assets/images/newjoblisting/course_img.svg";
    return resolveMediaUrl(bucketUrl, c.thumbnail);
  };

  if (loading || !course) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-500">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin" />
          <p className="m-0 text-sm">Loading your course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f5fb] font-sans text-slate-900">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 h-64 w-64 rounded-full bg-violet-200/35 blur-3xl" />
      <div className="relative max-w-[1400px] mx-auto px-4 pt-5 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <p className="m-0 mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500">Learning</p>
            <h3 className="m-0 text-[28px] leading-tight font-extrabold text-slate-900">My Course</h3>
            <p className="m-0 mt-1 text-sm text-slate-500">Track your learning journey and course progress</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 ring-1 ring-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {course.status}
          </span>
        </div>

        <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_22px_50px_rgba(15,23,42,0.08)] ring-1 ring-white mb-5">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500" />
          <div className="flex flex-wrap gap-5 p-5 pt-6">
            <div className="relative w-full sm:w-[220px] h-[168px] shrink-0 rounded-2xl overflow-hidden shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
              <img src={getCourseImageUrl(course)} alt={course.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 ring-1 ring-white/20">
                {course.trainingMode}
              </span>
            </div>

            <div className="flex-1 min-w-[240px]">
              <h4 className="m-0 mb-4 text-[22px] font-extrabold tracking-tight">{course.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <MetaChip icon={<Layers size={14} />} label="Batch" value={course.batchName} />
                <MetaChip icon={<MapPin size={14} />} label="Center" value={course.center} />
                <MetaChip icon={<User size={14} />} label="Trainer" value={course.trainerName} />
                <MetaChip icon={<CalendarDays size={14} />} label="Duration" value={course.duration} />
              </div>
            </div>

            <div className="w-full lg:w-[240px] shrink-0 lg:border-l lg:border-slate-100 lg:pl-5 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-400">Overall Progress</span>
                <Sparkles size={14} className="text-violet-500" />
              </div>
              <span className="block text-[34px] leading-none font-black bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent mb-3">
                {course.overallProgress}%
              </span>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-3 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 shadow-[0_0_12px_rgba(139,92,246,0.45)]"
                  style={{ width: `${course.overallProgress}%` }}
                />
              </div>
              <p className="m-0 text-[12px] text-slate-400">
                Sessions completed{" "}
                <strong className="text-slate-800">
                  {course.sessionsCompleted} / {course.totalSessions}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0 w-full">
              <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_22px_50px_rgba(15,23,42,0.08)] ring-1 ring-white p-5">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <h5 className="m-0 text-lg font-bold">Course Structure</h5>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> In Progress</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Not Started</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {(course.units || []).map((unit) => {
                    const unitOpen = openUnitId === unit.id;
                    return (
                      <div
                        key={unit.id}
                        className="relative rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-100"
                      >
                        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b ${UNIT_ACCENT[unit.status]}`} />
                        <button
                          type="button"
                          className="w-full text-left flex flex-wrap justify-between items-center gap-2 pl-5 pr-4 py-3.5 bg-transparent border-0 shadow-none outline-none appearance-none cursor-pointer focus:outline-none"
                          onClick={() => toggleUnit(unit.id)}
                          aria-expanded={unitOpen}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <StatusIcon status={unit.status} />
                            <span className="font-bold text-[15px] text-slate-800">{unit.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {unit.sessionsDone} / {unit.sessionsTotal} Sessions
                            </span>
                            <StatusPill status={unit.status} />
                            <ChevronDown
                              size={16}
                              className={`text-slate-400 transition-transform duration-300 ${unitOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </button>

                        <AccordionPanel open={unitOpen}>
                          <div className="mx-4 mb-4 ml-5 border-t border-slate-100 pt-2">
                            {(unit.chapters || []).map((chapter) => {
                              const chapterOpen = openChapterId === chapter.id;
                              const hasSessions = (chapter.sessions || []).length > 0;
                              return (
                                <div key={chapter.id} className="py-1">
                                  <button
                                    type="button"
                                    className="w-full text-left flex flex-wrap justify-between items-center gap-2 rounded-xl px-3 py-2.5 bg-transparent border-0 shadow-none outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none"
                                    onClick={() => toggleChapter(chapter.id)}
                                    aria-expanded={chapterOpen}
                                  >
                                    <span className="text-[13.5px] font-semibold text-slate-700">{chapter.name}</span>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-slate-400 whitespace-nowrap">
                                        {chapter.sessionsDone} / {chapter.sessionsTotal} Sessions
                                      </span>
                                      <StatusPill status={chapter.status} />
                                      <ChevronDown
                                        size={14}
                                        className={`text-slate-400 transition-transform duration-300 ${chapterOpen ? "rotate-180" : ""}`}
                                      />
                                    </div>
                                  </button>

                                  <AccordionPanel open={chapterOpen}>
                                    <div className="ml-3 mb-2 border-l-2 border-slate-100 pl-4">
                                      {hasSessions ? (
                                        (chapter.sessions || []).map((session) => (
                                          <div
                                            key={session.id}
                                            className="flex flex-wrap items-center gap-3 py-2.5 border-b border-slate-50 last:border-b-0"
                                          >
                                            <StatusIcon status={session.status} size="w-5 h-5" />
                                            <div className="flex-1 min-w-[160px]">
                                              <p className="m-0 text-[13px] font-medium text-slate-800">{session.name}</p>
                                              <p className="m-0 mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400">
                                                <CalendarDays size={11} /> {session.date}
                                              </p>
                                            </div>
                                            <span className={`text-xs font-semibold whitespace-nowrap ${SESSION_TEXT_STYLES[session.status]}`}>
                                              {PILL_LABEL[session.status]}
                                            </span>
                                            <Link
                                              to={`/candidate/session/${session.id}`}
                                              className="text-[11.5px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-rose-500 hover:text-white transition-colors"
                                            >
                                              View Details
                                            </Link>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="m-0 py-2 text-xs text-slate-400">No sessions added yet.</p>
                                      )}
                                    </div>
                                  </AccordionPanel>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionPanel>
                      </div>
                    );
                  })}
                </div>
              </div>
          </div>

          <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_22px_50px_rgba(15,23,42,0.08)] ring-1 ring-white p-5">
              <h6 className="m-0 mb-2 text-[15px] font-bold">About This Course</h6>
              <p className="m-0 mb-4 text-[13px] text-slate-500 leading-relaxed">{course.about}</p>
              <div>
                {[
                  ["Total Units", course.totalUnits],
                  ["Total Chapters", course.totalChapters],
                  ["Total Sessions", course.totalSessions],
                  ["Duration", course.courseDurationLabel],
                  ["Training Mode", course.trainingMode],
                ].map(([label, value]) => (
                  <div className="flex justify-between text-[13px] text-slate-500 py-2 border-t border-slate-100" key={label}>
                    <span>{label}</span>
                    <strong className="text-slate-800">{value}</strong>
                  </div>
                ))}
              </div>
             
            </div>

           

            <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_22px_50px_rgba(15,23,42,0.08)] ring-1 ring-white p-5 flex flex-col gap-2.5">
              <h6 className="m-0 mb-1 text-[15px] font-bold">Quick Actions</h6>
              <Link
                to="/candidate/sessionCalendar"
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] font-semibold bg-rose-50 text-rose-600 ring-1 ring-rose-100 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5 transition-all"
              >
                <CalendarDays size={16} /> View Session Calendar
              </Link>
              <Link
                to="/candidate/learningMaterial"
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] font-semibold bg-violet-50 text-violet-600 ring-1 ring-violet-100 hover:bg-violet-500 hover:text-white hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 transition-all"
              >
                <BookOpen size={16} /> View Learning Material
              </Link>
              <Link
                to="/candidate/assessments"
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 hover:-translate-y-0.5 transition-all"
              >
                <FileText size={16} /> Take Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;