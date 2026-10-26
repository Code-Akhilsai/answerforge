import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InteractiveInterviewSandbox from "./components/InteractiveInterviewSandbox";
import HowItWorks from "./components/HowItWorks";
import GnaniTechPillars from "./components/GnaniTechPillars";
import Footer from "./components/Footer";
import SignInModal from "./components/SignInModal";

function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleOpenSignIn = () => {
    setIsSignInOpen(true);
  };

  const handleCloseSignIn = () => {
    setIsSignInOpen(false);
  };

  const handleScrollToDemo = () => {
    const el = document.getElementById("interactive-sandbox");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Navbar with Sign In Button */}
      <Navbar
        onOpenSignInModal={handleOpenSignIn}
        onScrollToDemo={handleScrollToDemo}
      />

      <main className="flex-1">
        {/* Clean Hero with Audio Sample Question */}
        <Hero
          onOpenSignInModal={handleOpenSignIn}
          onScrollToDemo={handleScrollToDemo}
        />

        {/* Live Interactive Voice Demo */}
        <InteractiveInterviewSandbox />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* Gnani Voice Intelligence Advantage */}
        <GnaniTechPillars />
      </main>

      {/* Minimal Footer */}
      <Footer onOpenSignInModal={handleOpenSignIn} />

      {/* Clean Sign In Modal */}
      <SignInModal isOpen={isSignInOpen} onClose={handleCloseSignIn} />
    </div>
  );
}

export default App;
