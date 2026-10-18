import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Wallet,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function AuthPage() {
  const { login, register, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsRegister(searchParams.get('mode') === 'register');
    setError('');
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center p-4 transition-colors duration-300 overflow-hidden ${
        theme === 'dark' ? 'bg-[#060811] text-zinc-100' : 'bg-[#eef2f8] text-zinc-800'
      }`}
    >
      {/* Ambient Floating Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25 transition group-hover:scale-105">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            FinTrack Pro
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border backdrop-blur-md transition ${
            theme === 'dark'
              ? 'bg-zinc-900/60 border-zinc-800 text-sky-400 hover:text-white'
              : 'bg-white/70 border-zinc-300 text-amber-500 hover:text-zinc-900'
          }`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* Center Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div
          className={`rounded-2xl p-7 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-[#0c1222]/65 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
              : 'bg-white/75 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
          }`}
        >
          {/* Top Edge Gradient Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 absolute top-0 left-0" />

          {/* Header & Mode Switcher */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight mb-1">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-zinc-400">
              {isRegister
                ? 'Join PortPulse to manage your Rupee wealth portfolio'
                : 'Access your investments, live trends & financial tools'}
            </p>

            {/* Glass Pill Toggle */}
            <div className="mt-5 p-1 rounded-xl bg-zinc-500/10 border border-zinc-500/15 flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  !isRegister
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Investor Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  isRegister
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Register Free
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vennapusa Dinesh Kumar Reddy"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition ${
                      theme === 'dark'
                        ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-sky-500'
                        : 'bg-white/80 border-zinc-300 text-zinc-800 placeholder-zinc-400 focus:border-sky-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition ${
                    theme === 'dark'
                      ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-sky-500'
                      : 'bg-white/80 border-zinc-300 text-zinc-800 placeholder-zinc-400 focus:border-sky-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition ${
                    theme === 'dark'
                      ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-sky-500'
                      : 'bg-white/80 border-zinc-300 text-zinc-800 placeholder-zinc-400 focus:border-sky-500'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-6 pt-4 border-t border-zinc-500/10 flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted via TiDB Cloud Distributed SQL</span>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-xs text-zinc-400 hover:text-white transition font-medium"
          >
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}