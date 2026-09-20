import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { userDataContext } from "./context/UserContext.jsx";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn.jsx";
import Customize from "./pages/Customize.jsx";
import Customize2 from "./pages/Customize2.jsx";
import Home from "./pages/Home.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <Routes>
      {/* 🏠 HOME ROUTE */}
      <Route
        path="/"
        element={
          userData ? (
            <Home />
          ) : (
            <Navigate to="/signup" />
          )
        }
      />

      {/* 🛠️ CUSTOMIZE ROUTES */}
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signup" />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signup" />}
      />

      {/* ⚙️ SETTINGS ROUTE */}
      <Route
        path="/settings"
        element={userData ? <Settings /> : <Navigate to="/signup" />}
      />

      {/* 🔑 AUTH ROUTES */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      {/* 🏡 HOME PAGE (Direct Access) */}
      <Route
        path="/home"
        element={userData ? <Home /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
