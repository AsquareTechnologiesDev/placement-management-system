import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f8fc",
                padding: "30px",
                fontFamily: "Segoe UI",
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

                <p style={{ marginTop: 10 }}>
                    Manage all placement drives.
                </p>
            </div>

            {/* Add Drive */}

            <button
                onClick={() =>
                    navigate("/placement/drives/create")
                }
                style={{
                    background: "#ED1464",
                    color: "#fff",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "30px",
                    fontWeight: "600",
                }}
            >
                + Create New Drive
            </button>

            {drives.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>No Drives Available</h3>
                </div>
            ) : (
                drives.map((drive) => (
                    <div
                        key={drive.id}
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "25px",
                            marginBottom: "25px",
                            boxShadow:
                                "0 4px 12px rgba(0,0,0,0.08)",
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

                        <hr
                            style={{
                                border: "none",
                                borderTop:
                                    "1px solid #eee",
                            }}
                        />

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(280px,1fr))",
                                gap: "18px",
                                marginTop: "20px",
                            }}
                        >
                            <Info
                                label="Company"
                                value={
                                    drive.company_name
                                }
                            />

                            <Info
                                label="Package"
                                value={
                                    drive.package
                                }
                            />

                            <Info
                                label="Available Positions"
                                value={
                                    drive.available_positions
                                }
                            />

                            <Info
                                label="Openings"
                                value={
                                    drive.openings
                                }
                            />

                            <Info
                                label="Drive Date"
                                value={
                                    drive.drive_datetime
                                }
                            />

                            <Info
                                label="Registration Deadline"
                                value={
                                    drive.registration_deadline
                                }
                            />

                            <Info
                                label="Mode"
                                value={drive.mode}
                            />

                            <Info
                                label="Venue"
                                value={drive.venue}
                            />

                            <div>
                                <strong>
                                    Status
                                </strong>

                                <br />

                                <span
                                    style={{
                                        display:
                                            "inline-block",
                                        marginTop:
                                            "8px",
                                        background:
                                            "#d4edda",
                                        color:
                                            "#155724",
                                        padding:
                                            "6px 15px",
                                        borderRadius:
                                            "20px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    🟢{" "}
                                    {
                                        drive.status
                                    }
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                gap: "15px",
                            }}
                        >
                            <button
                                onClick={() =>
                                    navigate(
                                        `/placement/drives/${drive.id}`
                                    )
                                }
                                style={
                                    buttonStyle
                                }
                            >
                                View Details
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/placement/drives/edit/${drive.id}`
                                    )
                                }
                                style={
                                    buttonStyle
                                }
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <strong>{label}</strong>

        <p
            style={{
                marginTop: 6,
                color: "#555",
            }}
        >
            {value || "-"}
        </p>
    </div>
);

const buttonStyle = {
    background: "#ED1464",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
};

export default Drives;