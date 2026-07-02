import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const StudentDashboard = () => {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});
    const [drives, setDrives] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
        fetchDrives();
        fetchJobs();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get(
                "/student/profile/"
            );

            setDashboard(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDrives = async () => {
        try {
            const response = await api.get(
                "/companies/student/drives/"
            );

            setDrives(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get(
                "/companies/student/jobs/"
            );

            setJobs(response.data);

        } catch (error) {
            console.error(error);
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
                    padding: "30px",
                    borderRadius: "18px",
                    marginBottom: "30px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "32px",
                    }}
                >
                    Student Dashboard
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                        opacity: 0.9,
                        fontSize: "16px",
                    }}
                >
                    Welcome,
                    {" "}
                    <strong>
                        {dashboard.student_name}
                    </strong>

                    <br />

                    Explore placement drives,
                    available jobs and manage
                    your profile.
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

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#777",
                            marginBottom: "10px",
                        }}
                    >
                        Profile Status
                    </h3>

                    <h2
                        style={{
                            color: "#ED1464",
                            margin: 0,
                        }}
                    >
                        {dashboard.status || "DRAFT"}
                    </h2>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#777",
                            marginBottom: "10px",
                        }}
                    >
                        Active Drives
                    </h3>

                    <h2
                        style={{
                            color: "#ED1464",
                            margin: 0,
                        }}
                    >
                        {drives.length}
                    </h2>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#777",
                            marginBottom: "10px",
                        }}
                    >
                        Available Jobs
                    </h3>

                    <h2
                        style={{
                            color: "#ED1464",
                            margin: 0,
                        }}
                    >
                        {jobs.length}
                    </h2>
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
                        "0 3px 12px rgba(0,0,0,.08)",
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
                            navigate("/student/view-profile")
                        }
                        style={buttonStyle}
                    >
                        View Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/student/profile")
                        }
                        style={buttonStyle}
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/student/drives")
                        }
                        style={buttonStyle}
                    >
                        View Drives
                    </button>

                    <button
                        onClick={() =>
                            navigate("/student/jobs")
                        }
                        style={buttonStyle}
                    >
                        View Jobs
                    </button>

                    <button
                        onClick={() =>
                            navigate("/student/my-applications")
                        }
                        style={buttonStyle}
                    >
                        My Applications
                    </button>
                </div>
            </div>

            {/* Latest Placement Drives */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,.08)",
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: "20px",
                    }}
                >
                    Latest Placement Drives
                </h2>

                {drives.length === 0 ? (
                    <p
                        style={{
                            color: "#666",
                        }}
                    >
                        No active placement drives.
                    </p>
                ) : (
                    drives
                        .slice(0, 3)
                        .map((drive) => (
                            <div
                                key={drive.id}
                                style={{
                                    border:
                                        "1px solid #eee",
                                    borderRadius:
                                        "12px",
                                    padding: "18px",
                                    marginBottom:
                                        "15px",
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            margin: 0,
                                            color:
                                                "#ED1464",
                                        }}
                                    >
                                        {drive.title}
                                    </h3>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0",
                                        }}
                                    >
                                        <strong>
                                            Company:
                                        </strong>{" "}
                                        {
                                            drive.company_name
                                        }
                                    </p>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0",
                                        }}
                                    >
                                        <strong>
                                            Package:
                                        </strong>{" "}
                                        {
                                            drive.package
                                        }
                                    </p>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0",
                                        }}
                                    >
                                        <strong>
                                            Registration Ends:
                                        </strong>{" "}
                                        {new Date(
                                            drive.registration_deadline
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/student/drives/${drive.id}`
                                        )
                                    }
                                    style={
                                        buttonStyle
                                    }
                                >
                                    View
                                </button>
                            </div>
                        ))
                )}
            </div>
                        {/* Latest Available Jobs */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,.08)",
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: "20px",
                    }}
                >
                    Latest Available Jobs
                </h2>

                {jobs.length === 0 ? (
                    <p style={{ color: "#666" }}>
                        No active jobs available.
                    </p>
                ) : (
                    jobs
                        .slice(0, 3)
                        .map((job) => (
                            <div
                                key={job.id}
                                style={{
                                    border:
                                        "1px solid #eee",
                                    borderRadius:
                                        "12px",
                                    padding: "18px",
                                    marginBottom:
                                        "15px",
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            margin: 0,
                                            color:
                                                "#ED1464",
                                        }}
                                    >
                                        {job.title}
                                    </h3>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0",
                                        }}
                                    >
                                        <strong>
                                            Company:
                                        </strong>{" "}
                                        {
                                            job.company_name
                                        }
                                    </p>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0",
                                        }}
                                    >
                                        <strong>
                                            Package:
                                        </strong>{" "}
                                        {
                                            job.package
                                        }
                                    </p>

                                    <p
                                        style={{
                                            margin:
                                                "8px 0",
                                        }}
                                    >
                                        <strong>
                                            Deadline:
                                        </strong>{" "}
                                        {job.deadline}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/student/jobs/${job.id}`
                                        )
                                    }
                                    style={buttonStyle}
                                >
                                    View
                                </button>
                            </div>
                        ))
                )}
            </div>

            {/* Latest Updates */}

            <div
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
                    }}
                >
                    Latest Updates
                </h2>

                <ul
                    style={{
                        lineHeight: "2",
                        color: "#555",
                        paddingLeft: "20px",
                    }}
                >
                    <li>
                        Complete your profile
                        before applying for jobs.
                    </li>

                    <li>
                        Keep checking placement
                        drives regularly.
                    </li>

                    <li>
                        Only active jobs and
                        published drives are shown.
                    </li>

                    <li>
                        Upload your latest resume
                        for better opportunities.
                    </li>
                </ul>
            </div>

        </div>
    );
};

/* Shared Button Style */

const buttonStyle = {
    background: "#ED1464",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
};

export default StudentDashboard;