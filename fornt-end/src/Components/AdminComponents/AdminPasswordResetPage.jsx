import React, {useState,useEffect} from "react";
import AdminHeader from "./AdminHeader";
import { useParams } from "react-router";

const AdminPasswordResetPage = () => {

const[newPassword, setNewPassword] = useState("")

const {resetToken} = useParams();

console.log("Token:", resetToken)

const ResetPassword = () => {
    fetch(`https://api.devsite.cfd/admin/reset-password-token/${resetToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
      credentials: "include" // doar dacă ai nevoie de cookie-uri
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Eroare la resetarea parolei");
        }
        return res.json(); // 🟢 Important: returnăm data
      })
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      })
      .catch((error) =>
        console.error("Eroare la fetch-ul pt resetarea parolei:", error)
      );
  };
  

return(
<div className="admin-password-reset-page">
<AdminHeader/>
<main>
<div className="admin-password-reset-page-form-div">
<h1>Resetare parola admin</h1>
<hr />
<input onChange={(event)=> setNewPassword(event.target.value)}type="text" placeholder="Parola noua"></input>
<div className="admin-password-reset-page-button-div"><button onClick={()=>ResetPassword()}>Trimite</button></div>
</div>
</main>
</div>
)
}

export default AdminPasswordResetPage
