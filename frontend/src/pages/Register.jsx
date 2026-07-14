// src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    Users,
    Building2,
    TrendingUp,
} from "lucide-react";
import api from "../api/axios";
import AuthLayout from "../components/auth/AuthLayout";

const stats = [
    { icon: Building2, value: "100+", label: "Recruiters" },
    { icon: Users, value: "5000+", label: "Students" },
    { icon: TrendingUp, value: "95%", label: "Placement Success" },
];

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const confirmTouched = formData.confirm_password.length > 0;
    const passwordsMatch = formData.password === formData.confirm_password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (formData.password !== formData.confirm_password) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post("/auth/register/", {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            });

            setSuccessMessage("Registration successful! Redirecting you to sign in...");
            navigate("/");
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            cardClassName="au-card--wide"
            brandProps={{
                eyebrow: "Student Registration",
                subcopy:
                    "Create your student profile to discover recruiters, track applications and follow every step of your placement journey in one place.",
                stats,
            }}
        >

            <div className="au-card-head">
                <div className="au-badge">
                    <User />
                </div>

                <h2 className="au-card-title">Create Your Account</h2>
                <p className="au-card-sub">
                    Join Asquare Career Connect to get started.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

                {errorMessage && (
                    <div className="au-error" role="alert">
                        <AlertCircle />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="au-success" role="status">
                        <CheckCircle2 />
                        <span>{successMessage}</span>
                    </div>
                )}

                <div className="au-field-grid">

                    <div className="au-field">
                        <label className="au-label" htmlFor="au-first-name">
                            First Name
                        </label>

                        <div className="au-input-shell">
                            <input
                                id="au-first-name"
                                type="text"
                                name="first_name"
                                placeholder="Jordan"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                autoComplete="given-name"
                                className="au-input"
                            />
                            <User className="au-input-icon" />
                        </div>
                    </div>

                    <div className="au-field">
                        <label className="au-label" htmlFor="au-last-name">
                            Last Name
                        </label>

                        <div className="au-input-shell">
                            <input
                                id="au-last-name"
                                type="text"
                                name="last_name"
                                placeholder="Rivera"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                autoComplete="family-name"
                                className="au-input"
                            />
                            <User className="au-input-icon" />
                        </div>
                    </div>

                </div>

                <div className="au-field">
                    <label className="au-label" htmlFor="au-reg-email">
                        Email Address
                    </label>

                    <div className="au-input-shell">
                        <input
                            id="au-reg-email"
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className="au-input"
                        />
                        <Mail className="au-input-icon" />
                    </div>
                </div>

                <div className="au-field-grid">

                    <div className="au-field">
                        <label className="au-label" htmlFor="au-reg-password">
                            Password
                        </label>

                        <div className="au-input-shell">
                            <input
                                id="au-reg-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
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

                    <div className="au-field">
                        <label className="au-label" htmlFor="au-confirm-password">
                            Confirm Password
                        </label>

                        <div className="au-input-shell">
                            <input
                                id="au-confirm-password"
                                type={showConfirm ? "text" : "password"}
                                name="confirm_password"
                                placeholder="Re-enter password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                className={`au-input au-input--password ${
                                    confirmTouched ? (passwordsMatch ? "au-input--valid" : "au-input--invalid") : ""
                                }`}
                            />
                            <Lock className="au-input-icon" />

                            <button
                                type="button"
                                className="au-toggle-visibility"
                                onClick={() => setShowConfirm((v) => !v)}
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        {confirmTouched && (
                            <div className={`au-hint ${passwordsMatch ? "au-hint--match" : "au-hint--mismatch"}`}>
                                <CheckCircle2 />
                                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                            </div>
                        )}
                    </div>

                </div>

                <button type="submit" className="au-submit" disabled={isSubmitting} style={{ marginTop: 6 }}>
                    {isSubmitting && <span className="au-spinner" />}
                    {isSubmitting ? "Creating Account..." : "Register"}
                </button>

                <div className="au-switch">
                    Already have an account?
                    <Link to="/">Sign In</Link>
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

export default Register;