import React, {useState,useEffect} from "react";
import AdminHeader from "./AdminHeader";
import { useParams } from "react-router";

const AdminPasswordResetPage = () => {

const[newPassword, setNewPassword] = useState("")

const {token} = useParams();

const ResetPassword = () => {
fetch(`http://localhost:5000/admin/reset-password/${token}`, {credentials: "include",
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({
newPassword
})
})
.catch((error)=> console.error("Eroare la fetch-ul pt resetarea parolei:", error))
}

return(
<div className="admin-password-reset-page">
<AdminHeader/>
<main>
<div className="admin-password-reset-page-form-div">
<h1>Resetare parola admin</h1>
<hr />
<input onChange={(event)=> setNewPassword(event.target.value)}type="text" placeholder="Parola noua"></input>
<button onClick={()=>ResetPassword()}>Trimite</button>
</div>
</main>
</div>
)
}

export default AdminPasswordResetPage