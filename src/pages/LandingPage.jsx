import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Receipt,
  Coins,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
  Lock,
  PieChart,
  Calculator,
  ChevronDown,
  Building2,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does PortPulse calculate Indian Capital Gains taxes?',
      a: 'PortPulse embeds the latest Union Budget taxation framework. It differentiates between Short-Term Capital Gains (STCG @ 20%) and Long-Term Capital Gains (LTCG @ 12.5%), factoring in the standard statutory exemption threshold of ₹1.25 Lakhs per financial year.',
    },
    {
      q: 'What data sources power the live asset pricing?',
      a: 'The engine queries real-time and end-of-day market feeds for National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) securities, index ETFs, and commodities, complete with automatic fallback resilience.',
    },
    {
      q: 'Can I export audit-ready statements for my CA or tax filings?',
      a: 'Yes. PortPulse provides one-click exports for high-resolution Color PDF statements (utilizing standard font metrics to prevent formatting artifacts) and multi-tab Microsoft Excel (.xlsx) workbooks.',
    },
    {
      q: 'How does the TiDB Cloud integration safeguard my portfolio data?',
      a: 'All holdings, transactions, and custom watchlists are stored in a distributed, ACID-compliant TiDB Cloud cluster with TLS 1.2 encryption at rest and in transit.',
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#060811] text-zinc-100' : 'bg-[#f4f7fb] text-zinc-800'
      }`}
    >
      {/* Top Floating Glass Navigation Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-3.5 flex items-center justify-between transition-colors ${
          theme === 'dark' ? 'bg-[#060811]/85 border-zinc-800' : 'bg-white/85 border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              FinTrack Pro
            </span>
            <span className="hidden sm:block text-[9px] uppercase font-bold tracking-widest text-zinc-500">
              Institutional Wealth Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-sky-400 hover:text-white'
                : 'bg-zinc-100 border-zinc-300 text-amber-500 hover:text-zinc-900'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Link
            to="/auth?mode=login"
            className="text-xs font-bold px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/auth?mode=register"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/25 transition active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 max-w-7xl mx-auto w-full text-center">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-fuchsia-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Specifically for Indian Investors, Traders & Wealth Managers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Institutional portfolio analytics, <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              engineered for the Indian Rupee.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Consolidate Indian Equities, Index ETFs, Sovereign Gold Bonds, Mutual Funds, and Fixed Deposits into an automated intelligence engine powered by TiDB Cloud distributed SQL.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition shadow-lg shadow-sky-500/25 text-sm"
            >
              <span>Launch Dashboard Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth?mode=login"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm border transition ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
                  : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50'
              }`}
            >
              Investor Login
            </Link>
          </div>
        </div>

        {/* Live Mock Metrics Showcase */}
        <div className="mt-14 max-w-5xl mx-auto relative z-10">
          <div
            className={`rounded-2xl border p-2 sm:p-3 shadow-2xl transition-all ${
              theme === 'dark' ? 'bg-[#090d16]/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
            }`}
          >
            <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 rounded-t-lg mb-3" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2">
              <div
                className={`p-3.5 rounded-xl border text-left ${
                  theme === 'dark' ? 'bg-[#0d1222] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Total Market Value
                </span>
                <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-sky-400">
                  ₹1,13,801.00
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-left ${
                  theme === 'dark' ? 'bg-[#0d1222] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Total Investment
                </span>
                <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-zinc-300">
                  ₹81,135.00
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-left ${
                  theme === 'dark' ? 'bg-[#0d1222] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Unrealized Gain (P&L)
                </span>
                <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-emerald-400">
                  +₹32,666.00
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-left ${
                  theme === 'dark' ? 'bg-[#0d1222] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Overall Return
                </span>
                <p className="text-xl sm:text-2xl font-black font-mono mt-1 text-emerald-400">
                  +40.26%
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-500/10 flex flex-wrap items-center justify-between px-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live NSE/BSE quote feeds active
              </span>
              <div className="flex gap-4">
                <span>RELIANCE: <strong className="text-emerald-400 font-bold">₹2,980.50 (+1.4%)</strong></span>
                <span>TCS: <strong className="text-emerald-400 font-bold">₹3,890.00 (+0.8%)</strong></span>
                <span>HDFCBANK: <strong className="text-sky-400 font-bold">₹728.85</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Matrix */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Designed for the Indian Financial Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A unified suite tailored to Indian compliance, market structures, and asset classes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            className={`relative overflow-hidden p-6 rounded-xl border shadow-sm transition-all ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">Union Budget Capital Gains Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Computes Long-Term (LTCG @ 12.5% factoring the ₹1.25 Lakh threshold) and Short-Term (STCG @ 20%) tax liabilities automatically across listed Indian equities.
            </p>
          </div>

          <div
            className={`relative overflow-hidden p-6 rounded-xl border shadow-sm transition-all ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500 absolute top-0 left-0" />
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">Passive Dividend Cash Flow Forecaster</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Calculates annual dividend yields and projected passive payouts across your Indian equities, index funds, and quarterly bank fixed deposits.
            </p>
          </div>

          <div
            className={`relative overflow-hidden p-6 rounded-xl border shadow-sm transition-all ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-indigo-600 absolute top-0 left-0" />
            <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">Candlestick & Trajectory Analytics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Explore your portfolio assets with custom date filters, Japanese Candlesticks, moving volume bars, opening, and closing CMP values.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Tools Suite Showcase */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div
          className={`relative overflow-hidden rounded-2xl border p-8 shadow-xl ${
            theme === 'dark' ? 'bg-[#090d16] border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 absolute top-0 left-0" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Calculator className="w-3.5 h-3.5" /> Built-in Mathematical Suite
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Institutional Financial Tools & Valuation Suite
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Solve real-world corporate finance and investment models with step-by-step mathematical proofs: Monthly & Lumpsum SIPs, Time Value of Money (PV/FV for Annuity & Lumpsum), Full Loan Amortization Schedules (120+ months), Fixed Deposit returns, Bond YTM, and Equity CAPM valuation.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto text-xs font-semibold">
              <span className="p-3 rounded-xl border border-zinc-500/15 bg-zinc-500/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Monthly SIP & Lumpsum
              </span>
              <span className="p-3 rounded-xl border border-zinc-500/15 bg-zinc-500/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> PV & FV Annuity (Due/Ord)
              </span>
              <span className="p-3 rounded-xl border border-zinc-500/15 bg-zinc-500/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 120-Month Loan Schedules
              </span>
              <span className="p-3 rounded-xl border border-zinc-500/15 bg-zinc-500/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Gordon Growth & CAPM
              </span>
              <span className="p-3 rounded-xl border border-zinc-500/15 bg-zinc-500/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Bond Valuation & YTM
              </span>
              <span className="p-3 rounded-xl border border-zinc-500/15 bg-zinc-500/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Preference Shares (Kp)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Leadership Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 block mb-1">
            Leadership & Vision
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Meet the Founder
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Architecting institutional financial data tools for next-generation retail investors.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto rounded-2xl border p-6 sm:p-10 shadow-2xl relative overflow-hidden ${
            theme === 'dark' ? 'bg-[#090d16] border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 absolute top-0 left-0" />

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Founder Photo / Avatar Container */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-sky-500/30 p-1 bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/20">
                <img
                  src="https://avatars.githubusercontent.com/u/169218157?v=4'"
                  alt="Dinesh Kumar Reddy"
                  onError={(e) => {
                    // Fallback to high-res stylized SVG avatar if custom photo asset is not yet added
                    e.target.onerror = null;
                    e.target.src = 'https://avatars.githubusercontent.com/u/169218157?v=4';
                  }}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg border border-white/20">
                <Award className="w-4 h-4" />
              </div>
            </div>

            {/* Founder Bio & Credentials */}
            <div className="space-y-3.5 text-left">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    Dinesh Kumar Reddy
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Founder & Lead Architect
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-400 mt-1">
                  Financial Analytics & Distributed Software Systems
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                "Indian retail investors manage portfolios across fractured portals with disparate taxation methodologies. FinTrack Pro was founded to provide complete Rupee-denominated mathematical clarity: unifying real-time NSE/BSE feeds, Union Budget capital gains tracking, and institutional valuation algorithms on top of a zero-downtime distributed SQL architecture."
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-300">
                <span className="px-3 py-1 rounded-lg bg-zinc-500/10 border border-zinc-500/20">
                  Full-Stack Architecture
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-500/10 border border-zinc-500/20">
                  Corporate Valuation
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-500/10 border border-zinc-500/20">
                  TiDB Cloud Engineering
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-500/10 border border-zinc-500/20">
                  Capital Markets
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Answers to key technical, tax, and infrastructure questions.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all ${
                  theme === 'dark' ? 'bg-[#090d16] border-zinc-800' : 'bg-white border-zinc-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-sky-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-500/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Stack Highlights Banner */}
      <section className="py-8 px-6 max-w-7xl mx-auto w-full">
        <div
          className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
            theme === 'dark' ? 'bg-[#090d16] border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Backed by TiDB Cloud Distributed Database</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Financial-grade ACID compliance, zero-downtime clustering, and instant query execution.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Color PDF Statements
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Formatted Excel (.xlsx)
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-500/10 py-8 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FinTrack Pro. Founded by Dinesh Kumar Reddy.</p>
          <div className="flex gap-4 font-semibold">
            <Link to="/auth?mode=login" className="hover:text-zinc-300 transition">
              Sign In
            </Link>
            <Link to="/auth?mode=register" className="hover:text-zinc-300 transition">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}