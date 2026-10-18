import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axiosClient';
import Sidebar from '../components/Sidebar';
import HoldingsTable from '../components/HoldingsTable';
import AllocationPie from '../components/AllocationPie';
import TopHoldingsBar from '../components/TopHoldingsBar';
import AddHoldingModal from '../components/AddHoldingModal';
import TrendSection from '../components/TrendSection';
import CompaniesDirectory from '../components/CompaniesDirectory';
import WatchlistSection from '../components/WatchlistSection';
import FinancialToolsSection from '../components/FinancialToolsSection';
import { useTheme } from '../context/ThemeContext';
import { formatINR, formatPercent } from '../utils/formatters';
import {
  Menu,
  TrendingUp,
  IndianRupee,
  Layers,
  PieChart,
  Activity,
  Receipt,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSyncing, setAutoSyncing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledModalData, setPrefilledModalData] = useState(null);
  const [watchlistTickers, setWatchlistTickers] = useState([]);

  const { theme } = useTheme();

  const fetchPortfolio = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) setAutoSyncing(true);
      const res = await api.get('/portfolio');
      setData(res.data);
    } catch (err) {
      console.error('[Portfolio] Sync error:', err);
    } finally {
      setLoading(false);
      if (isBackground) {
        setTimeout(() => setAutoSyncing(false), 800);
      }
    }
  }, []);

  const fetchWatchlistTickers = async () => {
    try {
      const res = await api.get('/discovery/watchlist');
      if (Array.isArray(res.data)) {
        setWatchlistTickers(res.data.map((w) => w.ticker));
      }
    } catch (err) {
      console.error('[Watchlist] Tickers fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPortfolio(false);
    fetchWatchlistTickers();

    const interval = setInterval(() => {
      fetchPortfolio(true);
    }, 30000);

    const handleFocus = () => fetchPortfolio(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchPortfolio]);

  const handleAddHolding = async (payload) => {
    try {
      await api.post('/portfolio/holding', payload);
      fetchPortfolio(true);
    } catch (err) {
      alert('Error registering investment');
    }
  };

  const handleAddToWatchlist = async (company) => {
    try {
      if (watchlistTickers.includes(company.ticker)) {
        await api.delete(`/discovery/watchlist/${company.ticker}`);
      } else {
        await api.post('/discovery/watchlist', {
          ticker: company.ticker,
          name: company.name,
          sector: company.sector,
        });
      }
      fetchWatchlistTickers();
    } catch (err) {
      alert('Error updating watchlist');
    }
  };

  const handleDeleteHolding = async (id) => {
    if (!window.confirm('Delete this holding from portfolio?')) return;
    try {
      await api.delete(`/portfolio/holding/${id}`);
      fetchPortfolio(true);
    } catch (err) {
      alert('Error deleting holding');
    }
  };

  const { summary, holdings, assetAllocation, topHoldings } = data || {
    summary: {},
    holdings: [],
    assetAllocation: [],
    topHoldings: [],
  };

  const isProfit = (summary?.totalGainLossRupees || 0) >= 0;

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#060811] text-zinc-100' : 'bg-[#f4f7fb] text-zinc-800'
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenAddModal={() => {
          setPrefilledModalData(null);
          setIsModalOpen(true);
        }}
        holdings={holdings}
        summary={summary}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 lg:pl-68 flex flex-col min-w-0 w-full overflow-y-auto">
        <header
          className={`sticky top-0 z-30 flex items-center justify-between px-5 py-3 backdrop-blur-md border-b ${
            theme === 'dark' ? 'bg-[#060811]/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-zinc-500/10 border border-zinc-500/20"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                {activeTab === 'dashboard' && 'Investment Portfolio Tracker'}
                {activeTab === 'tools' && 'Financial Calculations & Valuation Suite'}
                {activeTab === 'trends' && 'Stock Trends & Price Trajectory'}
                {activeTab === 'companies' && 'All Listed Companies (NSE / BSE)'}
                {activeTab === 'watchlist' && 'My Active Watchlist'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex h-2 w-2 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      autoSyncing ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      autoSyncing ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </span>
                <p className="text-[10px] text-zinc-400">
                  {autoSyncing ? 'Auto-syncing live LTP...' : `Real-time feeds: ${summary?.lastUpdated || 'Active'}`}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-5 w-full min-w-0">
          {activeTab === 'tools' && <FinancialToolsSection />}

          {activeTab === 'trends' && <TrendSection holdings={holdings} />}

          {activeTab === 'companies' && (
            <CompaniesDirectory
              onAddHolding={(comp) => {
                setPrefilledModalData(comp);
                setIsModalOpen(true);
              }}
              onAddToWatchlist={handleAddToWatchlist}
              watchlistTickers={watchlistTickers}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistSection
              onAddHolding={(comp) => {
                setPrefilledModalData(comp);
                setIsModalOpen(true);
              }}
            />
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* Top 4 Core Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Total Market Value
                      </span>
                      <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
                        <IndianRupee className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight">
                      {formatINR(summary.totalMarketValue, 2)}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-600" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Total Investment
                      </span>
                      <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight">
                      {formatINR(summary.totalCostBasis, 2)}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div
                    className={`h-1 w-full ${
                      isProfit
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500'
                        : 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-600'
                    }`}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Unrealized Gain / Loss
                      </span>
                      <div
                        className={`p-1 rounded-md ${
                          isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p
                      className={`text-2xl font-bold font-mono tracking-tight ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isProfit ? '+' : ''}{formatINR(summary.totalGainLossRupees, 2)}
                    </p>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-500" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Total Return
                      </span>
                      <div className="p-1 rounded-md bg-fuchsia-500/10 text-fuchsia-400">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p
                      className={`text-2xl font-bold font-mono tracking-tight ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatPercent(summary.totalReturnPercent, 2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                        Union Budget Tax Estimator
                      </span>
                      <p className="text-xs text-zinc-400 mt-0.5">Estimated Capital Gains Liability</p>
                      <p className="text-lg font-bold font-mono text-zinc-100 mt-1">
                        {formatINR(summary.projectedTaxLiability, 2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
                        Projected Annual Dividends
                      </span>
                      <p className="text-xs text-zinc-400 mt-0.5">Annual Passive Cash Flow</p>
                      <p className="text-lg font-bold font-mono text-emerald-400 mt-1">
                        {formatINR(summary.totalProjectedAnnualDividends, 2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-blue-600" />
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 block">
                        Concentration & Risk Index
                      </span>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Top Holding: {summary.maxSingleHoldingWeight?.toFixed(1)}%
                      </p>
                      <p className="text-sm font-bold text-zinc-100 mt-1">
                        {summary.riskLevel || 'Balanced'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Holdings Table */}
              <HoldingsTable holdings={holdings} onDeleteHolding={handleDeleteHolding} />

              {/* Triple Split Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-indigo-600" />
                  <div className="p-3.5 border-b border-zinc-500/10 flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Portfolio Summary</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between border-b border-zinc-500/10 pb-1.5">
                      <span className="font-sans text-zinc-400">Total Market Value</span>
                      <span className="font-bold">{formatINR(summary.totalMarketValue, 2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-500/10 pb-1.5">
                      <span className="font-sans text-zinc-400">Total Cost Basis</span>
                      <span>{formatINR(summary.totalCostBasis, 2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-500/10 pb-1.5">
                      <span className="font-sans text-zinc-400">Total Gain / Loss</span>
                      <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}{formatINR(summary.totalGainLossRupees, 2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-500/10 pb-1.5">
                      <span className="font-sans text-zinc-400">Total Return %</span>
                      <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPercent(summary.totalReturnPercent, 2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600" />
                  <div className="p-3.5 border-b border-zinc-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Asset Class</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase opacity-80">Allocation</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-xs font-mono">
                    {assetAllocation.map((item) => (
                      <div key={item.name} className="flex justify-between border-b border-zinc-500/10 pb-1.5">
                        <span className="font-sans text-zinc-400">{item.name}</span>
                        <div className="flex gap-4 items-center">
                          <span className="font-bold">{formatINR(item.value, 2)}</span>
                          <span className="text-fuchsia-400 font-bold w-12 text-right">
                            {item.percentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <div className="p-3.5 border-b border-zinc-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Top Indian Holdings</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase opacity-80">Valuation</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-xs font-mono">
                    {topHoldings.map((h) => (
                      <div key={h.rank} className="flex justify-between border-b border-zinc-500/10 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-zinc-500/20 flex items-center justify-center text-[10px] font-bold">
                            {h.rank}
                          </span>
                          <span className="font-bold">{h.ticker}</span>
                        </div>
                        <span className="text-teal-400 font-bold">{formatINR(h.marketValue, 2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-500" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-500/10 mb-3">
                      <PieChart className="w-4 h-4 text-sky-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Portfolio Allocation</h3>
                    </div>
                    <AllocationPie data={assetAllocation} />
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-xl border shadow-sm ${
                    theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-500/10 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Top 5 Holdings by Valuation
                      </h3>
                    </div>
                    <TopHoldingsBar data={topHoldings} />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <AddHoldingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPrefilledModalData(null);
        }}
        onAdd={handleAddHolding}
        prefill={prefilledModalData}
      />
    </div>
  );
}