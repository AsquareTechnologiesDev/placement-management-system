import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Building2,
    FileText,
    ClipboardCheck,
    Wallet,
    Users,
    Briefcase,
    CalendarClock,
    Clock,
    Globe2,
    MapPin,
    Landmark,
    UserCog,
    Mail,
    Phone,
    ExternalLink,
    Lock,
    Loader2,
    SearchX,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./StudentDriveDetail.css";

const StudentDriveDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [drive, setDrive] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [driveRes, profileRes] = await Promise.all([
                api.get(`/companies/drives/${id}/`),
                api.get("/student/profile/"),
            ]);

            console.log("Drive:", driveRes.data);
            console.log("Profile:", profileRes.data);

            setDrive(driveRes.data);
            setProfile(profileRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="dd-root">
                    <div className="dd-state-card">
                        <Loader2 className="dd-spin" />
                        <p>Loading drive details...</p>
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    if (!drive) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="dd-root">
                    <div className="dd-state-card">
                        <SearchX />
                        <p>Drive not found.</p>
                    </div>
                </div>
                <AppFooter version="v1.0.0" />
            </>
        );
    }

    // Accept APPROVED / Approved / approved
    const status = profile?.status || "";
    const isApproved = status.toUpperCase() === "APPROVED";

    return (
        <>
        {/* Site-wide branded header (logo, company name, subtitle, logout) */}
        <AppHeader onLogoClick={() => navigate("/student/dashboard")} />

        <div className="dd-root">
            <div className="dd-card">

                {/* Header */}

                <div className="dd-header">
                    <div className="dd-header-blob" />
                    <div className="dd-header-grid" />
                    <span className="dd-header-eyebrow">
                        <Building2 /> {drive.company_name || "Placement Drive"}
                    </span>
                    <h1 className="dd-header-title">{drive.title}</h1>
                    {drive.status && (
                        <span className="dd-status-badge">{drive.status}</span>
                    )}
                </div>

                {/* Notice image */}

                {drive.notice_image && (
                    <div className="dd-notice-wrap">
                        <img
                            src={drive.notice_image}
                            alt="Notice"
                            className="dd-notice-img"
                        />
                    </div>
                )}

                <div className="dd-body">

                    {/* Overview */}

                    <Section title="Overview">
                        <TextBlock icon={FileText} label="Description" value={drive.description} />
                        <TextBlock icon={ClipboardCheck} label="Eligibility" value={drive.eligibility} />
                    </Section>

                    {/* Package & Positions */}

                    <Section title="Package & Openings">
                        <div className="dd-info-grid">
                            <InfoItem icon={Wallet} label="Package" value={drive.package} />
                            <InfoItem icon={Users} label="Available Positions" value={drive.available_positions} />
                            <InfoItem icon={Briefcase} label="Openings" value={drive.openings} />
                        </div>
                    </Section>

                    {/* Schedule */}

                    <Section title="Schedule">
                        <div className="dd-info-grid">
                            <InfoItem
                                icon={CalendarClock}
                                label="Drive Date & Time"
                                value={drive.drive_datetime ? new Date(drive.drive_datetime).toLocaleString() : "-"}
                            />
                            <InfoItem
                                icon={Clock}
                                label="Registration Deadline"
                                value={
                                    drive.registration_deadline
                                        ? new Date(drive.registration_deadline).toLocaleString()
                                        : "-"
                                }
                            />
                        </div>
                    </Section>

                    {/* Location */}

                    <Section title="Location & Mode">
                        <div className="dd-info-grid">
                            <InfoItem icon={Globe2} label="Mode" value={drive.mode} />
                            <InfoItem icon={MapPin} label="Venue" value={drive.venue} />
                            <InfoItem icon={Landmark} label="City" value={drive.city} />
                            <InfoItem icon={Landmark} label="State" value={drive.state} />
                        </div>
                    </Section>

                    {/* Coordinator */}

                    <Section title="Coordinator">
                        <div className="dd-info-grid">
                            <InfoItem icon={UserCog} label="Coordinator" value={drive.coordinator_name} />
                            <InfoItem icon={Mail} label="Email" value={drive.coordinator_email} />
                            <InfoItem icon={Phone} label="Phone" value={drive.coordinator_phone} />
                        </div>
                    </Section>

                    {/* CTA */}

                    <div className="dd-cta">
                        {isApproved ? (
                            <a
                                href={drive.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dd-register-btn"
                            >
                                <ExternalLink /> Register for Drive
                            </a>
                        ) : (
                            <div className="dd-pending-notice">
                                <Lock />
                                Registration link is available only after your profile
                                is approved by the trainer.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

const Section = ({ title, children }) => (
    <div className="dd-section">
        <h2 className="dd-section-title">{title}</h2>
        {children}
    </div>
);

const TextBlock = ({ icon: Icon, label, value }) => (
    <div className="dd-text-block">
        <h3 className="dd-text-block-label"><Icon /> {label}</h3>
        <p className="dd-text-block-value">{value || "-"}</p>
    </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="dd-info-item">
        <div className="dd-info-icon">
            <Icon />
        </div>
        <div>
            <span className="dd-info-label">{label}</span>
            <p className="dd-info-value">{value || "-"}</p>
        </div>
    </div>
);

export default StudentDriveDetail;