import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./UserComponents/Homepage.jsx";
import LogInPage from "./UserComponents/LogIn.jsx";

const TelefoanePage = React.lazy(() => import("./UserComponents/TelefoanePage.jsx"));
const UserCartPage = React.lazy(() => import("./UserComponents/UserCartPage.jsx"));
const CheckOutPage = React.lazy(() => import("./UserComponents/CheckoutPage.jsx"));
const AccountDetails = React.lazy(() => import("./UserComponents/Account-details.jsx"));
const ProductPage = React.lazy(() => import("./UserComponents/ProductPage.jsx"));
const SuccesPage = React.lazy(() => import("./UserComponents/SuccesPaymentPage.jsx"));
const SearchResultPage = React.lazy(() => import("./UserComponents/SearchResultPage.jsx"));
const MainPage = React.lazy(() => import("./AdminComponents/MainPage.jsx"));
const AdminLoginPage = React.lazy(() => import("./AdminComponents/AdminLogInPage.jsx"));
const ResetPasswordSucces = React.lazy(() => import("./AdminComponents/ResetPasswordSucces.jsx"));
const DynamicCategoryPage = React.lazy(() => import("./UserComponents/DynamicCategoryPage.jsx"));
const AdminPasswordRessetPage = React.lazy(() => import("./AdminComponents/AdminPasswordRessetPage.jsx"));
const ApprovalReviewsPage = React.lazy(() => import("./AdminComponents/ApprovalReviewsPage.jsx"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Se încarcă pagina...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/telefoane" element={<TelefoanePage />} />
          <Route path="/cart" element={<UserCartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/account-details" element={<AccountDetails />} />
          <Route path="/products/:name" element={<ProductPage />} />
          <Route path="/succes_payment" element={<SuccesPage />} />
          <Route path="/search-result/:text" element={<SearchResultPage />} />
          <Route path="/admin-panel" element={<MainPage />} />
          <Route path="/admin-login-page" element={<AdminLoginPage />} />
          <Route path="/admin/reset-password/:resetToken" element={<AdminPasswordRessetPage />} />
          <Route path="/admin/reset-password/succes" element={<ResetPasswordSucces />} />
          <Route path="/product-category/:category" element={<DynamicCategoryPage />} />
          <Route path="/admin/reviews-approval" element={<ApprovalReviewsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
