import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignInModal from "./components/SignInModal";

const AUTH_TOKEN_KEY = "userEmail";

const isAuthenticated = () => !!localStorage.getItem(AUTH_TOKEN_KEY);

// Redirect authenticated users away from sign-in / sign-up pages
function RequireGuest({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Redirect unauthenticated users to sign-in
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

// Keep the document title consistent across the site
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - public */}
        <Route
          path="/"
          element={
            <>
              <PageTitle title="AnswerForge — AI Voice Interview Practice" />
              <Home />
            </>
          }
        />

        {/* Dashboard Page - protected */}
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="Dashboard — AnswerForge" />
              <ProtectedRoute>
                <Dashboard
                  key={localStorage.getItem("userEmail") || ""}
                />
              </ProtectedRoute>
            </>
          }
        />

        {/* Sign In Routes - guest only */}
        <Route
          path="/signin"
          element={
            <>
              <PageTitle title="Sign In — AnswerForge" />
              <RequireGuest>
                <Home>
                  <SignInModal isSignUp={false} />
                </Home>
              </RequireGuest>
            </>
          }
        />
        <Route path="/login" element={<Navigate to="/signin" replace />} />

        {/* Sign Up / Registration Routes - guest only */}
        <Route
          path="/signup"
          element={
            <>
              <PageTitle title="Create Account — AnswerForge" />
              <RequireGuest>
                <Home>
                  <SignInModal isSignUp={true} />
                </Home>
              </RequireGuest>
            </>
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
