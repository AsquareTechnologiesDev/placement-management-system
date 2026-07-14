import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    Plus,
    Building2,
    Wallet,
    MapPin,
    Users,
    Clock,
    Eye,
    ClipboardList,
    Inbox,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Jobs.css";

const Jobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/companies/jobs/");

            setJobs(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />
            <div className="jb-root">

                {/* Header */}

                <div className="jb-header">
                    <div className="jb-header-blob" />
                    <div className="jb-header-grid" />
                    <span className="jb-header-eyebrow">
                        <Briefcase /> Job Openings
                    </span>
                    <h1 className="jb-header-title">Job Management</h1>
                    <p className="jb-header-sub">
                        Manage all placement jobs.
                    </p>
                </div>

                {/* Create Job */}

                <div className="jb-toolbar">
                    <div className="jb-stat-card">
                        <div className="jb-stat-icon"><Briefcase /></div>
                        <div>
                            <p className="jb-stat-label">Total Jobs</p>
                            <h1 className="jb-stat-value">{jobs.length}</h1>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/placement/jobs/create")}
                        className="jb-create-btn"
                    >
                        <Plus />
                        Create Job
                    </button>
                </div>

                {/* Job Cards */}

                {jobs.length === 0 ? (
                    <div className="jb-empty">
                        <div className="jb-empty-icon"><Inbox /></div>
                        <p className="jb-empty-title">No jobs available</p>
                        <p className="jb-empty-sub">Jobs you create will show up here.</p>
                    </div>
                ) : (
                    <div className="jb-grid">
                        {jobs.map((job) => (
                            <div key={job.id} className="jb-card">
                                <div className="jb-card-top">
                                    <h2 className="jb-card-title">{job.title}</h2>
                                    <span className={`jb-badge ${job.status === "OPEN" ? "jb-badge-green" : "jb-badge-red"}`}>
                                        {job.status}
                                    </span>
                                </div>

                                <div className="jb-divider" />

                                <div className="jb-info-grid">
                                    <Info icon={Building2} label="Company" value={job.company_name} />
                                    <Info icon={Wallet} label="Package" value={job.package} />
                                    <Info icon={MapPin} label="Location" value={job.location} />
                                    <Info icon={Users} label="Vacancies" value={job.vacancies} />
                                    <Info icon={Clock} label="Deadline" value={job.deadline} />
                                </div>

                                <div className="jb-actions">
                                    <button
                                        onClick={() => navigate(`/placement/jobs/${job.id}`)}
                                        className="jb-btn jb-btn-primary"
                                    >
                                        <Eye />
                                        View
                                    </button>

                                    <button
                                        onClick={() => navigate(`/placement/jobs/${job.id}/applications`)}
                                        className="jb-btn jb-btn-dark"
                                    >
                                        <ClipboardList />
                                        Applications
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AppFooter version="v1.0.0" />
        </>
    );
};

const Info = ({ icon: Icon, label, value }) => (
    <div className="jb-info-item">
        <span className="jb-info-label">
            <Icon />
            {label}
        </span>
        <p className="jb-info-value">{value || "-"}</p>
    </div>
);

export default Jobs;