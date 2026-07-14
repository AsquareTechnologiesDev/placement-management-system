import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    MapPin,
    Users,
    Calendar,
    Coins,
    Check,
    Clock,
    ArrowRight,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./StudentJobs.css";

const StudentJobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get(
                "/companies/student/jobs/"
            );

            setJobs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/student/dashboard")} />

        <div className="asq-jobs">
            {/* ---------- Hero ---------- */}
            <div className="asq-hero">
                <svg className="asq-hero-motif" viewBox="0 0 520 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M40 60 100 120 40 180 40 60Z" stroke="rgba(255,255,255,0.28)" strokeWidth="6" strokeLinejoin="round" />
                    <path d="M120 60 180 120 120 180 120 60Z" stroke="rgba(255,255,255,0.16)" strokeWidth="6" strokeLinejoin="round" />
                    <path d="M280 160 340 220 280 280 280 160Z" stroke="rgba(255,255,255,0.14)" strokeWidth="5" strokeLinejoin="round" />
                    <path d="M350 20 410 80 350 140 350 20Z" stroke="rgba(255,255,255,0.1)" strokeWidth="5" strokeLinejoin="round" />
                </svg>

                <div className="asq-hero-content">
                    <span className="asq-hero-eyebrow">Career Opportunities</span>
                    <h1 className="asq-hero-title">Available Jobs</h1>
                    <p className="asq-hero-subtitle">
                        Every open role from our hiring partners, matched to your placement track — apply directly from here.
                    </p>

                    {!loading && jobs.length > 0 && (
                        <div className="asq-hero-chip">
                            <Briefcase size={16} />
                            {jobs.length} open {jobs.length === 1 ? "role" : "roles"} right now
                        </div>
                    )}
                </div>
            </div>

            {/* ---------- Body ---------- */}
            {loading ? (
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
            ) : jobs.length === 0 ? (
                <div className="asq-empty-state">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                        <circle cx="60" cy="60" r="58" fill="#FDE8F0" />
                        <rect x="30" y="46" width="60" height="40" rx="8" fill="#fff" stroke="#D3004C" strokeWidth="3" />
                        <path d="M46 46v-6a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v6" stroke="#D3004C" strokeWidth="3" fill="none" />
                        <path d="M30 62h60" stroke="#D3004C" strokeWidth="3" />
                    </svg>
                    <h2 className="asq-empty-title">No open roles right now</h2>
                    <p className="asq-empty-text">
                        New opportunities are added regularly — check back soon, or update your profile so recruiters can find you.
                    </p>
                </div>
            ) : (
                <div className="asq-grid">
                    {jobs.map((job) => (
                        <article key={job.id} className="asq-card">
                            <div className="asq-card-accent" />

                            <div className="asq-card-body">
                                <div className="asq-card-top">
                                    <div>
                                        <h2 className="asq-job-title">{job.title}</h2>
                                        <p className="asq-company">{job.company_name}</p>
                                    </div>

                                    {job.is_applied ? (
                                        <span className="asq-status-pill asq-status-applied">
                                            <Check size={13} />
                                            Applied
                                        </span>
                                    ) : (
                                        <span className="asq-status-pill asq-status-pending">
                                            <Clock size={13} />
                                            Not applied
                                        </span>
                                    )}
                                </div>

                                <div className="asq-meta-list">
                                    <MetaRow icon={Coins} label="Package" value={job.package || "Not disclosed"} />
                                    <MetaRow icon={MapPin} label="Location" value={job.location || "Not specified"} />
                                    <MetaRow icon={Users} label="Vacancies" value={job.vacancies} />
                                    <MetaRow
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

                            <button
                                className="asq-cta"
                                onClick={() => navigate(`/student/jobs/${job.id}`)}
                            >
                                View Details
                                <ArrowRight size={16} />
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

const MetaRow = ({ icon: IconCmp, label, value }) => (
    <div className="asq-meta-row">
        <span className="asq-meta-icon">
            <IconCmp size={15} />
        </span>
        <span className="asq-meta-label">{label}</span>
        <span className="asq-meta-value">{value}</span>
    </div>
);

export default StudentJobs;