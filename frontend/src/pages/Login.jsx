// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import authService from "../services/authService";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Login
            const loginResponse = await authService.login(
                email,
                password
            );

            console.log(
                "Login Response:",
                loginResponse
            );

            // Save Access Token
            localStorage.setItem(
                "access_token",
                loginResponse.access
            );

            // Step 2: Get Current User
            const user =
                await authService.getCurrentUser();

            console.log(
                "Current User:",
                user
            );

            // Step 3 & 4: Navigate based on role
            if (user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (
                user.role ===
                "PLACEMENT_EXECUTIVE"
            ) {
                navigate(
                    "/placement/dashboard"
                );
            } else if (
                user.role === "TRAINER"
            ) {
                navigate(
                    "/trainer/dashboard"
                );
            } else if (
                user.role === "STUDENT"
            ) {
                navigate(
                    "/student/dashboard"
                );
            }
        } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.response) {
        console.log(error.response.data);
    }

    alert(error.message);
}

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                fontFamily:
                    "'Segoe UI', sans-serif",
                backgroundColor: "#ffffff",
            }}
        >
            {/* LEFT PANEL */}
            <div
                style={{
                    flex: 1,
                    background:
                        "linear-gradient(135deg, #ED1464, #c40f53)",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "70px",
                }}
            >
                <h1
                    style={{
                        fontSize: "4rem",
                        fontWeight: "700",
                        marginBottom: "0",
                    }}
                >
                    ASQUARE
                </h1>

                <p
                    style={{
                        letterSpacing: "8px",
                        marginTop: "5px",
                        fontSize: "1rem",
                    }}
                >
                    TECHNOLOGIES
                </p>

                <div
                    style={{
                        marginTop: "60px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "3rem",
                            fontWeight: "300",
                            marginBottom: "10px",
                        }}
                    >
                        Asquare
                    </h2>

                    <h2
                        style={{
                            fontSize: "4rem",
                            fontWeight: "700",
                            marginTop: "0",
                        }}
                    >
                        Career Connect
                    </h2>

                    <div
                        style={{
                            width: "120px",
                            height: "4px",
                            background:
                                "#ffffff",
                            marginTop: "20px",
                            marginBottom:
                                "30px",
                        }}
                    />

                    <h3
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        Connecting Students to
                        Opportunities
                    </h3>

                    <p
                        style={{
                            maxWidth: "500px",
                            fontSize: "1.1rem",
                            lineHeight: "1.8",
                        }}
                    >
                        Manage training,
                        placements,
                        recruiters, and
                        student success from
                        one platform.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems: "center",
                    backgroundColor:
                        "#ffffff",
                }}
            >
                <div
                    style={{
                        width: "450px",
                    }}
                >
                    <h1
                        style={{
                            textAlign: "center",
                            color: "#222",
                            marginBottom:
                                "10px",
                        }}
                    >
                        Welcome Back!
                    </h1>

                    <p
                        style={{
                            textAlign: "center",
                            color: "#777",
                            marginBottom:
                                "40px",
                        }}
                    >
                        Sign in to continue to
                        Asquare Career Connect
                    </p>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >
                        {/* EMAIL */}
                        <div
                            style={{
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <label
                                style={{
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={
                                    email
                                }
                                onChange={(
                                    e
                                ) =>
                                    setEmail(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                required
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "15px",
                                    marginTop:
                                        "8px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "10px",
                                    fontSize:
                                        "16px",
                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div
                            style={{
                                marginBottom:
                                    "15px",
                            }}
                        >
                            <label
                                style={{
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={
                                    password
                                }
                                onChange={(
                                    e
                                ) =>
                                    setPassword(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                required
                                style={{
                                    width:
                                        "100%",
                                    padding:
                                        "15px",
                                    marginTop:
                                        "8px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "10px",
                                    fontSize:
                                        "16px",
                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                textAlign:
                                    "right",
                                marginBottom:
                                    "25px",
                            }}
                        >
                            <span
                                style={{
                                    color:
                                        "#ED1464",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                Forgot Password?
                            </span>
                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding:
                                    "15px",
                                background:
                                    "#ED1464",
                                color:
                                    "#ffffff",
                                border:
                                    "none",
                                borderRadius:
                                    "10px",
                                fontSize:
                                    "18px",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer",
                            }}
                        >
                            Login
                        </button>

                        <div
                            style={{
                                textAlign:
                                    "center",
                                marginTop:
                                    "30px",
                            }}
                        >
                            <p
                                style={{
                                    color:
                                        "#666",
                                }}
                            >
                                Don't have an
                                account?
                            </p>

                            <Link
                                to="/register"
                                style={{
                                    color:
                                        "#ED1464",
                                    textDecoration:
                                        "none",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Register
                            </Link>
                        </div>
                    </form>

                    <p
                        style={{
                            textAlign:
                                "center",
                            marginTop:
                                "60px",
                            color: "#999",
                            fontSize:
                                "14px",
                        }}
                    >
                        © 2026 Asquare
                        Technologies. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;