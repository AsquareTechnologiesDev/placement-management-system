import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const ViewStudent = () => {
    const { id } = useParams();

    const [student, setStudent] = useState(null);

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const res = await api.get(`/student/placement/${id}/`);
            console.log(res.data);
            

            setStudent(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!student)
        return <h2 style={{ padding: "40px" }}>Loading...</h2>;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8f9fc",
                padding: "30px",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            <div
                style={{
                    background: "#ED1464",
                    color: "#fff",
                    padding: "25px",
                    borderRadius: "15px",
                    marginBottom: "30px",
                }}
            >
                <h1>{student.student_name}</h1>

                <p>Student Profile</p>
            </div>

            <div
                style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "30px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,.08)",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderSpacing: "18px",
                        fontSize: "17px",
                    }}
                >
                    <tbody>
                        <tr>
                            <td><b>Email</b></td>
                            <td>{student.email}</td>
                        </tr>

                        <tr>
                            <td><b>Phone</b></td>
                            <td>{student.phone}</td>
                        </tr>

                        <tr>
                            <td><b>Qualification</b></td>
                            <td>{student.qualification}</td>
                        </tr>

                        <tr>
                            <td><b>Passout Year</b></td>
                            <td>{student.passout_year}</td>
                        </tr>

                        <tr>
                            <td><b>Trainer</b></td>
                            <td>{student.trainer}</td>
                        </tr>

                        <tr>
                            <td><b>Skills</b></td>
                            <td>{student.skills}</td>
                        </tr>

                        <tr>
                            <td><b>Address</b></td>
                            <td>{student.address}</td>
                        </tr>

                        <tr>
                            <td><b>Status</b></td>
                            <td>{student.status}</td>
                        </tr>

                        <tr>
                            <td><b>Resume</b></td>
                            <td>
                                {student.resume ? (
                                    <a
                                        href={`http://127.0.0.1:8000${student.resume}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            color: "#ED1464",
                                            fontWeight: "600",
                                        }}
                                    >
                                        View Resume
                                    </a>
                                ) : (
                                    "No Resume"
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewStudent;