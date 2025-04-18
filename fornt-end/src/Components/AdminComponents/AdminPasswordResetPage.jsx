import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { useParams, useNavigate } from "react-router-dom";

const AdminPasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
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
        setResetPassword(true);
      })
      .catch((error) => {
        console.error("Eroare la fetch-ul pt resetarea parolei:", error);
      });
  };

  useEffect(() => {
    if (resetPassword) {
      navigate("https://www.devsite.cfd/admin/reset-password/succes");
    }
  }, [resetPassword, navigate]);

  return (
    <div className="admin-password-reset-page">
      <AdminHeader />
      <main>
        <div className="admin-password-reset-page-form-div">
          <h1>Resetare parolă admin</h1>
          <hr />
          <input
            onChange={(event) => setNewPassword(event.target.value)}
            type="text"
            placeholder="Parola nouă"
          />
          <div className="admin-password-reset-page-button-div">
            <button onClick={ResetPassword}>Trimite</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPasswordResetPage;
