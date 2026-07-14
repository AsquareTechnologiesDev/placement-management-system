import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    Inbox,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./Drives.css";

const STATUS_STYLES = {
    upcoming: "dr-badge-blue",
    ongoing: "dr-badge-green",
    open: "dr-badge-green",
    active: "dr-badge-green",
    completed: "dr-badge-slate",
    closed: "dr-badge-slate",
    cancelled: "dr-badge-red",
};

const getStatusClass = (status) => {
    const key = (status || "").toLowerCase();
    return STATUS_STYLES[key] || "dr-badge-blue";
};

const Drives = () => {
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await api.get("/companies/drives/");
            setDrives(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {/* Site-wide branded header (logo, company name, logout) */}
            <AppHeader onLogoClick={() => navigate("/placement/dashboard")} />

            <div className="dr-root">

            {/* Header */}

            <div className="dr-header">
                <div className="dr-header-blob" />
                <div className="dr-header-grid" />
                <span className="dr-header-eyebrow">
                    <CalendarClock /> Placement Drives
                </span>
                <h1 className="dr-header-title">Placement Drives</h1>
                <p className="dr-header-sub">
                    Manage all placement drives.
                </p>
            </div>

            {/* Add Drive */}

            <button
                onClick={() => navigate("/placement/drives/create")}
                className="dr-create-btn"
            >
                <Plus />
                Create New Drive
            </button>

            {drives.length === 0 ? (
                <div className="dr-empty">
                    <div className="dr-empty-icon"><Inbox /></div>
                    <p className="dr-empty-title">No drives available</p>
                    <p className="dr-empty-sub">Drives you create will show up here.</p>
                </div>
            ) : (
                <div className="dr-list">
                    {drives.map((drive) => (
                        <div key={drive.id} className="dr-card">
                            <div className="dr-card-top">
                                <h2 className="dr-card-title">{drive.title}</h2>
                                <span className={`dr-badge ${getStatusClass(drive.status)}`}>
                                    {drive.status || "Unknown"}
                                </span>
                            </div>

                            <div className="dr-divider" />

                            <div className="dr-info-grid">
                                <Info icon={Building2} label="Company" value={drive.company_name} />
                                <Info icon={Wallet} label="Package" value={drive.package} />
                                <Info icon={Users} label="Available Positions" value={drive.available_positions} />
                                <Info icon={Layers} label="Openings" value={drive.openings} />
                                <Info icon={Calendar} label="Drive Date" value={drive.drive_datetime} />
                                <Info icon={Clock} label="Registration Deadline" value={drive.registration_deadline} />
                                <Info icon={Laptop2} label="Mode" value={drive.mode} />
                                <Info icon={MapPin} label="Venue" value={drive.venue} />
                            </div>

                            <div className="dr-actions">
                                <button
                                    onClick={() => navigate(`/placement/drives/${drive.id}`)}
                                    className="dr-btn dr-btn-primary"
                                >
                                    <Eye />
                                    View Details
                                </button>

                                <button
                                    onClick={() => navigate(`/placement/drives/edit/${drive.id}`)}
                                    className="dr-btn dr-btn-outline"
                                >
                                    <Pencil />
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>

            <AppFooter version="v1.0.0" />
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

export default Drives;