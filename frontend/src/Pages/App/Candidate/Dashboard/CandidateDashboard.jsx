import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Award,
  BookOpen,
  Calendar,
  CalendarCheck2,
  CheckSquare,
  ClipboardList,
  ClipboardCheck,
  Clock,
  Clock3,
  Download,
  ExternalLink,
  FileEdit,
  FileText,
  Flame,
  GraduationCap,
  Library,
  Link as LinkIcon,
  MapPin,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Phone,
  ShieldCheck,
  Trophy,
  User,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { resolveMediaUrl } from '../../../../utils/resolveMediaUrl';
import CandidateLayout from '../../../../Component/Layouts/App/Candidates';
import CandidateHeader from '../../../../Component/Layouts/App/Candidates/CandidateHeader/CandidateHeader';
import CandidateSidebar from '../../../../Component/Layouts/App/Candidates/CandidateSidebar/CandidateSidebar';

/* ------------------------------ FALLBACK DATA ------------------------------ */

const FALLBACK_ACADEMICS = {
  rank: 3,
  totalStudents: 50,
  grade: 'A',
  gradeNote: 'Excellent',
  attendance: 87,
  present: 42,
  absent: 5,
  total: 47,
  monthAttendance: 90,
  totalSessions: 48,
  completedSessions: 32,
  upcomingCount: 16,
  theory: 72,
  practical: 60,
  softSkills: 80,
  overall: 68,
  assessmentAvg: 78,
  assessmentsTaken: 4,
  assessmentsTotal: 6,
  assessmentBreakdown: [
    { label: 'Excellent (80-100%)', count: 12, color: '#22c55e' },
    { label: 'Good (60-79%)', count: 8, color: '#3b82f6' },
    { label: 'Average (40-59%)', count: 3, color: '#f59e0b' },
    { label: 'Needs Improvement (<40%)', count: 1, color: '#ef4444' },
  ],
  performanceTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    attendance: [55, 70, 68, 75, 72],
    assessment: [40, 45, 42, 55, 50],
  },
  strengths: ['Communication', 'Customer Service', 'Product Knowledge'],
  improvements: ['Sales Techniques', 'Time Management'],
  streak: 7,
};

const FALLBACK_SESSIONS = [
  { day: '21', month: 'May', weekday: 'Wed', title: 'Product Demonstration', time: '10:00 AM', location: 'Classroom 2', tag: 'Tomorrow' },
  { day: '23', month: 'May', weekday: 'Fri', title: 'Revision & Discussion', time: '10:00 AM', location: 'Classroom 1', tag: 'Upcoming' },
  { day: '26', month: 'May', weekday: 'Mon', title: 'Mock Assessment', time: '10:00 AM', location: 'Lab 1', tag: 'Upcoming' },
];

const FALLBACK_ANNOUNCEMENTS = [
  { text: 'New Study Material Added', meta: 'New resources added for Unit 3.', date: '2 days ago' },
  { text: 'Mock Assessment Scheduled', meta: 'Scheduled for 26 May 2025.', date: '3 days ago' },
  { text: 'Center will remain closed on 15 May 2025.', meta: '', date: '5 days ago' },
];

const FALLBACK_MATERIALS = [
  { type: 'pdf', name: 'Retail Sales Handbook.pdf', meta: '2.4 MB' },
  { type: 'video', name: 'Customer Handling Video', meta: '12.5 MB' },
  { type: 'doc', name: 'Daily Sales Practice Worksheet.docx', meta: '1.1 MB' },
  { type: 'link', name: 'Industry Insights (External Link)', meta: null },
];

const FALLBACK_TASKS = [
  { icon: 'resume', title: 'Submit Resume', due: 'Due on 25 May 2025', count: 1 },
  { icon: 'quiz', title: 'Complete Quiz', due: 'Due on 26 May 2025', count: 2 },
  { icon: 'certificate', title: 'Upload Certificate', due: 'Due on 28 May 2025', count: 1 },
];

const STREAK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/* --------------------------------- HELPERS --------------------------------- */

const MaterialIcon = ({ type }) => {
  if (type === 'pdf') return <FileText size={18} />;
  if (type === 'video') return <MonitorPlay size={18} />;
  if (type === 'doc') return <FileText size={18} />;
  return <LinkIcon size={18} />;
};

