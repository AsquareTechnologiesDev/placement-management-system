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
    Eye,
    Pencil,
    Trash2,
    X,
    Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Companies.css";

/* ---------------- Shared: close on Escape key ---------------- */

const useEscapeKey = (onEscape, active = true) => {
    useEffect(() => {
        if (!active) return undefined;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onEscape();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onEscape, active]);
};

/* ---------------- View Company Modal ---------------- */

const ViewCompanyModal = ({ company, onClose }) => {
    useEscapeKey(onClose, !!company);

    if (!company) return null;

    const formattedDate = company.created_at
        ? new Date(company.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Not available";

    return (
        <div className="co-modal-overlay" onClick={onClose}>
            <div
                className="co-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="co-view-modal-title"
            >
                <div className="co-modal-head">
                    <div className="co-modal-head-text">
                        <span className="co-modal-eyebrow">
                            Company Profile
                        </span>
                        <h2
                            id="co-view-modal-title"
                            className="co-modal-title"
                        >
                            {company.name}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="co-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="co-modal-body co-view-grid">
                    <div className="co-view-row">
                        <Building2 className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Company Name</p>
                            <p className="co-view-value">
                                {company.name || "Not available"}
                            </p>
                        </div>
                    </div>

                    <div className="co-view-row">
                        <Globe className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Website</p>
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
                                    <ExternalLink size={14} />
                                </a>
                            ) : (
                                <p className="co-view-value co-card-muted">
                                    Not available
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="co-view-row">
                        <MapPin className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Location</p>
                            <p className="co-view-value">
                                {company.location || "Not available"}
                            </p>
                        </div>
                    </div>

                    <div className="co-view-row">
                        <User className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Contact Person</p>
                            <p className="co-view-value">
                                {company.contact_person || "Not available"}
                            </p>
                        </div>
                    </div>

                    <div className="co-view-row">
                        <Mail className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Email</p>
                            {company.email ? (
                                <a
                                    href={`mailto:${company.email}`}
                                    className="co-card-link"
                                >
                                    {company.email}
                                </a>
                            ) : (
                                <p className="co-view-value co-card-muted">
                                    Not available
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="co-view-row">
                        <Phone className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Phone</p>
                            {company.phone ? (
                                <a
                                    href={`tel:${company.phone}`}
                                    className="co-card-link"
                                >
                                    {company.phone}
                                </a>
                            ) : (
                                <p className="co-view-value co-card-muted">
                                    Not available
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="co-view-row">
                        <Calendar className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Created Date</p>
                            <p className="co-view-value">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="co-view-row co-view-row-full">
                        <FileText className="co-view-row-icon" />
                        <div>
                            <p className="co-view-label">Description</p>
                            <p className="co-view-value co-view-desc">
                                {company.description || "Not available"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="co-modal-foot">
                    <button
                        type="button"
                        className="co-btn-outline-primary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ---------------- Delete Confirmation Dialog ---------------- */

const DeleteConfirmDialog = ({ company, isDeleting, onCancel, onConfirm }) => {
    useEscapeKey(onCancel, !!company && !isDeleting);

    if (!company) return null;

    return (
        <div className="co-modal-overlay" onClick={isDeleting ? undefined : onCancel}>
            <div
                className="co-modal co-modal-sm"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="co-delete-modal-title"
            >
                <div className="co-modal-head">
                    <div className="co-modal-head-text">
                        <h2
                            id="co-delete-modal-title"
                            className="co-modal-title"
                        >
                            Delete Company
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="co-modal-close"
                        onClick={onCancel}
                        disabled={isDeleting}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="co-modal-body co-confirm-body">
                    <div className="co-confirm-icon">
                        <Trash2 size={22} />
                    </div>

                    <h3 className="co-confirm-title">Delete Company</h3>

                    <p className="co-confirm-text">
                        Are you sure you want to delete{" "}
                        <strong className="co-confirm-name">
                            {company.name}
                        </strong>
                        ?
                    </p>

                    <p className="co-confirm-warning">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="co-modal-foot">
                    <button
                        type="button"
                        className="co-btn-secondary"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="co-btn-danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={16} className="spin-icon" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ---------------- Companies Page ---------------- */

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

    // Edit mode: null = "Add" mode, otherwise holds the id being edited
    const [editingId, setEditingId] = useState(null);

    // Tracks which company row + action is currently loading (view/edit fetch)
    const [rowLoading, setRowLoading] = useState({ id: null, action: null });

    // View modal
    const [viewingCompany, setViewingCompany] = useState(null);

    // Delete dialog
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const getErrorMessage = (error, fallback) => {
        if (error?.response?.data?.detail) {
            return error.response.data.detail;
        }

        if (typeof error?.response?.data === "object" && error.response.data) {
            const firstError = Object.values(error.response.data)[0];
            return Array.isArray(firstError) ? firstError[0] : firstError;
        }

        if (error?.response?.status === 404) {
            return "Company not found.";
        }

        if (error?.response?.status === 401) {
            return "Your session has expired. Please log in again.";
        }

        if (error?.response?.status === 500) {
            return "Server error. Please try again later.";
        }

        return fallback;
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

    const resetForm = () => {
        setFormData(initialFormData);
        setErrors({});
        setEditingId(null);
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

            if (editingId) {
                await api.put(`/companies/${editingId}/`, formData);
                toast.success("Company updated successfully.");
            } else {
                await api.post("/companies/", formData);
                toast.success("Company added successfully.");
            }

            resetForm();

            await fetchCompanies();
        } catch (error) {
            console.error(error);
            toast.error(
                getErrorMessage(
                    error,
                    "Something went wrong. Please try again."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------------- View ---------------- */

    const handleView = async (company) => {
        if (rowLoading.id) return;

        try {
            setRowLoading({ id: company.id, action: "view" });

            const response = await api.get(`/companies/${company.id}/`);

            setViewingCompany(response.data);
        } catch (error) {
            console.error(error);
            toast.error(
                getErrorMessage(error, "Unable to load company details.")
            );
        } finally {
            setRowLoading({ id: null, action: null });
        }
    };

    const closeViewModal = () => setViewingCompany(null);

    /* ---------------- Edit ---------------- */

    const handleEditClick = async (company) => {
        if (rowLoading.id || isSubmitting) return;

        try {
            setRowLoading({ id: company.id, action: "edit" });

            const response = await api.get(`/companies/${company.id}/`);
            const data = response.data;

            setFormData({
                name: data.name || "",
                website: data.website || "",
                location: data.location || "",
                description: data.description || "",
                contact_person: data.contact_person || "",
                email: data.email || "",
                phone: data.phone || "",
            });

            setErrors({});
            setEditingId(company.id);

            // Bring the form into view for the user
            document
                .getElementById("co-company-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (error) {
            console.error(error);
            toast.error(
                getErrorMessage(error, "Unable to load company details.")
            );
        } finally {
            setRowLoading({ id: null, action: null });
        }
    };

    const handleCancelEdit = () => {
        if (isSubmitting) return;
        resetForm();
    };

    /* ---------------- Delete ---------------- */

    const handleDeleteClick = (company) => {
        if (rowLoading.id) return;
        setDeleteTarget(company);
    };

    const cancelDelete = () => {
        if (isDeleting) return;
        setDeleteTarget(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget || isDeleting) return;

        try {
            setIsDeleting(true);

            await api.delete(`/companies/${deleteTarget.id}/`);

            toast.success("Company deleted successfully.");

            setDeleteTarget(null);

            // If the deleted company was being edited, reset the form
            if (editingId === deleteTarget.id) {
                resetForm();
            }

            await fetchCompanies();
        } catch (error) {
            console.error(error);
            toast.error(
                getErrorMessage(
                    error,
                    "Unable to delete company. Please try again."
                )
            );
        } finally {
            setIsDeleting(false);
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

        {/* ---------------- Add / Edit Company ---------------- */}

        <div className="co-panel" id="co-company-form">

            <div className="co-panel-head">
                <h2 className="co-panel-title">
                    {editingId ? "Edit Company" : "Add Company"}
                </h2>

                <p className="co-panel-subtitle">
                    {editingId
                        ? "Update company information."
                        : "Register a new recruiting partner"}
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

                <div className="co-form-actions">

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
                                {editingId ? "Updating..." : "Saving..."}
                            </>
                        ) : editingId ? (
                            <>
                                <Pencil size={18} />
                                Update Company
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Add Company
                            </>
                        )}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="co-btn-secondary co-cancel-edit-btn"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}

                </div>

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
                    {companies.map((company) => {
                        const isRowBusy = rowLoading.id === company.id;
                        const isViewLoading =
                            isRowBusy && rowLoading.action === "view";
                        const isEditLoading =
                            isRowBusy && rowLoading.action === "edit";
                        const anyActionBusy =
                            rowLoading.id !== null || isDeleting;

                        return (
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

                            <div className="co-card-actions">
                                <button
                                    type="button"
                                    className="co-icon-btn"
                                    onClick={() => handleView(company)}
                                    disabled={anyActionBusy}
                                    aria-label={`View ${company.name}`}
                                    title="View"
                                >
                                    {isViewLoading ? (
                                        <Loader2
                                            size={16}
                                            className="spin-icon"
                                        />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                    View
                                </button>

                                <button
                                    type="button"
                                    className="co-icon-btn"
                                    onClick={() => handleEditClick(company)}
                                    disabled={anyActionBusy}
                                    aria-label={`Edit ${company.name}`}
                                    title="Edit"
                                >
                                    {isEditLoading ? (
                                        <Loader2
                                            size={16}
                                            className="spin-icon"
                                        />
                                    ) : (
                                        <Pencil size={16} />
                                    )}
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="co-icon-btn co-icon-btn-danger"
                                    onClick={() => handleDeleteClick(company)}
                                    disabled={anyActionBusy}
                                    aria-label={`Delete ${company.name}`}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>

    <AppFooter version="v1.0.0" />

    {viewingCompany && (
        <ViewCompanyModal
            company={viewingCompany}
            onClose={closeViewModal}
        />
    )}

    {deleteTarget && (
        <DeleteConfirmDialog
            company={deleteTarget}
            isDeleting={isDeleting}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
        />
    )}
</>
        
    );
};

export default Companies;