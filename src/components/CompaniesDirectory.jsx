import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useTheme } from '../context/ThemeContext';
import { formatINR, formatPercent } from '../utils/formatters';
import { useDraggableScroll } from '../utils/useDraggableScroll';
import { Search, Star, PlusCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function CompaniesDirectory({ onAddHolding, onAddToWatchlist, watchlistTickers = [] }) {
  const { theme } = useTheme();
  const scrollRef = useDraggableScroll();
  const [data, setData] = useState({
    companies: [],
    sectors: [],
    groups: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/discovery/companies', {
        params: {
          search,
          sector: selectedSector,
          group: selectedGroup,
          page,
          limit: 20,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, selectedSector, selectedGroup]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCompanies();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedSector, selectedGroup, page]);

  return (
    <div className="space-y-4 w-full">
      <div
        className={`p-4 rounded-xl border shadow-sm ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Symbol (e.g. RELIANCE, TATA, HDFC)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-zinc-50 border-zinc-300 text-black placeholder-zinc-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">Group:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className={`w-full border rounded-lg p-1.5 text-xs font-semibold focus:outline-none ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-black'
              }`}
            >
              {(data.groups || ['All']).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className={`w-full border rounded-lg p-1.5 text-xs font-semibold focus:outline-none ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-black'
              }`}
            >
              {(data.sectors || ['All']).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-500/10 text-xs text-zinc-400">
          <span>
            Showing <strong className="text-white">{data.companies.length}</strong> of{' '}
            <strong className="text-sky-400">{data.total}</strong> Listed Indian Companies
          </span>
          <button
            onClick={fetchCompanies}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            <span>Refresh Prices</span>
          </button>
        </div>
      </div>

      <div
        className={`w-full rounded-xl border shadow-sm overflow-hidden ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto select-none no-scrollbar cursor-grab active:cursor-grabbing"
        >
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[1050px]">
            <thead>
              <tr className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5 w-24">Symbol</th>
                <th className="py-3 px-3.5 w-60">Company Name</th>
                <th className="py-3 px-3 w-44">Sector</th>
                <th className="py-3 px-3 w-40">Industry</th>
                <th className="py-3 px-3 w-28">Group</th>
                <th className="py-3 px-3 text-right w-28">LTP (CMP)</th>
                <th className="py-3 px-3 text-right w-24">Day Change</th>
                <th className="py-3 px-3.5 text-right w-36">Market Cap</th>
                <th className="py-3 px-4 text-center w-28 sticky right-0 bg-indigo-600 z-10 shadow-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-zinc-800/60' : 'divide-zinc-200/80'}`}>
              {loading && data.companies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400 font-medium">
                    Loading directory...
                  </td>
                </tr>
              ) : data.companies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400 font-medium">
                    No matching listed companies found.
                  </td>
                </tr>
              ) : (
                data.companies.map((company) => {
                  const isWatchlisted = watchlistTickers.includes(company.ticker);
                  const isChangePositive = (company.changePercent || 0) >= 0;

                  return (
                    <tr
                      key={company.ticker}
                      className={`transition-colors ${
                        theme === 'dark' ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-100/70'
                      }`}
                    >
                      <td className="py-3 px-3.5 font-bold">
                        <span className="px-2 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 font-mono text-[11px]">
                          {company.ticker}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-zinc-100 truncate max-w-[240px]">
                        {company.name}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 truncate max-w-[170px]">{company.sector}</td>
                      <td className="py-3 px-3 text-zinc-400 truncate max-w-[160px]">{company.industry}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {company.group}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        {formatINR(company.price, 2)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold ${
                          isChangePositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatPercent(company.changePercent, 2)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold text-zinc-300">
                        {company.marketCap && company.marketCap > 0
                          ? `₹${(company.marketCap / 1e7).toLocaleString('en-IN', {
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
                            onClick={() => onAddToWatchlist(company)}
                            className={`p-1.5 rounded transition ${
                              isWatchlisted
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-zinc-400 hover:text-amber-400'
                            }`}
                            title={isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                          >
                            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() =>
                              onAddHolding({
                                ticker: company.ticker,
                                name: company.name,
                                assetClass:
                                  company.group === 'ETFs'
                                    ? 'ETFs'
                                    : company.group === 'Alternatives'
                                    ? 'Alternatives'
                                    : 'Stocks',
                              })
                            }
                            className="p-1.5 rounded text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 transition"
                            title="Add to Portfolio"
                          >
                            <PlusCircle className="w-4 h-4" />
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

        {data.totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-zinc-500/10 bg-zinc-500/5">
            <span className="text-xs text-zinc-400">
              Page <strong className="text-white">{data.page}</strong> of{' '}
              <strong className="text-white">{data.totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={data.page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={data.page >= data.totalPages || loading}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="px-3 py-1 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}