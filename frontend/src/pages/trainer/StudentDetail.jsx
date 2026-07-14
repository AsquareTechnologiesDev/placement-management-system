import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    UserRound,
    Phone,
    GraduationCap,
    Tags,
    FileText,
    FileX,
    MessageSquareText,
    CheckCircle2,
    XCircle,
    ClipboardCheck,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./StudentDetail.css";

const STATUS_META = {
    PENDING: { fg: "var(--status-pending)", bg: "var(--status-pending-tint)" },
    APPROVED: { fg: "var(--status-approved)", bg: "var(--status-approved-tint)" },
    REJECTED: { fg: "var(--status-rejected)", bg: "var(--status-rejected-tint)" },
};

const initials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

const InfoField = ({ icon: IconCmp, label, value }) => (
    <div className="asq-info-field">
        <span className="asq-info-icon">
            <IconCmp size={15} />
        </span>
        <span>
            <span className="asq-info-label">{label}</span>
            <span className="asq-info-value">{value || "—"}</span>
        </span>
    </div>
);

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [remark, setRemark] = useState("");

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const { data } = await api.get(
                `/student/trainer/students/${id}/`
            );

            setStudent(data);
        } catch (error) {
            console.error("Error fetching student:", error);
        }
    };

    const approveStudent = async () => {
        try {
            await api.post("/student/trainer/approve/", {
                student_profile_id: id,
                remark: remark,
            });

            alert("Profile Approved Successfully");

            fetchStudent();
        } catch (error) {
            console.error("Approval Error:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to approve student."
            );
        }
    };

    const rejectStudent = async () => {
        try {
            await api.post("/student/trainer/reject/", {
                student_profile_id: id,
                remark: remark,
            });

            alert("Profile Rejected Successfully");

            fetchStudent();
        } catch (error) {
            console.error("Rejection Error:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to reject student."
            );
        }
    };

    if (!student) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/trainer/dashboard")} />
                <div className="asq-review">
                    <div className="asq-loading-shell">
                        <div className="asq-skel" style={{ height: 140 }} />
                        <div className="asq-skel" style={{ height: 220 }} />
                        <div className="asq-skel" style={{ height: 180 }} />
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    const statusMeta = STATUS_META[student.status] || STATUS_META.PENDING;

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/trainer/dashboard")} />

        <div className="asq-review">
            <div className="asq-review-shell">
                {/* ---------- Header ---------- */}
                <div className="asq-review-header">
                    <svg className="asq-review-motif" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M30 40 80 90 30 140 30 40Z" stroke="rgba(255,255,255,0.28)" strokeWidth="6" strokeLinejoin="round" />
                        <path d="M100 40 150 90 100 140 100 40Z" stroke="rgba(255,255,255,0.16)" strokeWidth="6" strokeLinejoin="round" />
                        <path d="M220 110 270 160 220 210 220 110Z" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinejoin="round" />
                    </svg>

                    <div className="asq-review-heading">
                        <span className="asq-review-eyebrow">
                            <ClipboardCheck size={13} />
                            Trainer Console
                        </span>
                        <h1 className="asq-review-title">Student Review</h1>
                        <p className="asq-review-subtitle">
                            Review the student's profile and record an approval or rejection remark.
                        </p>
                    </div>
                </div>

                {/* ---------- Content ---------- */}
                <div className="asq-review-grid">
                    <div className="asq-panel">
                        <div className="asq-profile-id">
                            <span className="asq-avatar">{initials(student.student_name) || "?"}</span>
                            <div>
                                <h2 className="asq-profile-name">{student.student_name}</h2>
                                <span
                                    className="asq-status-pill"
                                    style={{ "--pill-fg": statusMeta.fg, "--pill-bg": statusMeta.bg }}
                                >
                                    {student.status}
                                </span>
                            </div>
                        </div>

                        <div className="asq-info-grid">
                            <InfoField icon={Phone} label="Phone" value={student.phone} />
                            <InfoField icon={GraduationCap} label="Qualification" value={student.qualification} />
                        </div>

                        <div className="asq-panel-title" style={{ marginBottom: 8 }}>
                            <Tags size={16} />
                            Skills
                        </div>
                        <p className="asq-skills-text">{student.skills || "No skills listed."}</p>

                        <div className="asq-panel-title" style={{ marginTop: 24, marginBottom: 10 }}>
                            <FileText size={16} />
                            Resume
                        </div>
                        {student.resume ? (
                            <a
                                href={`https://placement-management-system-29po.onrender.com${student.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="asq-resume-link"
                            >
                                <FileText size={16} />
                                View Resume
                            </a>
                        ) : (
                            <span className="asq-resume-empty">
                                <FileX size={16} />
                                No resume uploaded
                            </span>
                        )}
                    </div>

                    <aside className="asq-panel">
                        <h3 className="asq-panel-title">
                            <MessageSquareText size={16} />
                            Trainer Remark
                        </h3>

                        <textarea
                            className="asq-textarea"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Enter approval or rejection remarks..."
                        />

                        <div className="asq-decision-actions">
                            <button className="asq-btn asq-btn-approve" onClick={approveStudent}>
                                <CheckCircle2 size={16} />
                                Approve
                            </button>

                            <button className="asq-btn asq-btn-reject" onClick={rejectStudent}>
                                <XCircle size={16} />
                                Reject
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

export default StudentDetail;