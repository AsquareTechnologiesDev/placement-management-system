// src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.password !==
            formData.confirm_password
        ) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/auth/register/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        first_name:
                            formData.first_name,
                        last_name:
                            formData.last_name,
                        email:
                            formData.email,
                        password:
                            formData.password,
                    }),
                }
            );

            const data =
                await response.json();

            if (response.ok) {
                alert(
                    "Registration Successful"
                );
                navigate("/");
            } else {
                alert(
                    data.detail ||
                        "Registration Failed"
                );
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#ED1464,#c10f51)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "30px",
                fontFamily:
                    "'Segoe UI', sans-serif",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    width: "100%",
                    maxWidth: "650px",
                    borderRadius: "20px",
                    padding: "40px",
                    boxShadow:
                        "0 15px 40px rgba(0,0,0,0.15)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                    }}
                >
                    <h1
                        style={{
                            color: "#ED1464",
                            marginBottom: "10px",
                        }}
                    >
                        ASQUARE
                    </h1>

                    <h2
                        style={{
                            color: "#333",
                            marginBottom: "10px",
                        }}
                    >
                        Career Connect
                    </h2>

                    <p
                        style={{
                            color: "#777",
                        }}
                    >
                        Student Registration
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "20px",
                            marginBottom:
                                "20px",
                        }}
                    >
                        <div>
                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="first_name"
                                value={
                                    formData.first_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "12px",
                                    marginTop:
                                        "8px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "8px",
                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="last_name"
                                value={
                                    formData.last_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "12px",
                                    marginTop:
                                        "8px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "8px",
                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom:
                                "20px",
                        }}
                    >
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
                            required
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "8px",
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "8px",
                                boxSizing:
                                    "border-box",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "20px",
                            marginBottom:
                                "25px",
                        }}
                    >
                        <div>
                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "12px",
                                    marginTop:
                                        "8px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "8px",
                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                Confirm
                                Password
                            </label>

                            <input
                                type="password"
                                name="confirm_password"
                                value={
                                    formData.confirm_password
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "12px",
                                    marginTop:
                                        "8px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "8px",
                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background:
                                "#ED1464",
                            color: "#fff",
                            border: "none",
                            padding:
                                "14px",
                            borderRadius:
                                "10px",
                            fontSize:
                                "16px",
                            fontWeight:
                                "600",
                            cursor:
                                "pointer",
                        }}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;