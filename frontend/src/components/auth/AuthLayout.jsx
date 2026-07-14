// src/components/auth/AuthLayout.jsx
//
// Shared shell for auth screens: brand panel on the left, a glass card
// slot on the right. Keeps Login/Register/etc. visually consistent while
// each page only supplies its own form content.

import BrandPanel from "./BrandPanel";
import "./AuthLayout.css";

const AuthLayout = ({ brandProps, cardClassName = "", children }) => {
    return (
        <div className="au-root">

            <BrandPanel {...brandProps} />

            <div className="au-panel">
                <div className="au-panel-blob--a" />
                <div className="au-panel-blob--b" />

                <div className={`au-card ${cardClassName}`.trim()}>
                    {children}
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;