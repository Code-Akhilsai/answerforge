import { useState } from "react";
import { Check, Zap, ArrowRight } from "lucide-react";

export default function PricingSection({ onOpenPracticeModal }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Starter Trial",
      tagline: "Test your vocal cadence and baseline metrics",
      priceMonthly: "₹0",
      priceAnnual: "₹0",
      period: "forever free",
      highlight: false,
      ctaText: "Start Free Practice",
      features: [
        "2 full 20-min voice interviews per month",
        "Gnani STT multi-accent speech recognition",
        "Basic Words-Per-Minute (WPM) tracking",
        "Filler word count detection",
        "Access to General Tech & STAR question banks",
      ],
    },
    {
      name: "Pro Candidate",
      tagline: "For active job seekers targeting tier-1 offers",
      priceMonthly: "₹1,499",
      priceAnnual: "₹1,199",
      period: "per month",
      highlight: true,
      badge: "MOST POPULAR FOR ACTIVE INTERVIEWS",
      ctaText: "Upgrade to Pro Candidate",
      features: [
        "Unlimited voice mock interviews with Gnani AI",
        "Full post-interview Diagnostic PDF scorecards",
        "Timestamped audio playback with inline filler flags",
        "Deep STAR method alignment & business ROI scoring",
        "Personalized 7-day remediation drill plan",
        "Company-specific rubrics (Google, Amazon, Atlassian, Razorpay)",
        "Priority <140ms voice streaming cluster",
      ],
    },
    {
      name: "Campus & Enterprise",
      tagline: "For universities, placement cells & bootcamps",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      period: "per cohort / year",
      highlight: false,
      ctaText: "Contact Campus Team",
      features: [
        "Batch student onboarding & placement cell dashboard",
        "Cohort readiness benchmarking & leaderboard",
        "Custom institutional question banks & rubrics",
        "Dedicated Gnani voice pipeline with SSO & SLA",
        "Student progress export to placement committee",
        "Dedicated onboarding & faculty training",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-[#07090d] relative border-b border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>TRANSPARENT CANDIDATE PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Invest in Your Speaking Fluency, Not Generic Text Boxes
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            One extra counter-offer pays for 10 years of AnswerForge. Choose a
            plan or start with free monthly sessions.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 ${
                plan.highlight
                  ? "bg-zinc-900/90 border-2 border-cyan-500/80 shadow-2xl shadow-cyan-950/30 relative"
                  : "card-elevated border border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold tracking-wider font-mono uppercase shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-6">{plan.tagline}</p>

                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-zinc-800/80">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {billingCycle === "monthly"
                      ? plan.priceMonthly
                      : plan.priceAnnual}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Included capabilities:
                  </div>
                  {plan.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-zinc-300"
                    >
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-cyan-400" : "text-zinc-400"}`}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenPracticeModal}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Security & Guarantee Note */}
        <div className="mt-12 text-center text-xs text-zinc-500 flex flex-wrap items-center justify-center gap-6">
          <span>&bull; No credit card required for Starter Free</span>
          <span>&bull; 100% money-back guarantee within 7 days</span>
          <span>&bull; Audio encrypted and never used for LLM training</span>
        </div>
      </div>
    </section>
  );
}
