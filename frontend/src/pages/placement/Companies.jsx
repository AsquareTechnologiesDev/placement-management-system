import { useEffect, useState } from "react";
import {
    Building2,
    Globe,
    MapPin,
    User,
    Mail,
    Phone,
    FileText,
    Plus,
    ExternalLink,
    Inbox,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Companies.css";

const Companies = () => {
    const navigate = useNavigate();

    const initialFormData = {
        name: "",
        website: "",
        location: "",
        description: "",
        contact_person: "",
        email: "",
        phone: "",
    };

    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.name.trim())
            newErrors.name = "Company name is required.";

        if (!formData.website.trim())
            newErrors.website = "Website is required.";
        else {
            const urlRegex =
                /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

            if (!urlRegex.test(formData.website.trim()))
                newErrors.website = "Enter a valid website.";
        }

        if (!formData.contact_person.trim())
            newErrors.contact_person = "Contact person is required.";

        if (!formData.email.trim())
            newErrors.email = "Email is required.";
        else {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formData.email))
                newErrors.email = "Enter a valid email.";
        }

        if (!formData.phone.trim())
            newErrors.phone = "Phone number is required.";
        else {
            const phoneRegex =
                /^[0-9+\-\s()]{10,15}$/;

            if (!phoneRegex.test(formData.phone))
                newErrors.phone =
                    "Enter a valid phone number.";
        }

        if (!formData.location.trim())
            newErrors.location = "Location is required.";

        if (!formData.description.trim())
            newErrors.description = "Description is required.";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!validateForm()) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        try {
            setIsSubmitting(true);

            await api.post("/companies/", formData);

            toast.success("Company added successfully.");

            setFormData(initialFormData);
            setErrors({});

            await fetchCompanies();
        } catch (error) {
            console.error(error);

            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else if (typeof error.response?.data === "object") {
                const firstError = Object.values(error.response.data)[0];

                toast.error(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : firstError
                );
            } else {
                toast.error(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
    <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

    <div className="co-root">

        {/* ---------------- Header ---------------- */}

        <div className="co-header">
            <div className="co-header-blob" />
            <div className="co-header-grid" />

            <div className="co-header-top">
                <div className="co-header-text">

                    <span className="co-header-eyebrow">
                        <Building2 />
                        Placement Partners
                    </span>

                    <h1 className="co-header-title">
                        Company Management
                    </h1>

                    <p className="co-header-sub">
                        Manage recruiting companies and placement partners.
                    </p>

                </div>
            </div>
        </div>

        {/* ---------------- Summary ---------------- */}

        <div className="co-stat-card">
            <div className="co-stat-icon">
                <Building2 />
            </div>

            <div>
                <p className="co-stat-label">
                    Total Companies
                </p>

                <h1 className="co-stat-value">
                    {companies.length}
                </h1>
            </div>
        </div>

        {/* ---------------- Add Company ---------------- */}

        <div className="co-panel">

            <div className="co-panel-head">
                <h2 className="co-panel-title">
                    Add Company
                </h2>

                <p className="co-panel-subtitle">
                    Register a new recruiting partner
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

                <div className="co-form-grid">

                    {/* Company Name */}

                    <div className="co-field">
                        <label className="co-label">
                            Company Name <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap ${
                                errors.name ? "input-error" : ""
                            }`}
                        >
                            <Building2 className="co-input-icon" />

                            <input
                                autoFocus
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="co-input"
                                placeholder="e.g. Infineon Technologies"
                            />
                        </div>

                        {errors.name && (
                            <p className="error-text">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Website */}

                    <div className="co-field">

                        <label className="co-label">
                            Website <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap ${
                                errors.website ? "input-error" : ""
                            }`}
                        >
                            <Globe className="co-input-icon" />

                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="co-input"
                                placeholder="https://example.com"
                            />
                        </div>

                        {errors.website && (
                            <p className="error-text">
                                {errors.website}
                            </p>
                        )}
                    </div>

                    {/* Contact Person */}

                    <div className="co-field">

                        <label className="co-label">
                            Contact Person <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap ${
                                errors.contact_person
                                    ? "input-error"
                                    : ""
                            }`}
                        >
                            <User className="co-input-icon" />

                            <input
                                type="text"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                className="co-input"
                                placeholder="Full Name"
                            />
                        </div>

                        {errors.contact_person && (
                            <p className="error-text">
                                {errors.contact_person}
                            </p>
                        )}
                    </div>

                    {/* Email */}

                    <div className="co-field">

                        <label className="co-label">
                            Email <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap ${
                                errors.email ? "input-error" : ""
                            }`}
                        >
                            <Mail className="co-input-icon" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="co-input"
                                placeholder="contact@company.com"
                            />
                        </div>

                        {errors.email && (
                            <p className="error-text">
                                {errors.email}
                            </p>
                        )}
                    </div>
                                        {/* Phone */}

                    <div className="co-field">
                        <label className="co-label">
                            Phone <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap ${
                                errors.phone ? "input-error" : ""
                            }`}
                        >
                            <Phone className="co-input-icon" />

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="co-input"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        {errors.phone && (
                            <p className="error-text">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Location */}

                    <div className="co-field">
                        <label className="co-label">
                            Location <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap ${
                                errors.location ? "input-error" : ""
                            }`}
                        >
                            <MapPin className="co-input-icon" />

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="co-input"
                                placeholder="City, Country"
                            />
                        </div>

                        {errors.location && (
                            <p className="error-text">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    {/* Description */}

                    <div className="co-field co-field-full">
                        <label className="co-label">
                            Description <span className="required">*</span>
                        </label>

                        <div
                            className={`co-input-wrap co-input-wrap-textarea ${
                                errors.description ? "input-error" : ""
                            }`}
                        >
                            <FileText className="co-input-icon co-input-icon-textarea" />

                            <textarea
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="co-input co-textarea"
                                placeholder="Brief note about the company, hiring focus, etc."
                            />
                        </div>

                        {errors.description && (
                            <p className="error-text">
                                {errors.description}
                            </p>
                        )}
                    </div>

                </div>

                <button
                    type="submit"
                    className="co-submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2
                                size={18}
                                className="spin-icon"
                            />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            Add Company
                        </>
                    )}
                </button>

            </form>

        </div>

        {/* ---------------- Company List starts below ---------------- */}
                {/* ---------------- Company List ---------------- */}

        <div className="co-panel">
            <div className="co-panel-head">
                <h2 className="co-panel-title">
                    Company List
                </h2>

                <p className="co-panel-subtitle">
                    {companies.length} partner
                    {companies.length === 1 ? "" : "s"} on record
                </p>
            </div>

            {companies.length === 0 ? (
                <div className="co-empty">
                    <div className="co-empty-icon">
                        <Inbox />
                    </div>

                    <p className="co-empty-title">
                        No companies found
                    </p>

                    <p className="co-empty-sub">
                        Companies you add will appear here.
                    </p>
                </div>
            ) : (
                <div className="co-list-grid">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="co-card"
                        >
                            <div className="co-card-head">
                                <div className="co-avatar">
                                    {company.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>

                                <div>
                                    <h3 className="co-card-name">
                                        {company.name}
                                    </h3>

                                    <span className="co-card-location">
                                        <MapPin size={15} />
                                        {company.location || "Location not available"}
                                    </span>
                                </div>
                            </div>

                            <div className="co-card-rows">

                                <div className="co-card-row">
                                    <Globe className="co-card-row-icon" />

                                    {company.website ? (
                                        <a
                                            href={
                                                company.website.startsWith("http")
                                                    ? company.website
                                                    : `https://${company.website}`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="co-card-link"
                                        >
                                            {company.website}
                                            <ExternalLink size={15} />
                                        </a>
                                    ) : (
                                        <span className="co-card-muted">
                                            Not available
                                        </span>
                                    )}
                                </div>

                                <div className="co-card-row">
                                    <User className="co-card-row-icon" />

                                    <span>
                                        {company.contact_person || "Not available"}
                                    </span>
                                </div>

                                <div className="co-card-row">
                                    <Mail className="co-card-row-icon" />

                                    {company.email ? (
                                        <a
                                            href={`mailto:${company.email}`}
                                            className="co-card-link"
                                        >
                                            {company.email}
                                        </a>
                                    ) : (
                                        <span className="co-card-muted">
                                            Not available
                                        </span>
                                    )}
                                </div>

                                <div className="co-card-row">
                                    <Phone className="co-card-row-icon" />

                                    {company.phone ? (
                                        <a
                                            href={`tel:${company.phone}`}
                                            className="co-card-link"
                                        >
                                            {company.phone}
                                        </a>
                                    ) : (
                                        <span className="co-card-muted">
                                            Not available
                                        </span>
                                    )}
                                </div>
                            </div>

                            {company.description && (
                                <p className="co-card-desc">
                                    {company.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>

    <AppFooter version="v1.0.0" />
</>
        
    );
};

export default Companies;