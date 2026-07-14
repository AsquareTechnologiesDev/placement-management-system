import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    IdCard,
    Phone,
    GraduationCap,
    CalendarDays,
    UserCog,
    MapPin,
    Sparkles,
    FileText,
    FileX,
    Loader2,
} from "lucide-react";
import api from "../../api/axios";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./ViewProfile.css";

const MEDIA_URL = (
    import.meta.env.VITE_API_URL || ""
).replace("/api", "");

const ViewProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    // const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
    try {
        const { data } = await api.get("/student/profile/");

        console.log("PROFILE:", data);

        setProfile(data);
    } catch (error) {
        console.error("Profile Error:", error);
    }
};
    if (!profile) {
        return (
            <>
                <AppHeader onLogoClick={() => navigate("/student/dashboard")} />
                <div className="vp-root">
                    <div className="vp-state-card">
                        <Loader2 className="vp-spin" />
                        <p>Loading profile...</p>
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

        <div className="vp-root">

            {/* Header */}

            <div className="vp-header">
                <div className="vp-header-blob" />
                <div className="vp-header-grid" />
                <span className="vp-header-eyebrow">
                    <IdCard /> Placement Profile
                </span>
                <h1 className="vp-header-title">My Profile</h1>
                <p className="vp-header-sub">
                    View your placement profile details.
                </p>
            </div>

            {/* Profile Card */}

            <div className="vp-card">

                <div className="vp-identity">
                    <div className="vp-avatar">
                        {profile.student_name?.charAt(0)?.toUpperCase()}
                    </div>

                    <h2 className="vp-name">{profile.student_name}</h2>

                    <span className="vp-status-chip">{profile.status}</span>
                </div>

                <div className="vp-info-grid">
                    <ProfileItem icon={Phone} label="Phone" value={profile.phone} />
                    <ProfileItem icon={GraduationCap} label="Qualification" value={profile.qualification} />
                    <ProfileItem icon={CalendarDays} label="Passout Year" value={profile.passout_year} />
                    <ProfileItem icon={UserCog} label="Trainer" value={profile.trainer} />
                </div>

                <div className="vp-section">
                    <h3 className="vp-section-title"><MapPin /> Address</h3>
                    <div className="vp-section-body">
                        {profile.address || "-"}
                    </div>
                </div>

                <div className="vp-section">
                    <h3 className="vp-section-title"><Sparkles /> Skills</h3>
                    <div className="vp-section-body">
                        {profile.skills || "-"}
                    </div>
                </div>

                <div className="vp-section">
                    <h3 className="vp-section-title"><FileText /> Resume</h3>

                    {profile.resume ? (
                        <a
                            href={`${MEDIA_URL}${profile.resume}`}
                            target="_blank"
                            rel="noreferrer"
                            className="vp-resume-btn"
                        >
                            <FileText /> View Resume
                        </a>
                    ) : (
                        <p className="vp-no-resume">
                            <FileX /> No Resume Uploaded
                        </p>
                    )}
                </div>
            </div>
        </div>

        <AppFooter version="v1.0.0" />
        </>
    );
};

const ProfileItem = ({ icon: Icon, label, value }) => (
    <div className="vp-info-item">
        <div className="vp-info-icon">
            <Icon />
        </div>
        <div>
            <h4 className="vp-info-label">{label}</h4>
            <p className="vp-info-value">{value || "-"}</p>
        </div>
    </div>
);

export default ViewProfile;