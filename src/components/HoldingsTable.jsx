import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatINR, formatPercent } from '../utils/formatters';
import { useDraggableScroll } from '../utils/useDraggableScroll';

export default function HoldingsTable({ holdings = [], onDeleteHolding }) {
  const { theme } = useTheme();
  const scrollRef = useDraggableScroll();
  const categories = ['Stocks', 'ETFs', 'Alternatives', 'Liquid'];
  const safeHoldings = Array.isArray(holdings) ? holdings : [];

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border shadow-xl transition-all ${
        theme === 'dark'
          ? 'bg-[#0b101c]/90 border-zinc-800/80 text-zinc-100'
          : 'bg-white/95 border-zinc-200/90 text-zinc-800'
      }`}
    >
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto select-none no-scrollbar cursor-grab active:cursor-grabbing"
      >
        <table className="w-full text-left text-xs whitespace-nowrap min-w-[1100px]">
          <thead>
            <tr className="bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 text-white font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4 w-28">Symbol</th>
              <th className="py-3.5 px-4 w-64">Instrument Name</th>
              <th className="py-3.5 px-3 text-right w-24">Qty / Units</th>
              <th className="py-3.5 px-3 text-right w-28">Avg Buy Price</th>
              <th className="py-3.5 px-3 text-right w-28">CMP (LTP)</th>
              <th className="py-3.5 px-3 text-right w-32">Current Value</th>
              <th className="py-3.5 px-3 text-right w-32">Total Investment</th>
              <th className="py-3.5 px-3 text-right w-32">Unrealized P&L</th>
              <th className="py-3.5 px-3 text-right w-24">Net Return</th>
              <th className="py-3.5 px-3 text-right w-20">Yield</th>
              <th className="py-3.5 px-3 text-right w-20">Weight</th>
              <th className="py-3.5 px-3 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-zinc-800/60' : 'divide-zinc-200/80'}`}>
            {safeHoldings.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-zinc-400 font-medium font-sans">
                  No investments recorded yet. Click "+ Add Investment" in the sidebar.
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const items = safeHoldings.filter((h) => h?.assetClass === category);
                if (items.length === 0) return null;

                return (
                  <React.Fragment key={category}>
                    <tr
                      className={`${
                        theme === 'dark'
                          ? 'bg-sky-500/10 text-sky-400 border-l-4 border-sky-400'
                          : 'bg-sky-50 text-sky-700 border-l-4 border-sky-500'
                      }`}
                    >
                      <td colSpan={12} className="py-2.5 px-4 font-bold uppercase tracking-wider text-[11px]">
                        {category}
                      </td>
                    </tr>

                    {items.map((item) => {
                      const gainLossRupees = Number(item.gainLossRupees || 0);
                      const gainLossPercent = Number(item.gainLossPercent || 0);
                      const weight = Number(item.weight || 0);
                      const isProfit = gainLossRupees > 0;
                      const isLoss = gainLossRupees < 0;

                      return (
                        <tr
                          key={item.id || item.ticker}
                          className={`transition-colors ${
                            theme === 'dark' ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-100/70'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold">
                            <span className="px-2.5 py-1 rounded bg-zinc-500/10 border border-zinc-500/20 font-mono text-[11px]">
                              {item.ticker}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-zinc-100">{item.name}</td>
                          <td className="py-3 px-3 text-right font-mono font-medium">
                            {item.shares !== null && item.shares !== undefined ? item.shares : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-zinc-400">
                            {item.costBasis !== null && item.costBasis !== undefined
                              ? formatINR(item.costBasis, 2)
                              : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            {item.currentPrice !== null && item.currentPrice !== undefined
                              ? formatINR(item.currentPrice, 2)
                              : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            {formatINR(item.marketValue, 2)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-zinc-400">
                            {formatINR(item.totalCost, 2)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                                isProfit
                                  ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                  : isLoss
                                  ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                                  : 'text-zinc-400'
                              }`}
                            >
                              {formatINR(gainLossRupees, 2)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            <span
                              className={
                                isProfit ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-zinc-400'
                              }
                            >
                              {formatPercent(gainLossPercent, 2)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-zinc-400">
                            {item.estimatedDivYield ? `${item.estimatedDivYield.toFixed(1)}%` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-sky-400">
                            {weight.toFixed(2)}%
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => onDeleteHolding(item.id)}
                              className="p-1.5 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                              title="Delete Holding"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}