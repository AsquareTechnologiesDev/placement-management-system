import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Mail,
    Building2,
    Briefcase,
    GraduationCap,
    FileText,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock,
    Star,
    Loader2,
    AlertCircle,
    RefreshCw,
    Inbox,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Applications.css";

const PAGE_SIZE = 8;

const STATUS_CONFIG = {
    HIRED: { label: "Hired", icon: CheckCircle2, className: "ap-chip-hired" },
    SHORTLISTED: { label: "Shortlisted", icon: Star, className: "ap-chip-shortlisted" },
    REJECTED: { label: "Rejected", icon: XCircle, className: "ap-chip-rejected" },
    PENDING: { label: "Pending", icon: Clock, className: "ap-chip-pending" },
};

const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("");
};

const Applications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, statusFilter]);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/companies/applications/");
            setApplications(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load applications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    };

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
            if (!matchesStatus) return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            return [app.student_name, app.student_email, app.company_name, app.job_title]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q));
        });
    }, [applications, searchQuery, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredApplications.length / PAGE_SIZE));
    const paginatedApplications = filteredApplications.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const statusCounts = useMemo(() => {
        return {
            HIRED: applications.filter((a) => a.status === "HIRED").length,
            SHORTLISTED: applications.filter((a) => a.status === "SHORTLISTED").length,
            PENDING: applications.filter((a) => a.status === "PENDING").length,
            REJECTED: applications.filter((a) => a.status === "REJECTED").length,
        };
    }, [applications]);

    if (loading) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />
                <div className="ap-root">
                    <div className="ap-state-card">
                        <Loader2 className="ap-spin" />
                        <p>Loading applications...</p>
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />
                <div className="ap-root">
                    <div className="ap-state-card ap-state-error">
                        <AlertCircle />
                        <p>{error}</p>
                        <button className="ap-retry-btn" onClick={fetchApplications}>
                            <RefreshCw />
                            Try again
                        </button>
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

        <div className="ap-root">

            {/* Header */}

            <div className="ap-header">
                <div className="ap-header-blob" />
                <div className="ap-header-grid" />
                <span className="ap-header-eyebrow">
                    <ClipboardList /> Placement Tracker
                </span>
                <h1 className="ap-header-title">Job Applications</h1>
                <p className="ap-header-sub">
                    Track and review every student application across all openings.
                </p>

                <div className="ap-stat-row">
                    <div className="ap-stat-chip">
                        <span className="ap-stat-value">{applications.length}</span>
                        <span className="ap-stat-label">Total</span>
                    </div>
                    <div className="ap-stat-chip">
                        <span className="ap-stat-value">{statusCounts.HIRED}</span>
                        <span className="ap-stat-label">Hired</span>
                    </div>
                    <div className="ap-stat-chip">
                        <span className="ap-stat-value">{statusCounts.SHORTLISTED}</span>
                        <span className="ap-stat-label">Shortlisted</span>
                    </div>
                    <div className="ap-stat-chip">
                        <span className="ap-stat-value">{statusCounts.PENDING}</span>
                        <span className="ap-stat-label">Pending</span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}

            <div className="ap-toolbar">
                <div className="ap-search-wrap">
                    <Search className="ap-search-icon" />
                    <input
                        type="text"
                        className="ap-search-input"
                        placeholder="Search by student, email, company, or job..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="ap-filter-group">
                    <button
                        className={`ap-filter-btn${statusFilter === "ALL" ? " ap-filter-btn-active" : ""}`}
                        onClick={() => setStatusFilter("ALL")}
                    >
                        All
                    </button>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                            key={key}
                            className={`ap-filter-btn${statusFilter === key ? " ap-filter-btn-active" : ""}`}
                            onClick={() => setStatusFilter(key)}
                        >
                            {cfg.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="ap-result-count">
                Showing {paginatedApplications.length ? (page - 1) * PAGE_SIZE + 1 : 0}
                –{Math.min(page * PAGE_SIZE, filteredApplications.length)} of{" "}
                {filteredApplications.length} applications
            </p>

            {/* Table */}

            <div className="ap-table-card">
                <div className="ap-table-scroll">
                    <table className="ap-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th><Building2 /> Company</th>
                                <th><Briefcase /> Job</th>
                                <th><GraduationCap /> Qualification</th>
                                <th>Skills</th>
                                <th><FileText /> Resume</th>
                                <th><CalendarDays /> Applied On</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="8">
                                        <div className="ap-empty">
                                            <Inbox />
                                            <p>
                                                {applications.length === 0
                                                    ? "No applications found."
                                                    : "No applications match your search or filter."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedApplications.map((app) => {
                                    const cfg = STATUS_CONFIG[app.status] || {
                                        label: app.status || "Unknown",
                                        icon: Clock,
                                        className: "ap-chip-default",
                                    };
                                    const StatusIcon = cfg.icon;

                                    return (
                                        <tr key={app.id}>
                                            <td>
                                                <div className="ap-student-cell">
                                                    <span className="ap-avatar">
                                                        {getInitials(app.student_name)}
                                                    </span>
                                                    <div className="ap-student-info">
                                                        <span className="ap-student-name">
                                                            {app.student_name || "-"}
                                                        </span>
                                                        <span className="ap-student-email">
                                                            <Mail /> {app.student_email || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{app.company_name || "-"}</td>
                                            <td>{app.job_title || "-"}</td>
                                            <td>{app.qualification || "-"}</td>
                                            <td>
                                                <span className="ap-skills-cell" title={app.skills || ""}>
                                                    {app.skills || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                {app.resume ? (
                                                    <a
                                                        href={app.resume}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="ap-resume-link"
                                                    >
                                                        <FileText /> View
                                                    </a>
                                                ) : (
                                                    <span className="ap-muted">-</span>
                                                )}
                                            </td>
                                            <td className="ap-muted">{formatDate(app.applied_at)}</td>
                                            <td>
                                                <span className={`ap-chip ${cfg.className}`}>
                                                    <StatusIcon />
                                                    {cfg.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}

            {filteredApplications.length > 0 && (
                <div className="ap-pagination">
                    <button
                        className="ap-page-btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft />
                        Prev
                    </button>
                    <span className="ap-page-indicator">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="ap-page-btn"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default Applications;