import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import InteractiveInterviewSandbox from "../components/InteractiveInterviewSandbox";
import HowItWorks from "../components/HowItWorks";
import GnaniTechPillars from "../components/GnaniTechPillars";
import Footer from "../components/Footer";

export default function Home({ children }) {
  const navigate = useNavigate();

  const handleOpenSignIn = () => {
    navigate("/signin");
  };

  const handleScrollToDemo = () => {
    const el = document.getElementById("interactive-sandbox");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Navbar with Sign In Button & Navigation */}
      <Navbar
        onOpenSignInModal={handleOpenSignIn}
        onScrollToDemo={handleScrollToDemo}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenSignInModal={handleOpenSignIn}
          onScrollToDemo={handleScrollToDemo}
        />

        {/* Live Interactive Voice Demo */}
        <InteractiveInterviewSandbox />

        {/* 3-Step Process */}
        <HowItWorks />

        {/* Gnani Voice Intelligence Pillars */}
        <GnaniTechPillars />
      </main>

      {/* Footer */}
      <Footer onOpenSignInModal={handleOpenSignIn} />

      {/* Route-driven modal overlays */}
      {children}
    </div>
  );
}

