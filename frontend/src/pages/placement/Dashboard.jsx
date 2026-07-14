//src/pages/placement/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Building2,
    Users,
    Briefcase,
    CalendarClock,
    ClipboardList,
    Award,
    ClipboardX,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Dashboard.css";

const PlacementDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        companies: 0,
        approved_students: 0,
        jobs: 0,
        drives: 0,
        applications: 0,
        placements: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get(
                "/dashboard/placement/"
            );

            setStats(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        { icon: Building2, label: "Companies", value: stats.companies },
        { icon: Users, label: "Approved Students", value: stats.approved_students },
        { icon: Briefcase, label: "Jobs", value: stats.jobs },
        { icon: CalendarClock, label: "Placement Drives", value: stats.drives },
        { icon: ClipboardList, label: "Applications", value: stats.applications },
        { icon: Award, label: "Placements", value: stats.placements },
    ];

    const quickActions = [
        { label: "Manage Companies", desc: "Add or edit partner companies", icon: Building2, path: "/placement/companies" },
        { label: "Placement Drives", desc: "Schedule and track drives", icon: CalendarClock, path: "/placement/drives" },
        { label: "Approved Students", desc: "View eligible candidates", icon: Users, path: "/placement/students" },
        { label: "Manage Jobs", desc: "Post and update openings", icon: Briefcase, path: "/placement/jobs" },
        { label: "View Applications", desc: "Review candidate applications", icon: ClipboardList, path: "/placement/applications" },
    ];

    return (
        <>
            {/* Site-wide branded header (logo, company name, subtitle) */}
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="pd-root">

                {/* Page hero — page-specific title/eyebrow, no duplicate logo */}

                <div className="pd-header">
                    <div className="pd-header-blob" />
                    <div className="pd-header-blob pd-header-blob-2" />
                    <div className="pd-header-grid" />

                    <span className="pd-header-eyebrow">
                        <Sparkles /> Placement Cell
                    </span>
                    <h1 className="pd-header-title">Placement Dashboard</h1>
                    <p className="pd-header-sub">
                        Manage companies, approved students and placement
                        activities.
                    </p>
                </div>

                {/* Statistics */}

                <div className="pd-section-label">Overview</div>

                <div className="pd-stats">
                    {statCards.map(({ icon: Icon, label, value }, i) => (
                        <div
                            className="pd-stat-card"
                            key={label}
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="pd-stat-icon"><Icon /></div>
                            <div>
                                <p className="pd-stat-label">{label}</p>
                                {isLoading ? (
                                    <div className="pd-skeleton" style={{ width: 56, height: 30 }} />
                                ) : (
                                    <h1 className="pd-stat-value">{value}</h1>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}

                <div className="pd-panel">
                    <div className="pd-panel-head">
                        <h2 className="pd-panel-title">Quick Actions</h2>
                        <p className="pd-panel-subtitle">Jump straight into common tasks</p>
                    </div>

                    <div className="pd-actions">
                        {quickActions.map(({ label, desc, icon: Icon, path }) => (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className="pd-action-card"
                            >
                                <div className="pd-action-icon"><Icon /></div>
                                <div className="pd-action-text">
                                    <span className="pd-action-label">{label}</span>
                                    <span className="pd-action-desc">{desc}</span>
                                </div>
                                <ArrowUpRight className="pd-action-arrow" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}

                <div className="pd-panel">
                    <div className="pd-panel-head">
                        <h2 className="pd-panel-title">Recent Activity</h2>
                        <p className="pd-panel-subtitle">Latest updates across the placement cell</p>
                    </div>

                    <div className="pd-empty">
                        <div className="pd-empty-icon">
                            <ClipboardX />
                        </div>
                        <p className="pd-empty-title">No recent activity</p>
                        <p className="pd-empty-sub">New placement activity will show up here as it happens.</p>
                    </div>
                </div>

            </div>

            <AppFooter version="v1.0.0" />
        </>
    );
};

export default PlacementDashboard;