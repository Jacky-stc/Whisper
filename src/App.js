import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Homepage } from "./components/Homepage";
import { Home } from "./components/Home";
import Loader from "./components/loader/loader";
import { AuthContext } from "./context/AuthContext";
import { auth } from "./firebase";

export function App() {
  const { isLoading, currentUser } = useContext(AuthContext);
  // use protected route to check whether user is login or not
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div
          style={{
            position: "relative",
            width: `100px`,
            top: "50%",
            left: "50%",
          }}
        >
          <Loader />
        </div>
      );
    }
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {
      return children;
    }
  };
  const ProtectedRouteLogin = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="login"
          element={
            <ProtectedRouteLogin>
              <Homepage />
            </ProtectedRouteLogin>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
