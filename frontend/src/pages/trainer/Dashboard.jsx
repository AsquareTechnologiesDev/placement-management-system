import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const TrainerDashboard = () => {
    const [students, setStudents] = useState([]);

    const token = localStorage.getItem("access_token");

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
    try {
        const { data } = await api.get(
            "/student/trainer/students/"
        );

        setStudents(data);
    } catch (error) {
        console.error(
            "Error loading students:",
            error
        );
    }
};
    const handleView = (studentId) => {
        navigate(
            `/trainer/student/${studentId}`
        );
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8f9fc",
                padding: "30px",
                fontFamily:
                    "'Segoe UI', sans-serif",
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    background: "#ED1464",
                    color: "#fff",
                    padding: "25px",
                    borderRadius: "15px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 5px 20px rgba(0,0,0,0.1)",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                    }}
                >
                    Trainer Dashboard
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                    }}
                >
                    Manage assigned students and
                    track their progress.
                </p>
            </div>

            {/* STATS */}

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
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#777",
                        }}
                    >
                        Assigned Students
                    </h3>

                    <h1
                        style={{
                            color: "#ED1464",
                            margin: 0,
                        }}
                    >
                        {students.length}
                    </h1>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#777",
                        }}
                    >
                        Pending Reviews
                    </h3>

                    <h1
                        style={{
                            color: "#ED1464",
                            margin: 0,
                        }}
                    >
                        {students.filter(
                            (s) =>
                                s.status ===
                                "PENDING"
                        ).length}
                    </h1>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#777",
                        }}
                    >
                        Active Students
                    </h3>

                    <h1
                        style={{
                            color: "#ED1464",
                            margin: 0,
                        }}
                    >
                        {
                            students.length -
                            students.filter(
                                (s) =>
                                    s.status ===
                                    "PENDING"
                            ).length
                        }
                    </h1>
                </div>
            </div>

            {/* STUDENT SECTION */}

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
                        marginBottom: "20px",
                        color: "#333",
                    }}
                >
                    Assigned Students
                </h2>

                {students.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#888",
                        }}
                    >
                        No students assigned.
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(280px,1fr))",
                            gap: "20px",
                        }}
                    >
                        {students.map(
                            (student) => (
                                <div
                                    key={
                                        student.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #eee",
                                        borderRadius:
                                            "12px",
                                        padding:
                                            "20px",
                                        transition:
                                            "0.3s",
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 0,
                                            color:
                                                "#333",
                                        }}
                                    >
                                        {
                                            student.name
                                        }
                                    </h3>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        <span
                                            style={{
                                                color:
                                                    "#ED1464",
                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            {
                                                student.status
                                            }
                                        </span>
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleView(
                                                student.id
                                            )
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            padding:
                                                "12px",
                                            background:
                                                "#ED1464",
                                            color:
                                                "#fff",
                                            border:
                                                "none",
                                            borderRadius:
                                                "8px",
                                            cursor:
                                                "pointer",
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        View Student
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDashboard;