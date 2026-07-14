import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Building2,
    FileText,
    ClipboardCheck,
    Coins,
    MapPin,
    Users,
    Calendar,
    CheckCircle2,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./StudentJobDetail.css";

const StudentJobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchJob();
    }, []);

    const fetchJob = async () => {
        try {
            const response = await api.get(
                `/companies/student/jobs/${id}/`
            );

            setJob(response.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load job details.");
        } finally {
            setLoading(false);
        }
    };

    const applyJob = async () => {
        if (
            !window.confirm(
                "Are you sure you want to apply for this job?"
            )
        ) {
            return;
        }

        try {
            setApplying(true);

            const response = await api.post(
                `/companies/student/jobs/${id}/apply/`
            );

            alert(response.data.message);

            fetchJob();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.error ||
                    "Unable to apply."
            );
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="asq-detail">
                    <div className="asq-state-card">
                        <div className="asq-skel" style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto" }} />
                        <h2 className="asq-state-title">Loading job details…</h2>
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    if (!job) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="asq-detail">
                    <div className="asq-state-card">
                        <AlertTriangle size={44} color="#D3004C" style={{ margin: "0 auto" }} />
                        <h2 className="asq-state-title">Job not found</h2>
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

        <div className="asq-detail">
            <div className="asq-detail-shell">
                {/* ---------- Header ---------- */}
                <div className="asq-detail-header">
                    <svg className="asq-detail-motif" viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M30 40 80 90 30 140 30 40Z" stroke="rgba(255,255,255,0.28)" strokeWidth="6" strokeLinejoin="round" />
                        <path d="M100 40 150 90 100 140 100 40Z" stroke="rgba(255,255,255,0.16)" strokeWidth="6" strokeLinejoin="round" />
                        <path d="M230 120 280 170 230 220 230 120Z" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinejoin="round" />
                    </svg>

                    <div className="asq-detail-heading">
                        <span className="asq-detail-eyebrow">
                            <Building2 size={13} />
                            Job Opening
                        </span>
                        <h1 className="asq-detail-title">{job.title}</h1>
                        <p className="asq-detail-company">{job.company_name}</p>
                    </div>

                    <span className="asq-detail-status">{job.status}</span>
                </div>

                {/* ---------- Content ---------- */}
                <div className="asq-detail-grid">
                    <div>
                        <div className="asq-panel">
                            <h3 className="asq-panel-title">
                                <FileText size={16} />
                                Description
                            </h3>
                            <p className="asq-body-text">{job.description}</p>
                        </div>

                        <div className="asq-panel">
                            <h3 className="asq-panel-title">
                                <ClipboardCheck size={16} />
                                Eligibility
                            </h3>
                            <p className="asq-body-text">{job.eligibility}</p>
                        </div>
                    </div>

                    <aside className="asq-summary">
                        <div className="asq-panel">
                            <h3 className="asq-panel-title">Role summary</h3>
                            <div className="asq-summary-list">
                                <SummaryRow icon={Coins} label="Package" value={job.package} />
                                <SummaryRow icon={MapPin} label="Location" value={job.location} />
                                <SummaryRow icon={Users} label="Vacancies" value={job.vacancies} />
                                <SummaryRow
                                    icon={Calendar}
                                    label="Last date"
                                    value={new Date(job.deadline).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                />
                            </div>
                        </div>

                        <div className="asq-apply-panel">
                            {job.is_applied ? (
                                <button className="asq-btn asq-btn-success" disabled>
                                    <CheckCircle2 size={18} />
                                    Already Applied
                                </button>
                            ) : !job.profile_approved ? (
                                <div className="asq-notice">
                                    <AlertTriangle size={18} />
                                    <span>
                                        Your profile must be approved by your trainer before you can apply for jobs.
                                    </span>
                                </div>
                            ) : (
                                <button
                                    className="asq-btn asq-btn-primary"
                                    onClick={applyJob}
                                    disabled={applying}
                                >
                                    {applying ? (
                                        <>
                                            <Loader2 size={18} className="asq-spin" />
                                            Applying…
                                        </>
                                    ) : (
                                        "Apply Now"
                                    )}
                                </button>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

const SummaryRow = ({ icon: IconCmp, label, value }) => (
    <div className="asq-summary-row">
        <span className="asq-summary-icon">
            <IconCmp size={16} />
        </span>
        <span>
            <span className="asq-summary-label">{label}</span>
            <span className="asq-summary-value">{value}</span>
        </span>
    </div>
);

export default StudentJobDetail;