import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const DriveDetail = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [drive, setDrive] = useState(null);

    useEffect(() => {
        fetchDrive();
    }, []);

    const fetchDrive = async () => {
        try {
            const response = await api.get(
                `/companies/drives/${id}/`
            );

            console.log(response.data);

            setDrive(response.data);
        } catch (error) {
            console.error(error);

            alert("Unable to load drive.");
        }
    };

    const pageStyle = {
        background: "#f6f8fc",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Segoe UI",
    };

    const cardStyle = {
        background: "#fff",
        borderRadius: "18px",
        padding: "30px",
        marginBottom: "25px",
        boxShadow: "0 8px 25px rgba(0,0,0,.08)",
    };

    const sectionTitle = {
        color: "#ED1464",
        marginBottom: "20px",
    };

    const labelStyle = {
        fontWeight: "600",
        color: "#666",
        marginBottom: "5px",
    };

    const valueStyle = {
        fontSize: "17px",
        marginBottom: "18px",
        color: "#333",
    };

    const badge = {
        display: "inline-block",
        background: "#28a745",
        color: "#fff",
        padding: "8px 18px",
        borderRadius: "30px",
        fontWeight: "600",
    };

    if (!drive) {
        return (
            <div style={pageStyle}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div style={pageStyle}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                }}
            >
                <div>
                    <h1
                        style={{
                            color: "#ED1464",
                            marginBottom: "5px",
                        }}
                    >
                        Placement Drive Details
                    </h1>

                    <p style={{ color: "#666" }}>
                        Complete information about this
                        placement drive.
                    </p>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: "#ED1464",
                        color: "#fff",
                        border: "none",
                        padding: "12px 25px",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    ← Back
                </button>
            </div>

            {/* Notice Image */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Notice
                </h2>

                {drive.notice_image ? ( 
                    <img
                        src={drive.notice_image}
                        alt="Notice"
                        style={{
                            width: "100%",
                            maxHeight: "450px",
                            objectFit: "cover",
                            borderRadius: "12px",
                        }}
                    />
                ) : (
                    <p>No notice uploaded.</p>
                )}
            </div>
            

            {/* Basic Details */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Basic Information
                </h2>

                <div style={labelStyle}>
                    Company
                </div>

                <div style={valueStyle}>
                    {drive.company_name}
                </div>

                <div style={labelStyle}>
                    Drive Title
                </div>

                <div style={valueStyle}>
                    {drive.title}
                </div>

                <div style={labelStyle}>
                    Description
                </div>

                <div style={valueStyle}>
                    {drive.description}
                </div>

                <div style={labelStyle}>
                    Eligibility
                </div>

                <div style={valueStyle}>
                    {drive.eligibility}
                </div>
            </div>
                        {/* Job Details */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Job Details
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "25px",
                    }}
                >
                    <div>
                        <div style={labelStyle}>
                            Package
                        </div>

                        <div style={valueStyle}>
                            {drive.package}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            Available Positions
                        </div>

                        <div style={valueStyle}>
                            {drive.available_positions}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            Number of Openings
                        </div>

                        <div style={valueStyle}>
                            {drive.openings}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drive Schedule */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Drive Schedule
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "25px",
                    }}
                >
                    <div>
                        <div style={labelStyle}>
                            Drive Date & Time
                        </div>

                        <div style={valueStyle}>
                            {drive.drive_datetime
                                ? new Date(
                                      drive.drive_datetime
                                  ).toLocaleString()
                                : "-"}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            Registration Deadline
                        </div>

                        <div style={valueStyle}>
                            {drive.registration_deadline
                                ? new Date(
                                      drive.registration_deadline
                                  ).toLocaleString()
                                : "-"}
                        </div>
                    </div>

                    <div
                        style={{
                            gridColumn: "1 / -1",
                        }}
                    >
                        <div style={labelStyle}>
                            Registration Link
                        </div>

                        <div style={valueStyle}>
                            {drive.registration_link ? (
                                <a
                                    href={
                                        drive.registration_link
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: "#ED1464",
                                        fontWeight: "600",
                                        textDecoration:
                                            "none",
                                    }}
                                >
                                    {drive.registration_link}
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Venue Details */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Venue Details
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "25px",
                    }}
                >
                    <div>
                        <div style={labelStyle}>
                            Mode
                        </div>

                        <div style={valueStyle}>
                            {drive.mode}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            Venue
                        </div>

                        <div style={valueStyle}>
                            {drive.venue}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            City
                        </div>

                        <div style={valueStyle}>
                            {drive.city}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            State
                        </div>

                        <div style={valueStyle}>
                            {drive.state}
                        </div>
                    </div>
                </div>
            </div>

            {/* Coordinator */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Coordinator Details
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "25px",
                    }}
                >
                    <div>
                        <div style={labelStyle}>
                            Coordinator Name
                        </div>

                        <div style={valueStyle}>
                            {drive.coordinator_name}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            Email
                        </div>

                        <div style={valueStyle}>
                            {drive.coordinator_email}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>
                            Phone
                        </div>

                        <div style={valueStyle}>
                            {drive.coordinator_phone}
                        </div>
                    </div>
                </div>
            </div>
                        {/* Status */}

            <div style={cardStyle}>
                <h2 style={sectionTitle}>
                    Drive Status
                </h2>

                <span
                    style={{
                        ...badge,
                        background:
                            drive.status === "PUBLISHED"
                                ? "#28a745"
                                : drive.status === "CLOSED"
                                ? "#dc3545"
                                : "#ffc107",
                        color:
                            drive.status === "DRAFT"
                                ? "#000"
                                : "#fff",
                    }}
                >
                    {drive.status}
                </span>

                <div style={{ marginTop: "30px" }}>
                    <div style={labelStyle}>
                        Created At
                    </div>

                    <div style={valueStyle}>
                        {drive.created_at
                            ? new Date(
                                  drive.created_at
                              ).toLocaleString()
                            : "-"}
                    </div>

                    <div style={labelStyle}>
                        Last Updated
                    </div>

                    <div style={valueStyle}>
                        {drive.updated_at
                            ? new Date(
                                  drive.updated_at
                              ).toLocaleString()
                            : "-"}
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: "40px",
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: "#6c757d",
                        color: "#fff",
                        border: "none",
                        padding: "14px 35px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Back
                </button>

                {drive.registration_link && (
                    <a
                        href={drive.registration_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            background: "#ED1464",
                            color: "#fff",
                            padding: "14px 35px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "600",
                        }}
                    >
                        Apply Now
                    </a>
                )}
            </div>

        </div>
    );
};

export default DriveDetail;