
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateJob = () => {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [formData, setFormData] = useState({
        company: "",
        title: "",
        description: "",
        eligibility: "",
        package: "",
        location: "",
        vacancies: 1,
        deadline: "",
        status: "OPEN",
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
    try {
        const res = await api.get("/companies/");

        console.log(res.data);

        setCompanies(res.data);
    } catch (err) {
        console.log(err);
    }
};

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/companies/jobs/",
                formData
            );

            alert("Job created successfully.");

            navigate("/placement/jobs");
        } catch (err) {
            console.log(err.response?.data);
            alert("Failed to create job.");
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
                    marginBottom: "30px",
                }}
            >
                <h1 style={{ margin: 0 }}>
                    Create Job
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Create a new job opening.
                </p>
            </div>

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,.08)",
                    maxWidth: "700px",
                    margin: "auto",
                }}
            >
                {/* Company */}

                <label>
                    Company
                </label>

                <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                >
                    <option value="">
                        Select Company
                    </option>

                    {companies.map(
                        (company) => (
                            <option
                                key={
                                    company.id
                                }
                                value={
                                    company.id
                                }
                            >
                                {
                                    company.name
                                }
                            </option>
                        )
                    )}
                </select>

                {/* Job Title */}

                <label>
                    Job Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Description */}

                <label>
                    Description
                </label>

                <textarea
                    name="description"
                    value={
                        formData.description
                    }
                    onChange={handleChange}
                    rows="4"
                    required
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Eligibility */}

                <label>
                    Eligibility
                </label>

                <textarea
                    name="eligibility"
                    value={
                        formData.eligibility
                    }
                    onChange={handleChange}
                    rows="3"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Package */}

                <label>
                    Package
                </label>

                <input
                    type="text"
                    name="package"
                    value={
                        formData.package
                    }
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Location */}

                <label>
                    Location
                </label>

                <input
                    type="text"
                    name="location"
                    value={
                        formData.location
                    }
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Vacancies */}

                <label>
                    Vacancies
                </label>

                <input
                    type="number"
                    name="vacancies"
                    value={
                        formData.vacancies
                    }
                    onChange={handleChange}
                    min="1"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Deadline */}

                <label>
                    Deadline
                </label>

                <input
                    type="date"
                    name="deadline"
                    value={
                        formData.deadline
                    }
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                    }}
                />

                {/* Status */}

                <label>
                    Status
                </label>

                <select
                    name="status"
                    value={
                        formData.status
                    }
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "30px",
                        borderRadius: "8px",
                    }}
                >
                    <option value="OPEN">
                        Open
                    </option>

                    <option value="CLOSED">
                        Closed
                    </option>
                </select>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        background: "#ED1464",
                        color: "#fff",
                        border: "none",
                        padding: "14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "16px",
                    }}
                >
                    Create Job
                </button>
            </form>
        </div>
    );
};

export default CreateJob;

