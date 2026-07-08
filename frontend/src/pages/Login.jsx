// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import logoo from "../assets/logoo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginResponse = await authService.login(
                email,
                password
            );

            localStorage.setItem(
                "access_token",
                loginResponse.access
            );

            const user =
                await authService.getCurrentUser();

            switch (user.role) {
                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;

                case "PLACEMENT_EXECUTIVE":
                    navigate("/placement/dashboard");
                    break;

                case "TRAINER":
                    navigate("/trainer/dashboard");
                    break;

                case "STUDENT":
                    navigate("/student/dashboard");
                    break;

                default:
                    alert("Unknown user role");
            }
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.log(error.response.data);
            }

            alert(error.message);
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                overflow: "hidden",
                background: "#ffffff",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
                    {/* ================= LEFT PANEL ================= */}
            <div
                style={{
                    flex: 1,
                    background:
                        "linear-gradient(135deg,#ED1464 0%,#C40F53 100%)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "40px 55px",
                    color: "#fff",
                    boxSizing: "border-box",
                }}
            >
                {/* Background Decoration */}
                <div
                    style={{
                        position: "absolute",
                        width: "320px",
                        height: "320px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.08)",
                        top: "-140px",
                        left: "-140px",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        width: "380px",
                        height: "380px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.05)",
                        bottom: "-170px",
                        right: "-170px",
                    }}
                />

                {/* Logo */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 2,
                    }}
                >
                    <img
                        src={logoo}
                        alt="Asquare Technologies"
                        style={{
                            width: "72%",
                            maxWidth: "360px",
                            height: "auto",
                            objectFit: "contain",
                        }}
                    />
                </div>

                {/* Brand */}
                <div
                    style={{
                        textAlign: "center",
                        zIndex: 2,
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "3.2rem",
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: "1px",
                        }}
                    >
                        ASQUARE
                    </h1>

                    <p
                        style={{
                            marginTop: "12px",
                            marginBottom: 0,
                            fontSize: "1rem",
                            letterSpacing: "9px",
                        }}
                    >
                        TECHNOLOGIES
                    </p>
                </div>

                {/* Bottom Content */}
                <div
                    style={{
                        maxWidth: "500px",
                        zIndex: 2,
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontWeight: 300,
                            fontSize: "2.3rem",
                        }}
                    >
                        Asquare
                    </h2>

                    <h2
                        style={{
                            margin: "6px 0 20px",
                            fontSize: "3.4rem",
                            fontWeight: 700,
                            lineHeight: 1.05,
                        }}
                    >
                        Career Connect
                    </h2>

                    <div
                        style={{
                            width: "90px",
                            height: "4px",
                            borderRadius: "4px",
                            background: "#fff",
                            marginBottom: "25px",
                        }}
                    />

                    <h3
                        style={{
                            margin: 0,
                            marginBottom: "18px",
                            fontSize: "1.5rem",
                            fontWeight: 600,
                        }}
                    >
                        Connecting Students to Opportunities
                    </h3>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "1.08rem",
                            lineHeight: 1.9,
                            maxWidth: "480px",
                            opacity: 0.95,
                        }}
                    >
                        Manage training, placements, recruiters,
                        assessments and student success through one
                        integrated platform built for institutions,
                        trainers and placement teams.
                    </p>
                </div>
            </div>
                        {/* ================= RIGHT PANEL ================= */}
            <div
                style={{
                    flex: 1,
                    background: "#f8f9fc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px 60px ",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        background: "#ffffff",
                        padding: "60px 45px 10px",
                        borderRadius: "18px",
                        boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
                        boxSizing: "border-box",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            textAlign: "center",
                            fontSize: "2.6rem",
                            fontWeight: "700",
                            color: "#222",
                        }}
                    >
                        Welcome Back!
                    </h1>

                    <p
                        style={{
                            marginTop: "15px",
                            marginBottom: "40px",
                            textAlign: "center",
                            color: "#666",
                            fontSize: "1.05rem",
                            lineHeight: "1.6",
                        }}
                    >
                        Sign in to continue to
                        <br />
                        <strong>Asquare Career Connect</strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: "24px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#333",
                                }}
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "16px 18px",
                                    border: "1px solid #d7d7d7",
                                    borderRadius: "10px",
                                    fontSize: "16px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: "15px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#333",
                                }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "16px 18px",
                                    border: "1px solid #d7d7d7",
                                    borderRadius: "10px",
                                    fontSize: "16px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "30px",
                            }}
                        >
                            <span
                                style={{
                                    color: "#ED1464",
                                    fontSize: "15px",
                                    cursor: "pointer",
                                }}
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "16px",
                                background:
                                    "linear-gradient(135deg,#ED1464,#C40F53)",
                                border: "none",
                                borderRadius: "10px",
                                color: "#fff",
                                fontSize: "18px",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                        >
                            Login
                        </button>

                        <div
                            style={{
                                marginTop: "35px",
                                textAlign: "center",
                                lineHeight: "1.9",
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    color: "#666",
                                    fontSize: "16px",
                                }}
                            >
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                style={{
                                    display: "inline-block",
                                    marginTop: "10px",
                                    color: "#ED1464",
                                    fontWeight: "700",
                                    fontSize: "17px",
                                    textDecoration: "none",
                                }}
                            >
                                Register
                            </Link>
                        </div>
                    </form>

                    <div
                        style={{
                            marginTop: "45px",
                            textAlign: "center",
                            color: "#999",
                            fontSize: "13px",
                        }}
                    >
                        © 2026 Asquare Technologies. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;