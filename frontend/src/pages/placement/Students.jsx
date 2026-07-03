import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";



const Students = () => {
    const [students, setStudents] = useState([]);

    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get("/student/approved/");

            const data = await response.json();

            setStudents(data);
        } catch (error) {
            console.error(error);
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
                    Approved Students
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                    }}
                >
                    View trainer-approved
                    candidates ready for placement.
                </p>
            </div>

            {/* Count Card */}

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "15px",
                    marginBottom: "25px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        color: "#555",
                    }}
                >
                    Total Approved Students
                </h3>

                <h1
                    style={{
                        color: "#ED1464",
                        marginBottom: 0,
                    }}
                >
                    {students.length}
                </h1>
            </div>

            {/* Student Cards */}

            {students.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#888",
                        }}
                    >
                        No approved students found.
                    </h3>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(320px,1fr))",
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
                                    background:
                                        "#fff",
                                    padding:
                                        "25px",
                                    borderRadius:
                                        "15px",
                                    boxShadow:
                                        "0 3px 12px rgba(0,0,0,0.08)",
                                }}
                            >
                                {/* Avatar */}

                                <div
                                    style={{
                                        width:
                                            "60px",
                                        height:
                                            "60px",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "#ED1464",
                                        color:
                                            "#fff",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        fontSize:
                                            "24px",
                                        fontWeight:
                                            "bold",
                                        marginBottom:
                                            "15px",
                                    }}
                                >
                                    {student.student_name
                                        ?.charAt(
                                            0
                                        )
                                        ?.toUpperCase()}
                                </div>

                                <h2
                                    style={{
                                        marginTop:
                                            0,
                                        color:
                                            "#333",
                                    }}
                                >
                                    {
                                        student.student_name
                                    }
                                </h2>

                                <p>
                                    <strong>
                                        Qualification:
                                    </strong>
                                    <br />
                                    {
                                        student.qualification
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Skills:
                                    </strong>
                                    <br />
                                    {
                                        student.skills
                                    }
                                </p>

                                <div
                                    style={{
                                        marginTop:
                                            "20px",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/placement/student/${student.id}`
                                            )
                                        }
                                        style={{
                                            background:
                                                "#ED1464",
                                            color:
                                                "#fff",
                                            border:
                                                "none",
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
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Students;