const AdminDashboard = () => {
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
                    Admin Dashboard
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Manage students, trainers,
                    placement executives and monitor
                    placement activities.
                </p>
            </div>

            {/* Statistics */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <div
                    style={cardStyle}
                >
                    <h3 style={titleStyle}>
                        Students
                    </h3>

                    <h1 style={valueStyle}>
                        0
                    </h1>
                </div>

                <div
                    style={cardStyle}
                >
                    <h3 style={titleStyle}>
                        Trainers
                    </h3>

                    <h1 style={valueStyle}>
                        0
                    </h1>
                </div>

                <div
                    style={cardStyle}
                >
                    <h3 style={titleStyle}>
                        Placement Executives
                    </h3>

                    <h1 style={valueStyle}>
                        0
                    </h1>
                </div>

                <div
                    style={cardStyle}
                >
                    <h3 style={titleStyle}>
                        Companies
                    </h3>

                    <h1 style={valueStyle}>
                        0
                    </h1>
                </div>
            </div>

            {/* Quick Actions */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    marginBottom: "30px",
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
                        style={
                            buttonStyle
                        }
                    >
                        Add Trainer
                    </button>

                    <button
                        style={
                            buttonStyle
                        }
                    >
                        Add Placement Executive
                    </button>

                    <button
                        style={
                            buttonStyle
                        }
                    >
                        View Students
                    </button>

                    <button
                        style={
                            buttonStyle
                        }
                    >
                        Manage Companies
                    </button>
                </div>
            </div>

            {/* Recent Activity */}

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
                    Recent Activity
                </h2>

                <div
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#888",
                        border:
                            "1px dashed #ddd",
                        borderRadius:
                            "10px",
                    }}
                >
                    No recent activity found.
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

export default AdminDashboard;