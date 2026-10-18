import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AddHoldingModal({ isOpen, onClose, onAdd, prefill = null }) {
  const { theme } = useTheme();
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [assetClass, setAssetClass] = useState('Stocks');
  const [shares, setShares] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [manualMarketValue, setManualMarketValue] = useState('');

  useEffect(() => {
    if (prefill) {
      setTicker(prefill.ticker || '');
      setName(prefill.name || '');
      setAssetClass(prefill.assetClass || 'Stocks');
    } else {
      setTicker('');
      setName('');
      setAssetClass('Stocks');
      setShares('');
      setCostBasis('');
      setManualMarketValue('');
    }
  }, [prefill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ticker: ticker.toUpperCase(),
      name,
      assetClass,
      shares: assetClass === 'Liquid' ? 0 : Number(shares),
      costBasis: assetClass === 'Liquid' ? 0 : Number(costBasis),
      manualMarketValue: assetClass === 'Liquid' ? Number(manualMarketValue) : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md p-5 rounded-xl border shadow-2xl relative transition-all ${
          theme === 'dark' ? 'bg-[#0c101c] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-md text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold tracking-tight mb-4">Add Asset / Security</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Asset Category</label>
            <select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              className={`w-full border rounded-lg p-2 text-xs font-medium focus:outline-none ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'
              }`}
            >
              <option value="Stocks">Indian Equities (NSE/BSE)</option>
              <option value="ETFs">Index ETFs & Mutual Funds</option>
              <option value="Alternatives">Alternatives (Gold / SGB / Silver)</option>
              <option value="Liquid">Liquid (FD / Savings / Liquid Fund)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold block mb-1">Symbol / Code</label>
              <input
                type="text"
                required
                placeholder="e.g. RELIANCE"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className={`w-full border rounded-lg p-2 text-xs font-medium focus:outline-none uppercase ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Asset Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Reliance Industries"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-lg p-2 text-xs font-medium focus:outline-none ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'
                }`}
              />
            </div>
          </div>

          {assetClass === 'Liquid' ? (
            <div>
              <label className="text-xs font-semibold block mb-1">Total Valuation (₹)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="100000"
                value={manualMarketValue}
                onChange={(e) => setManualMarketValue(e.target.value)}
                className={`w-full border rounded-lg p-2 text-xs font-medium focus:outline-none ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'
                }`}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold block mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="50"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs font-medium focus:outline-none ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Avg Buy Price (₹)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="2450.50"
                  value={costBasis}
                  onChange={(e) => setCostBasis(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs font-medium focus:outline-none ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'
                  }`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-3 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md transition text-xs"
          >
            Save to TiDB Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}