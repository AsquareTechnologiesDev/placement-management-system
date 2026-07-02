import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const MyApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get(
                "/companies/student/my-applications/"
            );

            setApplications(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = {
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "40px",
        fontFamily: "Segoe UI",
    };

    const headerStyle = {
        background: "#e91e63",
        color: "#fff",
        padding: "25px 30px",
        borderRadius: "15px",
        marginBottom: "30px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(360px,1fr))",
        gap: "25px",
    };

    const cardStyle = {
        background: "#fff",
        borderRadius: "15px",
        padding: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    };

    const labelStyle = {
        fontWeight: "bold",
        color: "#555",
        width: "140px",
        display: "inline-block",
    };

    const statusStyle = (status) => {
        let background = "#999";

        switch (status) {
            case "APPLIED":
                background = "#17a2b8";
                break;

            case "SHORTLISTED":
                background = "#28a745";
                break;

            case "REJECTED":
                background = "#dc3545";
                break;

            case "HIRED":
                background = "#6f42c1";
                break;

            default:
                background = "#6c757d";
        }

        return {
            display: "inline-block",
            marginTop: "15px",
            padding: "8px 18px",
            borderRadius: "20px",
            background,
            color: "#fff",
            fontWeight: "bold",
        };
    };

    if (loading) {
        return (
            <div style={{ padding: "40px" }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h1 style={{ margin: 0 }}>
                    My Job Applications
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Track all your submitted job
                    applications.
                </p>
            </div>

            {applications.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "50px",
                        textAlign: "center",
                        borderRadius: "15px",
                        boxShadow:
                            "0 5px 15px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2>No Applications Yet</h2>

                    <p>
                        You haven't applied for any
                        jobs.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/student/jobs")
                        }
                        style={{
                            marginTop: "20px",
                            background: "#e91e63",
                            color: "#fff",
                            border: "none",
                            padding: "12px 25px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <div style={gridStyle}>
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            style={cardStyle}
                        >
                            <h2
                                style={{
                                    marginTop: 0,
                                    color:
                                        "#e91e63",
                                }}
                            >
                                {app.job_title}
                            </h2>

                            <h3
                                style={{
                                    color: "#555",
                                    marginTop:
                                        "-5px",
                                }}
                            >
                                {
                                    app.company_name
                                }
                            </h3>

                            <hr />

                            <p>
                                <span
                                    style={
                                        labelStyle
                                    }
                                >
                                    Package
                                </span>

                                {app.package ||
                                    "-"}
                            </p>

                            <p>
                                <span
                                    style={
                                        labelStyle
                                    }
                                >
                                    Location
                                </span>

                                {app.location ||
                                    "-"}
                            </p>

                            <p>
                                <span
                                    style={
                                        labelStyle
                                    }
                                >
                                    Last Date
                                </span>

                                {new Date(
                                    app.deadline
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                <span
                                    style={
                                        labelStyle
                                    }
                                >
                                    Applied On
                                </span>

                                {new Date(
                                    app.applied_at
                                ).toLocaleString()}
                            </p>

                            <div
                                style={statusStyle(
                                    app.status
                                )}
                            >
                                {app.status}
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/student/jobs/${app.job}`
                                    )
                                }
                                style={{
                                    width: "100%",
                                    marginTop:
                                        "25px",
                                    padding:
                                        "12px",
                                    background:
                                        "#e91e63",
                                    color:
                                        "#fff",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "bold",
                                }}
                            >
                                View Job
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;