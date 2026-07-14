import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../assets/logow.png";
import "./AppHeader.css";

/**
 * AppHeader
 * Reusable, sticky application header used across every page of the
 * Placement Management System. Purely presentational — it does not touch
 * API calls or business logic. Drop it at the top of any page or inside
 * a shared <Layout /> wrapper.
 *
 * Props (all optional — safe to use as <AppHeader /> with no props):
 * - actions:      extra node rendered on the right side, before the
 *                 logout button (e.g. nav links, user menu).
 * - subtitle:     overrides the default "Placement Management System" line.
 * - onLogoClick:  handler fired when the logo/brand block is clicked
 *                 (e.g. navigate("/dashboard")). Left undefined = no-op.
 * - showLogout:   set false to hide the built-in logout button entirely
 *                 (default true).
 * - onLogout:     custom logout handler. If omitted, the default handler
 *                 clears "token"/"authToken" from localStorage and
 *                 redirects to "/" — override this if your app stores
 *                 auth differently or needs an API call first.
 */
export default function AppHeader({
  actions,
  subtitle,
  onLogoClick,
  showLogout = true,
  onLogout,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <button
          type="button"
          className="app-header__brand"
          onClick={onLogoClick}
          aria-label="Asquare Technologies home"
        >
          <img
            src={logo}
            alt="Asquare Technologies logo"
            className="app-header__logo"
          />
          <span className="app-header__brand-text">
            <span className="app-header__name">ASQUARE CAREER CONNECT</span>
            <span className="app-header__subtitle">
              {subtitle || "Placement Management System"}
            </span>
          </span>
        </button>

        <div className="app-header__actions">
          {actions}
          {showLogout && (
            <button
              type="button"
              className="app-header__logout"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
      <div className="app-header__divider" aria-hidden="true" />
    </header>
  );
}