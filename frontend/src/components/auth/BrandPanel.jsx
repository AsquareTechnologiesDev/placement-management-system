// src/components/auth/BrandPanel.jsx
//
// Shared left-hand brand panel used across auth screens (Login, Register, ...).
// Copy and stats are passed in as props so each page can speak to its own
// moment while keeping one consistent visual identity.

import { Sparkles } from "lucide-react";
import logow from "../../assets/logow.png";

const BrandPanel = ({
    eyebrow = "Placement Management Platform",
    headline = ["Asquare", "Career Connect"],
    subcopy,
    stats = [],
    footerText = "Building a Journey from Talent to Employment",
}) => {
    return (
        <div className="au-brand">

            <div className="au-blob au-blob--a" />
            <div className="au-blob au-blob--b" />
            <div className="au-dotgrid" />

            <div className="au-brand-logo">
                <img src={logow} alt="Asquare Technologies" />
            </div>

            <div className="au-brand-main">

                <div className="au-eyebrow">
                    <Sparkles />
                    {eyebrow}
                </div>

                <h1 className="au-headline">
                    {headline.map((line, i) => (
                        <span key={i}>
                            {line}
                            {i < headline.length - 1 && <br />}
                        </span>
                    ))}
                </h1>

                {subcopy && <p className="au-subcopy">{subcopy}</p>}

                {/* Signature element — the talent-to-employment journey path */}
                <div className="au-journey" aria-hidden="true">
                    <svg viewBox="0 0 500 90" fill="none">
                        <path
                            className="au-journey-path"
                            d="M30 45 C 150 45, 190 15, 250 45 S 390 75, 470 45"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <circle cx="30" cy="45" r="7" fill="#fff" />
                        <circle cx="250" cy="45" r="7" fill="#fff" />
                        <circle cx="470" cy="45" r="7" fill="#fff" />

                        <text x="30" y="72" textAnchor="middle" className="au-journey-label">Talent</text>
                        <text x="250" y="20" textAnchor="middle" className="au-journey-label">Opportunity</text>
                        <text x="470" y="72" textAnchor="middle" className="au-journey-label">Growth</text>
                    </svg>
                </div>

                {stats.length > 0 && (
                    <div className="au-stats">
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div className="au-stat" key={label}>
                                <div className="au-stat-icon"><Icon /></div>
                                <div>
                                    <div className="au-stat-value">{value}</div>
                                    <div className="au-stat-label">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <div className="au-brand-footer">
                {footerText}
            </div>

        </div>
    );
};

export default BrandPanel;