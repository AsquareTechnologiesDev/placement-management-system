import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const StudentDriveDetail = () => {
    const { id } = useParams();

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
            <div style={{ padding: "40px", textAlign: "center" }}>
                Loading...
            </div>
        );
    }

    if (!drive) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                Drive not found.
            </div>
        );
    }

    // Accept APPROVED / Approved / approved
    const status = profile?.status || "";
    const isApproved = status.toUpperCase() === "APPROVED";

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "40px auto",
                background: "#fff",
                padding: "40px",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            }}
        >
            <h1
                style={{
                    color: "#e91e63",
                    marginBottom: "25px",
                }}
            >
                {drive.title}
            </h1>

            {drive.notice_image && (
                <img
                    src={drive.notice_image}
                    alt="Notice"
                    style={{
                        width: "100%",
                        maxHeight: "350px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "30px",
                    }}
                />
            )}

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <tbody>
                    <Row label="Company" value={drive.company_name} />
                    <Row label="Title" value={drive.title} />
                    <Row label="Description" value={drive.description} />
                    <Row label="Eligibility" value={drive.eligibility} />
                    <Row label="Package" value={drive.package} />
                    <Row label="Available Positions" value={drive.available_positions} />
                    <Row label="Openings" value={drive.openings} />

                    <Row
                        label="Drive Date & Time"
                        value={
                            drive.drive_datetime
                                ? new Date(drive.drive_datetime).toLocaleString()
                                : "-"
                        }
                    />

                    <Row
                        label="Registration Deadline"
                        value={
                            drive.registration_deadline
                                ? new Date(
                                      drive.registration_deadline
                                  ).toLocaleString()
                                : "-"
                        }
                    />

                    <Row label="Mode" value={drive.mode} />
                    <Row label="Venue" value={drive.venue} />
                    <Row label="City" value={drive.city} />
                    <Row label="State" value={drive.state} />
                    <Row label="Coordinator" value={drive.coordinator_name} />
                    <Row label="Email" value={drive.coordinator_email} />
                    <Row label="Phone" value={drive.coordinator_phone} />
                    <Row label="Status" value={drive.status} />
                </tbody>
            </table>

            <div
                style={{
                    marginTop: "40px",
                    textAlign: "center",
                }}
            >
                {isApproved ? (
                    <a
                        href={drive.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            background: "#e91e63",
                            color: "#fff",
                            padding: "14px 28px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Register for Drive
                    </a>
                ) : (
                    <div
                        style={{
                            background: "#fff3cd",
                            color: "#856404",
                            padding: "18px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                        }}
                    >
                        Registration link is available only after your profile
                        is approved by the trainer.
                    </div>
                )}
            </div>
        </div>
    );
};

const Row = ({ label, value }) => (
    <tr
        style={{
            borderBottom: "1px solid #eee",
        }}
    >
        <td
            style={{
                width: "35%",
                padding: "15px",
                fontWeight: "bold",
            }}
        >
            {label}
        </td>

        <td
            style={{
                padding: "15px",
            }}
        >
            {value || "-"}
        </td>
    </tr>
);

export default StudentDriveDetail;