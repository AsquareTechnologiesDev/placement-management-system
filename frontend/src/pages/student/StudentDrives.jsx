import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Rocket,
    Search,
    Building2,
    Wallet,
    Users,
    Briefcase,
    CalendarClock,
    Clock,
    MapPin,
    Globe2,
    ArrowRight,
    Inbox,
    Loader2,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./StudentDrives.css";

const StudentDrives = () => {
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("ALL");

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await api.get(
                "/companies/student/drives/"
            );

            setDrives(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const availableModes = useMemo(() => {
        return [...new Set(drives.map((d) => d.mode).filter(Boolean))];
    }, [drives]);

    const filteredDrives = useMemo(() => {
        return drives.filter((drive) => {
            const matchesMode = modeFilter === "ALL" || drive.mode === modeFilter;
            if (!matchesMode) return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            return [drive.title, drive.company_name, drive.venue]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q));
        });
    }, [drives, searchQuery, modeFilter]);

    if (loading) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="drv-root">
                    <div className="drv-state-card">
                        <Loader2 className="drv-spin" />
                        <p>Loading placement drives...</p>
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/student/dashboard")} />

        <div className="drv-root">

            {/* Header */}

            <div className="drv-header">
                <div className="drv-header-blob" />
                <div className="drv-header-grid" />
                <span className="drv-header-eyebrow">
                    <Rocket /> Placement Drives
                </span>
                <h1 className="drv-header-title">Placement Drives</h1>
                <p className="drv-header-sub">
                    Browse all active placement drives.
                </p>
            </div>

            {/* Toolbar */}

            {drives.length > 0 && (
                <div className="drv-toolbar">
                    <div className="drv-search-wrap">
                        <Search className="drv-search-icon" />
                        <input
                            type="text"
                            className="drv-search-input"
                            placeholder="Search by title, company, or venue..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {availableModes.length > 0 && (
                        <div className="drv-filter-group">
                            <button
                                className={`drv-filter-btn${modeFilter === "ALL" ? " drv-filter-btn-active" : ""}`}
                                onClick={() => setModeFilter("ALL")}
                            >
                                All
                            </button>
                            {availableModes.map((mode) => (
                                <button
                                    key={mode}
                                    className={`drv-filter-btn${modeFilter === mode ? " drv-filter-btn-active" : ""}`}
                                    onClick={() => setModeFilter(mode)}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Drives */}

            {drives.length === 0 ? (
                <div className="drv-empty-card">
                    <Inbox />
                    <h3>No Active Drives</h3>
                </div>
            ) : filteredDrives.length === 0 ? (
                <div className="drv-empty-card">
                    <Inbox />
                    <h3>No drives match your search or filter.</h3>
                </div>
            ) : (
                filteredDrives.map((drive) => (
                    <div key={drive.id} className="drv-card">
                        <div className="drv-card-head">
                            <h2 className="drv-card-title">{drive.title}</h2>
                            {drive.mode && (
                                <span className="drv-mode-badge">
                                    <Globe2 /> {drive.mode}
                                </span>
                            )}
                        </div>

                        <div className="drv-info-grid">
                            <InfoItem icon={Building2} label="Company" value={drive.company_name} />
                            <InfoItem icon={Wallet} label="Package" value={drive.package} />
                            <InfoItem icon={Users} label="Positions" value={drive.available_positions} />
                            <InfoItem icon={Briefcase} label="Openings" value={drive.openings} />
                            <InfoItem
                                icon={CalendarClock}
                                label="Drive Date"
                                value={new Date(drive.drive_datetime).toLocaleString()}
                            />
                            <InfoItem
                                icon={Clock}
                                label="Registration Deadline"
                                value={new Date(drive.registration_deadline).toLocaleString()}
                            />
                            <InfoItem icon={Globe2} label="Mode" value={drive.mode} />
                            <InfoItem icon={MapPin} label="Venue" value={drive.venue} />
                        </div>

                        <div className="drv-card-footer">
                            <button
                                onClick={() => navigate(`/student/drives/${drive.id}`)}
                                className="drv-view-btn"
                            >
                                View Details <ArrowRight />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="drv-info-item">
        <div className="drv-info-icon">
            <Icon />
        </div>
        <div>
            <span className="drv-info-label">{label}</span>
            <p className="drv-info-value">{value || "-"}</p>
        </div>
    </div>
);

export default StudentDrives;