const TaskIcon = ({ icon }) => {
  if (icon === 'quiz') return <ClipboardList size={18} />;
  if (icon === 'certificate') return <Award size={18} />;
  return <FileText size={18} />;
};

const MATERIAL_ICON_CLASSES = {
  pdf: 'bg-rose-100 text-rose-600',
  video: 'bg-violet-100 text-violet-600',
  doc: 'bg-blue-100 text-blue-600',
  link: 'bg-emerald-100 text-emerald-600',
};

const TAG_CLASSES = {
  tomorrow: 'bg-emerald-100 text-emerald-700',
  upcoming: 'bg-blue-100 text-blue-700',
};

// Builds a conic-gradient string for a donut chart from [{ value, color }]
const buildConicGradient = (segments, total) => {
  let cursor = 0;
  const stops = segments.map((seg) => {
    const start = (cursor / total) * 360;
    cursor += seg.value;
    const end = (cursor / total) * 360;
    return `${seg.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${stops.join(', ')})`;
};

const Donut = ({ segments, total, centerValue, centerLabel, size = 140 }) => (
  <div
    className="relative shrink-0 rounded-full grid place-items-center"
    style={{ width: size, height: size, background: buildConicGradient(segments, total) }}
  >
    <div className="flex flex-col items-center justify-center rounded-full bg-white" style={{ width: '68%', height: '68%' }}>
      <strong className="text-xl text-gray-800">{centerValue}</strong>
      <span className="text-[11px] text-gray-400">{centerLabel}</span>
    </div>
  </div>
);

// Circular progress ring — replaces flat stat icons for the "at a glance" numbers
const Ring = ({ percent, size = 56, stroke = 5, color = '#f43f5e', track = '#f1f1f4' }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(Math.max(percent, 0), 100) / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

const LineChart = ({ labels, series, width = 460, height = 170 }) => {
  const padding = 30;
  const chartW = width - padding * 2;
  const chartH = height - padding;
  const maxVal = 100;
  const pointsFor = (values) =>
    values
      .map((val, i) => {
        const x = padding + (i / (values.length - 1)) * chartW;
        const y = height - padding * 0.6 - (val / maxVal) * chartH;
        return `${x},${y}`;
      })
      .join(' ');

  const grid = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      {grid.map((g) => {
        const y = height - padding * 0.6 - (g / maxVal) * chartH;
        return (
          <g key={g}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#eef2f7" strokeWidth="1" />
            <text x={0} y={y + 4} fontSize="10" fill="#9ca3af">{g}%</text>
          </g>
        );
      })}
      {series.map((s) => (
        <polyline
          key={s.name}
          points={pointsFor(s.values)}
          fill="none"
          stroke={s.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {series.map((s) =>
        s.values.map((val, i) => {
          const x = padding + (i / (s.values.length - 1)) * chartW;
          const y = height - padding * 0.6 - (val / maxVal) * chartH;
          return <circle key={`${s.name}-${i}`} cx={x} cy={y} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />;
        })
      )}
      {labels.map((label, i) => {
        const x = padding + (i / (labels.length - 1)) * chartW;
        return (
          <text key={label} x={x} y={height - 4} fontSize="10" fill="#9ca3af" textAnchor="middle">
            {label}
          </text>
        );
      })}
    </svg>
  );
};

/* ------------------------------- SHARED ATOMS ------------------------------- */

// Small tracked uppercase caption — the "eyebrow" structural device, kept in the
// original light gray tone instead of the reference's mono/dark styling.
const Eyebrow = ({ children }) => (
  <p className="text-[10.5px] font-semibold tracking-[0.12em] text-gray-400 m-0">{children}</p>
);

const Panel = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col ${className}`}>{children}</div>
);

const CardShell = ({ title, action, children, className = '' }) => (
  <Panel className={className}>
    {title && (
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[15px] font-semibold text-gray-800 m-0">{title}</h4>
        {action}
      </div>
    )}
    {children}
  </Panel>
);

const ViewLink = ({ to, children }) => (
  <Link to={to} className="inline-flex items-center gap-1 text-[13px] font-medium text-rose-500 hover:text-rose-600">
    {children}
  </Link>
);

const StatIcon = ({ tone, children }) => {
  const tones = {
    pink: 'bg-rose-100 text-rose-500',
    green: 'bg-emerald-100 text-emerald-500',
    orange: 'bg-orange-100 text-orange-500',
    purple: 'bg-violet-100 text-violet-500',
    blue: 'bg-blue-100 text-blue-500',
  };
  return <span className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${tones[tone]}`}>{children}</span>;
};

/* -------------------------------- DASHBOARD -------------------------------- */

const CandidateDashboard = () => {
  const backendUrl = process.env.REACT_APP_MIPIE_BACKEND_URL;
  const bucketUrl = process.env.REACT_APP_MIPIE_BUCKET_URL;
  const token = localStorage.getItem('token');
  const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');

  const [profile, setProfile] = useState(sessionUser);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const headers = { 'x-auth': token };
        const [profileRes, coursesRes, assignmentsRes] = await Promise.allSettled([
          axios.get(`${backendUrl}/candidate/getProfile`, { headers }),
          axios.get(`${backendUrl}/candidate/enrolledCourses`, { headers }),
          axios.get(`${backendUrl}/candidate/assignments`, { headers }),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data?.status) {
          const candidate = profileRes.value.data.data?.candidate || {};
          setProfile((prev) => ({ ...prev, ...candidate }));
        }

        if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.status) {
          const courses = coursesRes.value.data.data?.courses || [];
          setCourse(courses[0] || null);
        }

        if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value.data?.status) {
          const assignments = assignmentsRes.value.data.data || [];
          const done = assignments.filter((item) => item.submitted || item.status === 'submitted').length;
          setProfile((prev) => ({
            ...prev,
            academics: {
              ...(prev.academics || {}),
              assignmentsDone: done,
              assignmentsTotal: assignments.length || undefined,
            },
          }));
        }
      } catch (error) {
        console.error('Dashboard load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [backendUrl, token]);

  const academics = useMemo(() => {
    const fromProfile = profile?.academics || {};
    return {
      rank: fromProfile.rank || profile?.rank || FALLBACK_ACADEMICS.rank,
      totalStudents: fromProfile.totalStudents || FALLBACK_ACADEMICS.totalStudents,
      grade: fromProfile.grade || profile?.grade || FALLBACK_ACADEMICS.grade,
      gradeNote: fromProfile.gradeNote || FALLBACK_ACADEMICS.gradeNote,
      attendance: Number(fromProfile.attendance ?? profile?.attendanceStats?.percentage ?? FALLBACK_ACADEMICS.attendance),
      present: fromProfile.present || FALLBACK_ACADEMICS.present,
      absent: fromProfile.absent || FALLBACK_ACADEMICS.absent,
      total: fromProfile.total || FALLBACK_ACADEMICS.total,
      monthAttendance: fromProfile.monthAttendance || FALLBACK_ACADEMICS.monthAttendance,
      totalSessions: fromProfile.totalSessions || FALLBACK_ACADEMICS.totalSessions,
      completedSessions: fromProfile.completedSessions || FALLBACK_ACADEMICS.completedSessions,
      upcomingCount: fromProfile.upcomingCount || FALLBACK_ACADEMICS.upcomingCount,
      theory: fromProfile.theory || FALLBACK_ACADEMICS.theory,
      practical: fromProfile.practical || FALLBACK_ACADEMICS.practical,
      softSkills: fromProfile.softSkills || FALLBACK_ACADEMICS.softSkills,
      overall: fromProfile.overall || course?.progress || FALLBACK_ACADEMICS.overall,
      assessmentAvg: fromProfile.assessmentAvg || FALLBACK_ACADEMICS.assessmentAvg,
      assessmentsTaken: fromProfile.assessmentsTaken || FALLBACK_ACADEMICS.assessmentsTaken,
      assessmentsTotal: fromProfile.assessmentsTotal || FALLBACK_ACADEMICS.assessmentsTotal,
      assessmentBreakdown: fromProfile.assessmentBreakdown || FALLBACK_ACADEMICS.assessmentBreakdown,
      performanceTrend: fromProfile.performanceTrend || FALLBACK_ACADEMICS.performanceTrend,
      strengths: fromProfile.strengths || FALLBACK_ACADEMICS.strengths,
      improvements: fromProfile.improvements || FALLBACK_ACADEMICS.improvements,
      streak: fromProfile.streak ?? FALLBACK_ACADEMICS.streak,
    };
  }, [profile, course]);

  const sessions = course?.upcomingSessions || FALLBACK_SESSIONS;
  const announcements = profile?.announcements || FALLBACK_ANNOUNCEMENTS;
  const materials = course?.materials || FALLBACK_MATERIALS;
  const tasks = profile?.pendingTasks || FALLBACK_TASKS;

  const student = {
    name: profile?.name || sessionUser?.name || 'Student',
    courseName: course?._course?.name || profile?.courseName || 'Retail Sales Associate',
    batchName: course?.batch?.name || profile?.batchName || 'RSA-APR-25-01',
    centerName: course?.center?.name || profile?.centerName || 'Jaipur Training Center',
    trainerName: course?.trainer?.name || profile?.trainerName || 'Mr. Amit Verma',
    duration: course?.duration || profile?.courseDuration || 'Jan 2025 - Jun 2025',
    image: resolveMediaUrl(bucketUrl, profile?.personalInfo?.image || profile?.image),
    courseImage: resolveMediaUrl(bucketUrl, course?.image) || null,
    firstName: (profile?.name || sessionUser?.name || 'Student').split(' ')[0],
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const nextSession = sessions[0];
  const assessmentTotal = academics.assessmentBreakdown.reduce((sum, item) => sum + item.count, 0);
  const attendanceSegments = [
    { value: academics.present, color: '#22c55e' },
    { value: academics.absent, color: '#ef4444' },
    { value: Math.max(academics.total - academics.present - academics.absent, 0), color: '#e5e7eb' },
  ];
  const assessmentSegments = academics.assessmentBreakdown.map((item) => ({ value: item.count, color: item.color }));

  return (
    <div className="font-sans text-gray-800">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <Eyebrow>SESSION ACTIVE · {todayLabel}</Eyebrow>
          <h3 className="text-xl sm:text-2xl font-bold mt-1.5 mb-1">
            {loading ? 'Welcome back!' : `Welcome back, ${student.firstName}!`} 👋
          </h3>
          <p className="text-gray-500 text-sm m-0">Keep learning and building your future.</p>
        </div>
        <Panel className="max-w-xs !py-3">
          <p className="text-[12.5px] leading-snug italic text-gray-500 m-0">
            "The future depends on what you do today."
          </p>
        </Panel>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-5">
        <Panel className="!p-4">
          <Eyebrow>PROGRESS</Eyebrow>
          <div className="flex items-center gap-3 mt-3">
            <div className="relative shrink-0">
              <Ring percent={academics.overall} color="#f43f5e" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                {academics.overall}%
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold m-0">{academics.overall}%</h4>
              <small className="text-gray-400">{academics.completedSessions}/{academics.totalSessions} sessions</small>
            </div>
          </div>
        </Panel>

        <Panel className="!p-4">
          <Eyebrow>ATTENDANCE</Eyebrow>
          <div className="flex items-center gap-3 mt-3">
            <div className="relative shrink-0">
              <Ring percent={academics.attendance} color="#22c55e" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                {academics.attendance}%
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold m-0">{academics.attendance}%</h4>
              <small className="text-gray-400">{academics.monthAttendance}% this month</small>
            </div>
          </div>
        </Panel>

        <Panel className="!p-4">
          <Eyebrow>NEXT SESSION</Eyebrow>
          <div className="flex items-center gap-2 mt-3.5">
            <StatIcon tone="orange"><Clock3 size={18} /></StatIcon>
            <div>
              <h4 className="text-base font-bold m-0">{nextSession?.day} {nextSession?.month}</h4>
              <small className="text-gray-400 truncate block max-w-[120px]">{nextSession?.title}</small>
            </div>
          </div>
        </Panel>

        <Panel className="!p-4">
          <Eyebrow>CURRENT RANK</Eyebrow>
          <div className="flex items-center gap-2 mt-3.5">
            <StatIcon tone="purple"><Trophy size={18} /></StatIcon>
            <div>
              <h4 className="text-lg font-bold m-0">
                #{academics.rank}<span className="text-gray-400 text-sm"> /{academics.totalStudents}</span>
              </h4>
              <small className="text-gray-400">in your batch</small>
            </div>
          </div>
        </Panel>

        <Panel className="!p-4">
          <Eyebrow>GRADE</Eyebrow>
          <div className="flex items-center gap-2 mt-3.5">
            <StatIcon tone="blue"><ShieldCheck size={18} /></StatIcon>
            <div>
              <h4 className="text-lg font-bold m-0">{academics.grade}</h4>
              <small className="text-gray-400">{academics.gradeNote}</small>
            </div>
          </div>
        </Panel>
      </div>

      {/* Hero course card + Upcoming sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 relative overflow-hidden bg-white rounded-2xl shadow-sm p-7 sm:p-8">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-md">
              <Eyebrow>ACTIVE COURSE</Eyebrow>
              <h2 className="text-[22px] font-bold mt-2 mb-3">{student.courseName}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-gray-500 mb-5">
                <span className="flex items-center gap-1"><User size={12} /> {student.batchName}</span>
                <span className="flex items-center gap-1"><Phone size={12} /> {student.trainerName}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {student.centerName}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {student.duration}</span>
              </div>
              <Link
                to="/candidate/course"
                className="inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
              >
                View Full Course <ArrowRight size={15} />
              </Link>
            </div>
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <Ring percent={academics.overall} size={104} stroke={7} color="#F0B94D" track="#f1f1f4" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-bold leading-none text-gray-800">{academics.overall}%</span>
                <span className="text-[9.5px] mt-1 text-gray-400">
                  {academics.completedSessions}/{academics.totalSessions}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardShell title="Upcoming Sessions" action={<ViewLink to="/candidate/session-calendar"><Calendar size={13} /> View</ViewLink>}>
          <div className="flex-1">
            {sessions.slice(0, 3).map((session) => (
              <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-none" key={`${session.day}-${session.title}`}>
                <div className="bg-rose-100 text-rose-500 rounded-lg text-center px-2.5 py-1.5 min-w-[52px]">
                  <span className="block font-bold text-[15px] leading-tight">{session.day}</span>
                  <span className="block text-[11px] uppercase leading-tight">{session.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="block text-[13px] truncate">{session.title}</strong>
                  <small className="flex items-center gap-1 text-gray-500 text-[11px]"><Clock size={12} /> {session.time}</small>
                </div>
                <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap ${TAG_CLASSES[String(session.tag).toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                  {session.tag}
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      {/* Quick access */}
      <div className="mb-5">
        <Eyebrow>QUICK ACCESS</Eyebrow>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-3">
          {[
            { l: 'Learning Material', icon: Library, tone: 'blue', to: '/candidate/learning-material' },
            { l: 'Assignments', icon: FileEdit, tone: 'orange', to: '/candidate/assignments' },
            { l: 'Assessments & Quiz', icon: ClipboardCheck, tone: 'green', to: '/candidate/assessments' },
            { l: 'Attendance', icon: CheckSquare, tone: 'blue', to: '/candidate/attendance' },
            { l: 'Certificates', icon: Award, tone: 'pink', to: '/candidate/certificates' },
          ].map(({ l, icon: Icon, tone, to }) => (
            <Link
              key={l}
              to={to}
              className="flex flex-col items-center gap-2.5 rounded-2xl bg-white shadow-sm py-5 px-2 hover:shadow-md transition-shadow"
            >
              <StatIcon tone={tone}><Icon size={18} /></StatIcon>
              <span className="text-[11px] font-medium text-center leading-tight text-gray-600">{l}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Materials / Pending tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <CardShell title="Latest Learning Material" action={<ViewLink to="/candidate/learning-material">View All</ViewLink>}>
          <div className="flex-1">
            {materials.map((item) => (
              <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-none" key={item.name}>
                <span className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${MATERIAL_ICON_CLASSES[item.type]}`}>
                  <MaterialIcon type={item.type} />
                </span>
                <div className="flex-1">
                  <strong className="block text-[13px]">{item.name}</strong>
                  {item.meta && <small className="text-gray-400">{item.meta}</small>}
                </div>
                {item.type === 'link' ? (
                  <ExternalLink size={16} className="text-gray-400" />
                ) : (
                  <Download size={16} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell title="Pending Tasks" action={<ViewLink to="/candidate/assignments">View All</ViewLink>}>
          <div className="flex-1">
            {tasks.map((task) => (
              <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-none" key={task.title}>
                <span
                  className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${
                    MATERIAL_ICON_CLASSES[task.icon === 'quiz' ? 'doc' : task.icon === 'certificate' ? 'link' : 'pdf']
                  }`}
                >
                  <TaskIcon icon={task.icon} />
                </span>
                <div className="flex-1">
                  <strong className="block text-[13px]">{task.title}</strong>
                  <small className="text-gray-400">{task.due}</small>
                </div>
                <span className="rounded-full bg-rose-100 text-rose-500 grid place-items-center text-[11px] font-bold shrink-0" style={{ width: 22, height: 22 }}>
                  {task.count}
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      {/* Attendance / Rank & grade / Assessment summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <CardShell title="Attendance Overview">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center justify-center w-full gap-6">
              <Donut segments={attendanceSegments} total={academics.total} centerValue={`${academics.attendance}%`} centerLabel="Overall" />
              <div className="text-[13px]">
                <div className="flex items-center gap-2 py-1 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Present <b className="ml-auto">{academics.present}</b>
                </div>
                <div className="flex items-center gap-2 py-1 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Absent <b className="ml-auto">{academics.absent}</b>
                </div>
                <div className="flex items-center gap-2 py-1 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Total <b className="ml-auto">{academics.total}</b>
                </div>
              </div>
            </div>
            <div className="w-full mt-4 bg-emerald-100 text-emerald-700 rounded-xl px-4 py-2.5 flex items-center justify-between text-[13px] font-semibold">
              <span>This Month Attendance</span>
              <strong>{academics.monthAttendance}%</strong>
            </div>
          </div>
        </CardShell>

        <CardShell title="Rank & Grade" action={<Sparkles size={16} className="text-gray-400" />}>
          <div className="flex items-center gap-3.5 py-2.5 border-b border-gray-100">
            <StatIcon tone="orange"><Trophy size={22} /></StatIcon>
            <div>
              <p className="text-gray-500 text-sm m-0">Rank</p>
              <h4 className="text-lg font-bold m-0">{academics.rank}<span className="text-gray-400 text-sm"> / {academics.totalStudents}</span></h4>
              <small className="text-gray-400">In Your Batch</small>
            </div>
          </div>
          <div className="flex items-center gap-3.5 py-2.5">
            <StatIcon tone="purple"><Award size={22} /></StatIcon>
            <div>
              <p className="text-gray-500 text-sm m-0">Grade</p>
              <h4 className="text-lg font-bold m-0">{academics.grade}</h4>
              <small className="text-gray-400">{academics.gradeNote}</small>
            </div>
          </div>
          <Link to="/candidate/attendance" className="block text-right text-rose-500 font-semibold text-[12.5px] mt-2 hover:text-rose-600">
            View Performance Details →
          </Link>
        </CardShell>

        <CardShell title="Assessment Summary" action={<ViewLink to="/candidate/assessments">View All</ViewLink>}>
          <div className="flex items-center gap-4">
            <Donut segments={assessmentSegments} total={assessmentTotal} centerValue={`${academics.assessmentAvg}%`} centerLabel="Average" size={120} />
            <div className="flex-1 text-[12px]">
              {academics.assessmentBreakdown.map((item) => (
                <div className="flex items-center justify-between py-1 text-gray-600" key={item.label}>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: item.color }} /> {item.label}
                  </span>
                  <b>{item.count}</b>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      </div>

      {/* Performance trend / Announcements / Performance overview ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <CardShell title="Performance Trend">
          <LineChart
            labels={academics.performanceTrend.labels}
            series={[
              { name: 'Attendance', color: '#FC2B5A', values: academics.performanceTrend.attendance },
              { name: 'Assessment Score', color: '#2E7CF6', values: academics.performanceTrend.assessment },
            ]}
          />
          <div className="flex justify-center gap-5 mt-2">
            <span className="flex items-center gap-2 text-[13px] text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Attendance
            </span>
            <span className="flex items-center gap-2 text-[13px] text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Assessment Score
            </span>
          </div>
        </CardShell>

        <CardShell title="Announcements" action={<ViewLink to="/candidate/announcements">View All</ViewLink>}>
          <div className="flex-1">
            {announcements.map((item) => (
              <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-none" key={item.text}>
                <span className="w-9 h-9 rounded-lg bg-orange-100 text-orange-500 grid place-items-center shrink-0">
                  <Megaphone size={16} />
                </span>
                <div>
                  <p className="text-[13px] font-medium m-0">{item.text}</p>
                  {item.meta && <small className="text-gray-400 block">{item.meta}</small>}
                  <small className="text-gray-400">{item.date}</small>
                </div>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell title="Performance Overview" action={<ViewLink to="/candidate/assessments">Details</ViewLink>}>
          <div className="flex items-center gap-6 mt-1">
            <div className="relative shrink-0">
              <Ring percent={academics.assessmentAvg} size={82} stroke={7} color="#2E7CF6" track="#f1f1f4" />
              <div className="absolute inset-0 flex items-center justify-center text-[15px] font-bold text-gray-800">
                {academics.assessmentAvg}%
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10.5px] text-gray-400 m-0">AVG SCORE</p>
                <p className="text-[17px] font-bold flex items-center gap-1 m-0">
                  {academics.assessmentAvg}% <ArrowUpRight size={13} className="text-emerald-500" />
                </p>
              </div>
              <div>
                <p className="text-[10.5px] text-gray-400 m-0">ASSESSMENTS TAKEN</p>
                <p className="text-[17px] font-bold m-0">
                  {academics.assessmentsTaken}<span className="text-[12px] text-gray-400"> / {academics.assessmentsTotal}</span>
                </p>
              </div>
            </div>
          </div>
        </CardShell>
      </div>

      {/* Course overview / Strength & improvement / Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <CardShell title="My Course Overview" action={<ViewLink to="/candidate/course">View Details</ViewLink>}>
          <div className="w-full h-28 rounded-xl overflow-hidden bg-rose-100 text-rose-500 grid place-items-center mb-3">
            {student.courseImage ? (
              <img src={student.courseImage} alt={student.courseName} className="w-full h-full object-cover" />
            ) : (
              <BookOpen size={26} />
            )}
          </div>
          <div className="flex justify-between mb-1 text-[13px] text-gray-600">
            <span>Course Progress</span>
            <strong>{academics.overall}%</strong>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${academics.overall}%` }} />
          </div>
          <div className="flex justify-between text-center mt-1">
            {[
              ['Theory', academics.theory],
              ['Practical', academics.practical],
              ['Soft Skills', academics.softSkills],
              ['Overall', academics.overall],
            ].map(([label, value]) => (
              <div className="flex flex-col" key={label}>
                <small className="text-gray-400 text-[11px]">{label}</small>
                <strong className="text-[13px]">{value}%</strong>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell title="Strength & Improvement Areas">
          <p className="text-[10.5px] font-semibold text-gray-400 mb-2">STRENGTH</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {academics.strengths.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-100 text-emerald-700">
                {t}
              </span>
            ))}
          </div>
          <p className="text-[10.5px] font-semibold text-gray-400 mb-2">IMPROVE</p>
          <div className="flex flex-wrap gap-2">
            {academics.improvements.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-100 text-rose-600">
                {t}
              </span>
            ))}
          </div>
        </CardShell>

        <CardShell
          title="Learning Streak"
          action={
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100">
              <Flame size={13} className="text-orange-500" />
              <span className="text-[12px] font-semibold text-orange-500">{academics.streak} DAYS</span>
            </span>
          }
        >
          <div className="flex justify-between mt-2">
            {STREAK_DAYS.map((d, i) => {
              const done = i < academics.streak;
              return (
                <div key={d} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${done ? 'bg-rose-100' : 'bg-gray-50'}`}>
                    {done && <span className="text-rose-500 text-[12px] font-bold">✓</span>}
                  </div>
                  <span className="text-[9px] text-gray-400">{d}</span>
                </div>
              );
            })}
          </div>
        </CardShell>
      </div>

      {/* Footer help banner */}
      <div className="relative overflow-hidden bg-blue-50 rounded-2xl px-6 py-4.5 flex items-center justify-between flex-wrap gap-3.5 mb-5" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
        <div className="relative flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-rose-500 text-white grid place-items-center shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <strong className="block">Need Help or Guidance?</strong>
            <small className="text-gray-500">Our counselors are here to help you with any queries.</small>
          </div>
        </div>
        <Link
          to="/candidate/support"
          className="relative inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5 font-semibold text-[13px]"
        >
          <MessageCircle size={14} /> Contact Counselor
        </Link>
      </div>
    </div>
  );
};

export default CandidateDashboard;