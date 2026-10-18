import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useTheme } from '../context/ThemeContext';
import { formatINR, formatPercent } from '../utils/formatters';
import { Trash2, Star, PlusCircle, RefreshCw } from 'lucide-react';

export default function WatchlistSection({ onAddHolding }) {
  const { theme } = useTheme();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/discovery/watchlist');
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (ticker) => {
    try {
      await api.delete(`/discovery/watchlist/${ticker}`);
      fetchWatchlist();
    } catch (err) {
      alert('Error removing from watchlist');
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Header Banner */}
      <div
        className={`p-4 rounded-xl border shadow-sm flex items-center justify-between ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Personal Stock Watchlist</h2>
            <p className="text-[11px] text-zinc-400">
              Track real-time valuations, day ranges, and 52-week metrics for your target equities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchWatchlist}
            className="p-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/40 text-zinc-400 hover:text-white transition"
            title="Refresh Watchlist"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
            {watchlist.length} Monitored
          </span>
        </div>
      </div>

      {/* Watchlist Table with explicit minimum width and invisible scrollbar */}
      <div
        className={`w-full rounded-xl border shadow-sm overflow-hidden ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[1050px]">
            <thead>
              <tr className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5 w-24">Symbol</th>
                <th className="py-3 px-3.5 w-60">Company Name</th>
                <th className="py-3 px-3 w-40">Sector</th>
                <th className="py-3 px-3 text-right w-28">LTP (CMP)</th>
                <th className="py-3 px-3 text-right w-24">Day Change</th>
                <th className="py-3 px-3.5 text-right w-44">Day High / Low</th>
                <th className="py-3 px-3.5 text-right w-44">52W High / Low</th>
                <th className="py-3 px-3.5 text-right w-36">Market Cap</th>
                <th className="py-3 px-4 text-center w-28 sticky right-0 bg-rose-500 z-10 shadow-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-zinc-800/60' : 'divide-zinc-200/80'}`}>
              {loading && watchlist.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-zinc-400 font-medium">
                    Loading watchlist data...
                  </td>
                </tr>
              ) : watchlist.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-zinc-400 font-medium">
                    Your watchlist is empty. Go to "All Listed Companies" and star your target investments.
                  </td>
                </tr>
              ) : (
                watchlist.map((item) => {
                  const isChangePositive = (item.change || 0) >= 0;

                  return (
                    <tr
                      key={item.id || item.ticker}
                      className={`transition-colors ${
                        theme === 'dark' ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-100/70'
                      }`}
                    >
                      <td className="py-3 px-3.5 font-bold">
                        <span className="px-2 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 font-mono text-[11px]">
                          {item.ticker}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-zinc-100 truncate max-w-[240px]">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 truncate max-w-[160px]">{item.sector}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        {formatINR(item.price, 2)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold ${
                          isChangePositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatPercent(item.changePercent, 2)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-zinc-400">
                        {item.dayHigh ? `${formatINR(item.dayHigh, 1)} / ${formatINR(item.dayLow, 1)}` : '—'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-zinc-400">
                        {item.fiftyTwoWeekHigh ? `${formatINR(item.fiftyTwoWeekHigh, 1)} / ${formatINR(item.fiftyTwoWeekLow, 1)}` : '—'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold text-zinc-300">
                        {item.marketCap && item.marketCap > 0
                          ? `₹${(item.marketCap / 1e7).toLocaleString('en-IN', {
                              maximumFractionDigits: 2,
                            })} Cr`
                          : '—'}
                      </td>
                      <td
                        className={`py-3 px-4 text-center sticky right-0 z-10 ${
                          theme === 'dark' ? 'bg-[#0a0f1d]' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              onAddHolding({
                                ticker: item.ticker,
                                name: item.name,
                                assetClass: 'Stocks',
                              })
                            }
                            className="p-1.5 rounded text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition"
                            title="Add to Portfolio"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemove(item.ticker)}
                            className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}