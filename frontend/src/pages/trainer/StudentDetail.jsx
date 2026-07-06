import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

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
        const { data } = await api.get(
            `/student/trainer/students/${id}/`
        );

        setStudent(data);
    } catch (error) {
        console.error("Error fetching student:", error);
    }
};

    const approveStudent = async () => {
    try {
        await api.post("/student/trainer/approve/", {
            student_profile_id: id,
            remark: remark,
        });

        alert("Profile Approved Successfully");

        fetchStudent();
    } catch (error) {
        console.error("Approval Error:", error);

        alert(
            error.response?.data?.detail ||
            "Failed to approve student."
        );
    }
};
    const rejectStudent = async () => {
    try {
        await api.post("/student/trainer/reject/", {
            student_profile_id: id,
            remark: remark,
        });

        alert("Profile Rejected Successfully");

        fetchStudent();
    } catch (error) {
        console.error("Rejection Error:", error);

        alert(
            error.response?.data?.detail ||
            "Failed to reject student."
        );
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
                            href={`https://placement-management-system-29po.onrender.com${student.resume}`}
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