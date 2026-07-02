import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const StudentDrives = () => {
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <h2
                style={{
                    textAlign: "center",
                    marginTop: "80px",
                }}
            >
                Loading...
            </h2>
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
                    marginBottom: "30px",
                }}
            >
                <h1 style={{ margin: 0 }}>
                    Placement Drives
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                    }}
                >
                    Browse all active placement
                    drives.
                </p>
            </div>

            {/* Drives */}

            {drives.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "30px",
                        borderRadius: "15px",
                        textAlign: "center",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,.08)",
                    }}
                >
                    <h3>
                        No Active Drives
                    </h3>
                </div>
            ) : (
                drives.map((drive) => (
                    <div
                        key={drive.id}
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "25px",
                            marginBottom: "20px",
                            boxShadow:
                                "0 3px 12px rgba(0,0,0,.08)",
                        }}
                    >
                        <h2
                            style={{
                                color: "#ED1464",
                                marginTop: 0,
                            }}
                        >
                            {drive.title}
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(250px,1fr))",
                                gap: "15px",
                            }}
                        >
                            <div>
                                <strong>
                                    Company
                                </strong>

                                <p>
                                    {
                                        drive.company_name
                                    }
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Package
                                </strong>

                                <p>
                                    {drive.package}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Positions
                                </strong>

                                <p>
                                    {
                                        drive.available_positions
                                    }
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Openings
                                </strong>

                                <p>
                                    {
                                        drive.openings
                                    }
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Drive Date
                                </strong>

                                <p>
                                    {new Date(
                                        drive.drive_datetime
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Registration Deadline
                                </strong>

                                <p>
                                    {new Date(
                                        drive.registration_deadline
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Mode
                                </strong>

                                <p>
                                    {drive.mode}
                                </p>
                            </div>

                            <div>
                                <strong>
                                    Venue
                                </strong>

                                <p>
                                    {drive.venue}
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: "20px",
                            }}
                        >
                            <button
                                onClick={() =>
                                    navigate(
                                        `/student/drives/${drive.id}`
                                    )
                                }
                                style={{
                                    background:
                                        "#ED1464",
                                    color: "#fff",
                                    border: "none",
                                    padding:
                                        "12px 20px",
                                    borderRadius:
                                        "8px",
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentDrives;