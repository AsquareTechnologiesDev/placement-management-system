import { useEffect, useState } from "react";
import api from "../../api/axios";

const Companies = () => {
    const [companies, setCompanies] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        website: "",
        location: "",
        description: "",
        contact_person: "",
        email: "",
        phone: "",
    });

    // const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies/");

            setCompanies(response.data);
        } catch (error) {
            console.error(error);
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
            const response = await api.post("/companies/", formData);

if (response.ok) {
    alert("Company Added");

    setFormData({
        name: "",
        website: "",
        contact_person: "",
        email: "",
        phone: "",
    });

    fetchCompanies();
}
        } catch (error) {
            console.error(error);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxSizing: "border-box",
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
                    Company Management
                </h1>

                <p style={{ marginTop: "10px" }}>
                    Manage recruiting companies and
                    placement partners.
                </p>
            </div>

            {/* Summary Card */}

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
                        color: "#555",
                        margin: 0,
                    }}
                >
                    Total Companies
                </h3>

                <h1
                    style={{
                        color: "#ED1464",
                        marginBottom: 0,
                    }}
                >
                    {companies.length}
                </h1>
            </div>

            {/* Add Company Form */}

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "15px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        color: "#ED1464",
                    }}
                >
                    Add Company
                </h2>

                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(300px,1fr))",
                            gap: "20px",
                        }}
                    >
                        <div>
                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Website
                            </label>

                            <input
                                type="text"
                                name="website"
                                value={
                                    formData.website
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Contact Person
                            </label>

                            <input
                                type="text"
                                name="contact_person"
                                value={
                                    formData.contact_person
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>
                        <div>
        <label>Location</label>
        <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={inputStyle}
        />
    </div>
    <div
        style={{
            gridColumn: "1 / -1",
        }}
    >
        <label>Description</label>

        <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
                ...inputStyle,
                resize: "vertical",
            }}
        />
    </div>

                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: "25px",
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
                        Add Company
                    </button>
                </form>
            </div>

            {/* Company List */}

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
                        marginTop: 0,
                        color: "#ED1464",
                    }}
                >
                    Company List
                </h2>

                {companies.length === 0 ? (
                    <p>
                        No companies found.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(300px,1fr))",
                            gap: "20px",
                        }}
                    >
                        {companies.map((company) => (
    <div
        key={company.id}
        style={{
            background: "#f8f9fc",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #eee",
        }}
    >
        <h3
            style={{
                color: "#ED1464",
                marginTop: 0,
                marginBottom: "15px",
            }}
        >
            {company.name}
        </h3>

        <p>
            <strong>Location:</strong>
            <br />
            {company.location || "Not Available"}
        </p>

        <p>
            <strong>Website:</strong>
            <br />
            {company.website ? (
                <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        color: "#ED1464",
                        textDecoration: "none",
                    }}
                >
                    {company.website}
                </a>
            ) : (
                "Not Available"
            )}
        </p>

        <p>
            <strong>Contact Person:</strong>
            <br />
            {company.contact_person ||
                "Not Available"}
        </p>

        <p>
            <strong>Email:</strong>
            <br />
            {company.email || "Not Available"}
        </p>

        <p>
            <strong>Phone:</strong>
            <br />
            {company.phone || "Not Available"}
        </p>

        <p>
            <strong>Description:</strong>
            <br />
            {company.description ||
                "No Description"}
        </p>
    </div>
))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;