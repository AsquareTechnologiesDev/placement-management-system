import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const StudentJobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get(
                "/companies/student/jobs/"
            );

            setJobs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = {
        minHeight: "100vh",
        background: "#f6f8fb",
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
            "repeat(auto-fit,minmax(350px,1fr))",
        gap: "25px",
    };

    const cardStyle = {
        background: "#fff",
        borderRadius: "15px",
        padding: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    };

    const labelStyle = {
        color: "#666",
        fontWeight: "600",
        width: "140px",
        display: "inline-block",
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h1 style={{ margin: 0 }}>
                    Available Jobs
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Explore the latest job
                    opportunities available for
                    students.
                </p>
            </div>

            {loading ? (
                <h3>Loading jobs...</h3>
            ) : jobs.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        boxShadow:
                            "0 5px 15px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2>No Active Jobs Available</h2>

                    <p>
                        Check back later for new
                        opportunities.
                    </p>
                </div>
            ) : (
                <div style={gridStyle}>
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            style={cardStyle}
                        >
                            <div>
                                <h2
                                    style={{
                                        marginTop: 0,
                                        color:
                                            "#e91e63",
                                    }}
                                >
                                    {job.title}
                                </h2>

                                <h3
                                    style={{
                                        marginTop: "-5px",
                                        color:
                                            "#555",
                                    }}
                                >
                                    {job.company_name}
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

                                    {job.package ||
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

                                    {job.location ||
                                        "-"}
                                </p>

                                <p>
                                    <span
                                        style={
                                            labelStyle
                                        }
                                    >
                                        Vacancies
                                    </span>

                                    {
                                        job.vacancies
                                    }
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
                                        job.deadline
                                    ).toLocaleDateString()}
                                </p>

                                <p>
                                    <span
                                        style={
                                            labelStyle
                                        }
                                    >
                                        Status
                                    </span>

                                    <span
                                        style={{
                                            color:
                                                "#28a745",
                                            fontWeight:
                                                "bold",
                                        }}
                                    >
                                        {job.status}
                                    </span>
                                </p>

                                <div
                                    style={{
                                        marginTop:
                                            "20px",
                                    }}
                                >
                                    {job.is_applied ? (
                                        <span
                                            style={{
                                                background:
                                                    "#28a745",
                                                color:
                                                    "#fff",
                                                padding:
                                                    "8px 14px",
                                                borderRadius:
                                                    "20px",
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            ✓ Already
                                            Applied
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                background:
                                                    "#fff3cd",
                                                color:
                                                    "#856404",
                                                padding:
                                                    "8px 14px",
                                                borderRadius:
                                                    "20px",
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            Not Applied
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/student/jobs/${job.id}`
                                    )
                                }
                                style={{
                                    marginTop:
                                        "25px",
                                    width: "100%",
                                    padding:
                                        "12px",
                                    background:
                                        "#e91e63",
                                    color:
                                        "#fff",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    fontSize:
                                        "15px",
                                    fontWeight:
                                        "600",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentJobs;