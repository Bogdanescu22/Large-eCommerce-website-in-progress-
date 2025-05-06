import React from "react";
import HomePage from "./UserComponents/Homepage.jsx";
import { BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import LogInPage from "./UserComponents/LogIn.jsx";
import TelefoanePage from "./UserComponents/TelefoanePage.jsx";
import UserCartPage from "./UserComponents/UserCartPage.jsx";
import CheckOutPage from "./UserComponents/CheckoutPage.jsx";
import AccountDetails from "./UserComponents/Account-details.jsx";
import ProductPage from "./UserComponents/ProductPage.jsx";
import SuccesPage from "./UserComponents/SuccesPaymentPage.jsx";
import SearchResultPage from "./UserComponents/SearchResultPage.jsx";
import MainPage from "./AdminComponents/MainPage.jsx";
import AdminLoginPage from "./AdminComponents/AdminLogInPage.jsx";
import ResetPasswordSucces from "./AdminComponents/ResetPasswordSucces.jsx";
import DynamicCategoryPage from "./UserComponents/DynamicCategoryPage.jsx";
import AdminPasswordRessetPage from "./AdminComponents/AdminPasswordRessetPage.jsx";
import ApprovalReviewsPage from "./AdminComponents/ApprovalReviewsPage.jsx";

function App() {
  return (
    <Router>
      <div>
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
          <Route path="/admin-panel" element={<MainPage/>} />
          <Route path="/admin-login-page" element={<AdminLoginPage />} />
          <Route path="/admin/reset-password/:resetToken" element={<AdminPasswordRessetPage />} />
          <Route path="/admin/reset-password/succes" element={<ResetPasswordSucces />} />
          <Route path="/product-category/:category" element={<DynamicCategoryPage />} />
          <Route path="/admin/approval-reviews" element={<ApprovalReviewsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
