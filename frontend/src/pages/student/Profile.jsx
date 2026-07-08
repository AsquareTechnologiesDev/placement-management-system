// src/pages/student/Profile.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";

const Profile = () => {
    const [status, setStatus] = useState("DRAFT");

    const [formData, setFormData] = useState({
        student_name: "",
        phone: "",
        address: "",
        qualification: "",
        passout_year: "",
        skills: "",
        trainer: "",
        resume: null,
    });

    const [trainers, setTrainers] = useState([]);

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        fetchProfile();
        fetchTrainers();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/student/profile/");

const data = response.data;

setStatus(data.status || "DRAFT");

setFormData((prev) => ({
            ...prev,
            student_name: data.student_name || "",
            phone: data.phone || "",
            address: data.address || "",
            qualification: data.qualification || "",
            passout_year: data.passout_year || "",
            skills: data.skills || "",
            trainer: data.trainer || "",
        }));
        } catch (error) {
            console.error(
                "Profile Error:",
                error
            );
        }
    };

    const fetchTrainers = async () => {
    try {
        const { data } = await api.get("/student/trainers/");
        setTrainers(data);
    } catch (error) {
        console.error("Trainer Error:", error);
    }
};
    const handleChange = (e) => {
        const { name, value, files } =
            e.target;

        setFormData({
            ...formData,
            [name]: files
                ? files[0]
                : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload =
                new FormData();

            payload.append(
                "student_name",
                formData.student_name
            );

            payload.append(
                "phone",
                formData.phone
            );

            payload.append(
                "address",
                formData.address
            );

            payload.append(
                "qualification",
                formData.qualification
            );

            payload.append(
                "passout_year",
                formData.passout_year
            );

            payload.append(
                "skills",
                formData.skills
            );

            payload.append(
                "trainer",
                formData.trainer
            );

            if (formData.resume) {
                payload.append(
                    "resume",
                    formData.resume
                );
            }

            const response = await api.post(
        "/student/profile/",
        payload
    );

    const data = response.data;

            

            setStatus(
                data.status ||
                    "PENDING"
            );

            alert(
                "Profile submitted successfully"
            );
        } catch (error) {
            console.error(
                "Save Error:",
                error
            );
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        border:
            "1px solid #ddd",
        borderRadius: "8px",
        boxSizing:
            "border-box",
        fontSize: "14px",
    };

    const textareaStyle = {
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        border:
            "1px solid #ddd",
        borderRadius: "8px",
        minHeight: "100px",
        boxSizing:
            "border-box",
        fontSize: "14px",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "#f8f9fc",
                padding: "30px",
                fontFamily:
                    "'Segoe UI', sans-serif",
            }}
        >
            {/* Header */}

            <div
                style={{
                    background:
                        "#ED1464",
                    color: "#fff",
                    padding: "25px",
                    borderRadius:
                        "15px",
                    marginBottom:
                        "25px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                    }}
                >
                    Student Profile
                </h1>

                <p
                    style={{
                        marginTop:
                            "10px",
                    }}
                >
                    Complete your
                    profile to
                    participate in
                    placement
                    activities.
                </p>
            </div>

            {/* Status */}

            <div
                style={{
                    background:
                        "#fff",
                    padding: "20px",
                    borderRadius:
                        "15px",
                    marginBottom:
                        "25px",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        color:
                            "#555",
                    }}
                >
                    Profile Status
                </h3>

                <div
                    style={{
                        display:
                            "inline-block",
                        marginTop:
                            "10px",
                        background:
                            "#ffe3ef",
                        color:
                            "#ED1464",
                        padding:
                            "8px 15px",
                        borderRadius:
                            "20px",
                        fontWeight:
                            "600",
                    }}
                >
                    {status}
                </div>
            </div>

            {/* Form */}

            <form
                onSubmit={
                    handleSubmit
                }
            >
                <div
                    style={{
                        background:
                            "#fff",
                        padding:
                            "30px",
                        borderRadius:
                            "15px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(300px,1fr))",
                            gap: "20px",
                        }}
                    >
                        <div>
                            <label>
                                Student
                                Name
                            </label>

                            <input
                                type="text"
                                name="student_name"
                                value={
                                    formData.student_name
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
                                Phone
                            </label>

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
                            <label>
                                Qualification
                            </label>

                            <input
                                type="text"
                                name="qualification"
                                value={
                                    formData.qualification
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
                                Passout
                                Year
                            </label>

                            <input
                                type="number"
                                name="passout_year"
                                value={
                                    formData.passout_year
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
                                Trainer
                            </label>

                            <select
                                name="trainer"
                                value={
                                    formData.trainer
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            >
                                <option value="">
                                    Select
                                    Trainer
                                </option>

                                {Array.isArray(
                                    trainers
                                ) &&
                                    trainers.map(
                                        (
                                            trainer
                                        ) => (
                                            <option
                                                key={
                                                    trainer.id
                                                }
                                                value={
                                                    trainer.id
                                                }
                                            >
                                                {
                                                    trainer.name
                                                }
                                            </option>
                                        )
                                    )}
                            </select>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop:
                                "20px",
                        }}
                    >
                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                            style={
                                textareaStyle
                            }
                        />
                    </div>

                    <div
                        style={{
                            marginTop:
                                "20px",
                        }}
                    >
                        <label>
                            Skills
                        </label>

                        <textarea
                            name="skills"
                            value={
                                formData.skills
                            }
                            onChange={
                                handleChange
                            }
                            style={
                                textareaStyle
                            }
                            placeholder="Python, Django, React..."
                        />
                    </div>

                    <div
                        style={{
                            marginTop:
                                "20px",
                        }}
                    >
                        <label>
                            Resume
                        </label>

                        <br />

                        <input
                            type="file"
                            name="resume"
                            onChange={
                                handleChange
                            }
                            style={{
                                marginTop:
                                    "10px",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginTop:
                                "30px",
                        }}
                    >
                        <button
                            type="submit"
                            style={{
                                background:
                                    "#ED1464",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                padding:
                                    "12px 30px",
                                borderRadius:
                                    "8px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "600",
                                fontSize:
                                    "15px",
                            }}
                        >
                            Submit
                            Profile
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;