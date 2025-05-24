import React from "react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet"; // ✅ Adaugă acest import




const ResetPasswordSucces= () => {

const navigate = useNavigate();

return(
<div className="reset-password-succes-page">
<Helmet>
              <title>Admin Login - DevSite</title>
              <meta name="robots" content="noindex, nofollow" />
</Helmet>
<main>
<div className="reset-password-succes-page-form-div">
<div className="reset-password-succes-page-form-div-animation"></div>
<h1>Parola ta a fost resetata cu succes</h1>
<button onClick={()=> navigate("/admin-login-page")}>Log in</button>
</div>
</main>
</div>
)
}

export default ResetPasswordSucces
