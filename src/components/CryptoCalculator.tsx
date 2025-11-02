'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { getCryptoDetails } from '@/lib/crypto-api';

export function CryptoCalculator() {
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('0');
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
      setBtcPrice(btc.current_price);
    } catch (error) {
      console.error('Failed to load BTC price:', error);
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
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Calculator</h3>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-800 rounded" />
          <div className="h-12 bg-gray-800 rounded" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">BTC Amount</label>
            <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg p-3">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent flex-1 outline-none text-xl"
                placeholder="0.00"
                step="0.00000001"
              />
              <span className="text-gray-500 font-mono">BTC</span>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="w-full flex items-center justify-center p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <ArrowDownUp className="text-gray-500" size={20} />
          </button>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">USD Value</label>
            <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg p-3">
              <span className="text-gray-500">$</span>
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
                className="bg-transparent flex-1 outline-none text-xl"
                placeholder="0.00"
              />
              <span className="text-gray-500 font-mono">USD</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            1 BTC = ${btcPrice.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
