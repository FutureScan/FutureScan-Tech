'use client';

import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import {
  ShoppingCart,
  Star,
  Shield,
  TrendingUp,
  Database,
  FileText,
  Zap,
  Bot,
  Code,
  CheckCircle,
  Info,
  Search,
  Plus,
  X,
  Loader2,
  Sparkles,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PaymentToken } from '@/types/marketplace';
import { TOKEN_CONFIGS, formatTokenAmount } from '@/lib/tokens';
import { executeDirectPayment, checkBalance } from '@/lib/x402-client';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: 'signals' | 'research' | 'data' | 'tools' | 'bots' | 'api';
  price: number;
  payment_token: PaymentToken;
  seller: string;
  seller_wallet: string;
  features: string[];
  verified: boolean;
  created_at: number;
  updated_at: number;
  total_sales: number;
  seller_rating: number;
  delivery_type?: string;
  access_info?: string;
}

export default function MarketplacePage() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Listing | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'signals' as Listing['category'],
    price: '',
    payment_token: 'SOL' as PaymentToken,
    seller: '',
    features: ['', '', ''],
  });

  useEffect(() => {
    loadListings();
  }, [selectedCategory]);

  async function loadListings() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);

      const response = await fetch(`/api/listings?${params}`);
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  }

  // Create Listing with Payment Token Selection
  async function handleCreateListing() {
    // Check wallet connection
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.price || !formData.seller) {
      alert('Please fill in all required fields');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length < 3) {
      alert('Please provide at least 3 features');
      return;
    }

    setCreating(true);

    try {
      // Create listing with selected payment token
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          payment_token: formData.payment_token,
          seller: formData.seller,
          seller_wallet: wallet.publicKey.toString(),
          features: validFeatures,
          delivery_type: 'instant',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success!
        setShowSuccess(true);
        setShowListingForm(false);
        setFormData({
          title: '',
          description: '',
          category: 'signals',
          price: '',
          payment_token: 'SOL',
          seller: '',
          features: ['', '', ''],
        });

        // Reload listings
        await loadListings();

        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        alert(`Failed to create listing: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  }

  // Purchase with X402 Payment Protocol
  async function handlePurchase(listing: Listing) {
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    // Check if trying to buy own listing
    if (listing.seller_wallet === wallet.publicKey.toString()) {
      alert('You cannot purchase your own listing');
      return;
    }

    setPurchasing(true);
    setSelectedProduct(listing);

    try {
      // Step 1: Check balance
      const balanceCheck = await checkBalance(
        listing.price,
        listing.payment_token,
        wallet,
        connection
      );

      if (!balanceCheck.sufficient) {
        alert(
          `Insufficient ${listing.payment_token} balance!\n\nRequired: ${listing.price} ${listing.payment_token}\nYour balance: ${balanceCheck.balance.toFixed(4)} ${listing.payment_token}`
        );
        setPurchasing(false);
        setSelectedProduct(null);
        return;
      }

      // Step 2: Execute payment
      const paymentResult = await executeDirectPayment(
        {
          amount: listing.price,
          token: listing.payment_token,
          recipient: listing.seller_wallet,
          memo: `Purchase: ${listing.title}`,
        },
        wallet,
        connection
      );

      if (!paymentResult.success) {
        alert(`Payment failed: ${paymentResult.error || 'Unknown error'}`);
        setPurchasing(false);
        setSelectedProduct(null);
        return;
      }

      // Step 3: Record purchase
      const purchaseResponse = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          buyer_wallet: wallet.publicKey.toString(),
          transaction_signature: paymentResult.signature,
        }),
      });

      const purchaseResult = await purchaseResponse.json();

      if (purchaseResponse.ok && purchaseResult.success) {
        alert(
          `Purchase successful! 🎉\n\nTransaction: ${paymentResult.signature?.substring(0, 20)}...\n\nAccess Key: ${purchaseResult.purchase.access_key}\n\nCheck your purchases page for details!`
        );
        await loadListings();
      } else {
        alert(`Failed to record purchase: ${purchaseResult.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setPurchasing(false);
      setSelectedProduct(null);
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'signals': return <TrendingUp size={18} />;
      case 'research': return <FileText size={18} />;
      case 'data': return <Database size={18} />;
      case 'tools': return <Zap size={18} />;
      case 'bots': return <Bot size={18} />;
      case 'api': return <Code size={18} />;
      default: return <ShoppingCart size={18} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      signals: 'Trading Signals',
      research: 'Research Reports',
      data: 'Market Data',
      tools: 'Trading Tools',
      bots: 'Automation Bots',
      api: 'API Access',
    };
    return labels[category] || category;
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Success Toast */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top">
              <div className="glass-card bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/50 backdrop-blur-xl border border-green-400/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="font-bold">Listing Created!</div>
                  <div className="text-sm text-green-100">Your product is now live on the Marketplace</div>
                </div>
              </div>
            </div>
          )}

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-5xl md:text-6xl font-black">
                  <span className="gradient-text neon-text">Marketplace</span>
                </h1>
                <div className="px-4 py-1.5 neon-border rounded-full glass-card animate-pulse">
                  <span className="text-sm font-bold text-green-400">FREE</span>
                </div>
              </div>
              <p className="text-gray-400 text-lg">Buy and sell crypto intelligence products</p>
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-[#ff6b35] via-purple-500 to-transparent rounded-full"></div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* My Purchases Link */}
              {wallet.connected && wallet.publicKey && (
                <Link
                  href="/marketplace/purchases"
                  className="flex items-center gap-2 px-5 py-2.5 glass-card hover:bg-gray-800/80 rounded-xl font-medium transition-all hover:scale-105 shine"
                >
                  <ShoppingCart size={18} className="text-[#ff6b35]" />
                  <span className="hidden md:inline">My Purchases</span>
                </Link>
              )}

              {/* My Dashboard Link */}
              {wallet.connected && wallet.publicKey && (
                <Link
                  href="/marketplace/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 glass-card hover:bg-gray-800/80 rounded-xl font-medium transition-all hover:scale-105 shine"
                >
                  <Wallet size={18} className="text-[#ff6b35]" />
                  <span className="hidden md:inline">My Dashboard</span>
                </Link>
              )}

              {/* Wallet Connect */}
              <div className="wallet-adapter-button-trigger">
                <WalletMultiButton />
              </div>

              {/* Create Listing Button */}
              <button
                onClick={() => {
                  if (!wallet.connected) {
                    alert('Please connect your wallet to list products');
                    return;
                  }
                  setShowListingForm(true);
                }}
                className="cyber-button flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 glow-orange"
              >
                <Plus size={20} />
                <span className="hidden md:inline">List Product</span>
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="glass-card holographic p-5 rounded-2xl mb-6 border border-[#ff6b35]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 pulse-ring">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">Free Marketplace</h3>
                <p className="text-sm text-gray-300">
                  List your crypto products at no cost. Zero listing fees, zero buyer fees. Instant publishing.
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6 group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-[#ff6b35] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 glass-card border border-gray-800/50 focus:border-[#ff6b35]/50 rounded-2xl focus:outline-none transition-all text-lg"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff6b35]/0 via-[#ff6b35]/10 to-[#ff6b35]/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { value: 'all', label: 'All Categories', icon: <ShoppingCart size={16} /> },
              { value: 'signals', label: 'Signals', icon: <TrendingUp size={16} /> },
              { value: 'data', label: 'Data', icon: <Database size={16} /> },
              { value: 'research', label: 'Research', icon: <FileText size={16} /> },
              { value: 'tools', label: 'Tools', icon: <Zap size={16} /> },
              { value: 'bots', label: 'Bots', icon: <Bot size={16} /> },
              { value: 'api', label: 'API', icon: <Code size={16} /> },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
                  selectedCategory === cat.value
                    ? 'cyber-button text-white glow-orange'
                    : 'glass-card hover:bg-gray-800/80 text-gray-300 hover:text-white'
                }`}
              >
                <span className={selectedCategory === cat.value ? 'text-white' : 'text-[#ff6b35] group-hover:text-[#ff6b35]'}>
                  {cat.icon}
                </span>
                {cat.label}
                {selectedCategory === cat.value && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-2/3 mb-4" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-full mb-2" />
                <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="glass-card neon-border p-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#e85a26]/10 mb-8 pulse-ring">
                <ShoppingCart className="text-[#ff6b35]" size={56} />
                <div className="absolute inset-0 rounded-full bg-[#ff6b35]/20 animate-ping"></div>
              </div>
              <h2 className="text-4xl font-black mb-4 gradient-text">Be the First to List</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                The FutureScan Marketplace is ready. List your crypto products and reach thousands of traders worldwide.
              </p>
              <button
                onClick={() => setShowListingForm(true)}
                className="cyber-button inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:scale-105 glow-orange"
              >
                <Plus size={28} />
                List Your First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="card-3d p-6 group shine">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b35]/30 to-[#e85a26]/20 text-[#ff6b35] group-hover:scale-110 transition-transform">
                      {getCategoryIcon(listing.category)}
                    </div>
                    {listing.verified && (
                      <div className="relative">
                        <Shield className="text-green-400" size={18} />
                        <span className="absolute inset-0 bg-green-400/20 rounded-full blur-md animate-pulse"></span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full glass-card text-gray-300 uppercase font-bold">
                    {getCategoryLabel(listing.category)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#ff6b35] transition-colors line-clamp-2">
                  {listing.title}
                </h3>

                {/* Seller Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg glass-card">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="font-bold text-yellow-400">{listing.seller_rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-400 font-medium">{listing.total_sales} sales</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                  {listing.description}
                </p>

                {/* Features */}
                <div className="mb-5">
                  <div className="text-xs font-bold text-[#ff6b35] mb-3 tracking-wider">KEY FEATURES</div>
                  <ul className="space-y-2">
                    {listing.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={14} />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-4 glass-card rounded-xl border border-[#ff6b35]/20 holographic">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black gradient-text">
                      ${listing.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="text-green-400" size={14} />
                      <span className="text-xs text-green-400 font-bold">No fees</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handlePurchase(listing)}
                  disabled={purchasing || (wallet.connected && listing.seller_wallet === wallet.publicKey?.toString())}
                  className="cyber-button w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {purchasing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : wallet.connected && listing.seller_wallet === wallet.publicKey?.toString() ? (
                    <>
                      <Shield size={20} />
                      Your Listing
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Purchase Now
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </>
                  )}
                </button>

                {/* Seller */}
                <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
                  <span>by {listing.seller}</span>
                  <span>{formatDistanceToNow(listing.created_at, { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        {showListingForm && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] border-2 border-[#ff6b35]/50 rounded-2xl max-w-2xl w-full shadow-2xl shadow-[#ff6b35]/30 my-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold gradient-text">List on Marketplace</h2>
                  <p className="text-xs text-gray-500 mt-1">Free listing - no payment required</p>
                </div>
                <button
                  onClick={() => !creating && setShowListingForm(false)}
                  disabled={creating}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {creating ? (
                  // Creating Listing State
                  <div className="text-center py-12">
                    <Loader2 size={64} className="mx-auto mb-4 text-[#ff6b35] animate-spin" />
                    <h3 className="text-xl font-bold mb-2">Creating Your Listing...</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Please wait while we publish your product
                    </p>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300 max-w-md mx-auto">
                      <strong>Free Publishing:</strong> No payment required
                    </div>
                  </div>
                ) : (
                  // Form Fields
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Product Title *</label>
                      <input
                        type="text"
                        maxLength={100}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Premium Bitcoin Trading Signals"
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as Listing['category'] })}
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                        >
                          <option value="signals">Trading Signals</option>
                          <option value="data">Market Data</option>
                          <option value="research">Research</option>
                          <option value="tools">Tools</option>
                          <option value="bots">Bots</option>
                          <option value="api">API</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Price (USD) *</label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="99.99"
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                      <textarea
                        rows={4}
                        maxLength={300}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product and its value..."
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none resize-none"
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">{formData.description.length}/300</div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Seller Name *</label>
                      <input
                        type="text"
                        maxLength={50}
                        value={formData.seller}
                        onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                        placeholder="Your name or company"
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Key Features (min 3) *</label>
                      {formData.features.map((feature, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={80}
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[idx] = e.target.value;
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          placeholder={`Feature ${idx + 1}`}
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none mb-2"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!creating && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-[#0a0a0a]/50">
                  <div className="text-xs text-gray-500">
                    Free listing - no fees required
                  </div>
                  <button
                    onClick={handleCreateListing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                  >
                    <Sparkles size={18} />
                    Create Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
