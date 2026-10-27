import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignInModal from "./components/SignInModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Sign In Routes */}
        <Route
          path="/signin"
          element={
            <Home>
              <SignInModal isSignUp={false} />
            </Home>
          }
        />
        <Route path="/login" element={<Navigate to="/signin" replace />} />

        {/* Sign Up / Registration Routes */}
        <Route
          path="/signup"
          element={
            <Home>
              <SignInModal isSignUp={true} />
            </Home>
          }
        />
        <Route path="/register" element={<Navigate to="/signup" replace />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
