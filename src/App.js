import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useContext, useLayoutEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import ForgotPassword from "./pages/User/ForgotPassword";
import SetNewPassword from "./pages/User/SetNewPassword";
import Shop from "./pages/User/Shop";
import SignIn from "./pages/User/SignIn";
import SignUp from "./pages/User/SignUp";
import Home from "./pages/User/Home";
import ProductDetails from "./pages/User/ProductDetails";
import ShoppingCart from "./pages/User/ShoppingCart";
import Checkout from "./pages/User/Checkout";
import OrderCompleted from "./pages/User/OrderCompleted";
import Account from "./pages/User/Account";
import VerifyCode from "./pages/User/VerifyCode";
import EmailVerify from "./pages/User/EmailVerify";
import Analysis from "./pages/Admin/Analysis";
import Products from "./pages/Admin/Products";
import Categories from "./pages/Admin/Categories";
import Dashboard from "./pages/Admin/Dashboard";
import Admin from "./pages/Admin/Admin";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const noHeaderRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-code",
    "/set-password",
    "/admin",
  ];

  useLayoutEffect(() => {
    switch (location.pathname) {
      case "/products":
        document.title = "Shop";
        break;
      case "/login":
        document.title = "Sign In";
        break;
      case "/signup":
        document.title = "Sign Up";
        break;
      case "/verify":
        document.title = "Verify Email";
        break;
      case "/cart":
        document.title = "Shopping Cart";
        break;
      case "/checkout":
        document.title = "Checkout";
        break;
      case "/order-completed":
        document.title = "Order Completed";
        break;
      case "/account":
        document.title = "Account";
        break;
      case "/forgot-password":
        document.title = "Forgot Password";
        break;
      case "/verify-code":
        document.title = "Verify Code";
        break;
      case "/set-password":
        document.title = "Set New Password";
        break;
      default:
        document.title = "Fashion Space";
    }
  }, [location]);

  return (
    <div>
      {!noHeaderRoutes.includes(location.pathname) && <Header /> &&
        !location.pathname.startsWith("/verify") && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/:id" element={<EmailVerify />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products/details/:id" element={<ProductDetails />} />
        <Route path="/order-completed" element={<OrderCompleted />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/account" element={<Account />} />
        <Route path="/set-password" element={<SetNewPassword />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
