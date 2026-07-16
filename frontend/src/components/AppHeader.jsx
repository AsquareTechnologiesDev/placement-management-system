import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import logo from "../assets/logow.png";
import "./AppHeader.css";

/**
 * AppHeader
 * ------------------------------------------------------------------
 * Reusable application header with integrated back navigation.
 *
 * Props:
 * - actions:      Extra content rendered before logout.
 * - subtitle:     Custom subtitle.
 * - onLogoClick:  Click handler for brand.
 * - showLogout:   Show/hide logout button.
 * - onLogout:     Custom logout function.
 * - showBack:     Show/hide back arrow (default: true).
 * ------------------------------------------------------------------
 */

export default function AppHeader({
  actions,
  subtitle,
  onLogoClick,
  showLogout = true,
  onLogout,
  showBack = true,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleBrandClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        {/* ---------------- Left Section ---------------- */}
        <div className="app-header__left">
          {showBack && (
            <button
              type="button"
              className="app-header__back"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft size={20} strokeWidth={2.3} />
            </button>
          )}

          <button
            type="button"
            className="app-header__brand"
            onClick={handleBrandClick}
            aria-label="Asquare Technologies home"
          >
            <img
              src={logo}
              alt="Asquare Technologies Logo"
              className="app-header__logo"
            />

            <span className="app-header__brand-text">
              <span className="app-header__name">
                ASQUARE CAREER CONNECT
              </span>

              <span className="app-header__subtitle">
                {subtitle || "Placement Management System"}
              </span>
            </span>
          </button>
        </div>

        {/* ---------------- Right Section ---------------- */}
        <div className="app-header__actions">
          {actions}

          {showLogout && (
            <button
              type="button"
              className="app-header__logout"
              onClick={handleLogout}
            >
              <LogOut size={17} strokeWidth={2.2} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      <div
        className="app-header__divider"
        aria-hidden="true"
      />
    </header>
  );
}