
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Jobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/companies/jobs/");

            setJobs(res.data);
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
                    marginBottom: "25px",
                }}
            >
                <h1 style={{ margin: 0 }}>
                    Job Management
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Manage all placement jobs.
                </p>
            </div>

            {/* Create Job */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "25px",
                }}
            >
                <button
                    onClick={() =>
                        navigate(
                            "/placement/jobs/create"
                        )
                    }
                    style={{
                        background: "#ED1464",
                        color: "#fff",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    + Create Job
                </button>
            </div>

            {/* Job Count */}

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "15px",
                    marginBottom: "25px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,.08)",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        color: "#555",
                    }}
                >
                    Total Jobs
                </h3>

                <h1
                    style={{
                        color: "#ED1464",
                        marginBottom: 0,
                    }}
                >
                    {jobs.length}
                </h1>
            </div>

            {/* Job Cards */}

            {jobs.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#888",
                        }}
                    >
                        No jobs available.
                    </h3>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(350px,1fr))",
                        gap: "20px",
                    }}
                >
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            style={{
                                background: "#fff",
                                borderRadius: "15px",
                                padding: "25px",
                                boxShadow:
                                    "0 3px 12px rgba(0,0,0,.08)",
                            }}
                        >
                            <h2
                                style={{
                                    marginTop: 0,
                                    color: "#333",
                                }}
                            >
                                {job.title}
                            </h2>

                            <p>
                                <strong>Company</strong>
                                <br />
                                {job.company_name}
                            </p>

                            <p>
                                <strong>Package</strong>
                                <br />
                                {job.package}
                            </p>

                            <p>
                                <strong>Location</strong>
                                <br />
                                {job.location}
                            </p>

                            <p>
                                <strong>Vacancies</strong>
                                <br />
                                {job.vacancies}
                            </p>

                            <p>
                                <strong>Status</strong>
                                <br />
                                <span
                                    style={{
                                        background:
                                            job.status ===
                                            "OPEN"
                                                ? "#d4edda"
                                                : "#f8d7da",
                                        color:
                                            job.status ===
                                            "OPEN"
                                                ? "#155724"
                                                : "#721c24",
                                        padding:
                                            "6px 12px",
                                        borderRadius:
                                            "20px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    {job.status}
                                </span>
                            </p>

                            <p>
                                <strong>Deadline</strong>
                                <br />
                                {job.deadline}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/placement/jobs/${job.id}`
                                        )
                                    }
                                    style={{
                                        flex: 1,
                                        background:
                                            "#ED1464",
                                        color: "#fff",
                                        border: "none",
                                        padding:
                                            "12px",
                                        borderRadius:
                                            "8px",
                                        cursor:
                                            "pointer",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    View
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/placement/jobs/${job.id}/applications`
                                        )
                                    }
                                    style={{
                                        flex: 1,
                                        background:
                                            "#333",
                                        color: "#fff",
                                        border: "none",
                                        padding:
                                            "12px",
                                        borderRadius:
                                            "8px",
                                        cursor:
                                            "pointer",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    Applications
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Jobs;

