// src/pages/student/Profile.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    IdCard,
    User,
    Phone,
    GraduationCap,
    CalendarDays,
    UserCog,
    MapPin,
    Sparkles,
    Upload,
    FileCheck2,
    Send,
    Loader2,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("DRAFT");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        student_name: "",
        phone: "",
        address: "",
        qualification: "",
        passout_year: "",
        skills: "",
        trainer: "",
        resume: null,
    });

    const [trainers, setTrainers] = useState([]);

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchProfile();
        fetchTrainers();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/student/profile/");

const data = response.data;

setStatus(data.status || "DRAFT");

setFormData((prev) => ({
            ...prev,
            student_name: data.student_name || "",
            phone: data.phone || "",
            address: data.address || "",
            qualification: data.qualification || "",
            passout_year: data.passout_year || "",
            skills: data.skills || "",
            trainer: data.trainer || "",
        }));
        } catch (error) {
            console.error(
                "Profile Error:",
                error
            );
        }
    };

    const fetchTrainers = async () => {
    try {
        const { data } = await api.get("/student/trainers/");
        setTrainers(data);
    } catch (error) {
        console.error("Trainer Error:", error);
    }
};
    const handleChange = (e) => {
        const { name, value, files } =
            e.target;

        setFormData({
            ...formData,
            [name]: files
                ? files[0]
                : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);

        try {
            const payload =
                new FormData();

            payload.append(
                "student_name",
                formData.student_name
            );

            payload.append(
                "phone",
                formData.phone
            );

            payload.append(
                "address",
                formData.address
            );

            payload.append(
                "qualification",
                formData.qualification
            );

            payload.append(
                "passout_year",
                formData.passout_year
            );

            payload.append(
                "skills",
                formData.skills
            );

            payload.append(
                "trainer",
                formData.trainer
            );

            if (formData.resume) {
                payload.append(
                    "resume",
                    formData.resume
                );
            }

            const response = await api.post(
        "/student/profile/",
        payload
    );

    const data = response.data;

            

            setStatus(
                data.status ||
                    "PENDING"
            );

            alert(
                "Profile submitted successfully"
            );
        } catch (error) {
            console.error(
                "Save Error:",
                error
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/student/dashboard")} />

        <div className="pf-root">

            {/* Header */}

            <div className="pf-header">
                <div className="pf-header-blob" />
                <div className="pf-header-grid" />
                <span className="pf-header-eyebrow">
                    <IdCard /> Placement Profile
                </span>
                <h1 className="pf-header-title">Student Profile</h1>
                <p className="pf-header-sub">
                    Complete your profile to participate in placement activities.
                </p>
            </div>

            {/* Status */}

            <div className="pf-status-card">
                <h3 className="pf-status-label">Profile Status</h3>
                <div className="pf-status-chip">{status}</div>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>
                <div className="pf-form-card">

                    <div className="pf-grid">
                        <Field icon={User} label="Student Name">
                            <input
                                type="text"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                className="pf-input"
                            />
                        </Field>

                        <Field icon={Phone} label="Phone">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="pf-input"
                            />
                        </Field>

                        <Field icon={GraduationCap} label="Qualification">
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="pf-input"
                            />
                        </Field>

                        <Field icon={CalendarDays} label="Passout Year">
                            <input
                                type="number"
                                name="passout_year"
                                value={formData.passout_year}
                                onChange={handleChange}
                                className="pf-input"
                            />
                        </Field>

                        <Field icon={UserCog} label="Trainer">
                            <select
                                name="trainer"
                                value={formData.trainer}
                                onChange={handleChange}
                                className="pf-select"
                            >
                                <option value="">Select Trainer</option>

                                {Array.isArray(trainers) &&
                                    trainers.map((trainer) => (
                                        <option key={trainer.id} value={trainer.id}>
                                            {trainer.name}
                                        </option>
                                    ))}
                            </select>
                        </Field>
                    </div>

                    <div className="pf-field-block">
                        <Field icon={MapPin} label="Address" area>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="pf-textarea"
                            />
                        </Field>
                    </div>

                    <div className="pf-field-block">
                        <Field icon={Sparkles} label="Skills" area>
                            <textarea
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="pf-textarea"
                                placeholder="Python, Django, React..."
                            />
                        </Field>
                    </div>

                    <div className="pf-field-block">
                        <label className="pf-label"><Upload /> Resume</label>

                        <label className="pf-file-drop">
                            <Upload />
                            <span>
                                {formData.resume
                                    ? formData.resume.name
                                    : "Click to upload your resume"}
                            </span>
                            {formData.resume && (
                                <FileCheck2 className="pf-file-check" />
                            )}
                            <input
                                type="file"
                                name="resume"
                                onChange={handleChange}
                                className="pf-file-input-hidden"
                            />
                        </label>
                    </div>

                    <div className="pf-submit-row">
                        <button type="submit" className="pf-submit-btn" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="pf-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send />
                                    Submit Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

const Field = ({ icon: Icon, label, area, children }) => (
    <div className="pf-field">
        <label className="pf-label">{label}</label>
        <div className={`pf-input-wrap${area ? " pf-input-wrap-area" : ""}`}>
            <Icon className="pf-input-icon" />
            {children}
        </div>
    </div>
);

export default Profile;