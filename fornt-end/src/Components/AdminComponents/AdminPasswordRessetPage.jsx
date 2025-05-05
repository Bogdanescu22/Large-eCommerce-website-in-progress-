import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import { useParams, useNavigate } from "react-router-dom";

const AdminPasswordRessetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const ResetPassword = () => {
    fetch(`https://api.devsite.cfd/admin/reset-password/${resetToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/admin/reset-password/succes");
      })
      .catch((error) => {
        console.error("Eroare la fetch-ul pentru resetarea parolei:", error);
      });
  };

  return (
    <div className="admin-password-reset-page">
      <AdminHeader />
      <main>
        <div className="admin-password-reset-page-form-div">
          <h1>Resetare parolă admin</h1>
          <hr />
          <input
            onChange={(event) => setNewPassword(event.target.value)}
            type="password"
            placeholder="Parola nouă"
          />
          <div className="admin-password-reset-page-button-div">
            <button type="button" onClick={ResetPassword}>
              Trimite
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPasswordRessetPage;