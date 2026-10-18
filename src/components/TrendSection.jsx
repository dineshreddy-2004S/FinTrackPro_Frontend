import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useTheme } from '../context/ThemeContext';
import { formatINR, formatPercent } from '../utils/formatters';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, RefreshCw, CandlestickChart as CandleIcon, LineChart as LineIcon } from 'lucide-react';

export default function TrendSection({ holdings = [] }) {
  const { theme } = useTheme();
  const equityHoldings = holdings.filter((h) => h.assetClass === 'Stocks' || h.assetClass === 'ETFs');
  const defaultTicker = equityHoldings[0]?.ticker || 'HDFCBANK';

  const [selectedTicker, setSelectedTicker] = useState(defaultTicker);
  const [period, setPeriod] = useState('1M'); // 1D, 1W, 1M, 3M, 6M, 1Y, CUSTOM
  const [chartType, setChartType] = useState('candle');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrend = async () => {
    if (!selectedTicker) return;
    setLoading(true);
    try {
      let url = `/discovery/trend/${selectedTicker}?period=${period}`;
      if (period === 'CUSTOM' && startDate && endDate) {
        url = `/discovery/trend/${selectedTicker}?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await api.get(url);
      setTrendData(res.data);
    } catch (err) {
      console.error('Error fetching trend:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when ticker or period changes
  useEffect(() => {
    if (period !== 'CUSTOM') {
      fetchTrend();
    }
  }, [selectedTicker, period]);

  const periods = [
    { label: 'Daywise', value: '1D' },
    { label: 'Weekly', value: '1W' },
    { label: 'Monthly', value: '1M' },
    { label: 'Quarterly', value: '3M' },
    { label: 'Half-Yearly', value: '6M' },
    { label: 'Yearly', value: '1Y' },
    { label: 'Custom Date', value: 'CUSTOM' },
  ];

  // User position in this asset
  const ownedStock = holdings.find((h) => h.ticker === selectedTicker);
  const ownedShares = Number(ownedStock?.shares || 0);

  // Dynamic Position P&L for the selected filtered window
  const isPositiveTrend = (trendData?.periodChange || 0) >= 0;
  const positionPeriodGainLoss = ownedShares > 0 
    ? ownedShares * (trendData?.periodChange || 0)
    : 0;

  // Chart boundaries
  const history = trendData?.history || [];
  const minLow = history.length ? Math.min(...history.map((d) => Number(d.low || d.close))) : 0;
  const maxHigh = history.length ? Math.max(...history.map((d) => Number(d.high || d.close))) : 100;
  const padding = (maxHigh - minLow) * 0.08 || 5;
  const yDomainMin = Math.max(0, minLow - padding);
  const yDomainMax = maxHigh + padding;

  const renderCandle = (props) => {
    const { x, width, payload } = props;
    if (!payload || payload.open === undefined) return null;

    const { open, close, high, low } = payload;
    const isUp = close >= open;
    const color = isUp ? '#10b981' : '#f43f5e';

    const chartHeight = 270;
    const topOffset = 10;
    const domainSpan = yDomainMax - yDomainMin || 1;

    const getY = (val) => topOffset + chartHeight - ((val - yDomainMin) / domainSpan) * chartHeight;

    const openY = getY(open);
    const closeY = getY(close);
    const highY = getY(high);
    const lowY = getY(low);

    const candleTop = Math.min(openY, closeY);
    const candleHeight = Math.max(Math.abs(closeY - openY), 2);
    const centerX = x + width / 2;

    return (
      <g key={`candle-${payload.date}`}>
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={1.5}
        />
        <rect
          x={x + 1}
          y={candleTop}
          width={Math.max(width - 2, 3)}
          height={candleHeight}
          fill={color}
          stroke={color}
          rx={1}
        />
      </g>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Controls */}
      <div
        className={`p-4 rounded-xl border shadow-sm ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase">Asset:</span>
              <select
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-700 text-white'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-800'
                }`}
              >
                {equityHoldings.length === 0 ? (
                  <option value="HDFCBANK">HDFCBANK (Default)</option>
                ) : (
                  equityHoldings.map((h) => (
                    <option key={h.id || h.ticker} value={h.ticker}>
                      {h.ticker} - {h.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Candle vs Line Toggle */}
            <div className="flex items-center p-0.5 rounded-lg border border-zinc-700/60 bg-zinc-900/40">
              <button
                onClick={() => setChartType('candle')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  chartType === 'candle'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CandleIcon className="w-3.5 h-3.5" />
                <span>Candles</span>
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  chartType === 'area'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LineIcon className="w-3.5 h-3.5" />
                <span>Line Area</span>
              </button>
            </div>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  period === p.value
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                    : theme === 'dark'
                    ? 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Pickers */}
        {period === 'CUSTOM' && (
          <div className="mt-3 pt-3 border-t border-zinc-500/10 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-zinc-400">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`border rounded px-2 py-1 text-xs ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300'
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-400">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`border rounded px-2 py-1 text-xs ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-300'
                }`}
              />
            </div>
            <button
              onClick={fetchTrend}
              className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded text-xs transition"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      {/* Snapshot Cards with Dynamic Period Values */}
      {trendData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            className={`p-3 rounded-xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {period === '1D' ? 'Closing Price' : 'Period Close'}
            </span>
            <p className="text-base font-bold font-mono mt-0.5">{formatINR(trendData.currentPrice, 2)}</p>
          </div>

          <div
            className={`p-3 rounded-xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {period === '1D' ? 'Day Open' : 'Period Open'}
            </span>
            <p className="text-base font-bold font-mono mt-0.5">{formatINR(trendData.open, 2)}</p>
          </div>

          <div
            className={`p-3 rounded-xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Period Return</span>
            <p
              className={`text-base font-bold font-mono mt-0.5 ${
                isPositiveTrend ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositiveTrend ? '+' : ''}{formatPercent(trendData.periodChangePercent, 2)}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Market Cap</span>
            <p className="text-base font-bold font-mono mt-0.5">
              {trendData.marketCap ? `₹${(trendData.marketCap / 1e7).toFixed(1)} Cr` : '—'}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {period === '1D' ? 'Day Volume' : 'Period Volume'}
            </span>
            <p className="text-base font-bold font-mono mt-0.5">
              {Number(trendData.volume || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border shadow-sm ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Your Period P&L
            </span>
            <p
              className={`text-base font-bold font-mono mt-0.5 ${
                positionPeriodGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {ownedShares > 0 ? (
                <>
                  {positionPeriodGainLoss >= 0 ? '+' : ''}
                  {formatINR(positionPeriodGainLoss, 2)}
                </>
              ) : (
                'Not owned'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Main Trajectory Chart */}
      <div
        className={`relative overflow-hidden rounded-xl border shadow-sm p-4 ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 absolute top-0 left-0 right-0" />
        <div className="flex items-center justify-between pb-3 border-b border-zinc-500/10 mb-4 mt-1">
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              {trendData?.name || selectedTicker} ({selectedTicker}) •{' '}
              {chartType === 'candle' ? 'OHLC Candlestick Chart' : 'Price Trajectory Area'}
            </h3>
            <p className="text-[11px] text-zinc-400">
              Filter: {period} • Period High: {formatINR(trendData?.dayHigh, 2)} • Period Low: {formatINR(trendData?.dayLow, 2)}
            </p>
          </div>
          <button
            onClick={fetchTrend}
            className="p-1 rounded text-zinc-400 hover:text-sky-400"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>

        <div className="h-[320px] w-full">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'candle' ? (
                <BarChart
                  data={history}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis
                    domain={[yDomainMin, yDomainMax]}
                    stroke="#71717a"
                    fontSize={10}
                    tickFormatter={(val) => `₹${Math.round(val)}`}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || !payload[0]) return null;
                      const d = payload[0].payload;
                      const isUp = d.close >= d.open;
                      return (
                        <div
                          className={`p-2.5 rounded-lg shadow-xl text-xs font-mono border ${
                            theme === 'dark' ? 'bg-[#0c101a] border-zinc-700 text-white' : 'bg-white border-zinc-200 text-black'
                          }`}
                        >
                          <p className="font-sans font-bold text-zinc-400 mb-1">{d.date}</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                            <span className="text-zinc-400">Open:</span>
                            <span className="font-bold text-right">{formatINR(d.open, 2)}</span>
                            <span className="text-zinc-400">High:</span>
                            <span className="font-bold text-right text-emerald-400">{formatINR(d.high, 2)}</span>
                            <span className="text-zinc-400">Low:</span>
                            <span className="font-bold text-right text-rose-400">{formatINR(d.low, 2)}</span>
                            <span className="text-zinc-400">Close:</span>
                            <span className={`font-bold text-right ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {formatINR(d.close, 2)}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="close" shape={renderCandle} />
                </BarChart>
              ) : (
                <AreaChart
                  data={history}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositiveTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={isPositiveTrend ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis
                    domain={[yDomainMin, yDomainMax]}
                    stroke="#71717a"
                    fontSize={10}
                    tickFormatter={(val) => `₹${Math.round(val)}`}
                  />
                  <Tooltip
                    formatter={(val) => [formatINR(val, 2), 'Closing Price']}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0c101a' : '#fff',
                      borderColor: '#27272a',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={isPositiveTrend ? '#10b981' : '#f43f5e'}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
              {loading ? 'Fetching historical trajectory...' : 'No historical data found for this range.'}
            </div>
          )}
        </div>

        {/* Volume Sub-Chart */}
        <div className="h-[90px] w-full mt-4 pt-3 border-t border-zinc-500/10">
          <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Trading Volume</span>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <Bar dataKey="volume" fill="#0284c7" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}