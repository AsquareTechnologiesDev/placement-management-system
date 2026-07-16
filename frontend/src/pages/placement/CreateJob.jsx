import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BriefcaseBusiness,
    Building2,
    FileText,
    ClipboardCheck,
    Wallet,
    MapPin,
    Users,
    CalendarDays,
    ToggleLeft,
    Send,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./CreateJob.css";

const CreateJob = () => {
    const navigate = useNavigate();

    const initialFormData = {
        company: "",
        title: "",
        description: "",
        eligibility: "",
        package: "",
        location: "",
        vacancies: 1,
        deadline: "",
        status: "OPEN",
    };

    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get("/companies/");
            setCompanies(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Unable to load companies.");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company)
            newErrors.company = "Please select a company.";

        if (!formData.title.trim())
            newErrors.title = "Job title is required.";

        if (!formData.description.trim())
            newErrors.description = "Description is required.";

        if (
            formData.vacancies === "" ||
            isNaN(formData.vacancies) ||
            Number(formData.vacancies) < 1
        )
            newErrors.vacancies = "Vacancies must be at least 1.";

        if (!formData.deadline)
            newErrors.deadline = "Deadline is required.";
        else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (new Date(formData.deadline) < today)
                newErrors.deadline = "Deadline cannot be in the past.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleStatusSelect = (value) => {
        setFormData((prev) => ({
            ...prev,
            status: value,
        }));
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

            await api.post("/companies/jobs/", formData);

            toast.success("Job created successfully.");

            setTimeout(() => {
                navigate("/placement/jobs");
            }, 1500);
        } catch (err) {
            console.error(err.response?.data);

            if (err.response?.data?.detail) {
                toast.error(err.response.data.detail);
            } else if (typeof err.response?.data === "object" && err.response?.data) {
                const firstError = Object.values(err.response.data)[0];

                toast.error(
                    Array.isArray(firstError) ? firstError[0] : String(firstError)
                );
            } else {
                toast.error("Something went wrong. Please try again.");
            }

            setSubmitting(false);
        }
    };

    return (
        <>
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />
            <div className="cj-root">

                {/* Header */}

                <div className="cj-header">
                    <div className="cj-header-blob" />
                    <div className="cj-header-blob cj-header-blob-sm" />
                    <div className="cj-header-grid" />
                    <span className="cj-header-eyebrow">
                        <BriefcaseBusiness /> New Opening
                    </span>
                    <h1 className="cj-header-title">Create Job</h1>
                    <p className="cj-header-sub">
                        Create a new job opening.
                    </p>
                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="cj-form" noValidate>

                    <Section num="01" icon={FileText} title="Basic Information">
                        <div className="cj-grid">
                            <Field icon={Building2} label="Company" required error={errors.company}>
                                <select
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="cj-select"
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field icon={BriefcaseBusiness} label="Job Title" required error={errors.title}>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="cj-input"
                                    placeholder="e.g. Frontend Engineer"
                                />
                            </Field>

                            <Field
                                icon={FileText}
                                label="Description"
                                required
                                full
                                area
                                error={errors.description}
                                footer={
                                    <span className="cj-char-count">
                                        {formData.description.length} characters
                                    </span>
                                }
                            >
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="cj-textarea"
                                    placeholder="Describe the role, responsibilities, and what makes it a great opportunity..."
                                />
                            </Field>

                            <Field icon={ClipboardCheck} label="Eligibility" full area>
                                <textarea
                                    name="eligibility"
                                    value={formData.eligibility}
                                    onChange={handleChange}
                                    rows="3"
                                    className="cj-textarea"
                                    placeholder="Minimum qualifications, CGPA cutoff, branch eligibility..."
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section num="02" icon={Wallet} title="Job Details">
                        <div className="cj-grid">
                            <Field icon={Wallet} label="Package">
                                <input
                                    type="text"
                                    name="package"
                                    value={formData.package}
                                    onChange={handleChange}
                                    className="cj-input"
                                    placeholder="e.g. ₹6 LPA"
                                />
                            </Field>

                            <Field icon={MapPin} label="Location">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="cj-input"
                                    placeholder="e.g. Kochi, Kerala"
                                />
                            </Field>

                            <Field icon={Users} label="Vacancies" error={errors.vacancies}>
                                <input
                                    type="number"
                                    name="vacancies"
                                    value={formData.vacancies}
                                    onChange={handleChange}
                                    min="1"
                                    className="cj-input"
                                />
                            </Field>

                            <Field icon={CalendarDays} label="Deadline" required error={errors.deadline}>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="cj-input"
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section num="03" icon={ToggleLeft} title="Status">
                        <div className="cj-field" style={{ maxWidth: 360 }}>
                            <label className="cj-label"><ToggleLeft /> Job Status</label>
                            <div className="cj-segmented" role="group" aria-label="Job status">
                                <button
                                    type="button"
                                    className={`cj-segment-btn${formData.status === "OPEN" ? " cj-segment-btn-active" : ""}`}
                                    onClick={() => handleStatusSelect("OPEN")}
                                    aria-pressed={formData.status === "OPEN"}
                                >
                                    <CheckCircle2 />
                                    Open
                                </button>
                                <button
                                    type="button"
                                    className={`cj-segment-btn${formData.status === "CLOSED" ? " cj-segment-btn-active" : ""}`}
                                    onClick={() => handleStatusSelect("CLOSED")}
                                    aria-pressed={formData.status === "CLOSED"}
                                >
                                    <XCircle />
                                    Closed
                                </button>
                            </div>
                        </div>
                    </Section>

                    <button type="submit" className="cj-submit-btn" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="cj-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Send />
                                Create Job
                            </>
                        )}
                    </button>
                </form>
            </div>
            <AppFooter version="v1.0.0" />
        </>
    );
};

const Section = ({ num, icon: Icon, title, children }) => (
    <div className="cj-section" style={{ animationDelay: `${(parseInt(num, 10) - 1) * 90}ms` }}>
        <div className="cj-section-head">
            <span className="cj-section-num">{num}</span>
            <h2 className="cj-section-title">
                <Icon /> {title}
            </h2>
            <span className="cj-section-step">Step {num} / 03</span>
        </div>
        {children}
    </div>
);

const Field = ({ icon: Icon, label, required, full, area, footer, error, children }) => (
    <div className={`cj-field${full ? " cj-field-full" : ""}`}>
        <label className={`cj-label${required ? " cj-label-required" : ""}`}>{label}</label>
        <div className={`cj-input-wrap${area ? " cj-input-wrap-area" : ""}${error ? " input-error" : ""}`}>
            <Icon className="cj-input-icon" />
            {children}
        </div>
        {error && <p className="error-text">{error}</p>}
        {footer && <div className="cj-field-footer">{footer}</div>}
    </div>
);

export default CreateJob;