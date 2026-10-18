import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { exportToExcel, exportToColorPDF } from '../utils/exportReports';
import {
  Wallet,
  LayoutDashboard,
  TrendingUp,
  Building2,
  Star,
  PlusCircle,
  FileSpreadsheet,
  FileText,
  Sun,
  Moon,
  LogOut,
  X,
  Download,
  Calculator, // NEW
} from 'lucide-react';

export default function Sidebar({
  isOpen = false,
  setIsOpen = () => {},
  onOpenAddModal = () => {},
  holdings = [],
  summary = {},
  activeTab = 'dashboard',
  setActiveTab = () => {},
}) {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  // Navigation Items Including Financial Tools
  const navItems = [
    { id: 'dashboard', label: 'Portfolio Dashboard', icon: LayoutDashboard },
    { id: 'tools', label: 'Financial Tools Suite', icon: Calculator }, // <-- NEW
    { id: 'trends', label: 'Stock Trends & Analytics', icon: TrendingUp },
    { id: 'companies', label: 'All Listed Companies', icon: Building2 },
    { id: 'watchlist', label: 'My Active Watchlist', icon: Star },
  ];

  const handleTabClick = (tabId) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    }
    if (typeof setIsOpen === 'function') {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'bg-[#090d16] text-zinc-100 border-r border-zinc-800/90'
            : 'bg-white text-zinc-800 border-r border-zinc-200'
        } p-5 flex flex-col justify-between shadow-2xl overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                    FinTrack Pro
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500 mt-0.5">
                  Institutional Tools & Analytics
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Switcher Widget */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-500/5 border border-zinc-500/10">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 transition"
            >
              Switch
            </button>
          </div>

          {/* Main Navigation Items */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
              Main Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                      : theme === 'dark'
                      ? 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
              Quick Action
            </span>

            <button
              onClick={() => {
                onOpenAddModal();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Investment</span>
            </button>
          </div>

          {/* Reports and Statements */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1.5 mb-1">
              <Download className="w-3 h-3 text-sky-400" /> Reports & Statements
            </span>

            <button
              onClick={() => exportToColorPDF(holdings, summary, user)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs border transition ${
                theme === 'dark'
                  ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 text-rose-300'
                  : 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold">Color Statement</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 font-bold">
                PDF
              </span>
            </button>

            <button
              onClick={() => exportToExcel(holdings, summary, user)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs border transition ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Portfolio Excel</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">
                XLSX
              </span>
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="pt-4 mt-6 border-t border-zinc-500/10">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-500/5 border border-zinc-500/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="text-xs font-bold truncate">{user?.name || 'Investor'}</p>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}