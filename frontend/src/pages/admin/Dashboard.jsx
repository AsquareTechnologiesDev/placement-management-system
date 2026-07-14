import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    GraduationCap,
    UserCog,
    Briefcase,
    Building2,
    UserPlus,
    Users,
    Eye,
    Settings2,
    History,
} from "lucide-react";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/admin/dashboard")} />

        <div className="asq-admin">
            {/* ---------- Hero ---------- */}
            <div className="asq-hero">
                <svg className="asq-hero-motif" viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M40 50 95 105 40 160 40 50Z" stroke="rgba(255,255,255,0.28)" strokeWidth="6" strokeLinejoin="round" />
                    <path d="M115 50 170 105 115 160 115 50Z" stroke="rgba(255,255,255,0.16)" strokeWidth="6" strokeLinejoin="round" />
                    <path d="M270 150 325 205 270 260 270 150Z" stroke="rgba(255,255,255,0.13)" strokeWidth="5" strokeLinejoin="round" />
                </svg>

                <div className="asq-hero-content">
                    <span className="asq-hero-eyebrow">
                        <LayoutDashboard size={13} />
                        Admin Console
                    </span>
                    <h1 className="asq-hero-title">Admin Dashboard</h1>
                    <p className="asq-hero-subtitle">
                        Manage students, trainers, placement executives and monitor placement activity.
                    </p>
                </div>
            </div>

            {/* ---------- Stats ---------- */}
            <div className="asq-stats">
                <div className="asq-stat-card">
                    <span className="asq-stat-icon">
                        <GraduationCap size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Students</p>
                        <h2 className="asq-stat-value">0</h2>
                    </div>
                </div>

                <div className="asq-stat-card">
                    <span className="asq-stat-icon">
                        <UserCog size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Trainers</p>
                        <h2 className="asq-stat-value">0</h2>
                    </div>
                </div>

                <div className="asq-stat-card">
                    <span className="asq-stat-icon">
                        <Briefcase size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Placement Executives</p>
                        <h2 className="asq-stat-value">0</h2>
                    </div>
                </div>

                <div className="asq-stat-card">
                    <span className="asq-stat-icon">
                        <Building2 size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Companies</p>
                        <h2 className="asq-stat-value">0</h2>
                    </div>
                </div>
            </div>

            {/* ---------- Quick Actions ---------- */}
            <div className="asq-panel">
                <h2 className="asq-panel-title">Quick Actions</h2>

                <div className="asq-actions">
                    <button className="asq-action-btn">
                        <UserPlus size={16} />
                        Add Trainer
                    </button>

                    <button className="asq-action-btn">
                        <Users size={16} />
                        Add Placement Executive
                    </button>

                    <button className="asq-action-btn asq-action-secondary">
                        <Eye size={16} />
                        View Students
                    </button>

                    <button className="asq-action-btn asq-action-secondary">
                        <Settings2 size={16} />
                        Manage Companies
                    </button>
                </div>
            </div>

            {/* ---------- Recent Activity ---------- */}
            <div className="asq-panel">
                <h2 className="asq-panel-title">Recent Activity</h2>

                <div className="asq-empty-state">
                    <History size={36} color="#D3004C" />
                    <span>No recent activity found.</span>
                </div>
            </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default AdminDashboard;