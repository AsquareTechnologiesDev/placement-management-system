import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
    CalendarClock,
    Plus,
    Building2,
    Wallet,
    Users,
    Layers,
    Calendar,
    Clock,
    Laptop2,
    MapPin,
    Eye,
    Pencil,
    Trash2,
    Inbox,
    X,
    AlertTriangle,
    Loader2,
    Search,
    SlidersHorizontal,
    XCircle,
    RefreshCw,
    FileText,
    ClipboardList,
    Link2,
    User,
    Mail,
    Phone,
    History,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Drives.css";

// ---------------- Status vocabulary ----------------
// Supports both the legacy status set already in use (upcoming/ongoing/…)
// and the Published/Draft/Closed vocabulary called out in the design brief.

const STATUS_META = {
    published: { label: "Published", tone: "success" },
    open: { label: "Open", tone: "success" },
    active: { label: "Active", tone: "success" },
    ongoing: { label: "Ongoing", tone: "success" },
    upcoming: { label: "Upcoming", tone: "warning" },
    draft: { label: "Draft", tone: "warning" },
    completed: { label: "Completed", tone: "neutral" },
    closed: { label: "Closed", tone: "danger" },
    cancelled: { label: "Cancelled", tone: "danger" },
};

const getStatusMeta = (status) => {
    const key = (status || "").toLowerCase();
    return STATUS_META[key] || { label: status || "Unknown", tone: "neutral" };
};

const EMPTY_FORM = {
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
    mode: "",
    venue: "",
    city: "",
    state: "",
    coordinator_name: "",
    coordinator_email: "",
    coordinator_phone: "",
    status: "",
};

const STATUS_OPTIONS = ["draft", "published", "upcoming", "ongoing", "completed", "closed", "cancelled"];
const MODE_OPTIONS = ["online", "offline", "hybrid"];

const extractErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (!data) return error?.message || fallback;
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
        const val = data[firstKey];
        const msg = Array.isArray(val) ? val[0] : val;
        return `${firstKey}: ${msg}`;
    }
    return fallback;
};

const toDateTimeLocal = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (value, withTime = true) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const opts = withTime
        ? { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
        : { day: "numeric", month: "short", year: "numeric" };
    return d.toLocaleString("en-IN", opts);
};

// Days remaining until a registration deadline — the one signature detail
// that turns a flat field into something a coordinator can act on at a glance.
const getDeadlineUrgency = (deadline) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    if (Number.isNaN(d.getTime())) return null;
    const diffMs = d.getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: "Closed", tone: "neutral" };
    if (diffDays === 0) return { label: "Closes today", tone: "danger" };
    if (diffDays <= 3) return { label: `${diffDays}d left`, tone: "danger" };
    if (diffDays <= 7) return { label: `${diffDays}d left`, tone: "warning" };
    return { label: `${diffDays}d left`, tone: "success" };
};

