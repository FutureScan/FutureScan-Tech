'use client';

import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { executeX402Request } from '@/lib/x402-client';
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

interface Listing {
  id: string;
  title: string;
  description: string;
  category: 'signals' | 'research' | 'data' | 'tools' | 'bots' | 'api';
  price: number;
  seller: string;
  features: string[];
  verified: boolean;
  created_at: number;
  total_sales: number;
  seller_rating: number;
}

export default function X402MarketplacePage() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'signals' as Listing['category'],
    price: '',
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

  // Create Listing (No Payment Required)
  async function handleCreateListing() {
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
      // Direct POST - no payment required
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          seller: formData.seller,
          features: validFeatures,
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-500/50 flex items-center gap-3">
              <CheckCircle size={24} />
              <div>
                <div className="font-bold">Listing Created!</div>
                <div className="text-sm text-green-100">Your product is now live on X402 Marketplace</div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="gradient-text">X402</span> Marketplace
                </h1>
                <div className="px-3 py-1 bg-[#ff6b35]/20 border border-[#ff6b35]/50 rounded-full">
                  <span className="text-xs font-bold text-[#ff6b35]">PROTOCOL</span>
                </div>
              </div>
              <p className="text-gray-400">Instant payments powered by HTTP 402</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Wallet Connect */}
              <div className="wallet-adapter-button-trigger">
                <WalletMultiButton />
              </div>

              {/* Create Listing Button */}
              <button
                onClick={() => setShowListingForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all shadow-lg shadow-[#ff6b35]/30"
              >
                <Plus size={20} />
                <span className="hidden md:inline">List Product</span>
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="card p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-200">
                <strong>Free Marketplace:</strong> List your crypto products at no cost. Zero listing fees, zero buyer fees. Instant publishing.
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-[#ff6b35] transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-2/3 mb-4" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-20 bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="card p-16 text-center border-2 border-dashed border-gray-800">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#ff6b35]/10 mb-6">
                <ShoppingCart className="text-[#ff6b35]" size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Be the First to List</h2>
              <p className="text-gray-400 text-lg mb-6">
                The X402 Marketplace is ready. List your crypto products and reach thousands of traders worldwide.
              </p>
              <button
                onClick={() => setShowListingForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-bold text-lg transition-all shadow-2xl shadow-[#ff6b35]/30"
              >
                <Plus size={24} />
                List Your First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="card p-6 hover:border-[#ff6b35]/50 transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#ff6b35]/20 text-[#ff6b35]">
                      {getCategoryIcon(listing.category)}
                    </div>
                    {listing.verified && (
                      <Shield className="text-green-500" size={16} />
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400 uppercase">
                    {getCategoryLabel(listing.category)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#ff6b35] transition-colors">
                  {listing.title}
                </h3>

                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={14} />
                    <span className="font-semibold">{listing.seller_rating}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{listing.total_sales} sales</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {listing.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 mb-2">KEY FEATURES:</div>
                  <ul className="space-y-1">
                    {listing.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={12} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-3 bg-[#0a0a0a] rounded-lg border border-gray-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-[#ff6b35]">
                      ${listing.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-green-400">No fees</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group">
                  <ShoppingCart size={18} />
                  Purchase Now
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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

        {/* Create Listing Modal - X402 Protocol */}
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
                    Fee: 0.1 SOL (one-time listing fee)
                  </div>
                  <button
                    onClick={handleCreateListing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                  >
                    <Sparkles size={18} />
                    Create Listing (x402)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
