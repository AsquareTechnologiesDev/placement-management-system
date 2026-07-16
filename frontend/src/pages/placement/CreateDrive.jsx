import { useEffect, useState } from "react";
import {
    Building2,
    Briefcase,
    Calendar,
    MapPin,
    User,
    Mail,
    Phone,
    FileText,
    ClipboardList,
    Hash,
    Link as LinkIcon,
    Image as ImageIcon,
    CheckCircle2,
    Loader2,
    Send,
    Users,
    Landmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./CreateDrive.css";

const CreateDrive = () => {
    const navigate = useNavigate();

    const initialFormData = {
        company: "",
        title: "",
        description: "",
        eligibility: "",

        package: "",
        available_positions: "",
        openings: "",

        drive_datetime: "",
        registration_deadline: "",
        registration_link: "",

        mode: "OFFLINE",
        venue: "",
        city: "",
        state: "",

        coordinator_name: "",
        coordinator_email: "",
        coordinator_phone: "",

        notice_image: null,

        status: "DRAFT",
    };

    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [noticeFileName, setNoticeFileName] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies/");
            setCompanies(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load companies.");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company)
            newErrors.company = "Please select a company.";

        if (!formData.title.trim())
            newErrors.title = "Drive title is required.";

        if (!formData.description.trim())
            newErrors.description = "Description is required.";

        if (!formData.eligibility.trim())
            newErrors.eligibility = "Eligibility criteria is required.";

        if (
            formData.openings !== "" &&
            (isNaN(formData.openings) || Number(formData.openings) <= 0)
        )
            newErrors.openings = "Openings must be a positive number.";

        if (!formData.drive_datetime)
            newErrors.drive_datetime = "Drive date & time is required.";

        if (!formData.registration_deadline)
            newErrors.registration_deadline =
                "Registration deadline is required.";

        if (
            formData.drive_datetime &&
            formData.registration_deadline &&
            new Date(formData.registration_deadline) >=
                new Date(formData.drive_datetime)
        )
            newErrors.registration_deadline =
                "Deadline must be before the drive date & time.";

        if (formData.registration_link.trim()) {
            const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

            if (!urlRegex.test(formData.registration_link.trim()))
                newErrors.registration_link = "Enter a valid URL.";
        }

        if (formData.mode !== "ONLINE" && !formData.venue.trim())
            newErrors.venue = "Venue is required for this mode.";

        if (!formData.city.trim())
            newErrors.city = "City is required.";

        if (!formData.state.trim())
            newErrors.state = "State is required.";

        if (!formData.coordinator_name.trim())
            newErrors.coordinator_name = "Coordinator name is required.";

        if (!formData.coordinator_email.trim())
            newErrors.coordinator_email = "Coordinator email is required.";
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formData.coordinator_email))
                newErrors.coordinator_email = "Enter a valid email.";
        }

        if (!formData.coordinator_phone.trim())
            newErrors.coordinator_phone = "Coordinator phone is required.";
        else {
            const phoneRegex = /^[0-9+\-\s()]{10,15}$/;

            if (!phoneRegex.test(formData.coordinator_phone))
                newErrors.coordinator_phone = "Enter a valid phone number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "notice_image") {
            const file = files?.[0] || null;

            setFormData((prev) => ({
                ...prev,
                notice_image: file,
            }));

            setNoticeFileName(file ? file.name : "");
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

        if (isSubmitting) return;

        if (!validateForm()) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = new FormData();

            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    payload.append(key, formData[key]);
                }
            });

            await api.post("/companies/drives/", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Placement drive created successfully.");

            setTimeout(() => {
                navigate("/placement/drives");
            }, 1500);
        } catch (error) {
            console.error(error);

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

            setIsSubmitting(false);
        }
    };

    const statusOptions = [
        { value: "DRAFT", label: "Draft" },
        { value: "PUBLISHED", label: "Published" },
        { value: "CLOSED", label: "Closed" },
    ];

    return (
        <>
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="cd-root">

                {/* ---------------- Header ---------------- */}

                <div className="cd-header">
                    <div className="cd-header-blob" />
                    <div className="cd-header-grid" />

                    <span className="cd-header-eyebrow">
                        <Briefcase />
                        Placement Drives
                    </span>

                    <h1 className="cd-header-title">
                        Create Placement Drive
                    </h1>

                    <p className="cd-header-sub">
                        Fill in the details below to publish a new placement drive.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                    {/* ---------------- Basic Information ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">1</div>

                            <h2 className="cd-section-title">
                                <Building2 />
                                Basic Information
                            </h2>
                        </div>

                        <div className="cd-grid">

                            <div>
                                <label className="cd-label">
                                    <Building2 />
                                    Company <span className="required">*</span>
                                </label>

                                <select
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className={`cd-select ${
                                        errors.company ? "input-error" : ""
                                    }`}
                                >
                                    <option value="">Select Company</option>

                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.company && (
                                    <p className="error-text">{errors.company}</p>
                                )}
                            </div>

                            <div>
                                <label className="cd-label">
                                    <ClipboardList />
                                    Drive Title <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.title ? "input-error" : ""
                                    }`}
                                    placeholder="e.g. TCS Digital Hiring 2026"
                                />

                                {errors.title && (
                                    <p className="error-text">{errors.title}</p>
                                )}
                            </div>

                            <div className="cd-field-full">
                                <label className="cd-label">
                                    <FileText />
                                    Description <span className="required">*</span>
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className={`cd-textarea ${
                                        errors.description ? "input-error" : ""
                                    }`}
                                    placeholder="Brief overview of the hiring drive, roles and process."
                                />

                                {errors.description && (
                                    <p className="error-text">{errors.description}</p>
                                )}
                            </div>

                            <div className="cd-field-full">
                                <label className="cd-label">
                                    <CheckCircle2 />
                                    Eligibility <span className="required">*</span>
                                </label>

                                <textarea
                                    name="eligibility"
                                    value={formData.eligibility}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`cd-textarea ${
                                        errors.eligibility ? "input-error" : ""
                                    }`}
                                    placeholder="Eligible branches, CGPA cutoff, backlog policy, etc."
                                />

                                {errors.eligibility && (
                                    <p className="error-text">{errors.eligibility}</p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ---------------- Job Details ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">2</div>

                            <h2 className="cd-section-title">
                                <Briefcase />
                                Job Details
                            </h2>
                        </div>

                        <div className="cd-grid">

                            <div>
                                <label className="cd-label">
                                    <Hash />
                                    Package
                                </label>

                                <input
                                    type="text"
                                    name="package"
                                    value={formData.package}
                                    onChange={handleChange}
                                    placeholder="e.g. ₹7 LPA"
                                    className="cd-input"
                                />
                            </div>

                            <div>
                                <label className="cd-label">
                                    <Briefcase />
                                    Available Positions
                                </label>

                                <input
                                    type="text"
                                    name="available_positions"
                                    value={formData.available_positions}
                                    onChange={handleChange}
                                    placeholder="Python Developer, QA Engineer"
                                    className="cd-input"
                                />
                            </div>

                            <div>
                                <label className="cd-label">
                                    <Users />
                                    Number of Openings
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    name="openings"
                                    value={formData.openings}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.openings ? "input-error" : ""
                                    }`}
                                    placeholder="e.g. 25"
                                />

                                {errors.openings && (
                                    <p className="error-text">{errors.openings}</p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ---------------- Drive Schedule ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">3</div>

                            <h2 className="cd-section-title">
                                <Calendar />
                                Drive Schedule
                            </h2>
                        </div>

                        <div className="cd-grid">

                            <div>
                                <label className="cd-label">
                                    <Calendar />
                                    Drive Date & Time <span className="required">*</span>
                                </label>

                                <input
                                    type="datetime-local"
                                    name="drive_datetime"
                                    value={formData.drive_datetime}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.drive_datetime ? "input-error" : ""
                                    }`}
                                />

                                {errors.drive_datetime && (
                                    <p className="error-text">{errors.drive_datetime}</p>
                                )}
                            </div>

                            <div>
                                <label className="cd-label">
                                    <Calendar />
                                    Registration Deadline <span className="required">*</span>
                                </label>

                                <input
                                    type="datetime-local"
                                    name="registration_deadline"
                                    value={formData.registration_deadline}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.registration_deadline ? "input-error" : ""
                                    }`}
                                />

                                {errors.registration_deadline && (
                                    <p className="error-text">
                                        {errors.registration_deadline}
                                    </p>
                                )}
                            </div>

                            <div className="cd-field-full">
                                <label className="cd-label">
                                    <LinkIcon />
                                    Registration Link
                                </label>

                                <input
                                    type="text"
                                    name="registration_link"
                                    value={formData.registration_link}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className={`cd-input ${
                                        errors.registration_link ? "input-error" : ""
                                    }`}
                                />

                                {errors.registration_link && (
                                    <p className="error-text">
                                        {errors.registration_link}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ---------------- Venue Details ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">4</div>

                            <h2 className="cd-section-title">
                                <MapPin />
                                Venue Details
                            </h2>
                        </div>

                        <div className="cd-grid">

                            <div>
                                <label className="cd-label">
                                    <Landmark />
                                    Mode
                                </label>

                                <select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    className="cd-select"
                                >
                                    <option value="OFFLINE">Offline</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>

                            <div>
                                <label className="cd-label">
                                    <MapPin />
                                    Venue{" "}
                                    {formData.mode !== "ONLINE" && (
                                        <span className="required">*</span>
                                    )}
                                </label>

                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.venue ? "input-error" : ""
                                    }`}
                                    placeholder="Venue Name"
                                />

                                {errors.venue && (
                                    <p className="error-text">{errors.venue}</p>
                                )}
                            </div>

                            <div>
                                <label className="cd-label">
                                    <MapPin />
                                    City <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.city ? "input-error" : ""
                                    }`}
                                />

                                {errors.city && (
                                    <p className="error-text">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label className="cd-label">
                                    <MapPin />
                                    State <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.state ? "input-error" : ""
                                    }`}
                                />

                                {errors.state && (
                                    <p className="error-text">{errors.state}</p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ---------------- Coordinator Details ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">5</div>

                            <h2 className="cd-section-title">
                                <User />
                                Coordinator Details
                            </h2>
                        </div>

                        <div className="cd-grid">

                            <div>
                                <label className="cd-label">
                                    <User />
                                    Coordinator Name <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="coordinator_name"
                                    value={formData.coordinator_name}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.coordinator_name ? "input-error" : ""
                                    }`}
                                    placeholder="Full Name"
                                />

                                {errors.coordinator_name && (
                                    <p className="error-text">
                                        {errors.coordinator_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="cd-label">
                                    <Mail />
                                    Coordinator Email <span className="required">*</span>
                                </label>

                                <input
                                    type="email"
                                    name="coordinator_email"
                                    value={formData.coordinator_email}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.coordinator_email ? "input-error" : ""
                                    }`}
                                    placeholder="coordinator@company.com"
                                />

                                {errors.coordinator_email && (
                                    <p className="error-text">
                                        {errors.coordinator_email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="cd-label">
                                    <Phone />
                                    Coordinator Phone <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="coordinator_phone"
                                    value={formData.coordinator_phone}
                                    onChange={handleChange}
                                    className={`cd-input ${
                                        errors.coordinator_phone ? "input-error" : ""
                                    }`}
                                    placeholder="+91 98765 43210"
                                />

                                {errors.coordinator_phone && (
                                    <p className="error-text">
                                        {errors.coordinator_phone}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* ---------------- Notice ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">6</div>

                            <h2 className="cd-section-title">
                                <ImageIcon />
                                Notice
                            </h2>
                        </div>

                        <label className="cd-file-drop">
                            <div className="cd-file-icon">
                                <ImageIcon />
                            </div>

                            <div>
                                <p className="cd-file-title">
                                    {noticeFileName || "Upload notice image or PDF"}
                                </p>

                                <p className="cd-file-sub">
                                    PNG, JPG or PDF — click to browse
                                </p>
                            </div>

                            <input
                                type="file"
                                name="notice_image"
                                accept="image/*,.pdf"
                                onChange={handleChange}
                                className="cd-file-input"
                            />
                        </label>
                    </div>

                    {/* ---------------- Status ---------------- */}

                    <div className="cd-section">
                        <div className="cd-section-head">
                            <div className="cd-section-num">7</div>

                            <h2 className="cd-section-title">
                                <CheckCircle2 />
                                Status
                            </h2>
                        </div>

                        <div className="cd-status-group">
                            {statusOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`cd-status-pill ${
                                        formData.status === option.value
                                            ? "cd-status-pill-active"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={option.value}
                                        checked={formData.status === option.value}
                                        onChange={handleChange}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ---------------- Actions ---------------- */}

                    <div className="cd-actions">
                        <button
                            type="button"
                            className="cd-btn cd-btn-outline"
                            disabled={isSubmitting}
                            onClick={() => navigate("/placement/drives")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cd-btn cd-btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={17} className="cd-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Publish Drive
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>

            <AppFooter version="v1.0.0" />
        </>
    );
};

export default CreateDrive;