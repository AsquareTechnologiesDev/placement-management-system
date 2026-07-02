import { useEffect, useState } from "react";
import api from "../../api/axios";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get("/companies/applications/");
            setApplications(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load applications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    };

    const statusColors = {
        HIRED: "#d4edda",
        SHORTLISTED: "#d1ecf1",
        REJECTED: "#f8d7da",
        PENDING: "#fff3cd",
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                Loading applications...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
            <h1 style={{ color: "#e91e63", marginBottom: "25px" }}>
                Job Applications
            </h1>

            <div
                style={{
                    background: "#fff",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#e91e63", color: "#fff" }}>
                        <tr>
                            <th style={th}>Student</th>
                            <th style={th}>Email</th>
                            <th style={th}>Company</th>
                            <th style={th}>Job</th>
                            <th style={th}>Qualification</th>
                            <th style={th}>Skills</th>
                            <th style={th}>Resume</th>
                            <th style={th}>Applied On</th>
                            <th style={th}>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ padding: "30px", textAlign: "center" }}>
                                    No applications found.
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id}>
                                    <td style={td}>{app.student_name}</td>
                                    <td style={td}>{app.student_email}</td>
                                    <td style={td}>{app.company_name}</td>
                                    <td style={td}>{app.job_title}</td>
                                    <td style={td}>{app.qualification}</td>
                                    <td style={td}>{app.skills}</td>

                                    <td style={td}>
                                        {app.resume ? (
                                            <a
                                                href={app.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{ color: "#e91e63", fontWeight: "bold" }}
                                            >
                                                View
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td style={td}>{formatDate(app.applied_at)}</td>

                                    <td style={td}>
                                        <span
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                background:
                                                    statusColors[app.status] || "#eee",
                                            }}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const th = { padding: "15px", textAlign: "left" };
const td = { padding: "15px", borderBottom: "1px solid #eee" };

export default Applications;