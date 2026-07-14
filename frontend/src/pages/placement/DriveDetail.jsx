import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    Building2,
    Wallet,
    Users,
    Layers,
    Calendar,
    Clock,
    Link2,
    Laptop2,
    MapPin,
    Map,
    User,
    Mail,
    Phone,
    FileText,
    ClipboardCheck,
    ImageOff,
    AlertCircle,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./DriveDetail.css";

const STATUS_STYLES = {
    upcoming: "dd-badge-blue",
    ongoing: "dd-badge-green",
    open: "dd-badge-green",
    active: "dd-badge-green",
    completed: "dd-badge-slate",
    closed: "dd-badge-slate",
    cancelled: "dd-badge-red",
};

const getStatusClass = (status) => {
    const key = (status || "").toLowerCase();
    return STATUS_STYLES[key] || "dd-badge-blue";
};

const DriveDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [drive, setDrive] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchDrive();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchDrive = async () => {
        setIsLoading(true);
        setError(false);

        try {
            const response = await api.get(`/companies/drives/${id}/`);
            setDrive(response.data);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Site-wide branded header (logo, company name, logout) */}
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="dd-root">

                <button
                    onClick={() => navigate("/placement/drives")}
                    className="dd-back-btn"
                >
                    <ArrowLeft />
                    Back to Drives
                </button>

                {isLoading ? (
                    <div className="dd-header dd-header-loading">
                        <div className="dd-header-blob" />
                        <div className="dd-header-grid" />
                        <div className="dd-skeleton" style={{ width: 140, height: 24, marginBottom: 16 }} />
                        <div className="dd-skeleton" style={{ width: "60%", height: 36, marginBottom: 12 }} />
                        <div className="dd-skeleton" style={{ width: "40%", height: 18 }} />
                    </div>
                ) : error || !drive ? (
                    <div className="dd-empty">
                        <div className="dd-empty-icon"><AlertCircle /></div>
                        <p className="dd-empty-title">Drive not found</p>
                        <p className="dd-empty-sub">
                            This placement drive may have been removed, or the link is incorrect.
                        </p>
                        <button
                            onClick={() => navigate("/placement/drives")}
                            className="dd-empty-btn"
                        >
                            Go back to Drives
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}

                        <div className="dd-header">
                            <div className="dd-header-blob" />
                            <div className="dd-header-grid" />

                            <div className="dd-header-top">
                                <span className={`dd-badge ${getStatusClass(drive.status)}`}>
                                    {drive.status || "Unknown"}
                                </span>

                                <button
                                    onClick={() => navigate(`/placement/drives/edit/${drive.id}`)}
                                    className="dd-edit-btn"
                                >
                                    <Pencil />
                                    Edit Drive
                                </button>
                            </div>

                            <h1 className="dd-header-title">{drive.title}</h1>

                            <p className="dd-header-sub">
                                <Building2 />
                                {drive.company_name || "Company not specified"}
                            </p>
                        </div>

                        {/* Overview stats */}

                        <div className="dd-stats">
                            <Stat icon={Wallet} label="Package" value={drive.package} />
                            <Stat icon={Layers} label="Available Positions" value={drive.available_positions} />
                            <Stat icon={Users} label="Openings" value={drive.openings} />
                            <Stat icon={Laptop2} label="Mode" value={drive.mode} />
                        </div>

                        {/* Description & Eligibility */}

                        {(drive.description || drive.eligibility) && (
                            <div className="dd-panel">
                                <div className="dd-panel-head">
                                    <h2 className="dd-panel-title">
                                        <FileText /> Overview
                                    </h2>
                                </div>

                                <div className="dd-text-grid">
                                    {drive.description && (
                                        <div className="dd-text-block">
                                            <span className="dd-text-label">Description</span>
                                            <p className="dd-text-value">{drive.description}</p>
                                        </div>
                                    )}

                                    {drive.eligibility && (
                                        <div className="dd-text-block">
                                            <span className="dd-text-label">
                                                <ClipboardCheck /> Eligibility
                                            </span>
                                            <p className="dd-text-value">{drive.eligibility}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Schedule */}

                        <div className="dd-panel">
                            <div className="dd-panel-head">
                                <h2 className="dd-panel-title">
                                    <Calendar /> Schedule
                                </h2>
                            </div>

                            <div className="dd-info-grid">
                                <Info icon={Calendar} label="Drive Date & Time" value={drive.drive_datetime} />
                                <Info icon={Clock} label="Registration Deadline" value={drive.registration_deadline} />
                                <Info
                                    icon={Link2}
                                    label="Registration Link"
                                    value={
                                        drive.registration_link ? (
                                            <a
                                                href={drive.registration_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="dd-link"
                                            >
                                                {drive.registration_link}
                                            </a>
                                        ) : null
                                    }
                                />
                            </div>
                        </div>

                        {/* Venue */}

                        <div className="dd-panel">
                            <div className="dd-panel-head">
                                <h2 className="dd-panel-title">
                                    <MapPin /> Venue
                                </h2>
                            </div>

                            <div className="dd-info-grid">
                                <Info icon={Laptop2} label="Mode" value={drive.mode} />
                                <Info icon={MapPin} label="Venue" value={drive.venue} />
                                <Info icon={Map} label="City" value={drive.city} />
                                <Info icon={Map} label="State" value={drive.state} />
                            </div>
                        </div>

                        {/* Coordinator */}

                        <div className="dd-panel">
                            <div className="dd-panel-head">
                                <h2 className="dd-panel-title">
                                    <User /> Coordinator
                                </h2>
                            </div>

                            <div className="dd-info-grid">
                                <Info icon={User} label="Name" value={drive.coordinator_name} />
                                <Info
                                    icon={Mail}
                                    label="Email"
                                    value={
                                        drive.coordinator_email ? (
                                            <a href={`mailto:${drive.coordinator_email}`} className="dd-link">
                                                {drive.coordinator_email}
                                            </a>
                                        ) : null
                                    }
                                />
                                <Info
                                    icon={Phone}
                                    label="Phone"
                                    value={
                                        drive.coordinator_phone ? (
                                            <a href={`tel:${drive.coordinator_phone}`} className="dd-link">
                                                {drive.coordinator_phone}
                                            </a>
                                        ) : null
                                    }
                                />
                            </div>
                        </div>

                        {/* Notice */}

                        <div className="dd-panel">
                            <div className="dd-panel-head">
                                <h2 className="dd-panel-title">Notice</h2>
                            </div>

                            {drive.notice_image ? (
                                <a
                                    href={drive.notice_image}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="dd-notice-preview"
                                >
                                    <img src={drive.notice_image} alt="Drive notice" />
                                </a>
                            ) : (
                                <div className="dd-empty dd-empty-inline">
                                    <div className="dd-empty-icon"><ImageOff /></div>
                                    <p className="dd-empty-title">No notice uploaded</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <AppFooter version="v1.0.0" />
        </>
    );
};

const Stat = ({ icon: Icon, label, value }) => (
    <div className="dd-stat-card">
        <div className="dd-stat-icon"><Icon /></div>
        <div>
            <p className="dd-stat-label">{label}</p>
            <h3 className="dd-stat-value">{value || "-"}</h3>
        </div>
    </div>
);

const Info = ({ icon: Icon, label, value }) => (
    <div className="dd-info-item">
        <span className="dd-info-label">
            <Icon />
            {label}
        </span>
        <p className="dd-info-value">{value || "-"}</p>
    </div>
);

export default DriveDetails;