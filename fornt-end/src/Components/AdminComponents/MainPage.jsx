import React,{useEffect, useState} from "react";
import AdminHeader from "./AdminHeader";
import { Helmet } from "react-helmet"; // ✅ Adaugă acest import


const MainPage = () => {



return(
<div className="admin-main-page">
<Helmet>
              <title>Admin Login - DevSite</title>
              <meta name="robots" content="noindex, nofollow" />
            </Helmet>
<AdminHeader />
<AdminHeader />
<main className="admin-main-panel-page">
<div>
<h2>Gestionare produse</h2>
<hr />
<h2>Gestionare comenzi</h2>
<hr />
<h2 onClick={() => {window.location.href="/admin/reviews-approval"}}>Gestionare reviews</h2>
</div>
</main>
</div>
)
}

export default MainPage