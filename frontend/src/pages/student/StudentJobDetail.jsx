import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const StudentJobDetail = () => {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchJob();
    }, []);

    const fetchJob = async () => {
        try {
            const response = await api.get(
                `/companies/student/jobs/${id}/`
            );

            setJob(response.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load job details.");
        } finally {
            setLoading(false);
        }
    };

    const applyJob = async () => {
        if (
            !window.confirm(
                "Are you sure you want to apply for this job?"
            )
        ) {
            return;
        }

        try {
            setApplying(true);

            const response = await api.post(
                `/companies/student/jobs/${id}/apply/`
            );

            alert(response.data.message);

            fetchJob();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.error ||
                    "Unable to apply."
            );
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "40px" }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ padding: "40px" }}>
                <h2>Job not found.</h2>
            </div>
        );
    }

    const pageStyle = {
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "40px",
        fontFamily: "Segoe UI",
    };

    const cardStyle = {
        maxWidth: "1000px",
        margin: "auto",
        background: "#fff",
        borderRadius: "15px",
        padding: "35px",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.08)",
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "25px",
    };

    const thStyle = {
        width: "30%",
        textAlign: "left",
        padding: "14px",
        background: "#fafafa",
        borderBottom: "1px solid #eee",
    };

    const tdStyle = {
        padding: "14px",
        borderBottom: "1px solid #eee",
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h1
                    style={{
                        marginTop: 0,
                        color: "#e91e63",
                    }}
                >
                    {job.title}
                </h1>

                <h2
                    style={{
                        color: "#555",
                        marginBottom: "25px",
                    }}
                >
                    {job.company_name}
                </h2>

                <table style={tableStyle}>
                    <tbody>
                        <tr>
                            <th style={thStyle}>
                                Company
                            </th>
                            <td style={tdStyle}>
                                {job.company_name}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Description
                            </th>
                            <td style={tdStyle}>
                                {job.description}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Eligibility
                            </th>
                            <td style={tdStyle}>
                                {job.eligibility}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Package
                            </th>
                            <td style={tdStyle}>
                                {job.package}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Location
                            </th>
                            <td style={tdStyle}>
                                {job.location}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Vacancies
                            </th>
                            <td style={tdStyle}>
                                {job.vacancies}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Last Date
                            </th>
                            <td style={tdStyle}>
                                {new Date(
                                    job.deadline
                                ).toLocaleDateString()}
                            </td>
                        </tr>

                        <tr>
                            <th style={thStyle}>
                                Status
                            </th>
                            <td style={tdStyle}>
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
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div
                    style={{
                        marginTop: "35px",
                        textAlign: "center",
                    }}
                >
                    {job.is_applied ? (
                        <button
                            disabled
                            style={{
                                background:
                                    "#28a745",
                                color: "#fff",
                                padding:
                                    "15px 30px",
                                border: "none",
                                borderRadius:
                                    "8px",
                                fontSize:
                                    "16px",
                                fontWeight:
                                    "bold",
                            }}
                        >
                            ✓ Already Applied
                        </button>
                    ) : !job.profile_approved ? (
                        <div
                            style={{
                                background:
                                    "#fff3cd",
                                color:
                                    "#856404",
                                padding:
                                    "18px",
                                borderRadius:
                                    "8px",
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Your profile must be
                            approved by your trainer
                            before you can apply for
                            jobs.
                        </div>
                    ) : (
                        <button
                            onClick={applyJob}
                            disabled={applying}
                            style={{
                                background:
                                    "#e91e63",
                                color: "#fff",
                                padding:
                                    "15px 35px",
                                border: "none",
                                borderRadius:
                                    "8px",
                                cursor: "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "16px",
                            }}
                        >
                            {applying
                                ? "Applying..."
                                : "Apply Now"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentJobDetail;