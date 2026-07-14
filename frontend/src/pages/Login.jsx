// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Users,
    Building2,
    TrendingUp,
    AlertCircle,
} from "lucide-react";
import authService from "../services/authService";
import AuthLayout from "../components/auth/AuthLayout";

const stats = [
    { icon: Building2, value: "100+", label: "Recruiters" },
    { icon: Users, value: "5000+", label: "Students" },
    { icon: TrendingUp, value: "95%", label: "Placement Success" },
];

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

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
                    setErrorMessage("We couldn't determine your account role. Please contact support.");
            }
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.log(error.response.data);
            }

            setErrorMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            brandProps={{
                subcopy:
                    "A complete Placement Management Platform designed to connect students, institutions, recruiters and placement officers through one modern digital ecosystem.",
                stats,
            }}
        >

            <div className="au-card-head">
                <div className="au-badge">
                    <Lock />
                </div>

                <h2 className="au-card-title">Welcome Back</h2>
                <p className="au-card-sub">
                    Sign in to continue managing placements,
                    recruiters and students.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

                {errorMessage && (
                    <div className="au-error" role="alert">
                        <AlertCircle />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="au-field">
                    <label className="au-label" htmlFor="au-email">
                        Email Address
                    </label>

                    <div className="au-input-shell">
                        <input
                            id="au-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="au-input"
                        />
                        <Mail className="au-input-icon" />
                    </div>
                </div>

                <div className="au-field">
                    <label className="au-label" htmlFor="au-password">
                        Password
                    </label>

                    <div className="au-input-shell">
                        <input
                            id="au-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="au-input au-input--password"
                        />
                        <Lock className="au-input-icon" />

                        <button
                            type="button"
                            className="au-toggle-visibility"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                </div>

                <div className="au-row">
                    <label className="au-remember">
                        <input
                            type="checkbox"
                            className="au-checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        Remember me
                    </label>

                    <button type="button" className="au-forgot">
                        Forgot Password?
                    </button>
                </div>

                <button type="submit" className="au-submit" disabled={isSubmitting}>
                    {isSubmitting && <span className="au-spinner" />}
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

                <div className="au-switch">
                    Don't have an account?
                    <Link to="/register">Register</Link>
                </div>

            </form>

            <div className="au-card-footer">
                <div className="au-hr" />
                <p className="au-fineprint">
                    © {new Date().getFullYear()} Asquare Technologies.
                    <br />
                    Building a Journey from Talent to Employment.
                </p>
            </div>

        </AuthLayout>
    );
};

export default Login;