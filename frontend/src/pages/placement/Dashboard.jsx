import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const PlacementDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        companies: 0,
        approved_students: 0,
        jobs: 0,
        drives: 0,
        applications: 0,
        placements: 0,
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get(
                "/dashboard/placement/"
            );

            setStats(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
                    Placement Dashboard
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Manage companies, approved
                    students and placement
                    activities.
                </p>
            </div>

            {/* Statistics */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <div style={cardStyle}>
                    <h3 style={titleStyle}>
                        Companies
                    </h3>

                    <h1 style={valueStyle}>
                        {stats.companies}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={titleStyle}>
                        Approved Students
                    </h3>

                    <h1 style={valueStyle}>
                        {stats.approved_students}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={titleStyle}>
                        Jobs
                    </h3>

                    <h1 style={valueStyle}>
                        {stats.jobs}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={titleStyle}>
                        Placement Drives
                    </h3>

                    <h1 style={valueStyle}>
                        {stats.drives}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={titleStyle}>
                        Applications
                    </h3>

                    <h1 style={valueStyle}>
                        {stats.applications}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h3 style={titleStyle}>
                        Placements
                    </h3>

                    <h1 style={valueStyle}>
                        {stats.placements}
                    </h1>
                </div>
            </div>

            {/* Quick Actions */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        color: "#333",
                    }}
                >
                    Quick Actions
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={() =>
                            navigate("/placement/companies")
                        }
                        style={buttonStyle}
                    >
                        Manage Companies
                    </button>

                    <button
                        onClick={() =>
                            navigate("/placement/drives")
                        }
                        style={buttonStyle}
                    >
                        Placement Drives
                    </button>

                    <button
                        onClick={() =>
                            navigate("/placement/students")
                        }
                        style={buttonStyle}
                    >
                        Approved Students
                    </button>

                    <button
                        onClick={() =>
                            navigate("/placement/jobs")
                        }
                        style={buttonStyle}
                    >
                        Manage Jobs
                    </button>

                    <button
                        onClick={() =>
                            navigate("/placement/applications")
                        }
                        style={buttonStyle}
                    >
                        View Applications
                    </button>
                </div>
            </div>

            {/* Recent Activity */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    marginTop: "30px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        color: "#333",
                    }}
                >
                    Recent Activity
                </h2>

                <div
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#888",
                        border:
                            "1px dashed #ddd",
                        borderRadius: "10px",
                    }}
                >
                    No recent activity available.
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
        "0 3px 12px rgba(0,0,0,0.08)",
};

const titleStyle = {
    color: "#777",
    marginBottom: "10px",
};

const valueStyle = {
    color: "#ED1464",
    margin: 0,
};

const buttonStyle = {
    background: "#ED1464",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
};

export default PlacementDashboard;