const Drives = () => {
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);
    const [listState, setListState] = useState("loading"); // loading | ready | error

    // ---- Search / filter ----
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");

    // ---- View modal state ----
    const [viewOpen, setViewOpen] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewDrive, setViewDrive] = useState(null);

    // ---- Edit modal state ----
    const [editOpen, setEditOpen] = useState(false);
    const [editDriveId, setEditDriveId] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);

    // ---- Delete modal state ----
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteDrive, setDeleteDrive] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        setListState("loading");
        try {
            const response = await api.get("/companies/drives/");
            setDrives(response.data);
            setListState("ready");
        } catch (error) {
            console.error(error);
            setListState("error");
        }
    };

    const fetchDriveDetail = useCallback(async (id) => {
        const response = await api.get(`/companies/drives/${id}/`);
        return response.data;
    }, []);

    // ---------------- Derived: filtered list ----------------

    const companyOptions = useMemo(() => {
        const names = new Set(drives.map((d) => d.company_name).filter(Boolean));
        return Array.from(names).sort();
    }, [drives]);

    const filteredDrives = useMemo(() => {
        const q = search.trim().toLowerCase();
        return drives.filter((d) => {
            const matchesSearch =
                !q ||
                d.title?.toLowerCase().includes(q) ||
                d.company_name?.toLowerCase().includes(q);
            const matchesStatus = !statusFilter || (d.status || "").toLowerCase() === statusFilter;
            const matchesCompany = !companyFilter || d.company_name === companyFilter;
            return matchesSearch && matchesStatus && matchesCompany;
        });
    }, [drives, search, statusFilter, companyFilter]);

    const hasActiveFilters = Boolean(search || statusFilter || companyFilter);

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setCompanyFilter("");
    };

    // ---------------- View flow ----------------

    const openViewModal = async (drive) => {
        setViewOpen(true);
        setViewLoading(true);
        setViewDrive(null);
        try {
            const data = await fetchDriveDetail(drive.id);
            setViewDrive(data);
        } catch (error) {
            console.error(error);
            toast.error(extractErrorMessage(error, "Failed to load drive details."));
            setViewOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setViewOpen(false);
        setViewDrive(null);
    };

    // ---------------- Edit flow ----------------

    const openEditModal = async (drive) => {
        setEditDriveId(drive.id);
        setEditOpen(true);
        setEditLoading(true);
        setNewImageFile(null);
        try {
            const d = await fetchDriveDetail(drive.id);
            setEditForm({
                company: d.company ?? "",
                title: d.title ?? "",
                description: d.description ?? "",
                eligibility: d.eligibility ?? "",
                package: d.package ?? "",
                available_positions: d.available_positions ?? "",
                openings: d.openings ?? "",
                drive_datetime: toDateTimeLocal(d.drive_datetime),
                registration_deadline: toDateTimeLocal(d.registration_deadline),
                registration_link: d.registration_link ?? "",
                mode: d.mode ?? "",
                venue: d.venue ?? "",
                city: d.city ?? "",
                state: d.state ?? "",
                coordinator_name: d.coordinator_name ?? "",
                coordinator_email: d.coordinator_email ?? "",
                coordinator_phone: d.coordinator_phone ?? "",
                status: d.status ?? "",
            });
            setCurrentImageUrl(d.notice_image || null);
        } catch (error) {
            console.error(error);
            toast.error(extractErrorMessage(error, "Failed to load drive details."));
            closeEditModal();
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditModal = () => {
        if (editSaving) return;
        setEditOpen(false);
        setEditDriveId(null);
        setEditForm(EMPTY_FORM);
        setCurrentImageUrl(null);
        setNewImageFile(null);
    };

    const handleEditFieldChange = (field) => (e) => {
        setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        setNewImageFile(file);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (editSaving || !editDriveId) return;

        setEditSaving(true);
        try {
            const formData = new FormData();
            Object.entries(editForm).forEach(([key, value]) => {
                formData.append(key, value ?? "");
            });
            if (newImageFile) {
                formData.append("notice_image", newImageFile);
            }

            const response = await api.put(`/companies/drives/${editDriveId}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Placement drive updated successfully.");
            closeEditModal();

            // Update in place so the list feels instant, then reconcile with the server.
            setDrives((prev) =>
                prev.map((d) => (d.id === editDriveId ? { ...d, ...response.data } : d))
            );
            fetchDrives();
        } catch (error) {
            console.error(error);
            const status = error?.response?.status;
            const fallback =
                status === 400
                    ? "Please check the form for invalid values."
                    : status === 401
                    ? "You are not authorized. Please log in again."
                    : status === 404
                    ? "This drive no longer exists."
                    : "Something went wrong while updating the drive.";
            toast.error(extractErrorMessage(error, fallback));
        } finally {
            setEditSaving(false);
        }
    };

    // ---------------- Delete flow ----------------

    const openDeleteModal = (drive) => {
        setDeleteDrive({ id: drive.id, title: drive.title });
        setDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setDeleteOpen(false);
        setDeleteDrive(null);
    };

    const handleConfirmDelete = async () => {
        if (deleting || !deleteDrive) return;
        setDeleting(true);
        try {
            await api.delete(`/companies/drives/${deleteDrive.id}/`);
            toast.success("Placement drive deleted successfully.");
            setDrives((prev) => prev.filter((d) => d.id !== deleteDrive.id));
            setDeleteOpen(false);
            setDeleteDrive(null);
        } catch (error) {
            console.error(error);
            const status = error?.response?.status;
            const fallback =
                status === 401
                    ? "You are not authorized. Please log in again."
                    : status === 404
                    ? "This drive no longer exists."
                    : "Something went wrong while deleting the drive.";
            toast.error(extractErrorMessage(error, fallback));
        } finally {
            setDeleting(false);
        }
    };

    // ESC closes whichever modal is open (highest layer first)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key !== "Escape") return;
            if (deleteOpen) closeDeleteModal();
            else if (editOpen) closeEditModal();
            else if (viewOpen) closeViewModal();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteOpen, editOpen, viewOpen, deleting, editSaving]);

    return (
        <>
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="dr-root">
                <div className="dr-shell">

                    {/* Header */}
                    <div className="dr-header">
                        <div className="dr-header-blob" />
                        <div className="dr-header-grid" />
                        <div className="dr-header-main">
                            <div>
                                <span className="dr-header-eyebrow">
                                    <CalendarClock /> Placement Drives
                                </span>
                                <h1 className="dr-header-title">Placement Drives</h1>
                                <p className="dr-header-sub">Manage all placement drives efficiently.</p>
                            </div>
                            <button
                                onClick={() => navigate("/placement/drives/create")}
                                className="dr-create-btn"
                            >
                                <Plus />
                                Create Drive
                            </button>
                        </div>
                    </div>

                    {/* Search + Filter bar */}
                    <div className="dr-toolbar">
                        <div className="dr-search">
                            <Search />
                            <input
                                type="text"
                                placeholder="Search by title or company…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Search drives"
                            />
                        </div>

                        <div className="dr-toolbar-filters">
                            <div className="dr-select-wrap">
                                <SlidersHorizontal />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    aria-label="Filter by status"
                                >
                                    <option value="">All statuses</option>
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{getStatusMeta(s).label}</option>
                                    ))}
                                </select>
                            </div>

                            {companyOptions.length > 0 && (
                                <div className="dr-select-wrap">
                                    <Building2 />
                                    <select
                                        value={companyFilter}
                                        onChange={(e) => setCompanyFilter(e.target.value)}
                                        aria-label="Filter by company"
                                    >
                                        <option value="">All companies</option>
                                        {companyOptions.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {hasActiveFilters && (
                                <button className="dr-clear-btn" onClick={clearFilters} type="button">
                                    <XCircle />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content states */}
                    {listState === "loading" && (
                        <div className="dr-list">
                            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {listState === "error" && (
                        <div className="dr-error-card">
                            <div className="dr-error-icon"><AlertTriangle /></div>
                            <h3>Couldn't load placement drives</h3>
                            <p>Something went wrong while fetching the list. Please try again.</p>
                            <button className="dr-btn dr-btn-primary" onClick={fetchDrives}>
                                <RefreshCw />
                                Retry
                            </button>
                        </div>
                    )}

                    {listState === "ready" && filteredDrives.length === 0 && (
                        <div className="dr-empty">
                            <div className="dr-empty-icon"><Inbox /></div>
                            <p className="dr-empty-title">Nothing to display</p>
                            <p className="dr-empty-sub">
                                {hasActiveFilters
                                    ? "No drives match your filters. Try adjusting or clearing them."
                                    : "Drives you create will show up here."}
                            </p>
                            {hasActiveFilters ? (
                                <button className="dr-btn dr-btn-outline" onClick={clearFilters}>
                                    Clear filters
                                </button>
                            ) : (
                                <button
                                    className="dr-btn dr-btn-primary"
                                    onClick={() => navigate("/placement/drives/create")}
                                >
                                    <Plus />
                                    Create Drive
                                </button>
                            )}
                        </div>
                    )}

                    {listState === "ready" && filteredDrives.length > 0 && (
                        <div className="dr-list">
                            {filteredDrives.map((drive, idx) => {
                                const statusMeta = getStatusMeta(drive.status);
                                const urgency = getDeadlineUrgency(drive.registration_deadline);
                                return (
                                    <div
                                        key={drive.id}
                                        className="dr-card"
                                        style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                                    >
                                        <div className="dr-card-top">
                                            <div>
                                                <h2 className="dr-card-title">{drive.title}</h2>
                                                <span className="dr-card-company">
                                                    <Building2 />
                                                    {drive.company_name || "-"}
                                                </span>
                                            </div>
                                            <div className="dr-card-badges">
                                                <span className={`dr-badge dr-badge-${statusMeta.tone}`}>
                                                    {statusMeta.label}
                                                </span>
                                                {urgency && (
                                                    <span className={`dr-chip dr-chip-${urgency.tone}`}>
                                                        {urgency.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="dr-divider" />

                                        <div className="dr-info-grid">
                                            <Info icon={Wallet} label="Package" value={drive.package} />
                                            <Info icon={Users} label="Openings" value={drive.openings} />
                                            <Info icon={Laptop2} label="Mode" value={drive.mode} />
                                            <Info icon={MapPin} label="Venue" value={drive.venue} />
                                            <Info icon={Calendar} label="Drive Date" value={formatDate(drive.drive_datetime)} />
                                            <Info icon={Clock} label="Registration Deadline" value={formatDate(drive.registration_deadline)} />
                                            {drive.created_at && (
                                                <Info icon={History} label="Created" value={formatDate(drive.created_at, false)} />
                                            )}
                                        </div>

                                        <div className="dr-actions">
                                            <button
                                                onClick={() => openViewModal(drive)}
                                                className="dr-btn dr-btn-primary"
                                            >
                                                <Eye />
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => openEditModal(drive)}
                                                className="dr-btn dr-btn-outline"
                                            >
                                                <Pencil />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => openDeleteModal(drive)}
                                                className="dr-btn dr-btn-danger-outline"
                                            >
                                                <Trash2 />
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

            {viewOpen && (
                <ViewDetailsModal
                    loading={viewLoading}
                    drive={viewDrive}
                    onClose={closeViewModal}
                />
            )}

            {editOpen && (
                <EditDriveModal
                    loading={editLoading}
                    saving={editSaving}
                    form={editForm}
                    currentImageUrl={currentImageUrl}
                    newImageFile={newImageFile}
                    onFieldChange={handleEditFieldChange}
                    onImageChange={handleImageChange}
                    onSubmit={handleEditSubmit}
                    onClose={closeEditModal}
                />
            )}

            {deleteOpen && (
                <DeleteConfirmModal
                    driveTitle={deleteDrive?.title}
                    deleting={deleting}
                    onCancel={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                />
            )}

            <Toaster position="top-right" richColors closeButton />
        </>
    );
};

const Info = ({ icon: Icon, label, value }) => (
    <div className="dr-info-item">
        <span className="dr-info-label">
            <Icon />
            {label}
        </span>
        <p className="dr-info-value">{value || "-"}</p>
    </div>
);

// ---------------- Skeleton ----------------

const SkeletonCard = () => (
    <div className="dr-card dr-skeleton-card" aria-hidden="true">
        <div className="dr-skel dr-skel-title" />
        <div className="dr-skel dr-skel-sub" />
        <div className="dr-divider" />
        <div className="dr-skeleton-grid">
            {[1, 2, 3, 4].map((i) => <div key={i} className="dr-skel dr-skel-line" />)}
        </div>
        <div className="dr-skeleton-actions">
            <div className="dr-skel dr-skel-btn" />
            <div className="dr-skel dr-skel-btn" />
            <div className="dr-skel dr-skel-btn" />
        </div>
    </div>
);

// ---------------- View Details Modal ----------------

const ViewDetailsModal = ({ loading, drive, onClose }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const statusMeta = drive ? getStatusMeta(drive.status) : null;

    return (
        <div className="dr-modal-overlay" onMouseDown={handleOverlayClick}>
            <div className="dr-modal dr-modal-lg" role="dialog" aria-modal="true" aria-labelledby="dr-view-title">
                <div className="dr-modal-header">
                    <h2 id="dr-view-title" className="dr-modal-title">Drive Details</h2>
                    <button type="button" className="dr-modal-close" onClick={onClose} aria-label="Close">
                        <X />
                    </button>
                </div>

                {loading || !drive ? (
                    <div className="dr-modal-loading">
                        <Loader2 className="dr-spin" />
                        <span>Loading drive details…</span>
                    </div>
                ) : (
                    <div className="dr-modal-body dr-view-body">
                        <ViewSection icon={FileText} title="Basic Information">
                            <ViewRow label="Title" value={drive.title} />
                            <ViewRow label="Status">
                                <span className={`dr-badge dr-badge-${statusMeta.tone}`}>{statusMeta.label}</span>
                            </ViewRow>
                        </ViewSection>

                        <ViewSection icon={Building2} title="Company Information">
                            <ViewRow label="Company" value={drive.company_name || drive.company} />
                        </ViewSection>

                        <ViewSection icon={Wallet} title="Package Information">
                            <ViewRow label="Package" value={drive.package} />
                            <ViewRow label="Available Positions" value={drive.available_positions} />
                            <ViewRow label="Openings" value={drive.openings} />
                        </ViewSection>

                        <ViewSection icon={Calendar} title="Schedule">
                            <ViewRow label="Drive Date & Time" value={formatDate(drive.drive_datetime)} />
                            <ViewRow label="Registration Deadline" value={formatDate(drive.registration_deadline)} />
                            <ViewRow label="Registration Link" value={drive.registration_link} link />
                        </ViewSection>

                        <ViewSection icon={MapPin} title="Venue">
                            <ViewRow label="Mode" value={drive.mode} />
                            <ViewRow label="Venue" value={drive.venue} />
                            <ViewRow label="City" value={drive.city} />
                            <ViewRow label="State" value={drive.state} />
                        </ViewSection>

                        <ViewSection icon={ClipboardList} title="Description">
                            <p className="dr-view-paragraph">{drive.description || "-"}</p>
                        </ViewSection>

                        <ViewSection icon={FileText} title="Requirements">
                            <p className="dr-view-paragraph">{drive.eligibility || "-"}</p>
                        </ViewSection>

                        <ViewSection icon={User} title="Coordinator">
                            <ViewRow label="Name" value={drive.coordinator_name} />
                            <ViewRow label="Email" value={drive.coordinator_email} />
                            <ViewRow label="Phone" value={drive.coordinator_phone} />
                        </ViewSection>

                        <ViewSection icon={History} title="Timeline">
                            <ViewRow label="Created Date" value={formatDate(drive.created_at)} />
                            <ViewRow label="Updated Date" value={formatDate(drive.updated_at)} />
                        </ViewSection>

                        {drive.notice_image && (
                            <ViewSection icon={FileText} title="Notice">
                                <img src={drive.notice_image} alt="Notice" className="dr-current-image" />
                            </ViewSection>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ViewSection = ({ icon: Icon, title, children }) => (
    <div className="dr-view-section">
        <span className="dr-view-section-label">
            <Icon />
            {title}
        </span>
        <div className="dr-view-section-body">{children}</div>
    </div>
);

const ViewRow = ({ label, value, children, link }) => (
    <div className="dr-view-row">
        <span className="dr-view-row-label">{label}</span>
        {children ? (
            children
        ) : link && value ? (
            <a href={value} target="_blank" rel="noreferrer" className="dr-view-link">
                <Link2 />
                {value}
            </a>
        ) : (
            <span className="dr-view-row-value">{value || "-"}</span>
        )}
    </div>
);

// ---------------- Edit Drive Modal ----------------

const EditDriveModal = ({
    loading,
    saving,
    form,
    currentImageUrl,
    newImageFile,
    onFieldChange,
    onImageChange,
    onSubmit,
    onClose,
}) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="dr-modal-overlay" onMouseDown={handleOverlayClick}>
            <div className="dr-modal dr-modal-lg" role="dialog" aria-modal="true" aria-labelledby="dr-edit-title">
                <div className="dr-modal-header">
                    <h2 id="dr-edit-title" className="dr-modal-title">Edit Placement Drive</h2>
                    <button
                        type="button"
                        className="dr-modal-close"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                    >
                        <X />
                    </button>
                </div>

                {loading ? (
                    <div className="dr-modal-loading">
                        <Loader2 className="dr-spin" />
                        <span>Loading drive details…</span>
                    </div>
                ) : (
                    <form onSubmit={onSubmit}>
                        <div className="dr-modal-body">
                            <div className="dr-form-grid">
                                <Field label="Company">
                                    <input value={form.company} onChange={onFieldChange("company")} disabled={saving} required />
                                </Field>
                                <Field label="Title">
                                    <input value={form.title} onChange={onFieldChange("title")} disabled={saving} required />
                                </Field>
                                <Field label="Description" full>
                                    <textarea rows={3} value={form.description} onChange={onFieldChange("description")} disabled={saving} />
                                </Field>
                                <Field label="Eligibility" full>
                                    <textarea rows={2} value={form.eligibility} onChange={onFieldChange("eligibility")} disabled={saving} />
                                </Field>
                                <Field label="Package">
                                    <input value={form.package} onChange={onFieldChange("package")} disabled={saving} />
                                </Field>
                                <Field label="Available Positions">
                                    <input type="number" min="0" value={form.available_positions} onChange={onFieldChange("available_positions")} disabled={saving} />
                                </Field>
                                <Field label="Openings">
                                    <input type="number" min="0" value={form.openings} onChange={onFieldChange("openings")} disabled={saving} />
                                </Field>
                                <Field label="Drive Date & Time">
                                    <input type="datetime-local" value={form.drive_datetime} onChange={onFieldChange("drive_datetime")} disabled={saving} />
                                </Field>
                                <Field label="Registration Deadline">
                                    <input type="datetime-local" value={form.registration_deadline} onChange={onFieldChange("registration_deadline")} disabled={saving} />
                                </Field>
                                <Field label="Registration Link" full>
                                    <input type="url" value={form.registration_link} onChange={onFieldChange("registration_link")} disabled={saving} />
                                </Field>
                                <Field label="Mode">
                                    <select value={form.mode} onChange={onFieldChange("mode")} disabled={saving}>
                                        <option value="">Select mode</option>
                                        {MODE_OPTIONS.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Status">
                                    <select value={form.status} onChange={onFieldChange("status")} disabled={saving}>
                                        <option value="">Select status</option>
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{getStatusMeta(s).label}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Venue">
                                    <input value={form.venue} onChange={onFieldChange("venue")} disabled={saving} />
                                </Field>
                                <Field label="City">
                                    <input value={form.city} onChange={onFieldChange("city")} disabled={saving} />
                                </Field>
                                <Field label="State">
                                    <input value={form.state} onChange={onFieldChange("state")} disabled={saving} />
                                </Field>
                                <Field label="Coordinator Name">
                                    <input value={form.coordinator_name} onChange={onFieldChange("coordinator_name")} disabled={saving} />
                                </Field>
                                <Field label="Coordinator Email">
                                    <input type="email" value={form.coordinator_email} onChange={onFieldChange("coordinator_email")} disabled={saving} />
                                </Field>
                                <Field label="Coordinator Phone">
                                    <input value={form.coordinator_phone} onChange={onFieldChange("coordinator_phone")} disabled={saving} />
                                </Field>
                                <Field label="Notice Image" full>
                                    {currentImageUrl && !newImageFile && (
                                        <img src={currentImageUrl} alt="Current notice" className="dr-current-image" />
                                    )}
                                    <input type="file" accept="image/*" onChange={onImageChange} disabled={saving} />
                                </Field>
                            </div>
                        </div>

                        <div className="dr-modal-footer">
                            <button type="button" className="dr-btn dr-btn-secondary-outline" onClick={onClose} disabled={saving}>
                                Cancel
                            </button>
                            <button type="submit" className="dr-btn dr-btn-primary" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="dr-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const Field = ({ label, children, full }) => (
    <label className={`dr-field ${full ? "dr-field-full" : ""}`}>
        <span className="dr-field-label">{label}</span>
        {children}
    </label>
);

// ---------------- Delete Confirmation Modal ----------------

const DeleteConfirmModal = ({ driveTitle, deleting, onCancel, onConfirm }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onCancel();
    };

    return (
        <div className="dr-modal-overlay" onMouseDown={handleOverlayClick}>
            <div
                className="dr-modal dr-modal-sm dr-modal-center"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="dr-delete-title"
            >
                <div className="dr-delete-icon">
                    <AlertTriangle />
                </div>
                <h2 id="dr-delete-title" className="dr-delete-title">Delete Placement Drive</h2>
                <p className="dr-delete-message">
                    Are you sure you want to delete{" "}
                    <strong>{driveTitle || "this drive"}</strong>?
                    <br />
                    This action cannot be undone.
                </p>

                <div className="dr-delete-actions">
                    <button
                        type="button"
                        className="dr-btn dr-btn-secondary-outline"
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="dr-btn dr-btn-danger"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="dr-spin" />
                                Deleting…
                            </>
                        ) : (
                            "Delete Drive"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Drives;