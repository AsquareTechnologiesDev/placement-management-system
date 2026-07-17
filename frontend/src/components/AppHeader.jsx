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
 * Layout: 3-column CSS Grid (logo | title | actions). The center
 * column sits in the grid's "auto" track between two equal "1fr"
 * tracks, so the title stays mathematically centered no matter how
 * wide the logo or the action buttons are.
 *
 * Props:
 * - actions:      Extra content rendered above Logout.
 * - subtitle:     Custom subtitle.
 * - onLogoClick:  Click handler for the logo.
 * - showLogout:   Show/hide logout button.
 * - onLogout:     Custom logout function.
 * - showBack:     Show/hide back button (default: true).
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

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        {/* ---------------- Left: Logo ---------------- */}
        <div className="app-header__left">
          <button
            type="button"
            className="app-header__brand"
            onClick={handleLogoClick}
            aria-label="Asquare Technologies home"
          >
            <img
              src={logo}
              alt="Asquare Technologies Logo"
              className="app-header__logo"
            />
          </button>
        </div>

        {/* ---------------- Center: Title (mathematically centered) ---------------- */}
        <div className="app-header__center">
          <span className="app-header__name">ASQUARE CAREER CONNECT</span>
          <span className="app-header__subtitle">
            {subtitle || "Placement Management System"}
          </span>
        </div>

        {/* ---------------- Right: Stacked actions ---------------- */}
        <div className="app-header__actions">
          {actions && <div className="app-header__extra-actions">{actions}</div>}

          {showLogout && (
            <button
              type="button"
              className="app-header__nav-btn app-header__logout"
              onClick={handleLogout}
            >
              <LogOut size={16} strokeWidth={2.3} />
              <span>Logout</span>
            </button>
          )}

          {showBack && (
            <button
              type="button"
              className="app-header__nav-btn app-header__back"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft size={16} strokeWidth={2.3} />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}