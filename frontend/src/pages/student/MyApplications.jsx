import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Coins,
    MapPin,
    Calendar,
    Clock,
    SendHorizonal,
    CheckCircle2,
    XCircle,
    Trophy,
    HelpCircle,
    Inbox,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./MyApplications.css";

/* Maps each application status to an icon + a CSS custom-property pair
   that drives the pill's background/foreground color (see .css file). */
const STATUS_META = {
    APPLIED: { icon: SendHorizonal, fg: "var(--status-applied)", bg: "var(--status-applied-tint)" },
    SHORTLISTED: { icon: CheckCircle2, fg: "var(--status-shortlisted)", bg: "var(--status-shortlisted-tint)" },
    REJECTED: { icon: XCircle, fg: "var(--status-rejected)", bg: "var(--status-rejected-tint)" },
    HIRED: { icon: Trophy, fg: "var(--status-hired)", bg: "var(--status-hired-tint)" },
};

const StatusPill = ({ status }) => {
    const meta = STATUS_META[status] || { icon: HelpCircle, fg: "var(--status-default)", bg: "var(--status-default-tint)" };
    const StatusIcon = meta.icon;

    return (
        <span
            className="asq-status-pill"
            style={{ "--pill-fg": meta.fg, "--pill-bg": meta.bg }}
        >
            <StatusIcon size={13} />
            {status}
        </span>
    );
};

const MetaRow = ({ icon: IconCmp, label, value }) => (
    <div className="asq-meta-row">
        <span className="asq-meta-icon">
            <IconCmp size={15} />
        </span>
        <span className="asq-meta-label">{label}</span>
        <span className="asq-meta-value">{value}</span>
    </div>
);

const MyApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get(
                "/companies/student/my-applications/"
            );

            setApplications(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="asq-applications">
                    <div className="asq-grid">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="asq-skeleton-card">
                                <div className="asq-skel asq-skel-title" />
                                <div className="asq-skel asq-skel-sub" />
                                <div className="asq-skel asq-skel-line" />
                                <div className="asq-skel asq-skel-line" />
                                <div className="asq-skel asq-skel-line" />
                            </div>
                        ))}
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/student/dashboard")} />

        <div className="asq-applications">
            {/* ---------- Hero ---------- */}
            <div className="asq-hero">
                <svg className="asq-hero-motif" viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M40 60 100 120 40 180 40 60Z" stroke="rgba(255,255,255,0.28)" strokeWidth="6" strokeLinejoin="round" />
                    <path d="M120 60 180 120 120 180 120 60Z" stroke="rgba(255,255,255,0.16)" strokeWidth="6" strokeLinejoin="round" />
                    <path d="M280 160 340 220 280 280 280 160Z" stroke="rgba(255,255,255,0.14)" strokeWidth="5" strokeLinejoin="round" />
                    <path d="M350 20 410 80 350 140 350 20Z" stroke="rgba(255,255,255,0.1)" strokeWidth="5" strokeLinejoin="round" />
                </svg>

                <div className="asq-hero-content">
                    <span className="asq-hero-eyebrow">
                        <ClipboardList size={13} />
                        Application Tracker
                    </span>
                    <h1 className="asq-hero-title">My Job Applications</h1>
                    <p className="asq-hero-subtitle">
                        Every role you've applied to, with its current status, in one place.
                    </p>

                    {applications.length > 0 && (
                        <div className="asq-hero-chip">
                            <ClipboardList size={16} />
                            {applications.length} {applications.length === 1 ? "application" : "applications"} submitted
                        </div>
                    )}
                </div>
            </div>

            {/* ---------- Body ---------- */}
            {applications.length === 0 ? (
                <div className="asq-empty-state">
                    <Inbox size={48} color="#D3004C" />
                    <h2 className="asq-empty-title">No applications yet</h2>
                    <p className="asq-empty-text">
                        You haven't applied for any jobs. Browse open roles and submit your first application.
                    </p>
                    <button
                        className="asq-cta-inline"
                        onClick={() => navigate("/student/jobs")}
                    >
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <div className="asq-grid">
                    {applications.map((app) => (
                        <article key={app.id} className="asq-card">
                            <div className="asq-card-accent" />

                            <div className="asq-card-body">
                                <div className="asq-card-top">
                                    <div>
                                        <h2 className="asq-job-title">{app.job_title}</h2>
                                        <p className="asq-company">{app.company_name}</p>
                                    </div>

                                    <StatusPill status={app.status} />
                                </div>

                                <div className="asq-meta-list">
                                    <MetaRow icon={Coins} label="Package" value={app.package || "Not disclosed"} />
                                    <MetaRow icon={MapPin} label="Location" value={app.location || "Not specified"} />
                                    <MetaRow
                                        icon={Calendar}
                                        label="Last date"
                                        value={new Date(app.deadline).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    />
                                    <MetaRow
                                        icon={Clock}
                                        label="Applied on"
                                        value={new Date(app.applied_at).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    />
                                </div>
                            </div>

                            <button
                                className="asq-cta"
                                onClick={() => navigate(`/student/jobs/${app.job}`)}
                            >
                                View Job
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default MyApplications;