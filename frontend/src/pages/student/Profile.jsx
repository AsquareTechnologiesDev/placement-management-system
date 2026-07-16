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
import { toast } from "sonner";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const initialFormData = {
        student_name: "",
        phone: "",
        address: "",
        qualification: "",
        passout_year: "",
        skills: "",
        trainer: "",
        resume: null,
    };

    const [status, setStatus] = useState("DRAFT");
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [trainers, setTrainers] = useState([]);
    const [resumeFileName, setResumeFileName] = useState("");

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
            console.error("Profile Error:", error);
            toast.error("Unable to load your profile.");
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.student_name.trim())
            newErrors.student_name = "Your name is required.";

        if (!formData.phone.trim())
            newErrors.phone = "Phone number is required.";
        else {
            const phoneRegex = /^[0-9+\-\s()]{10,15}$/;

            if (!phoneRegex.test(formData.phone))
                newErrors.phone = "Enter a valid phone number.";
        }

        if (!formData.qualification.trim())
            newErrors.qualification = "Qualification is required.";

        if (!formData.passout_year)
            newErrors.passout_year = "Passout year is required.";
        else {
            const year = Number(formData.passout_year);
            const currentYear = new Date().getFullYear();

            if (isNaN(year) || year < 1990 || year > currentYear + 10)
                newErrors.passout_year = "Enter a valid passout year.";
        }

        if (!formData.address.trim())
            newErrors.address = "Address is required.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "resume") {
            const file = files?.[0] || null;

            setFormData((prev) => ({
                ...prev,
                resume: file,
            }));

            setResumeFileName(file ? file.name : "");
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        if (!validateForm()) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = new FormData();

            payload.append("student_name", formData.student_name);
            payload.append("phone", formData.phone);
            payload.append("address", formData.address);
            payload.append("qualification", formData.qualification);
            payload.append("passout_year", formData.passout_year);
            payload.append("skills", formData.skills);
            payload.append("trainer", formData.trainer);

            if (formData.resume) {
                payload.append("resume", formData.resume);
            }

            const response = await api.post("/student/profile/", payload);

            const data = response.data;

            setStatus(data.status || "PENDING");

            toast.success("Profile submitted successfully.");

            await fetchProfile();
        } catch (error) {
            console.error("Save Error:", error);

            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else if (typeof error.response?.data === "object" && error.response?.data) {
                const firstError = Object.values(error.response.data)[0];

                toast.error(
                    Array.isArray(firstError) ? firstError[0] : String(firstError)
                );
            } else {
                toast.error("Something went wrong. Please try again.");
            }
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

            <form onSubmit={handleSubmit} noValidate>
                <div className="pf-form-card">

                    <div className="pf-grid">
                        <Field icon={User} label="Student Name" required error={errors.student_name}>
                            <input
                                type="text"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                className="pf-input"
                                placeholder="Full Name"
                            />
                        </Field>

                        <Field icon={Phone} label="Phone" required error={errors.phone}>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="pf-input"
                                placeholder="+91 98765 43210"
                            />
                        </Field>

                        <Field icon={GraduationCap} label="Qualification" required error={errors.qualification}>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="pf-input"
                                placeholder="e.g. B.Tech Computer Science"
                            />
                        </Field>

                        <Field icon={CalendarDays} label="Passout Year" required error={errors.passout_year}>
                            <input
                                type="number"
                                name="passout_year"
                                value={formData.passout_year}
                                onChange={handleChange}
                                className="pf-input"
                                placeholder="e.g. 2026"
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
                        <Field icon={MapPin} label="Address" area required error={errors.address}>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="pf-textarea"
                                placeholder="Your current residential address"
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
                                {resumeFileName || "Click to upload your resume"}
                            </span>
                            {resumeFileName && (
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

const Field = ({ icon: Icon, label, area, required, error, children }) => (
    <div className="pf-field">
        <label className={`pf-label${required ? " pf-label-required" : ""}`}>{label}</label>
        <div className={`pf-input-wrap${area ? " pf-input-wrap-area" : ""}${error ? " input-error" : ""}`}>
            <Icon className="pf-input-icon" />
            {children}
        </div>
        {error && <p className="error-text">{error}</p>}
    </div>
);

export default Profile;