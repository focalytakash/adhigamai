import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, Download, FileText, MessageCircle } from "lucide-react";
import siteConfig from "../../../config/siteConfig";
import "./Hackathon.css";

const HomePage = () => {
  const { name } = siteConfig.branding;
  const backendUrl = process.env.REACT_APP_ADHIGAM_BACKEND_URL;
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openTeams, setOpenTeams] = useState({});
  const [downloading, setDownloading] = useState(false);

  const toggleTeam = (teamId) => {
    setOpenTeams((current) => ({ ...current, [teamId]: !current[teamId] }));
  };

  const downloadExcel = async () => {
    if (!teams.length || downloading) return;

    setDownloading(true);
    try {
      const XLSX = await import("xlsx");
      const maxOtherMembers = Math.max(
        0,
        ...teams.map((team) => {
          const members = team.members || [];
          const others = members.filter((m) => !m.isLeader);
          // If no leader flagged, first person is treated as leader
          return members.some((m) => m.isLeader) ? others.length : Math.max(0, members.length - 1);
        })
      );

      const memberCols = [];
      for (let i = 1; i <= maxOtherMembers; i += 1) {
        memberCols.push(
          `Member ${i} Name`,
          `Member ${i} Email`,
          `Member ${i} Contact`,
          `Member ${i} Roll No`
        );
      }

      const headers = [
        "Team ID",
        "Team Name",
        "College",
        "Course",
        "Year",
        "Category",
        "Problem Statement",
        "Problem Code",
        "Problem Description",
        "Leader Name",
        "Leader Email",
        "Leader Contact",
        "Leader Roll No",
        ...memberCols,
        "Registered At",
      ];

      const formatRegisteredAt = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      const rows = [headers];
      teams.forEach((team) => {
        const members = team.members?.length ? [...team.members] : [];
        const leader =
          members.find((m) => m.isLeader) || members[0] || {};
        const others = members.filter((m) => m !== leader);

        const memberValues = [];
        for (let i = 0; i < maxOtherMembers; i += 1) {
          const member = others[i] || {};
          memberValues.push(
            member.name || "",
            member.email || "",
            member.mobile || "",
            member.roll || ""
          );
        }

        rows.push([
          team.teamId || "",
          team.teamName || "",
          team.collegeName || "",
          team.course || "",
          team.yearOfStudy || "",
          team.category || "",
          team.problemStatement || "",
          team.problemCode || "",
          team.problemDesc || "",
          leader.name || team.leaderName || "",
          leader.email || "",
          leader.mobile || "",
          leader.roll || "",
          ...memberValues,
          formatRegisteredAt(team.registeredAt || team.createdAt),
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      worksheet["!cols"] = headers.map((header) => ({
        wch: Math.min(Math.max(header.length + 2, 14), 40),
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
      XLSX.writeFile(
        workbook,
        `hackathon-registrations-${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Excel download failed:", error);
      alert("Failed to download Excel file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!backendUrl) {
      setStatus("error");
      return undefined;
    }

    let cancelled = false;
    axios
      .get(`${backendUrl}/api/v1/hackathon`)
      .then((response) => {
        if (cancelled) return;
        setTeams(Array.isArray(response.data?.data) ? response.data.data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [backendUrl]);

  return (
    <div className="hackathon-page">
      <div className="hackathon-wrap hack-teams-wrap">
        <header className="hackathon-header">
          <div className="hackathon-kicker">
            <span className="dot" />
            {name} AI Hackathon
          </div>
          <h1>
            Registered <span className="accent">teams</span>
          </h1>
          <div className="hackathon-sub">
            {status === "ready"
              ? `${teams.length} team${teams.length === 1 ? "" : "s"} registered.`
              : "Teams that have submitted their registration."}
          </div>
          <div className="hackathon-header-links">
            <a
              className="hackathon-guide-link is-light"
              href={siteConfig.hackathon?.rulebookPdf || "/Assets/pdf/Hackathon_Rulebook.pdf"}
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={16} />
              Hackathon guidelines
            </a>
            {siteConfig.hackathon?.whatsappGroup ? (
              <a
                className="hackathon-guide-link is-light is-whatsapp"
                href={siteConfig.hackathon.whatsappGroup}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} />
                Join WhatsApp group
              </a>
            ) : null}
            {status === "ready" && teams.length > 0 ? (
              <button
                type="button"
                className="hackathon-guide-link is-light"
                onClick={downloadExcel}
                disabled={downloading}
              >
                <Download size={16} />
                {downloading ? "Preparing…" : "Download Excel"}
              </button>
            ) : null}
          </div>
        </header>

        {status === "loading" ? <p className="hack-teams-status">Loading registrations…</p> : null}
        {status === "error" ? (
          <p className="hack-teams-status is-error">Could not load registrations. Please refresh.</p>
        ) : null}
        {status === "ready" && teams.length === 0 ? (
          <p className="hack-teams-status">No teams have registered yet.</p>
        ) : null}

        {status === "ready" && teams.length > 0 ? (
          <div className="hack-reg-scroll">
            <table className="hack-reg-table">
              <thead>
                <tr>
                  <th>Team ID</th>
                  <th>Team</th>
                  <th>College</th>
                  <th>Category</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const members = team.members?.length ? team.members : [];
                  const open = Boolean(openTeams[team.teamId]);
                  const collegeLine = [team.collegeName, team.course, team.yearOfStudy].filter(Boolean).join(" · ");
                  return (
                    <Fragment key={team.teamId}>
                      <tr className="hack-reg-team">
                        <td className="hack-reg-id">{team.teamId}</td>
                        <td className="hack-reg-team-name">{team.teamName}</td>
                        <td className="hack-reg-college">{collegeLine || "—"}</td>
                        <td className="hack-reg-category">
                          <div className="hack-reg-cat">{team.category || "—"}</div>
                          {team.problemStatement ? (
                            <div className="hack-reg-sub">{team.problemStatement}</div>
                          ) : null}
                        </td>
                        <td className="hack-reg-actions">
                          <button
                            type="button"
                            className={`hack-reg-toggle${open ? " is-open" : ""}`}
                            aria-expanded={open}
                            onClick={() => toggleTeam(team.teamId)}
                          >
                            {open ? "Hide" : "View"}
                            <span>{members.length}</span>
                            <ChevronDown size={16} />
                          </button>
                        </td>
                      </tr>
                      <tr className="hack-reg-members-row">
                        <td colSpan={5}>
                          <div className={`hack-reg-collapse${open ? " is-open" : ""}`}>
                            <div className="hack-reg-collapse-inner">
                              {team.problemDesc ? (
                                <div className="hack-reg-problem">
                                  <div className="hack-reg-problem-title">Problem description</div>
                                  <p>{team.problemDesc}</p>
                                </div>
                              ) : null}
                              <table className="hack-reg-members">
                                <thead>
                                  <tr>
                                    <th>Member</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Roll no</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {members.length ? (
                                    members.map((member, index) => (
                                      <tr key={`${team.teamId}-${member.email || index}`}>
                                        <td>
                                          {member.name || "—"}
                                          {member.isLeader ? <span className="hack-reg-leader">Leader</span> : null}
                                        </td>
                                        <td>{member.email || "—"}</td>
                                        <td className="hack-reg-nowrap">{member.mobile || "—"}</td>
                                        <td className="hack-reg-nowrap">{member.roll || "—"}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4}>No members listed.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
