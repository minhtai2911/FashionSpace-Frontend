import { useLayoutEffect, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Admin from "./pages/Admin/Admin";
import Analysis from "./pages/Admin/Analysis";
import Categories from "./pages/Admin/Categories";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/AdminProducts";
import Users from "./pages/Admin/Users";
import Sizes from "./pages/Admin/Sizes";
import Colors from "./pages/Admin/Colors";
import AdminAccount from "./pages/Admin/Account";
import CreateProduct from "./pages/Admin/CreateProduct";

import Account from "./pages/User/Account";
import AuthSuccess from "./pages/User/AuthSuccess";
import Checkout from "./pages/User/Checkout";
import EmailVerify from "./pages/User/EmailVerify";
import ForgotPassword from "./pages/User/ForgotPassword";
import Home from "./pages/User/Home";
import OrderCompleted from "./pages/User/OrderCompleted";
import ProductDetails from "./pages/User/ProductDetails";
import SetNewPassword from "./pages/User/SetNewPassword";
import Shop from "./pages/User/Shop";
import ShoppingCart from "./pages/User/ShoppingCart";
import SignIn from "./pages/User/SignIn";
import SignUp from "./pages/User/SignUp";
import VerifyCode from "./pages/User/VerifyCode";

import Header from "./components/Header";
import SideBar from "./components/SideBar";
import AdminProductDetails from "./pages/Admin/AdminProductDetails";
import UpdateProduct from "./pages/Admin/AdminUpdateProduct";
import Orders from "./pages/Admin/Orders";
import Reviews from "./pages/Admin/Reviews";
import OrderDetails from "./pages/Admin/OrderDetails";
import UpdateOrder from "./pages/Admin/UpdateOrder";
import TrackOrder from "./pages/User/TrackOrder";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const noHeaderRoutes = [
    "/login",
    "/signup",
    "/forgotPassword",
    "/verifyCode",
    "/verify",
    "/setPassword",
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
      case "/orderCompleted":
        document.title = "Order Completed";
        break;
      case "/account":
        document.title = "Account";
        break;
      case "/forgotPassword":
        document.title = "Forgot Password";
        break;
      case "/verifyCode":
        document.title = "Verify Code";
        break;
      case "/setPassword":
        document.title = "Set New Password";
        break;
      default:
        document.title = "Fashion Space";
    }
  }, [location]);

  const AdminRedirect = () => {
    const location = useLocation();
    return location.pathname === "/admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : null;
  };

  return (
    <div>
      {!noHeaderRoutes.includes(location.pathname) &&
        !location.pathname.startsWith("/admin") && <Header />}
      <AdminRedirect />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/:id" element={<EmailVerify />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products/details/:id" element={<ProductDetails />} />
        <Route path="/orderCompleted" element={<OrderCompleted />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verifyCode" element={<VerifyCode />} />
        <Route path="/trackOrder/:id" element={<TrackOrder />} />
        <Route path="/account" element={<Account />} />
        <Route path="/success/*" element={<AuthSuccess />} />
        <Route path="/setPassword" element={<SetNewPassword />} />
        <Route
          path="/admin"
          element={
            <div className="admin">
              <Admin />
            </div>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="/admin/products/create" element={<CreateProduct />} />
          <Route
            path="/admin/products/details/:id"
            element={<AdminProductDetails />}
          />
          <Route
            path="/admin/products/update/:id"
            element={<UpdateProduct />}
          />
          <Route path="categories" element={<Categories />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="users" element={<Users />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="/admin/orders/details/:id" element={<OrderDetails />} />
          <Route path="/admin/orders/update/:id" element={<UpdateOrder />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="colors" element={<Colors />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
