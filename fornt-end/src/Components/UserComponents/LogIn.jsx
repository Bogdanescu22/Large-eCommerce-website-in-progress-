import React from "react";
import Header from "../UserComponents/Header.jsx";

function LogInPage() {
  function pressGoogle() {
    window.location.href = "https://api.devsite.cfd/auth/google";
  }

  function pressFacebook() {
    window.location.href = "https://api.devsite.cfd/auth/facebook";
  }

  return (
    <>
      <Header />
      <div
        className="login-page"
        style={{
          backgroundColor: "#ebebeb",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="login-container"
          style={{
            background: "white",
            padding: "100px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            height: "300px",
            width: "300px",
          }}
        >
          <h1
            style={{
              fontSize: "50px",
            }}
          >
            DevSite
          </h1>
          <hr
            style={{
              margin: "20px 0",
              height: "1px",
              backgroundColor: "#78a481",
            }}
          />
          <button
            className="facebookButton"
            style={{
              backgroundColor: "#78a481",
              cursor: "pointer",
              color: "white",
              padding: "20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "19px",
              margin: "10px 0",
              marginTop: "40px",
            }}
            onClick={pressFacebook}
          >
            Conectează-te cu Facebook
          </button>
          <button
            className="googleButton"
            style={{
              backgroundColor: "#ff4d67",
              cursor: "pointer",
              color: "white",
              padding: "20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "19px",
              margin: "10px 0",
            }}
            onClick={pressGoogle}
          >
            Conectează-te cu Google
          </button>
        </div>
      </div>
    </>
  );
}

export default LogInPage;
