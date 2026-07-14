import React from "react";
import logo from "../assets/logo.png";
import "./AppFooter.css";

/**
 * AppFooter
 * Reusable, lightweight footer used across every page of the Placement
 * Management System. Purely presentational — no API calls, no routing.
 *
 * Props (all optional):
 * - version:   e.g. "v1.4.0" — shown as a small pill if provided.
 * - showStack: when true, renders the "Built with React & Django" line.
 */
export default function AppFooter({ version, showStack = true }) {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <img
            src={logo}
            alt="Asquare Technologies logo"
            className="app-footer__logo"
          />
          <span className="app-footer__name">Asquare Career Connect</span>
        </div>

        <div className="app-footer__meta">
          <span className="app-footer__copy">
            © {year} Asquare Technologies. Placement Management System.
          </span>
          {showStack && (
            <span className="app-footer__stack">
              Built with React &amp; Django
            </span>
          )}
        </div>

        {version ? (
          <span className="app-footer__version">{version}</span>
        ) : null}
      </div>
    </footer>
  );
}