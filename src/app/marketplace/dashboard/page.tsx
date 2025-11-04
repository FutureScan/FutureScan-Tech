'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import type { Listing, Order } from '@/types/marketplace';

export default function DashboardPage() {
  const wallet = useWallet();

  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      loadDashboardData();
    }
  }, [wallet.connected, wallet.publicKey]);

  async function loadDashboardData() {
    if (!wallet.publicKey) return;

    try {
      setLoading(true);

      // Load my listings
      const listingsRes = await fetch(
        `/api/listings?seller_wallet=${wallet.publicKey.toString()}`
      );
      const listingsData = await listingsRes.json();
      setListings(listingsData.listings || []);

      // Load my orders (sales)
      const ordersRes = await fetch(
        `/api/orders?seller_wallet=${wallet.publicKey.toString()}`
      );
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);

    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteListing(listingId: string) {
    if (!wallet.publicKey) return;
    if (!confirm('Are you sure you want to delete this listing?')) return;

    setDeleting(listingId);

    try {
      const response = await fetch(
        `/api/listings?id=${listingId}&seller_wallet=${wallet.publicKey.toString()}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove from state
        setListings(listings.filter(l => l.id !== listingId));
        alert('Listing deleted successfully');
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  }

  const stats = {
    totalListings: listings.length,
    totalSales: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
    activeListings: listings.filter(l => l.total_sales < 100).length,
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="card p-12 text-center max-w-md">
          <div className="mb-6">
            <Package className="mx-auto text-[#ff6b35]" size={64} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to access your seller dashboard
          </p>
          <div className="wallet-adapter-button-trigger mx-auto">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative p-4 md:p-8">
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
                Seller Dashboard
              </h1>
              <p className="text-gray-400">Manage your listings and track sales</p>
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
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="glass-card p-6 holographic group hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                    <Package className="text-blue-400" size={28} />
                  </div>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Listings</span>
                </div>
                <div className="text-4xl font-black gradient-text animate-count">{stats.totalListings}</div>
              </div>

              <div className="glass-card p-6 holographic group hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10">
                    <ShoppingBag className="text-green-400" size={28} />
                  </div>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Sales</span>
                </div>
                <div className="text-4xl font-black text-green-400 animate-count">{stats.totalSales}</div>
              </div>

              <div className="glass-card p-6 holographic group hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#e85a26]/10 pulse-ring">
                    <DollarSign className="text-[#ff6b35]" size={28} />
                  </div>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Revenue</span>
                </div>
                <div className="text-4xl font-black gradient-text animate-count">${stats.totalRevenue.toFixed(2)}</div>
              </div>

              <div className="glass-card p-6 holographic group hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10">
                    <TrendingUp className="text-purple-400" size={28} />
                  </div>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active</span>
                </div>
                <div className="text-4xl font-black text-purple-400 animate-count">{stats.activeListings}</div>
              </div>
            </div>

            {/* My Listings */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black gradient-text">My Listings</h2>
                <Link
                  href="/marketplace"
                  className="cyber-button px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create New
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className="card p-12 text-center">
                  <Package className="mx-auto mb-4 text-gray-600" size={48} />
                  <h3 className="text-xl font-bold mb-2">No Listings Yet</h3>
                  <p className="text-gray-400 mb-4">
                    Create your first listing to start selling
                  </p>
                  <Link
                    href="/marketplace"
                    className="inline-block px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8c5a] rounded-lg font-semibold transition-colors"
                  >
                    Create Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="card p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{listing.title}</h3>
                              <p className="text-sm text-gray-400 mb-3">
                                {listing.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#ff6b35]">
                                ${listing.price_usd.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {listing.total_sales} sales
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {listing.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="capitalize">{listing.category}</span>
                            <span>•</span>
                            <span>
                              Created {new Date(listing.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // TODO: Implement edit
                              alert('Edit functionality coming soon!');
                            }}
                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit listing"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            disabled={deleting === listing.id}
                            className="p-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete listing"
                          >
                            {deleting === listing.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Sales</h2>

              {orders.length === 0 ? (
                <div className="card p-12 text-center">
                  <ShoppingBag className="mx-auto mb-4 text-gray-600" size={48} />
                  <h3 className="text-xl font-bold mb-2">No Sales Yet</h3>
                  <p className="text-gray-400">
                    Your sales will appear here once customers purchase your products
                  </p>
                </div>
              ) : (
                <div className="card">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                            Product
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                            Buyer
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.purchase_id} className="border-b border-gray-800/50">
                            <td className="px-6 py-4">
                              <div className="font-semibold">{order.listing_title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-400">{order.buyer_name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-[#ff6b35]">
                                ${order.amount.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-400">
                                {new Date(order.purchased_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'completed'
                                    ? 'bg-green-900/20 text-green-400'
                                    : 'bg-yellow-900/20 text-yellow-400'
                                }`}
                              >
                                {order.status === 'completed' ? (
                                  <CheckCircle size={12} />
                                ) : (
                                  <AlertCircle size={12} />
                                )}
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
}
