'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { getCryptoDetails } from '@/lib/crypto-api';

export function CryptoCalculator() {
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('0');
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadBtcPrice();
  }, []);

  useEffect(() => {
    if (btcPrice > 0) {
      const amount = parseFloat(fromAmount) || 0;
      setToAmount((amount * btcPrice).toFixed(2));
    }
  }, [fromAmount, btcPrice]);

  async function loadBtcPrice() {
    try {
      const btc = await getCryptoDetails('bitcoin');
      if (btc && btc.current_price) {
        setBtcPrice(btc.current_price);
        setError(false);
      } else {
        setError(true);
        // Use fallback price
        setBtcPrice(50000);
      }
    } catch (error) {
      console.error('Failed to load BTC price:', error);
      setError(true);
      // Use fallback price
      setBtcPrice(50000);
    } finally {
      setLoading(false);
    }
  }

  function handleSwap() {
    if (btcPrice > 0) {
      const amount = parseFloat(toAmount) || 0;
      setFromAmount((amount / btcPrice).toFixed(8));
      setToAmount(fromAmount);
    }
  }

  return (
    <div className="card p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent"></div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">Quick Calculator</h3>
        <p className="text-sm text-gray-500 font-mono">BTC to USD Converter</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-[#ff6b35]/10 rounded-xl" />
          <div className="h-16 bg-[#ff6b35]/10 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 mb-2">
              Using cached price data
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 mb-2 block font-medium">BTC Amount</label>
            <div className="flex items-center gap-2 bg-black/50 rounded-xl p-4 border border-[#ff6b35]/20 focus-within:border-[#ff6b35]/40 transition-colors">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent flex-1 outline-none text-2xl font-mono"
                placeholder="0.00"
                step="0.00000001"
              />
              <span className="text-gray-500 font-mono font-bold">BTC</span>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="w-full flex items-center justify-center p-3 hover:bg-[#ff6b35]/10 rounded-xl transition-colors group"
          >
            <ArrowDownUp className="text-[#ff6b35] group-hover:rotate-180 transition-transform duration-300" size={24} />
          </button>

          <div>
            <label className="text-sm text-gray-400 mb-2 block font-medium">USD Value</label>
            <div className="flex items-center gap-2 bg-black/50 rounded-xl p-4 border border-[#ff6b35]/20 focus-within:border-[#ff6b35]/40 transition-colors">
              <span className="text-gray-500 font-bold">$</span>
              <input
                type="number"
                value={toAmount}
                onChange={(e) => {
                  setToAmount(e.target.value);
                  const amount = parseFloat(e.target.value) || 0;
                  if (btcPrice > 0) {
                    setFromAmount((amount / btcPrice).toFixed(8));
                  }
                }}
                className="bg-transparent flex-1 outline-none text-2xl font-mono"
                placeholder="0.00"
              />
              <span className="text-gray-500 font-mono font-bold">USD</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-[#ff6b35]/10">
            <p className="text-xs text-gray-500 font-mono">
              1 BTC = <span className="text-[#ff6b35] font-bold">${btcPrice.toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
