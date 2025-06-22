import * as React from "react";
import "../styles.css";
import { Slice } from "gatsby";
import "./page-consistency.css";
import "./global-fixes.css";
// import CookieConsent from "react-cookie-consent";
// import CookieConsent, { Cookies } from "react-cookie-consent";


const Layout = ({ children }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      {/* Header */}
      <Slice alias="header" />

      {/* Main Content */}
      <main style={{ 
        margin: "0 auto", 
        padding: "20px", 
        maxWidth: "1200px",
        position: "relative",
        zIndex: "1" 
      }}>
        {children}
      </main>

      {/* Footer */}
      <Slice alias="footer" />

      {/* Cookie Consent */}
      {/* <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="gatsby-gdpr-google-analytics"
        style={{
          background: "#2c3e50",
          color: "#ecf0f1",
          padding: "15px 30px",
          fontSize: "14px",
          borderTop: "2px solid #2980b9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        buttonStyle={{
          background: "#27ae60",
          color: "#ffffff",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
        declineButtonStyle={{
          background: "#e74c3c",
          color: "#ffffff",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
        buttonClasses="consent-button"
        declineButtonClasses="decline-button"
        overlay
      >
        <div style={{ flex: "1" }}>
          <h4 style={{ margin: "0 0 5px", fontSize: "16px" }}>
            We Value Your Privacy 🍪
          </h4>
          <p style={{ margin: 0 }}>
            This site uses cookies to enhance your experience. By clicking
            "Accept," you agree to our use of cookies.
          </p>
        </div>
      </CookieConsent> */}
    </div>
  );
};

export default Layout;
