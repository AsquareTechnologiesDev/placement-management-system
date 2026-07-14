import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    GraduationCap,
    Sparkles,
    ArrowRight,
    UserX,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Students.css";

const Students = () => {
    const [students, setStudents] = useState([]);

    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get("/student/approved/");

            setStudents(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {/* Site-wide branded header (logo, company name, logout) */}
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="st-root">

            {/* Header */}

            <div className="st-header">
                <div className="st-header-blob" />
                <div className="st-header-grid" />
                <span className="st-header-eyebrow">
                    <Users /> Talent Pool
                </span>
                <h1 className="st-header-title">Approved Students</h1>
                <p className="st-header-sub">
                    View trainer-approved candidates ready for placement.
                </p>
            </div>

            {/* Count Card */}

            <div className="st-stat-card">
                <div className="st-stat-icon"><Users /></div>
                <div>
                    <p className="st-stat-label">Total Approved Students</p>
                    <h1 className="st-stat-value">{students.length}</h1>
                </div>
            </div>

            {/* Student Cards */}

            {students.length === 0 ? (
                <div className="st-empty">
                    <div className="st-empty-icon"><UserX /></div>
                    <p className="st-empty-title">No approved students found</p>
                    <p className="st-empty-sub">Approved candidates will appear here once available.</p>
                </div>
            ) : (
                <div className="st-grid">
                    {students.map((student) => {
                        const skills = student.skills
                            ? student.skills.split(",").map((s) => s.trim()).filter(Boolean)
                            : [];

                        return (
                            <div key={student.id} className="st-card">
                                <div className="st-avatar">
                                    {student.student_name?.charAt(0)?.toUpperCase()}
                                </div>

                                <h2 className="st-card-name">{student.student_name}</h2>

                                <div className="st-card-row">
                                    <span className="st-card-label">
                                        <GraduationCap /> Qualification
                                    </span>
                                    <p className="st-card-value">{student.qualification || "Not specified"}</p>
                                </div>

                                <div className="st-card-row">
                                    <span className="st-card-label">
                                        <Sparkles /> Skills
                                    </span>
                                    {skills.length > 0 ? (
                                        <div className="st-tags">
                                            {skills.map((skill, i) => (
                                                <span className="st-tag" key={i}>{skill}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="st-card-value">Not specified</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate(`/placement/student/${student.id}`)}
                                    className="st-view-btn"
                                >
                                    View Profile
                                    <ArrowRight />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            </div>

            <AppFooter version="v1.0.0" />
        </>
    );
};

export default Students;