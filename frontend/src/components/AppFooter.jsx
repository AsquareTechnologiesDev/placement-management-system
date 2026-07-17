import React from "react";
import logo from "../assets/logo.png";
import "./AppFooter.css";

/**
 * AppFooter
 * Reusable, lightweight footer used across every page of the Placement
 * Management System. Purely presentational — no API calls, no routing.
 *
 * Layout: 3-column CSS Grid (logo | copyright | brand + version). The
 * center column sits in the grid's "auto" track between two equal "1fr"
 * tracks, so it stays centered regardless of logo/right-content width.
 *
 * Props (all optional):
 * - version:   e.g. "v1.0.0" — shown as a small pink pill.
 * - showStack: when true, renders the "Built with React & Django" line.
 */
export default function AppFooter({ version = "v1.0.0", showStack = true }) {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        {/* ---------------- Left: logo only ---------------- */}
        <div className="app-footer__left">
          <img
            src={logo}
            alt="Asquare Technologies logo"
            className="app-footer__logo"
          />
        </div>

        {/* ---------------- Center: copyright (perfectly centered) ---------------- */}
        <div className="app-footer__center">
          <span className="app-footer__copy">
            © {year} Asquare Technologies. Placement Management System.
          </span>
          {showStack && (
            <span className="app-footer__stack">
              Built with React &amp; Django
            </span>
          )}
        </div>

        {/* ---------------- Right: brand name + version pill ---------------- */}
        <div className="app-footer__right">
          <span className="app-footer__name">Asquare Career Connect</span>
          {version ? (
            <span className="app-footer__version">{version}</span>
          ) : null}
        </div>
      </div>
    </footer>
  );
}