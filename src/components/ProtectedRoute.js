// components/ProtectedRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element, role, ...rest }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    // Assuming user.role contains the user's role
    return <Navigate to="/" />; // Redirect if the user doesn't have the right role
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
