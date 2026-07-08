import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateDrive = () => {
    const navigate = useNavigate();
    
    const [companies, setCompanies] = useState([]);
    
    const [formData, setFormData] = useState({
        company: "",
        title: "",
        description: "",
        eligibility: "",
        
        package: "",
        available_positions: "",
        openings: "",
        
        drive_datetime: "",
        registration_deadline: "",
        registration_link: "",
        
        mode: "OFFLINE",
        venue: "",
        city: "",
        state: "",
        
        coordinator_name: "",
        coordinator_email: "",
        coordinator_phone: "",
        
        notice_image: null,
        
        status: "DRAFT",
    });
    
    useEffect(() => {
        fetchCompanies();
    }, []);
    
    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies/");
            setCompanies(response.data)
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const payload = new FormData();

        Object.keys(formData).forEach((key) => {
            if (
                formData[key] !== null &&
                formData[key] !== ""
            ) {
                payload.append(key, formData[key]);
            }
        });

        // Print everything being sent
        console.log("===== Payload =====");
        for (let pair of payload.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await api.post(
            "/companies/drives/",
            payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log(response.data);

        alert("Placement Drive Created Successfully!");
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Errors:", error.response?.data);

        alert(JSON.stringify(error.response?.data));
    }
};
    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxSizing: "border-box",
        fontSize: "15px",
    };
    
    const labelStyle = {
        fontWeight: "600",
        color: "#444",
    };
    
    const sectionStyle = {
        background: "#fff",
        borderRadius: "15px",
        padding: "25px",
        marginBottom: "25px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    };
    
    return (
        <div
        style={{
            minHeight: "100vh",
            background: "#f8f9fc",
            padding: "30px",
            fontFamily: "Segoe UI",
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
        Create Placement Drive
        </h1>
        
        <p style={{ marginTop: 10 }}>
        Fill in the details below to publish a new placement drive.
        </p>
        </div>
        
        <form onSubmit={handleSubmit}>
        
        {/* Basic Information */}
        
        <div style={sectionStyle}>
        
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Basic Information
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
        <label style={labelStyle}>
        Company
        </label>
        
        <select
        name="company"
        value={formData.company}
        onChange={handleChange}
        style={inputStyle}
        required
        >
        <option value="">
        Select Company
        </option>
        
        {companies.map((company) => (
            <option
            key={company.id}
            value={company.id}
            >
            {company.name}
            </option>
        ))}
        </select>
        </div>
        
        <div>
        <label style={labelStyle}>
        Drive Title
        </label>
        
        <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Eg. TCS Digital Hiring 2026"
        required
        />
        </div>
        
        </div>
        
        <br />
        
        <div>
        <label style={labelStyle}>
        Description
        </label>
        
        <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="5"
        style={inputStyle}
        />
        </div>
        
        <br />
        
        <div>
        <label style={labelStyle}>
        Eligibility
        </label>
        
        <textarea
        name="eligibility"
        value={formData.eligibility}
        onChange={handleChange}
        rows="4"
        style={inputStyle}
        />
        </div>
        
        </div>
        
        {/* Job Details */}
        
        <div style={sectionStyle}>
        
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Job Details
        </h2>
        
        <div
        style={{
            display: "grid",
            gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
        }}
        >
        
        <div>
        <label style={labelStyle}>
        Package
        </label>
        
        <input
        type="text"
        name="package"
        value={formData.package}
        onChange={handleChange}
        placeholder="Eg. ₹7 LPA"
        style={inputStyle}
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        Available Positions
        </label>
        
        <input
        type="text"
        name="available_positions"
        value={formData.available_positions}
        onChange={handleChange}
        placeholder="Python Developer, QA Engineer"
        style={inputStyle}
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        Number of Openings
        </label>
        
        <input
        type="number"
        name="openings"
        value={formData.openings}
        onChange={handleChange}
        style={inputStyle}
        />
        </div>
        
        </div>
        
        </div>
        {/* Drive Schedule */}
        
        <div style={sectionStyle}>
        
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Drive Schedule
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
        <label style={labelStyle}>
        Drive Date & Time
        </label>
        
        <input
        type="datetime-local"
        name="drive_datetime"
        value={formData.drive_datetime}
        onChange={handleChange}
        style={inputStyle}
        required
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        Registration Deadline
        </label>
        
        <input
        type="datetime-local"
        name="registration_deadline"
        value={
            formData.registration_deadline
        }
        onChange={handleChange}
        style={inputStyle}
        required
        />
        </div>
        </div>
        
        <br />
        
        <div>
        <label style={labelStyle}>
        Registration Link
        </label>
        
        <input
        type="url"
        name="registration_link"
        value={formData.registration_link}
        onChange={handleChange}
        placeholder="https://"
        style={inputStyle}
        />
        </div>
        
        </div>
        
        {/* Venue Details */}
        
        <div style={sectionStyle}>
        
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Venue Details
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
        <label style={labelStyle}>
    Mode
</label>

<select
    name="mode"
    value={formData.mode}
    onChange={handleChange}
    style={inputStyle}
>
    <option value="OFFLINE">
        Offline
    </option>

    <option value="ONLINE">
        Online
    </option>

    <option value="HYBRID">
        Hybrid
    </option>
</select>
        </div>
        
        <div>
        <label style={labelStyle}>
        Venue
        </label>
        
        <input
        type="text"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Venue Name"
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        City
        </label>
        
        <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        style={inputStyle}
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        State
        </label>
        
        <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        style={inputStyle}
        />
        </div>
        </div>
        
        </div>
        
        {/* Coordinator Details */}
        
        <div style={sectionStyle}>
        
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Coordinator Details
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
        <label style={labelStyle}>
        Coordinator Name
        </label>
        
        <input
        type="text"
        name="coordinator_name"
        value={
            formData.coordinator_name
        }
        onChange={handleChange}
        style={inputStyle}
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        Coordinator Email
        </label>
        
        <input
        type="email"
        name="coordinator_email"
        value={
            formData.coordinator_email
        }
        onChange={handleChange}
        style={inputStyle}
        />
        </div>
        
        <div>
        <label style={labelStyle}>
        Coordinator Phone
        </label>
        
        <input
        type="text"
        name="coordinator_phone"
        value={
            formData.coordinator_phone
        }
        onChange={handleChange}
        style={inputStyle}
        />
        </div>
        
        </div>
        
        </div>
        {/* Notice */}
        
        <div style={sectionStyle}>
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Notice
        </h2>
        
        <label style={labelStyle}>
        Upload Notice Image
        </label>
        
        <input
        type="file"
        name="notice_image"
        accept="image/*,.pdf"
        onChange={handleChange}
        style={{
            marginTop: "12px",
        }}
        />
        </div>
        
        {/* Status */}
        
        <div style={sectionStyle}>
        <h2
        style={{
            color: "#ED1464",
            marginTop: 0,
        }}
        >
        Status
        </h2>
        
        <div
        style={{
            display: "flex",
            gap: "25px",
            marginTop: "15px",
        }}
        >
        <label>
    <input
        type="radio"
        name="status"
        value="DRAFT"
        checked={formData.status === "DRAFT"}
        onChange={handleChange}
    />

    {" "}Draft
</label>

<label>
    <input
        type="radio"
        name="status"
        value="PUBLISHED"
        checked={formData.status === "PUBLISHED"}
        onChange={handleChange}
    />

    {" "}Published
</label>

<label>
    <input
        type="radio"
        name="status"
        value="CLOSED"
        checked={formData.status === "CLOSED"}
        onChange={handleChange}
    />

    {" "}Closed
</label>
        </div>
        </div>
        
        {/* Buttons */}
        
        <div
        style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginBottom: "40px",
        }}
        >
        <button
        type="button"
        onClick={() =>
            navigate(
                "/placement/drives"
            )
        }
        style={{
            padding:
            "12px 25px",
            border:
            "1px solid #ED1464",
            background:
            "#fff",
            color:
            "#ED1464",
            borderRadius:
            "8px",
            cursor:
            "pointer",
            fontWeight:
            "600",
        }}
        >
        Cancel
        </button>
        
        <button
        type="submit"
        style={{
            padding:
            "12px 30px",
            border: "none",
            background:
            "#ED1464",
            color: "#fff",
            borderRadius:
            "8px",
            cursor:
            "pointer",
            fontWeight:
            "600",
        }}
        >
        Publish Drive
        </button>
        </div>
        
        </form>
        </div>
    );
};

export default CreateDrive;