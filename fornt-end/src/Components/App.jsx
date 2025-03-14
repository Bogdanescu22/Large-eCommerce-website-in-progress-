import React from "react";
import HomePage from "./UserComponents/Homepage";
import { BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import LogInPage from "./UserComponents/LogIn";
import TelefoanePage from "./UserComponents/TelefoanePage";
import UserCartPage from "./UserComponents/UserCartPage";
import CheckOutPage from "./UserComponents/CheckoutPage";
import AccountDetails from "./UserComponents/Account-details";
import ProductPage from "./UserComponents/ProductPage";
import SuccesPage from "./UserComponents/SuccesPaymentPage";
import SearchResultPage from "./UserComponents/SearchResultPage";
import MainPage from "./AdminComponents/MainPage";
import AdminLoginPage from "./AdminComponents/AdminLogInPage";
import AdminPasswordResetPage from "./AdminComponents/AdminPasswordResetPage";
import ResetPasswordSucces from "./AdminComponents/ResetPasswordSucces";

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
          <Route path="/admin/reset-password/:token" element={<AdminPasswordResetPage />} />
          <Route path="/admin/reset-password/succes" element={<ResetPasswordSucces />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
