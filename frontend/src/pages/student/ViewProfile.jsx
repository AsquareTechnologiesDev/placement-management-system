import { useEffect, useState } from "react";
import api from "../../api/axios";

const MEDIA_URL = (
    import.meta.env.VITE_API_URL || ""
).replace("/api", "");

const ViewProfile = () => {
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
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                }}
            >
                Loading Profile...
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8f9fc",
                padding: "30px",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            {/* Header */}

            <div
                style={{
                    background: "#ED1464",
                    color: "#fff",
                    padding: "25px",
                    borderRadius: "15px",
                    marginBottom: "25px",
                }}
            >
                <h1 style={{ margin: 0 }}>
                    My Profile
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                    }}
                >
                    View your placement profile details.
                </p>
            </div>

            {/* Profile Card */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "30px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                    }}
                >
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            background: "#ED1464",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "36px",
                            fontWeight: "bold",
                            margin: "0 auto",
                        }}
                    >
                        {profile.student_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <h2
                        style={{
                            marginTop: "15px",
                            color: "#333",
                        }}
                    >
                        {profile.student_name}
                    </h2>

                    <span
                        style={{
                            background: "#ffe3ef",
                            color: "#ED1464",
                            padding: "8px 15px",
                            borderRadius: "20px",
                            fontWeight: "600",
                        }}
                    >
                        {profile.status}
                    </span>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(300px,1fr))",
                        gap: "20px",
                    }}
                >
                    <ProfileItem
                        label="Phone"
                        value={profile.phone}
                    />

                    <ProfileItem
                        label="Qualification"
                        value={
                            profile.qualification
                        }
                    />

                    <ProfileItem
                        label="Passout Year"
                        value={
                            profile.passout_year
                        }
                    />

                    <ProfileItem
                        label="Trainer"
                        value={
                            profile.trainer
                        }
                    />
                </div>

                <div
                    style={{
                        marginTop: "25px",
                    }}
                >
                    <h3
                        style={{
                            color: "#ED1464",
                            marginBottom: "10px",
                        }}
                    >
                        Address
                    </h3>

                    <div
                        style={{
                            background:
                                "#f8f9fc",
                            padding: "15px",
                            borderRadius:
                                "10px",
                        }}
                    >
                        {profile.address}
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "25px",
                    }}
                >
                    <h3
                        style={{
                            color: "#ED1464",
                            marginBottom: "10px",
                        }}
                    >
                        Skills
                    </h3>

                    <div
                        style={{
                            background:
                                "#f8f9fc",
                            padding: "15px",
                            borderRadius:
                                "10px",
                        }}
                    >
                        {profile.skills}
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "25px",
                    }}
                >
                    <h3
                        style={{
                            color: "#ED1464",
                            marginBottom: "10px",
                        }}
                    >
                        Resume
                    </h3>

                    {profile.resume ? (
                        <a
                            href={`${MEDIA_URL}${profile.resume}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display:
                                    "inline-block",
                                background:
                                    "#ED1464",
                                color: "#fff",
                                textDecoration:
                                    "none",
                                padding:
                                    "12px 20px",
                                borderRadius:
                                    "8px",
                                fontWeight:
                                    "600",
                            }}
                        >
                            View Resume
                        </a>
                    ) : (
                        <p>
                            No Resume Uploaded
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({
    label,
    value,
}) => (
    <div
        style={{
            background: "#f8f9fc",
            padding: "15px",
            borderRadius: "10px",
        }}
    >
        <h4
            style={{
                margin: "0 0 8px 0",
                color: "#ED1464",
            }}
        >
            {label}
        </h4>

        <p
            style={{
                margin: 0,
                color: "#333",
            }}
        >
            {value || "-"}
        </p>
    </div>
);

export default ViewProfile;