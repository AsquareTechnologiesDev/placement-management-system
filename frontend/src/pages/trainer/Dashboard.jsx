import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Clock,
    UserCheck,
    ArrowRight,
    UserX,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./TrainerDashboard.css";

const initials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

const TrainerDashboard = () => {
    const [students, setStudents] = useState([]);

    const token = localStorage.getItem("access_token");

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get(
                "/student/trainer/students/"
            );

            setStudents(data);
        } catch (error) {
            console.error(
                "Error loading students:",
                error
            );
        }
    };

    const handleView = (studentId) => {
        navigate(
            `/trainer/student/${studentId}`
        );
    };

    const pendingCount = students.filter((s) => s.status === "PENDING").length;
    const activeCount = students.length - pendingCount;

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/trainer/dashboard")} />

        <div className="asq-trainer">
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
                        Trainer Console
                    </span>
                    <h1 className="asq-hero-title">Trainer Dashboard</h1>
                    <p className="asq-hero-subtitle">
                        Manage your assigned students and track their progress.
                    </p>
                </div>
            </div>

            {/* ---------- Stats ---------- */}
            <div className="asq-stats">
                <div className="asq-stat-card">
                    <span className="asq-stat-icon" style={{ "--stat-tint": "var(--brand-tint-50)", "--stat-fg": "var(--brand-primary-dark)" }}>
                        <Users size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Assigned Students</p>
                        <h2 className="asq-stat-value">{students.length}</h2>
                    </div>
                </div>

                <div className="asq-stat-card">
                    <span className="asq-stat-icon" style={{ "--stat-tint": "var(--status-pending-tint)", "--stat-fg": "var(--status-pending)" }}>
                        <Clock size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Pending Reviews</p>
                        <h2 className="asq-stat-value">{pendingCount}</h2>
                    </div>
                </div>

                <div className="asq-stat-card">
                    <span className="asq-stat-icon" style={{ "--stat-tint": "var(--status-active-tint)", "--stat-fg": "var(--status-active)" }}>
                        <UserCheck size={22} />
                    </span>
                    <div>
                        <p className="asq-stat-label">Active Students</p>
                        <h2 className="asq-stat-value">{activeCount}</h2>
                    </div>
                </div>
            </div>

            {/* ---------- Roster ---------- */}
            <div className="asq-roster">
                <div className="asq-roster-header">
                    <h2 className="asq-roster-title">Assigned Students</h2>
                    {students.length > 0 && (
                        <span className="asq-roster-count">{students.length} total</span>
                    )}
                </div>

                {students.length === 0 ? (
                    <div className="asq-empty-state">
                        <UserX size={44} color="#D3004C" />
                        <h3 className="asq-empty-title">No students assigned</h3>
                        <p className="asq-empty-text">
                            Students you're assigned to mentor will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="asq-roster-grid">
                        {students.map((student) => {
                            const isPending = student.status === "PENDING";

                            return (
                                <div key={student.id} className="asq-student-card">
                                    <div className="asq-student-top">
                                        <span className="asq-student-avatar">{initials(student.name) || "?"}</span>
                                        <div>
                                            <h3 className="asq-student-name">{student.name}</h3>
                                            <span
                                                className="asq-status-pill"
                                                style={
                                                    isPending
                                                        ? { "--pill-fg": "var(--status-pending)", "--pill-bg": "var(--status-pending-tint)" }
                                                        : { "--pill-fg": "var(--status-active)", "--pill-bg": "var(--status-active-tint)" }
                                                }
                                            >
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="asq-student-cta"
                                        onClick={() => handleView(student.id)}
                                    >
                                        View Student
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default TrainerDashboard;