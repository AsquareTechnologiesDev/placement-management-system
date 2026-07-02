import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const StudentDetail = () => {
    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [remark, setRemark] = useState("");

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/student/trainer/students/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            setStudent(data);
        } catch (error) {
            console.error(error);
        }
    };

    const approveStudent = async () => {
        try {
            await fetch(
                "http://127.0.0.1:8000/api/student/trainer/approve/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        student_profile_id: id,
                        remark: remark,
                    }),
                }
            );

            alert(
                "Profile Approved Successfully"
            );

            fetchStudent();
        } catch (error) {
            console.error(error);
        }
    };

    const rejectStudent = async () => {
        try {
            await fetch(
                "http://127.0.0.1:8000/api/student/trainer/reject/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        student_profile_id: id,
                        remark: remark,
                    }),
                }
            );

            alert(
                "Profile Rejected Successfully"
            );

            fetchStudent();
        } catch (error) {
            console.error(error);
        }
    };

    if (!student) {
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                Loading...
            </div>
        );
    }

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
                    Student Review
                </h1>

                <p
                    style={{
                        marginTop: "10px",
                    }}
                >
                    Review student profile and
                    provide approval remarks.
                </p>
            </div>

            {/* Student Details Card */}

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                    marginBottom: "25px",
                }}
            >
                <h2
                    style={{
                        color: "#ED1464",
                        marginTop: 0,
                    }}
                >
                    Student Information
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(300px,1fr))",
                        gap: "20px",
                    }}
                >
                    <div>
                        <strong>
                            Student Name
                        </strong>
                        <p>
                            {
                                student.student_name
                            }
                        </p>
                    </div>

                    <div>
                        <strong>
                            Phone
                        </strong>
                        <p>
                            {student.phone}
                        </p>
                    </div>

                    <div>
                        <strong>
                            Qualification
                        </strong>
                        <p>
                            {
                                student.qualification
                            }
                        </p>
                    </div>

                    <div>
                        <strong>
                            Status
                        </strong>

                        <p>
                            <span
                                style={{
                                    background:
                                        "#ffe3ef",
                                    color:
                                        "#ED1464",
                                    padding:
                                        "6px 12px",
                                    borderRadius:
                                        "20px",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                {
                                    student.status
                                }
                            </span>
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "20px",
                    }}
                >
                    <strong>
                        Skills
                    </strong>

                    <p>
                        {student.skills}
                    </p>
                </div>

                <div
                    style={{
                        marginTop: "20px",
                    }}
                >
                    <strong>
                        Resume
                    </strong>

                    <br />
                    <br />

                    {student.resume ? (
                        <a
                            href={`http://127.0.0.1:8000${student.resume}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                background:
                                    "#ED1464",
                                color:
                                    "#fff",
                                padding:
                                    "10px 18px",
                                borderRadius:
                                    "8px",
                                textDecoration:
                                    "none",
                            }}
                        >
                            View Resume
                        </a>
                    ) : (
                        "No Resume Uploaded"
                    )}
                </div>
            </div>

            {/* Remark Section */}

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h2
                    style={{
                        color: "#ED1464",
                        marginTop: 0,
                    }}
                >
                    Trainer Remark
                </h2>

                <textarea
                    value={remark}
                    onChange={(e) =>
                        setRemark(
                            e.target.value
                        )
                    }
                    placeholder="Enter approval or rejection remarks..."
                    style={{
                        width: "100%",
                        minHeight: "120px",
                        padding: "12px",
                        border:
                            "1px solid #ddd",
                        borderRadius:
                            "8px",
                        boxSizing:
                            "border-box",
                        resize: "vertical",
                    }}
                />

                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        gap: "15px",
                    }}
                >
                    <button
                        onClick={
                            approveStudent
                        }
                        style={{
                            background:
                                "#ED1464",
                            color: "#fff",
                            border: "none",
                            padding:
                                "12px 25px",
                            borderRadius:
                                "8px",
                            cursor:
                                "pointer",
                            fontWeight:
                                "600",
                        }}
                    >
                        Approve
                    </button>

                    <button
                        onClick={
                            rejectStudent
                        }
                        style={{
                            background:
                                "#dc3545",
                            color: "#fff",
                            border: "none",
                            padding:
                                "12px 25px",
                            borderRadius:
                                "8px",
                            cursor:
                                "pointer",
                            fontWeight:
                                "600",
                        }}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;