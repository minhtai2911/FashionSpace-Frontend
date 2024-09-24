import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

import ForgotPassword from "./pages/ForgotPassword";
import SetNewPassword from "./pages/SetNewPassword";
import Shop from "./pages/Shop";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";

import Header from "./components/Header";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";

function App() {
  const location = useLocation();
  const noHeaderRoutes = ["/login", "/signup"];

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
      case "/cart":
        document.title = "Shopping Cart";
        break;
      case "/cart/checkout":
        document.title = "Checkout";
        break;
      default:
        document.title = "Fashion Space";
    }
  }, [location]);

  return (
    <div>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/cart/checkout" element={<Checkout />} />
        <Route path="/products/details/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;
