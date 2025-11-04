'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  Key,
  ExternalLink,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface Purchase {
  id: string;
  listing_id: string;
  buyer_wallet: string;
  seller_wallet: string;
  amount: number;
  transaction_signature: string;
  purchased_at: number;
  status: string;
  access_granted: boolean;
  access_key?: string;
  access_url?: string;
  listing?: {
    title: string;
    description: string;
    seller: string;
    category: string;
  } | null;
}

export default function PurchasesPage() {
  const wallet = useWallet();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      loadPurchases();
    }
  }, [wallet.connected, wallet.publicKey]);

  async function loadPurchases() {
    if (!wallet.publicKey) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/purchases?buyer_wallet=${wallet.publicKey.toString()}`
      );
      const data = await response.json();

      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!wallet.connected) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="card p-12 text-center max-w-md">
          <div className="mb-6">
            <ShoppingBag className="mx-auto text-[#ff6b35]" size={64} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to view your purchases
          </p>
          <div className="wallet-adapter-button-trigger mx-auto">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Marketplace
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                My Purchases
              </h1>
              <p className="text-gray-400">Products you've purchased</p>
            </div>

            <div className="wallet-adapter-button-trigger">
              <WalletMultiButton />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#ff6b35]" size={48} />
          </div>
        ) : purchases.length === 0 ? (
          <div className="card p-16 text-center">
            <ShoppingBag className="mx-auto mb-6 text-gray-600" size={64} />
            <h2 className="text-2xl font-bold mb-4">No Purchases Yet</h2>
            <p className="text-gray-400 mb-6">
              Browse the marketplace and purchase products to see them here
            </p>
            <Link
              href="/marketplace"
              className="inline-block px-8 py-3 bg-[#ff6b35] hover:bg-[#ff8c5a] rounded-lg font-semibold transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="card p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {purchase.listing?.title || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {purchase.listing?.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>Seller: {purchase.listing?.seller || 'Unknown'}</span>
                          <span>•</span>
                          <span className="capitalize">{purchase.listing?.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#ff6b35] mb-1">
                          ${purchase.amount.toFixed(2)}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            purchase.status === 'completed'
                              ? 'bg-green-900/20 text-green-400'
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}
                        >
                          <CheckCircle size={12} />
                          {purchase.status}
                        </span>
                      </div>
                    </div>

                    {/* Access Information */}
                    {purchase.access_granted && (
                      <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Key className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                          <div className="flex-1">
                            <div className="font-semibold text-green-400 mb-2">
                              Access Granted
                            </div>

                            {purchase.access_key && (
                              <div className="mb-2">
                                <div className="text-xs text-gray-400 mb-1">Access Key:</div>
                                <div className="flex items-center gap-2">
                                  <code className="flex-1 px-3 py-2 bg-black/50 rounded font-mono text-sm">
                                    {purchase.access_key}
                                  </code>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(purchase.access_key!);
                                      alert('Access key copied to clipboard!');
                                    }}
                                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                            )}

                            {purchase.access_url && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Access URL:</div>
                                <a
                                  href={purchase.access_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-[#ff6b35] hover:text-[#ff8c5a] transition-colors"
                                >
                                  {purchase.access_url}
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            )}

                            <div className="mt-3 text-xs text-gray-500">
                              Purchased on {new Date(purchase.purchased_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="card p-6 bg-gradient-to-r from-[#ff6b35]/10 to-[#e85a26]/10 border-[#ff6b35]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Purchases</div>
                  <div className="text-2xl font-bold">{purchases.length} products</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                  <div className="text-2xl font-bold text-[#ff6b35]">
                    ${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
