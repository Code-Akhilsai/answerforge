import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Mic,
  ArrowRight,
  Lock,
  Mail,
  User,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../api";

export default function SignInModal({
  isOpen = true,
  onClose,
  isSignUp: propIsSignUp,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUpRoute =
    location.pathname === "/signup" || location.pathname === "/register";

  const [isSignUp, setIsSignUp] = useState(
    propIsSignUp !== undefined ? propIsSignUp : isSignUpRoute,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (propIsSignUp !== undefined) {
      setIsSignUp(propIsSignUp);
    } else {
      setIsSignUp(
        location.pathname === "/signup" || location.pathname === "/register",
      );
    }
    setErrorMessage("");
  }, [location.pathname, propIsSignUp]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSwitchMode = (signUpMode) => {
    setIsSignUp(signUpMode);
    setErrorMessage("");
    setIsSubmitted(false);
    navigate(signUpMode ? "/signup" : "/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Flow - send fullName, email, password to backend
        const response = await api.post("/register", {
          fullName: name,
          email,
          password,
        });

        if (name) localStorage.setItem("userName", name);
        if (email) localStorage.setItem("userEmail", email);

        setIsSubmitted(true);
        setStatusMessage(
          response.data?.message || "Account created successfully!",
        );

        setTimeout(() => {
          setIsSubmitted(false);
          setStatusMessage("");
          if (onClose) onClose();
          navigate("/dashboard");
        }, 1000);
      } else {
        // Sign In Flow - send email and password to backend
        const response = await api.post("/login", {
          email,
          password,
        });

        if (response.data?.user?.fullName) {
          localStorage.setItem("userName", response.data.user.fullName);
        } else if (!localStorage.getItem("userName")) {
          localStorage.setItem("userName", email.split("@")[0]);
        }
        localStorage.setItem("userEmail", email);

        setIsSubmitted(true);
        setStatusMessage(response.data?.message || "Login successful!");

        setTimeout(() => {
          setIsSubmitted(false);
          setStatusMessage("");
          if (onClose) onClose();
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    localStorage.setItem("userName", "Alex Morgan");
    localStorage.setItem("userEmail", "alex@answerforge.dev");
    setIsSubmitted(true);
    setStatusMessage("Authenticating with Google...");
    setTimeout(() => {
      setIsSubmitted(false);
      setStatusMessage("");
      if (onClose) onClose();
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1117] border border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-7 text-slate-100">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-inner">
            <Mic className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isSignUp ? "Create your account" : "Sign in to AnswerForge"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xs mx-auto">
            {isSignUp
              ? "Start practicing high-stakes interviews with Gnani Voice AI"
              : "Welcome back! Enter your details to resume interview practice"}
          </p>
        </div>

        {/* Google Authentication Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading || isSubmitted}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-700/80 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-3 transition-colors shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.5 0 2.8.5 3.9 1.4l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.5 2.7C6.3 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.6C.7 9 .1 10.5.1 12s.6 3 1.8 5.4l3.5-2.7z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.2-6.6-5L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider with Proper Text */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0e1117] px-3 text-zinc-400 font-medium text-[11px] uppercase tracking-wider">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name field in Sign Up mode */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  disabled={loading || isSubmitted}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 text-xs placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all disabled:opacity-60"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading || isSubmitted}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 text-xs placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() =>
                    alert("Password reset link sent to demo email!")
                  }
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading || isSubmitted}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 text-xs placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isSubmitted}
            className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              </span>
            ) : isSubmitted ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{statusMessage}</span>
              </span>
            ) : (
              <>
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Create Account */}
        <div className="mt-5 text-center text-xs text-zinc-400">
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode(false)}
                className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => handleSwitchMode(true)}
                className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors"
              >
                Create one
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
