import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UserCheck,
    Rocket,
    Briefcase,
    Eye,
    Edit3,
    ClipboardList,
    ArrowRight,
    Building2,
    Wallet,
    CalendarClock,
    Inbox,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Dashboard.css";

const StudentDashboard = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});
    const [drives, setDrives] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
        fetchDrives();
        fetchJobs();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get(
                "/student/profile/"
            );

            setDashboard(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDrives = async () => {
        try {
            const response = await api.get(
                "/companies/student/drives/"
            );

            setDrives(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get(
                "/companies/student/jobs/"
            );

            setJobs(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="sd-root">
                    <div className="sd-state-card">
                        <Loader2 className="sd-spin" />
                        <p>Loading your dashboard...</p>
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

        <div className="sd-root">

            {/* Header */}

            <div className="sd-header">
                <div className="sd-header-blob" />
                <div className="sd-header-grid" />
                <span className="sd-header-eyebrow">
                    <LayoutDashboard /> Student Portal
                </span>
                <h1 className="sd-header-title">Student Dashboard</h1>
                <p className="sd-header-sub">
                    Welcome, <strong>{dashboard.student_name}</strong>
                    <br />
                    Explore placement drives, available jobs and manage your profile.
                </p>
            </div>

            {/* Statistics */}

            <div className="sd-stat-grid">

                <div className="sd-stat-card">
                    <div className="sd-stat-icon">
                        <UserCheck />
                    </div>
                    <div>
                        <h3 className="sd-stat-label">Profile Status</h3>
                        <h2 className="sd-stat-value">{dashboard.status || "DRAFT"}</h2>
                    </div>
                </div>

                <div className="sd-stat-card">
                    <div className="sd-stat-icon">
                        <Rocket />
                    </div>
                    <div>
                        <h3 className="sd-stat-label">Active Drives</h3>
                        <h2 className="sd-stat-value">{drives.length}</h2>
                    </div>
                </div>

                <div className="sd-stat-card">
                    <div className="sd-stat-icon">
                        <Briefcase />
                    </div>
                    <div>
                        <h3 className="sd-stat-label">Available Jobs</h3>
                        <h2 className="sd-stat-value">{jobs.length}</h2>
                    </div>
                </div>

            </div>

            {/* Quick Actions */}

            <div className="sd-card">
                <h2 className="sd-card-title">Quick Actions</h2>

                <div className="sd-action-grid">
                    <button
                        onClick={() => navigate("/student/view-profile")}
                        className="sd-action-card"
                    >
                        <Eye />
                        <span>View Profile</span>
                    </button>

                    <button
                        onClick={() => navigate("/student/profile")}
                        className="sd-action-card"
                    >
                        <Edit3 />
                        <span>Edit Profile</span>
                    </button>

                    <button
                        onClick={() => navigate("/student/drives")}
                        className="sd-action-card"
                    >
                        <Rocket />
                        <span>View Drives</span>
                    </button>

                    <button
                        onClick={() => navigate("/student/jobs")}
                        className="sd-action-card"
                    >
                        <Briefcase />
                        <span>View Jobs</span>
                    </button>

                    <button
                        onClick={() => navigate("/student/my-applications")}
                        className="sd-action-card"
                    >
                        <ClipboardList />
                        <span>My Applications</span>
                    </button>
                </div>
            </div>

            {/* Latest Placement Drives */}

            <div className="sd-card">
                <h2 className="sd-card-title">Latest Placement Drives</h2>

                {drives.length === 0 ? (
                    <div className="sd-empty">
                        <Inbox />
                        <p>No active placement drives.</p>
                    </div>
                ) : (
                    drives.slice(0, 3).map((drive) => (
                        <div key={drive.id} className="sd-list-item">
                            <div className="sd-list-item-body">
                                <h3 className="sd-list-item-title">{drive.title}</h3>
                                <div className="sd-list-item-meta">
                                    <span><Building2 /> {drive.company_name}</span>
                                    <span><Wallet /> {drive.package}</span>
                                    <span>
                                        <CalendarClock /> Ends{" "}
                                        {new Date(drive.registration_deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/student/drives/${drive.id}`)}
                                className="sd-view-btn"
                            >
                                View <ArrowRight />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Latest Available Jobs */}

            <div className="sd-card">
                <h2 className="sd-card-title">Latest Available Jobs</h2>

                {jobs.length === 0 ? (
                    <div className="sd-empty">
                        <Inbox />
                        <p>No active jobs available.</p>
                    </div>
                ) : (
                    jobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="sd-list-item">
                            <div className="sd-list-item-body">
                                <h3 className="sd-list-item-title">{job.title}</h3>
                                <div className="sd-list-item-meta">
                                    <span><Building2 /> {job.company_name}</span>
                                    <span><Wallet /> {job.package}</span>
                                    <span><CalendarClock /> {job.deadline}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/student/jobs/${job.id}`)}
                                className="sd-view-btn"
                            >
                                View <ArrowRight />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Latest Updates */}

            <div className="sd-card">
                <h2 className="sd-card-title">Latest Updates</h2>

                <ul className="sd-updates-list">
                    <li>
                        <CheckCircle2 />
                        Complete your profile before applying for jobs.
                    </li>

                    <li>
                        <CheckCircle2 />
                        Keep checking placement drives regularly.
                    </li>

                    <li>
                        <CheckCircle2 />
                        Only active jobs and published drives are shown.
                    </li>

                    <li>
                        <CheckCircle2 />
                        Upload your latest resume for better opportunities.
                    </li>
                </ul>
            </div>

        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default StudentDashboard;