import React from "react";
import { useNavigate } from "react-router";



const ResetPasswordSucces= () => {

const navigate = useNavigate();

return(
<div className="reset-password-succes-page">
<main>
<div className="reset-password-succes-page-form-div">
<div className="reset-password-succes-page-form-div-animation"></div>
<h1>Parola ta a fost resetata cu succes</h1>
<button onClick={()=> navigate("http://localhost:3000/admin-login-page")}>Log in</button>
</div>
</main>
</div>
)
}

export default ResetPasswordSucces
