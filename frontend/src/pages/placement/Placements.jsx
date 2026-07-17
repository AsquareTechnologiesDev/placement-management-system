// src/pages/placement/Placements.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import {
    Trophy,
    Star,
    Building2,
    Banknote,
    Search,
    Filter,
    RefreshCw,
    Plus,
    X,
    User,
    Briefcase,
    Calendar,
    ImagePlus,
    FileText,
    Loader2,
    Pencil,
    Trash2,
    Inbox,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Placements.css";

const Placements = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    /* ==================================================
       Initial state
    ================================================== */

    const initialFormData = {
        student_id: "",
        company_id: "",
        job_role: "",
        package: "",
        placement_date: "",
        success_story: "",
        is_featured: false,
    };

    const [placements, setPlacements] = useState([]);
    const [students, setStudents] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [featuredFilter, setFeaturedFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");
    const [companyFilter, setCompanyFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    /* ==================================================
       Data fetching
    ================================================== */

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setIsLoadingList(true);

        try {
            await Promise.all([
                fetchPlacements(),
                fetchStudents(),
                fetchCompanies(),
            ]);
        } finally {
            setIsLoadingList(false);
        }
    };

    const fetchPlacements = async () => {
        try {
            const response = await api.get("/placements/");
            setPlacements(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load placements.");
        }
    };

    const fetchStudents = async () => {
    try {
        const response = await api.get("/student/approved/");
        setStudents(response.data);
    } catch (error) {
        console.error("Failed to fetch students:", error);
    }
};

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies/");
            setCompanies(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            await fetchPlacements();
            toast.success("Placements refreshed.");
        } finally {
            setIsRefreshing(false);
        }
    };

    /* ==================================================
       Derived data — stats, filters
    ================================================== */

    const stats = useMemo(() => {
        const total = placements.length;
        const featured = placements.filter((p) => p.is_featured).length;

        const uniqueCompanies = new Set(
            placements.map((p) => p.company_id ?? p.company?.id ?? p.company_name)
        );

        const highestPackage = placements.reduce((max, p) => {
            const value = parseFloat(p.package);
            return !isNaN(value) && value > max ? value : max;
        }, 0);

        return {
            total,
            featured,
            companies: uniqueCompanies.size,
            highestPackage,
        };
    }, [placements]);

    const availableYears = useMemo(() => {
        const years = new Set(
            placements
                .map((p) => (p.placement_date ? p.placement_date.slice(0, 4) : null))
                .filter(Boolean)
        );

        return Array.from(years).sort((a, b) => b.localeCompare(a));
    }, [placements]);

    const filteredPlacements = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return placements.filter((p) => {
            const studentName = (p.student_name || p.student?.name || "").toLowerCase();
            const companyName = (p.company_name || p.company?.name || "").toLowerCase();
            const jobRole = (p.job_role || "").toLowerCase();

            const matchesSearch =
                !term ||
                studentName.includes(term) ||
                companyName.includes(term) ||
                jobRole.includes(term);

            const matchesFeatured =
                featuredFilter === "all" ||
                (featuredFilter === "featured" && p.is_featured) ||
                (featuredFilter === "not_featured" && !p.is_featured);

            const matchesYear =
                yearFilter === "all" ||
                (p.placement_date && p.placement_date.slice(0, 4) === yearFilter);

            const matchesCompany =
                companyFilter === "all" ||
                String(p.company_id ?? p.company?.id) === String(companyFilter);

            return matchesSearch && matchesFeatured && matchesYear && matchesCompany;
        });
    }, [placements, searchTerm, featuredFilter, yearFilter, companyFilter]);

    /* ==================================================
       Modal — open / close
    ================================================== */

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormData);
        setErrors({});
        setPhotoFile(null);
        setPhotoPreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (placement) => {
        setEditingId(placement.id);

        setFormData({
            student_id: String(placement.student_id ?? placement.student?.id ?? ""),
            company_id: String(placement.company_id ?? placement.company?.id ?? ""),
            job_role: placement.job_role || "",
            package: placement.package || "",
            placement_date: placement.placement_date || "",
            success_story: placement.success_story || "",
            is_featured: !!placement.is_featured,
        });

        setErrors({});
        setPhotoFile(null);
        setPhotoPreview(placement.student_photo || placement.photo_url || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) return;

        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormData);
        setErrors({});
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    /* ==================================================
       Form handling
    ================================================== */

    const validateForm = () => {
        const newErrors = {};

        if (!formData.student_id)
            newErrors.student_id = "Please select a student.";

        if (!formData.company_id)
            newErrors.company_id = "Please select a company.";

        if (!formData.job_role.trim())
            newErrors.job_role = "Job role is required.";

        if (!formData.package.toString().trim())
            newErrors.package = "Package is required.";
        else if (isNaN(parseFloat(formData.package)))
            newErrors.package = "Enter a valid numeric package.";

        if (!formData.placement_date)
            newErrors.placement_date = "Placement date is required.";

        if (!formData.success_story.trim())
            newErrors.success_story = "Success story is required.";
        else if (formData.success_story.trim().length < 20)
            newErrors.success_story = "Story should be at least 20 characters.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleToggleFeatured = () => {
        setFormData((prev) => ({
            ...prev,
            is_featured: !prev.is_featured,
        }));
    };

    /* ---------------- Photo upload ---------------- */

    const applyPhotoFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file.");
            return;
        }

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handlePhotoInputChange = (e) => {
        const file = e.target.files?.[0];
        applyPhotoFile(file);
    };

    const handleRemovePhoto = (e) => {
        e.stopPropagation();
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);

        const file = e.dataTransfer.files?.[0];
        applyPhotoFile(file);
    };

    /* ---------------- Submit ---------------- */

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

            payload.append("student", formData.student_id);
            payload.append("company", formData.company_id);
            payload.append("job_role", formData.job_role);
            payload.append("package", formData.package);
            payload.append("placement_date", formData.placement_date);
            payload.append("success_story", formData.success_story);
            payload.append("is_featured", formData.is_featured);

            if (photoFile) {
                payload.append("student_photo", photoFile);
            }

            if (editingId) {
                await api.put(`/placements/${editingId}/`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Placement updated successfully.");
            } else {
                await api.post("/placements/", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Placement added successfully.");
            }

            setFormData(initialFormData);
            setErrors({});
            setPhotoFile(null);
            setPhotoPreview(null);
            setIsModalOpen(false);
            setEditingId(null);

            await fetchPlacements();
        } catch (error) {
            console.error(error);

            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else if (typeof error.response?.data === "object") {
    console.log("Backend Errors:", error.response.data);

    Object.entries(error.response.data).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        toast.error(`${field}: ${message}`);
    });
} else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ==================================================
       Delete
    ================================================== */

    const requestDelete = (placement) => {
        setDeleteTarget(placement);
    };

    const cancelDelete = () => {
        if (isDeleting) return;
        setDeleteTarget(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setIsDeleting(true);

            await api.delete(`/placements/${deleteTarget.id}/`);

            toast.success("Placement deleted.");
            setDeleteTarget(null);

            await fetchPlacements();
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete placement.");
        } finally {
            setIsDeleting(false);
        }
    };

    /* ==================================================
       Helpers
    ================================================== */

    const formatPackage = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return value || "—";
        return `₹${num.toLocaleString("en-IN")} LPA`;
    };

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);
        if (isNaN(date.getTime())) return value;

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /* ==================================================
       Render
    ================================================== */

    return (
        <>
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="pl-root">

                {/* ---------------- Hero ---------------- */}

                <div className="pl-header">
                    <div className="pl-header-blob" />
                    <div className="pl-header-grid" />

                    <div className="pl-header-top">
                        <div className="pl-header-text">

                            <span className="pl-header-eyebrow">
                                <Trophy />
                                Success Stories
                            </span>

                            <h1 className="pl-header-title">
                                Placement Management
                            </h1>

                            <p className="pl-header-sub">
                                Manage successful student placements and inspire future candidates.
                            </p>

                        </div>
                    </div>
                </div>

                {/* ---------------- Summary Cards ---------------- */}

                <div className="pl-stats-grid">

                    <div className="pl-stat-card">
                        <div className="pl-stat-icon pl-stat-icon-pink">
                            <Trophy />
                        </div>

                        <div className="pl-stat-body">
                            <h2 className="pl-stat-value">{stats.total}</h2>
                            <p className="pl-stat-label">Total Placements</p>
                            <p className="pl-stat-desc">All placements on record</p>
                        </div>
                    </div>

                    <div className="pl-stat-card">
                        <div className="pl-stat-icon pl-stat-icon-gold">
                            <Star />
                        </div>

                        <div className="pl-stat-body">
                            <h2 className="pl-stat-value">{stats.featured}</h2>
                            <p className="pl-stat-label">Featured Placements</p>
                            <p className="pl-stat-desc">Highlighted for students</p>
                        </div>
                    </div>

                    <div className="pl-stat-card">
                        <div className="pl-stat-icon pl-stat-icon-blue">
                            <Building2 />
                        </div>

                        <div className="pl-stat-body">
                            <h2 className="pl-stat-value">{stats.companies}</h2>
                            <p className="pl-stat-label">Companies</p>
                            <p className="pl-stat-desc">Recruiting partners represented</p>
                        </div>
                    </div>

                    <div className="pl-stat-card">
                        <div className="pl-stat-icon pl-stat-icon-green">
                            <Banknote />
                        </div>

                        <div className="pl-stat-body">
                            <h2 className="pl-stat-value">
                                {stats.highestPackage
                                    ? `₹${stats.highestPackage.toLocaleString("en-IN")}`
                                    : "—"}
                            </h2>
                            <p className="pl-stat-label">Highest Package</p>
                            <p className="pl-stat-desc">Top offer secured</p>
                        </div>
                    </div>

                </div>

                {/* ---------------- Action Bar ---------------- */}

                <div className="pl-action-bar">

                    <div className="pl-search-wrap">
                        <Search className="pl-search-icon" />

                        <input
                            type="text"
                            className="pl-search-input"
                            placeholder="Search by student, company or job role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="pl-filter-group">

                        <div className="pl-filter-wrap">
                            <Filter className="pl-filter-icon" />

                            <select
                                className="pl-filter-select"
                                value={featuredFilter}
                                onChange={(e) => setFeaturedFilter(e.target.value)}
                            >
                                <option value="all">All Placements</option>
                                <option value="featured">Featured Only</option>
                                <option value="not_featured">Not Featured</option>
                            </select>
                        </div>

                        <div className="pl-filter-wrap">
                            <Calendar className="pl-filter-icon" />

                            <select
                                className="pl-filter-select"
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                            >
                                <option value="all">All Years</option>
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pl-filter-wrap">
                            <Building2 className="pl-filter-icon" />

                            <select
                                className="pl-filter-select"
                                value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}
                            >
                                <option value="all">All Companies</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="pl-action-buttons">

                        <button
                            type="button"
                            className="pl-btn pl-btn-outline"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw
                                size={16}
                                className={isRefreshing ? "pl-spin" : ""}
                            />
                            Refresh
                        </button>

                        <button
                            type="button"
                            className="pl-btn pl-btn-primary"
                            onClick={openAddModal}
                        >
                            <Plus size={16} />
                            Add Placement
                        </button>

                    </div>

                </div>

                {/* ---------------- Placement List ---------------- */}

                <div className="pl-panel">

                    <div className="pl-panel-head">
                        <h2 className="pl-panel-title">Placements</h2>

                        <p className="pl-panel-subtitle">
                            {filteredPlacements.length} record
                            {filteredPlacements.length === 1 ? "" : "s"} found
                        </p>
                    </div>

                    {isLoadingList ? (
                        <div className="pl-loading-state">
                            <Loader2 size={26} className="pl-spin" />
                            <p>Loading placements...</p>
                        </div>
                    ) : filteredPlacements.length === 0 ? (
                        <div className="pl-empty">
                            <div className="pl-empty-icon">
                                <Inbox />
                            </div>

                            <p className="pl-empty-title">No placements yet</p>

                            <p className="pl-empty-sub">
                                Add your first successful placement to inspire future students.
                            </p>

                            <button
                                type="button"
                                className="pl-btn pl-btn-primary pl-empty-cta"
                                onClick={openAddModal}
                            >
                                <Plus size={16} />
                                Add your first placement
                            </button>
                        </div>
                    ) : (
                        <div className="pl-card-grid">
                            {filteredPlacements.map((placement) => {
                                const studentName =
                                    placement.student_name || placement.student?.name || "Unknown Student";

                                const companyName =
                                    placement.company_name || placement.company?.name || "Unknown Company";

                                const photo = placement.student_photo || placement.photo_url;

                                return (
                                    <div className="pl-card" key={placement.id}>

                                        {placement.is_featured && (
                                            <span className="pl-card-badge">
                                                <Star size={12} />
                                                Featured
                                            </span>
                                        )}

                                        <div className="pl-card-media">
                                            {photo ? (
                                                <img
                                                    src={photo}
                                                    alt={studentName}
                                                    className="pl-card-photo"
                                                />
                                            ) : (
                                                <div className="pl-card-photo-fallback">
                                                    <User size={34} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pl-card-body">

                                            <h3 className="pl-card-name">{studentName}</h3>

                                            <div className="pl-card-company-row">
                                                <span className="pl-company-avatar">
                                                    {companyName.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="pl-card-company-name">{companyName}</span>
                                            </div>

                                            <div className="pl-card-meta">
                                                <span className="pl-card-meta-item">
                                                    <Briefcase size={14} />
                                                    {placement.job_role}
                                                </span>

                                                <span className="pl-card-meta-item">
                                                    <Banknote size={14} />
                                                    {formatPackage(placement.package)}
                                                </span>

                                                <span className="pl-card-meta-item">
                                                    <Calendar size={14} />
                                                    {formatDate(placement.placement_date)}
                                                </span>
                                            </div>

                                            {placement.success_story && (
                                                <p className="pl-card-story">
                                                    "{placement.success_story}"
                                                </p>
                                            )}

                                        </div>

                                        <div className="pl-card-actions">
                                            <button
                                                type="button"
                                                className="pl-icon-btn"
                                                onClick={() => openEditModal(placement)}
                                                aria-label="Edit placement"
                                            >
                                                <Pencil size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                className="pl-icon-btn pl-icon-btn-danger"
                                                onClick={() => requestDelete(placement)}
                                                aria-label="Delete placement"
                                            >
                                                <Trash2 size={15} />
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

            {/* ==================================================
                Add / Edit Modal
            ================================================== */}

            {isModalOpen && (
                <div className="pl-modal-overlay" onMouseDown={closeModal}>
                    <div
                        className="pl-modal"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Sticky header */}

                        <div className="pl-modal-head">
                            <div>
                                <h2 className="pl-modal-title">
                                    {editingId ? "Edit Placement" : "Add Placement"}
                                </h2>

                                <p className="pl-modal-subtitle">
                                    {editingId
                                        ? "Update the details of this student's placement."
                                        : "Record a successful placement to inspire future students."}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="pl-modal-close"
                                onClick={closeModal}
                                disabled={isSubmitting}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="pl-modal-form">

                            {/* Scrollable body — header and footer stay fixed */}

                            <div className="pl-modal-body">

                                {/* ---------------- Section 1: Basic Information ---------------- */}

                                <div className="pl-modal-section">
                                    <div className="pl-modal-section-head">
                                        <span className="pl-modal-section-num">1</span>
                                        <h3 className="pl-modal-section-title">Basic Information</h3>
                                    </div>

                                    <div className="pl-form-grid">

                                        {/* Student */}

                                        <div className="pl-field">
                                            <label className="pl-label">
                                                Student <span className="required">*</span>
                                            </label>

                                            <div
                                                className={`pl-input-wrap ${
                                                    errors.student_id ? "input-error" : ""
                                                }`}
                                            >
                                                <User className="pl-input-icon" />

                                                <select
    name="student_id"
    value={formData.student_id}
    onChange={handleChange}
    className="pl-input pl-select"
>
    <option value="">Select student</option>

    {students.map((student) => (
        <option key={student.id} value={student.id}>
            {student.student_name}
        </option>
    ))}
</select>
                                            </div>

                                            {errors.student_id && (
                                                <p className="error-text">{errors.student_id}</p>
                                            )}
                                        </div>

                                        {/* Company */}

                                        <div className="pl-field">
                                            <label className="pl-label">
                                                Company <span className="required">*</span>
                                            </label>

                                            <div
                                                className={`pl-input-wrap ${
                                                    errors.company_id ? "input-error" : ""
                                                }`}
                                            >
                                                <Building2 className="pl-input-icon" />

                                                <select
                                                    name="company_id"
                                                    value={formData.company_id}
                                                    onChange={handleChange}
                                                    className="pl-input pl-select"
                                                >
                                                    <option value="">Select company</option>
                                                    {companies.map((company) => (
                                                        <option key={company.id} value={company.id}>
                                                            {company.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {errors.company_id && (
                                                <p className="error-text">{errors.company_id}</p>
                                            )}
                                        </div>

                                        {/* Job Role */}

                                        <div className="pl-field">
                                            <label className="pl-label">
                                                Job Role <span className="required">*</span>
                                            </label>

                                            <div
                                                className={`pl-input-wrap ${
                                                    errors.job_role ? "input-error" : ""
                                                }`}
                                            >
                                                <Briefcase className="pl-input-icon" />

                                                <input
                                                    type="text"
                                                    name="job_role"
                                                    value={formData.job_role}
                                                    onChange={handleChange}
                                                    className="pl-input"
                                                    placeholder="e.g. Software Engineer"
                                                />
                                            </div>

                                            {errors.job_role && (
                                                <p className="error-text">{errors.job_role}</p>
                                            )}
                                        </div>

                                        {/* Package */}

                                        <div className="pl-field">
                                            <label className="pl-label">
                                                Package (LPA) <span className="required">*</span>
                                            </label>

                                            <div
                                                className={`pl-input-wrap ${
                                                    errors.package ? "input-error" : ""
                                                }`}
                                            >
                                                <Banknote className="pl-input-icon" />

                                                <input
                                                    type="text"
                                                    name="package"
                                                    value={formData.package}
                                                    onChange={handleChange}
                                                    className="pl-input"
                                                    placeholder="e.g. 12.5"
                                                />
                                            </div>

                                            {errors.package && (
                                                <p className="error-text">{errors.package}</p>
                                            )}
                                        </div>

                                        {/* Placement Date */}

                                        <div className="pl-field">
                                            <label className="pl-label">
                                                Placement Date <span className="required">*</span>
                                            </label>

                                            <div
                                                className={`pl-input-wrap ${
                                                    errors.placement_date ? "input-error" : ""
                                                }`}
                                            >
                                                <Calendar className="pl-input-icon" />

                                                <input
                                                    type="date"
                                                    name="placement_date"
                                                    value={formData.placement_date}
                                                    onChange={handleChange}
                                                    className="pl-input"
                                                />
                                            </div>

                                            {errors.placement_date && (
                                                <p className="error-text">{errors.placement_date}</p>
                                            )}
                                        </div>

                                        {/* Featured toggle */}

                                        <div className="pl-field">
                                            <label className="pl-label">Featured Placement</label>

                                            <div className="pl-toggle-row">
                                                <button
                                                    type="button"
                                                    className={`pl-toggle ${
                                                        formData.is_featured ? "pl-toggle-active" : ""
                                                    }`}
                                                    onClick={handleToggleFeatured}
                                                    role="switch"
                                                    aria-checked={formData.is_featured}
                                                    aria-label="Toggle featured placement"
                                                >
                                                    <span className="pl-toggle-knob" />
                                                </button>

                                                <span
                                                    className={`pl-toggle-status ${
                                                        formData.is_featured ? "pl-toggle-status-on" : ""
                                                    }`}
                                                >
                                                    {formData.is_featured ? "Featured Placement" : "Not Featured"}
                                                </span>
                                            </div>

                                            <p className="pl-toggle-hint">
                                                {formData.is_featured
                                                    ? "Will appear in featured stories"
                                                    : "Will not be featured"}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* ---------------- Section 2: Student Photo ---------------- */}

                                <div className="pl-modal-section">
                                    <div className="pl-modal-section-head">
                                        <span className="pl-modal-section-num">2</span>
                                        <h3 className="pl-modal-section-title">Student Photo</h3>
                                    </div>

                                    <div
                                        className={`pl-file-drop pl-file-drop-lg ${
                                            isDragActive ? "pl-file-drop-active" : ""
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {photoPreview ? (
                                            <div className="pl-file-preview-wrap">
                                                <img
                                                    src={photoPreview}
                                                    alt="Student preview"
                                                    className="pl-file-preview pl-file-preview-lg"
                                                />

                                                <button
                                                    type="button"
                                                    className="pl-file-remove"
                                                    onClick={handleRemovePhoto}
                                                    aria-label="Remove photo"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="pl-file-icon pl-file-icon-lg">
                                                <ImagePlus />
                                            </div>
                                        )}

                                        <div>
                                            <p className="pl-file-title">
                                                {photoFile
                                                    ? photoFile.name
                                                    : "Drag & drop a photo, or click to browse"}
                                            </p>

                                            <p className="pl-file-sub">
                                                Accepted formats: PNG, JPG, WEBP &nbsp;•&nbsp; Maximum size: 5MB
                                            </p>
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoInputChange}
                                            className="pl-file-input"
                                        />
                                    </div>
                                </div>

                                {/* ---------------- Section 3: Success Story ---------------- */}

                                <div className="pl-modal-section pl-modal-section-last">
                                    <div className="pl-modal-section-head">
                                        <span className="pl-modal-section-num">3</span>
                                        <h3 className="pl-modal-section-title">Success Story</h3>
                                    </div>

                                    <div className="pl-field">
                                        <label className="pl-label">
                                            Share the journey <span className="required">*</span>
                                        </label>

                                        <div
                                            className={`pl-input-wrap pl-input-wrap-textarea ${
                                                errors.success_story ? "input-error" : ""
                                            }`}
                                        >
                                            <FileText className="pl-input-icon pl-input-icon-textarea" />

                                            <textarea
                                                rows="6"
                                                maxLength={600}
                                                name="success_story"
                                                value={formData.success_story}
                                                onChange={handleChange}
                                                className="pl-input pl-textarea pl-textarea-lg"
                                                placeholder="Share the student's journey — how they prepared, what set them apart, and what made this placement special..."
                                            />
                                        </div>

                                        <div className="pl-textarea-footer">
                                            {errors.success_story ? (
                                                <p className="error-text">{errors.success_story}</p>
                                            ) : (
                                                <span className="pl-field-hint">
                                                    Minimum 20 characters
                                                </span>
                                            )}

                                            <span className="pl-char-counter">
                                                {formData.success_story.length}/600
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Sticky footer */}

                            <div className="pl-modal-actions">

                                <button
                                    type="button"
                                    className="pl-btn pl-btn-outline"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="pl-btn pl-btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="pl-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            Save Placement
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* ==================================================
                Delete Confirmation
            ================================================== */}

            {deleteTarget && (
                <div className="pl-modal-overlay" onMouseDown={cancelDelete}>
                    <div
                        className="pl-confirm-dialog"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="pl-confirm-icon">
                            <AlertTriangle />
                        </div>

                        <h3 className="pl-confirm-title">Delete this placement?</h3>

                        <p className="pl-confirm-sub">
                            This will permanently remove{" "}
                            <strong>
                                {deleteTarget.student_name || deleteTarget.student?.name || "this record"}
                            </strong>
                            's placement. This action cannot be undone.
                        </p>

                        <div className="pl-confirm-actions">
                            <button
                                type="button"
                                className="pl-btn pl-btn-outline"
                                onClick={cancelDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="pl-btn pl-btn-danger"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="pl-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete Placement
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Placements;