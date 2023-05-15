import React, { useState } from "react";
import { AuthPageContext } from "../../context/AuthPageContext";
import Login from "./Login";
import Register from "./Register";
import RegisterMobile from "./RegisterMobile";
import ForgotPassword from "./ForgotPassword";
import LoginMobile from "./LoginMobile";

function AuthPages() {
  const [page, setPage] = useState("login");

  return (
    <AuthPageContext.Provider value={[page, setPage]}>
      {page === "login" && <Login />}
      {page === "login-mobile" && <LoginMobile />}
      {page === "register" && <Register />}
      {page === "register-mobile" && <RegisterMobile />}
      {page === "forgot-password" && <ForgotPassword />}
    </AuthPageContext.Provider>
  );
}

export default AuthPages;
