//src/pages/placement/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
    Trophy,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Dashboard.css";

/* ==================================================
   Animated counter — counts up from 0 to value once
   the dashboard stats have finished loading.
================================================== */

const AnimatedValue = ({ value = 0, duration = 700 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const frameRef = useRef(null);

    useEffect(() => {
        const target = Number(value) || 0;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(Math.round(eased * target));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <>{displayValue}</>;
};

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
    const [ripple, setRipple] = useState(null);

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
        { label: "Placements", desc: "Manage successful student placements", icon: Trophy, path: "/placement/placements" },
    ];

    /* ---------------- Ripple + navigate ---------------- */

    const handleActionClick = (path, event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.6;

        setRipple({
            path,
            key: Date.now(),
            x: event.clientX - rect.left - size / 2,
            y: event.clientY - rect.top - size / 2,
            size,
        });

        window.setTimeout(() => navigate(path), 220);
    };

    const handleActionKeyDown = (path, event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate(path);
        }
    };

    return (
        <>
            {/* Site-wide branded header (logo, company name, subtitle) */}
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="pd-root">

                {/* Page hero — page-specific title/eyebrow, no duplicate logo */}

                <div className="pd-header">
                    <div className="pd-header-blob pd-header-float" />
                    <div className="pd-header-blob pd-header-blob-2 pd-header-float-slow" />
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
                                    <h1 className="pd-stat-value">
                                        <AnimatedValue value={value} />
                                    </h1>
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
                                type="button"
                                onClick={(e) => handleActionClick(path, e)}
                                onKeyDown={(e) => handleActionKeyDown(path, e)}
                                className="pd-action-card"
                            >
                                <div className="pd-action-icon"><Icon /></div>
                                <div className="pd-action-text">
                                    <span className="pd-action-label">{label}</span>
                                    <span className="pd-action-desc">{desc}</span>
                                </div>
                                <ArrowUpRight className="pd-action-arrow" />

                                {ripple && ripple.path === path && (
                                    <span
                                        key={ripple.key}
                                        className="pd-action-ripple"
                                        style={{
                                            left: ripple.x,
                                            top: ripple.y,
                                            width: ripple.size,
                                            height: ripple.size,
                                        }}
                                        onAnimationEnd={() => setRipple(null)}
                                    />
                                )}
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
                        <p className="pd-empty-title">No recent activity yet</p>
                        <p className="pd-empty-sub">
                            Updates from drives, applications and placements will
                            show up here as they happen.
                        </p>

                        <button
                            type="button"
                            className="pd-empty-cta"
                            onClick={() => navigate("/placement/placements")}
                        >
                            <Trophy size={15} />
                            View Placements
                        </button>
                    </div>
                </div>

            </div>

            <AppFooter version="v1.0.0" />
        </>
    );
};

export default PlacementDashboard;