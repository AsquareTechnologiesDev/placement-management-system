import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Mail,
    Phone,
    GraduationCap,
    CalendarDays,
    UserCheck,
    Sparkles,
    MapPin,
    BadgeCheck,
    FileText,
    Download,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./ViewStudent.css";

const MEDIA_URL = (
    import.meta.env.VITE_API_URL || ""
).replace("/api", "");

const ViewStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const res = await api.get(`/student/placement/${id}/`);
            console.log(res.data);


            setStudent(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!student) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

                <div className="vs-root">
                    <div className="vs-skeleton-header" />
                    <div className="vs-skeleton-card" />
                </div>

                <AppFooter version="v1.0.0" />
            </>
        );
    }

    const skills = student.skills
        ? student.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <>
            {/* Site-wide branded header (logo, company name, logout) */}
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="vs-root">

            <div className="vs-header">
                <div className="vs-header-blob" />
                <div className="vs-header-grid" />

                <div className="vs-header-content">
                    <div className="vs-avatar">
                        {student.student_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <span className="vs-header-eyebrow">Student Profile</span>
                        <h1 className="vs-header-title">{student.student_name}</h1>
                        {student.status && (
                            <span className="vs-status-badge">
                                <BadgeCheck /> {student.status}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="vs-card">
                <div className="vs-grid">
                    <Field icon={Mail} label="Email" value={student.email} />
                    <Field icon={Phone} label="Phone" value={student.phone} />
                    <Field icon={GraduationCap} label="Qualification" value={student.qualification} />
                    <Field icon={CalendarDays} label="Passout Year" value={student.passout_year} />
                    <Field icon={UserCheck} label="Trainer" value={student.trainer} />
                    <Field icon={MapPin} label="Address" value={student.address} full />

                    <div className="vs-field vs-field-full">
                        <span className="vs-label"><Sparkles /> Skills</span>
                        {skills.length > 0 ? (
                            <div className="vs-tags">
                                {skills.map((skill, i) => (
                                    <span className="vs-tag" key={i}>{skill}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="vs-value">Not specified</p>
                        )}
                    </div>

                    <div className="vs-field vs-field-full">
                        <span className="vs-label"><FileText /> Resume</span>
                        {student.resume ? (
                            <a
                                href={`${MEDIA_URL}${student.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="vs-resume-card"
                            >
                                <div className="vs-resume-icon"><FileText /></div>
                                <div>
                                    <p className="vs-resume-title">View Resume</p>
                                    <p className="vs-resume-sub">Opens in a new tab</p>
                                </div>
                                <Download className="vs-resume-download" />
                            </a>
                        ) : (
                            <p className="vs-value">No resume uploaded</p>
                        )}
                    </div>
                </div>
            </div>
            </div>

            <AppFooter version="v1.0.0" />
        </>
    );
};

const Field = ({ icon: Icon, label, value, full }) => (
    <div className={`vs-field ${full ? "vs-field-full" : ""}`}>
        <span className="vs-label"><Icon /> {label}</span>
        <p className="vs-value">{value || "-"}</p>
    </div>
);

export default ViewStudent;