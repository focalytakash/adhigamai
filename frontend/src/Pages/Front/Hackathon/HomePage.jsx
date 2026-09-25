import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, FileText, MessageCircle } from "lucide-react";
import siteConfig from "../../../config/siteConfig";
import "./Hackathon.css";

const HomePage = () => {
  const { name } = siteConfig.branding;
  const backendUrl = process.env.REACT_APP_ADHIGAM_BACKEND_URL;
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openTeams, setOpenTeams] = useState({});

  const toggleTeam = (teamId) => {
    setOpenTeams((current) => ({ ...current, [teamId]: !current[teamId] }));
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
