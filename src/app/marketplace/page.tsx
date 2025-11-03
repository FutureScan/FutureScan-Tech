'use client';

import { useEffect, useState } from 'react';
import { MarketplaceListing } from '@/types';
import { getMarketplaceListings, submitListing, X402_CONFIG } from '@/lib/marketplace-api';
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
  ExternalLink,
  Search,
  Plus,
  X,
  Loader2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Wallet,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceListing['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [listingStep, setListingStep] = useState(1); // 1: Payment, 2: Details, 3: Review
  const [submittingListing, setSubmittingListing] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'signals' as MarketplaceListing['category'],
    price: '',
    seller: '',
    preview: '',
    features: ['', '', ''],
    transactionSignature: '',
  });

  useEffect(() => {
    loadListings();

    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem('marketplace_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [selectedCategory]);

  async function loadListings() {
    try {
      setLoading(true);
      const data = await getMarketplaceListings(
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setListings(data);
    } catch (error) {
      console.error('Error loading marketplace listings:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(X402_CONFIG.FEE_WALLET_ADDRESS);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmitListing = async () => {
    setSubmittingListing(true);

    try {
      const result = await submitListing(
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          seller: formData.seller,
          seller_rating: 0,
          preview: formData.preview || undefined,
          features: formData.features.filter(f => f.trim() !== ''),
          verified: false,
        },
        formData.transactionSignature
      );

      if (result.success) {
        alert('✅ Listing submitted successfully! It will appear after review.');
        setShowListingForm(false);
        setListingStep(1);
        setFormData({
          title: '',
          description: '',
          category: 'signals',
          price: '',
          seller: '',
          preview: '',
          features: ['', '', ''],
          transactionSignature: '',
        });
        loadListings();
      } else {
        alert(`❌ ${result.error || 'Failed to submit listing'}`);
      }
    } catch (error) {
      alert('❌ An error occurred. Please try again.');
    } finally {
      setSubmittingListing(false);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return formData.transactionSignature.length >= 64;
    }
    if (step === 2) {
      return (
        formData.title.length > 0 &&
        formData.description.length > 0 &&
        formData.price.length > 0 &&
        parseFloat(formData.price) > 0 &&
        formData.seller.length > 0 &&
        formData.features.filter(f => f.trim() !== '').length >= 3
      );
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(listingStep)) {
      setListingStep(listingStep + 1);
    } else {
      alert('Please fill in all required fields correctly');
    }
  };

  const prevStep = () => {
    setListingStep(listingStep - 1);
  };

  const closeTutorial = () => {
    localStorage.setItem('marketplace_tutorial_seen', 'true');
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const reopenTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'signals':
        return <TrendingUp size={18} />;
      case 'research':
        return <FileText size={18} />;
      case 'data':
        return <Database size={18} />;
      case 'tools':
        return <Zap size={18} />;
      case 'bots':
        return <Bot size={18} />;
      case 'api':
        return <Code size={18} />;
      default:
        return <ShoppingCart size={18} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'signals':
        return 'Trading Signals';
      case 'research':
        return 'Research Reports';
      case 'data':
        return 'Market Data';
      case 'tools':
        return 'Trading Tools';
      case 'bots':
        return 'Automation Bots';
      case 'api':
        return 'API Access';
      default:
        return category;
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                X402 Marketplace
              </h1>
              <p className="text-gray-400">
                The world's premier crypto marketplace
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={reopenTutorial}
                className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-800 rounded-lg font-medium transition-all"
              >
                <Info size={18} />
                <span className="hidden md:inline">How It Works</span>
              </button>
              <button
                onClick={() => setShowListingForm(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all shadow-lg shadow-[#ff6b35]/20"
              >
                <Plus size={20} />
                List Your Product
              </button>
            </div>
          </div>

          {/* Legal Banner */}
          <div className="card p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-200">
                <strong>Platform Notice:</strong> Sellers pay a one-time {X402_CONFIG.LISTING_FEE_SOL} SOL fee to list products.
                Buyers pay directly to sellers with no platform fees. All products are for informational and educational purposes only.
                <button
                  onClick={() => setShowTerms(true)}
                  className="underline ml-1 hover:text-blue-300"
                >
                  View Terms & Compliance
                </button>
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
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Filter by Category:</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all' as const, label: 'All Categories', icon: <ShoppingCart size={16} /> },
                { value: 'signals' as const, label: 'Signals', icon: <TrendingUp size={16} /> },
                { value: 'data' as const, label: 'Data', icon: <Database size={16} /> },
                { value: 'research' as const, label: 'Research', icon: <FileText size={16} /> },
                { value: 'tools' as const, label: 'Tools', icon: <Zap size={16} /> },
                { value: 'bots' as const, label: 'Bots', icon: <Bot size={16} /> },
                { value: 'api' as const, label: 'API', icon: <Code size={16} /> },
              ].map((category) => {
                const isActive = selectedCategory === category.value;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-[#ff6b35] text-white'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {category.icon}
                    {category.label}
                  </button>
                );
              })}
            </div>
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
                The X402 Marketplace is ready for sellers. List your crypto products, services, or data and reach thousands of traders worldwide.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <CheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                  <div className="text-sm font-semibold mb-1">Zero Buyer Fees</div>
                  <div className="text-xs text-gray-500">Customers pay full price to you</div>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <CheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                  <div className="text-sm font-semibold mb-1">Global Reach</div>
                  <div className="text-xs text-gray-500">Access crypto traders worldwide</div>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <CheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                  <div className="text-sm font-semibold mb-1">0.1 SOL Fee</div>
                  <div className="text-xs text-gray-500">One-time listing fee only</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowListingForm(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-bold text-lg transition-all shadow-2xl shadow-[#ff6b35]/30"
                >
                  <Plus size={24} />
                  List Your First Product
                </button>
                <button
                  onClick={reopenTutorial}
                  className="flex items-center gap-2 px-6 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-800 rounded-lg font-semibold transition-all"
                >
                  <Info size={20} />
                  Watch Tutorial
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              return (
                <div
                  key={listing.id}
                  className="card p-6 hover:border-[#ff6b35]/50 transition-all group"
                >
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
                    <span className="text-gray-400">{listing.total_sales.toLocaleString()} sales</span>
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
                      {listing.features.length > 3 && (
                        <li className="text-xs text-gray-500 ml-5">
                          +{listing.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Preview */}
                  {listing.preview && (
                    <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300">
                      <span className="font-semibold">Preview: </span>{listing.preview}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="mb-4 p-3 bg-[#0a0a0a] rounded-lg border border-gray-800">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#ff6b35]">
                        ${listing.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-green-400">No platform fees</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group">
                    <ShoppingCart size={18} />
                    Purchase Now
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Seller */}
                  <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
                    <span>by {listing.seller}</span>
                    <span>{formatDistanceToNow(listing.created_at, { addSuffix: true })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Professional Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] border-2 border-[#ff6b35]/50 rounded-2xl max-w-3xl w-full shadow-2xl shadow-[#ff6b35]/30 my-4">
              {/* Tutorial Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold gradient-text">Welcome to X402 Marketplace</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Learn how to buy and sell</p>
                  </div>
                  <button
                    onClick={closeTutorial}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Tutorial Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {tutorialStep === 0 && (
                  <div className="space-y-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#e85a26] mb-2">
                      <ShoppingCart className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">World's Premier Crypto Marketplace</h3>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto">
                      Buy and sell premium crypto products with zero buyer fees. Powered by Solana for instant verification.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg">
                        <Shield className="text-green-500 mx-auto mb-2" size={24} />
                        <div className="text-sm font-bold mb-1">On-Chain Verified</div>
                        <div className="text-xs text-gray-400">Solana blockchain security</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg">
                        <Zap className="text-blue-500 mx-auto mb-2" size={24} />
                        <div className="text-sm font-bold mb-1">Zero Buyer Fees</div>
                        <div className="text-xs text-gray-400">Pay sellers directly</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg">
                        <TrendingUp className="text-purple-500 mx-auto mb-2" size={24} />
                        <div className="text-sm font-bold mb-1">Premium Products</div>
                        <div className="text-xs text-gray-400">Signals, data, tools & more</div>
                      </div>
                    </div>
                  </div>
                )}

                {tutorialStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ff6b35]/20 mb-2">
                        <Search className="text-[#ff6b35]" size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-1">Browsing & Buying</h3>
                      <p className="text-sm text-gray-400">How to find and purchase products</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6b35] flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <div className="text-sm font-semibold mb-0.5">Browse Categories</div>
                          <div className="text-xs text-gray-400">Filter by Signals, Data, Research, Tools, Bots, or API</div>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6b35] flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <div className="text-sm font-semibold mb-0.5">Review Details</div>
                          <div className="text-xs text-gray-400">Check seller ratings, features, and pricing</div>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6b35] flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <div className="text-sm font-semibold mb-0.5">Purchase Directly</div>
                          <div className="text-xs text-gray-400">Pay sellers directly - no platform fees!</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                        <div className="text-xs text-blue-200">
                          <strong>Pro Tip:</strong> Look for verified sellers (green shield) for the best experience
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tutorialStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 mb-2">
                        <Plus className="text-green-500" size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-1">Selling Your Products</h3>
                      <p className="text-sm text-gray-400">List once, sell globally</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <div className="text-sm font-semibold mb-0.5">Pay One-Time Fee</div>
                          <div className="text-xs text-gray-400">Send 0.1 SOL (verified on-chain automatically)</div>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <div className="text-sm font-semibold mb-0.5">Fill Product Details</div>
                          <div className="text-xs text-gray-400">Title, description, category, price, features</div>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <div className="text-sm font-semibold mb-0.5">Go Live</div>
                          <div className="text-xs text-gray-400">Listing appears after review (within 24 hours)</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <CheckCircle className="text-green-500 mb-1.5" size={18} />
                        <div className="text-xs font-semibold mb-0.5">Keep 100% of Sales</div>
                        <div className="text-[10px] text-gray-400">No commission or hidden fees</div>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <CheckCircle className="text-green-500 mb-1.5" size={18} />
                        <div className="text-xs font-semibold mb-0.5">Global Audience</div>
                        <div className="text-[10px] text-gray-400">Reach crypto traders worldwide</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tutorial Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-[#0a0a0a]/50">
                <button
                  onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                  disabled={tutorialStep === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={14} />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all ${
                        step === tutorialStep ? 'bg-[#ff6b35] w-6' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {tutorialStep < 2 ? (
                  <button
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                    className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={closeTutorial}
                    className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-semibold transition-all"
                  >
                    <CheckCircle size={14} />
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Professional Listing Form Modal - Step Wizard */}
        {showListingForm && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#0a0a0a] border-2 border-[#ff6b35]/40 rounded-2xl max-w-2xl w-full shadow-2xl shadow-[#ff6b35]/20 my-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-bold gradient-text">List on X402 Marketplace</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Join the world's premier crypto marketplace</p>
                </div>
                <button
                  onClick={() => {
                    setShowListingForm(false);
                    setListingStep(1);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-3 px-5 py-3 bg-[#0a0a0a]/50">
                {[
                  { num: 1, label: 'Payment', icon: Wallet },
                  { num: 2, label: 'Details', icon: FileText },
                  { num: 3, label: 'Review', icon: CheckCircle },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = listingStep === step.num;
                  const isCompleted = listingStep > step.num;
                  return (
                    <div key={step.num} className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
                        isActive ? 'bg-[#ff6b35] text-white' :
                        isCompleted ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-800 text-gray-500'
                      }`}>
                        <Icon size={14} />
                        <span className="text-xs font-semibold">{step.label}</span>
                      </div>
                      {idx < 2 && (
                        <ArrowRight size={14} className="text-gray-700" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="p-5 max-h-[55vh] overflow-y-auto">
                {/* STEP 1: PAYMENT */}
                {listingStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ff6b35]/20 mb-2">
                        <Wallet className="text-[#ff6b35]" size={24} />
                      </div>
                      <h3 className="text-lg font-bold mb-1">One-Time Listing Fee</h3>
                      <p className="text-xs text-gray-400">
                        Pay {MARKETPLACE_CONFIG.POSTING_FEE_SOL} SOL to list your product on the world's premier crypto marketplace
                      </p>
                    </div>

                    {/* Wallet Address */}
                    <div className="p-3 bg-gradient-to-r from-[#ff6b35]/10 to-purple-500/10 border border-[#ff6b35]/30 rounded-lg">
                      <div className="text-xs font-semibold text-[#ff6b35] mb-2">SEND {MARKETPLACE_CONFIG.POSTING_FEE_SOL} SOL TO:</div>
                      <div className="flex items-center gap-2 p-3 bg-black rounded border border-gray-800">
                        <code className="flex-1 text-xs text-white font-mono break-all">
                          {MARKETPLACE_CONFIG.FEE_WALLET_ADDRESS}
                        </code>
                        <button
                          onClick={copyWalletAddress}
                          className="flex-shrink-0 p-2 bg-[#ff6b35]/20 hover:bg-[#ff6b35]/30 rounded transition-colors"
                        >
                          {copiedWallet ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} className="text-[#ff6b35]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Transaction Signature Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Paste Transaction Signature
                      </label>
                      <input
                        type="text"
                        value={formData.transactionSignature}
                        onChange={(e) => setFormData({ ...formData, transactionSignature: e.target.value })}
                        placeholder="Paste your Solana transaction signature here..."
                        className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg font-mono text-sm transition-colors focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        ✓ Find this in your wallet after sending the payment
                      </p>
                    </div>

                    {/* Why List Here */}
                    <div className="mt-4 p-2.5 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <div className="text-xs font-semibold text-blue-400 mb-1.5">🌍 Why List on FutureScan X402?</div>
                      <ul className="text-xs text-gray-400 space-y-0.5">
                        <li>• <strong>Zero buyer fees</strong> - customers pay full price to you</li>
                        <li>• <strong>Global reach</strong> - access crypto traders worldwide</li>
                        <li>• <strong>Premium audience</strong> - serious traders with real budgets</li>
                        <li>• <strong>Instant credibility</strong> - verified seller status</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS */}
                {listingStep === 2 && (
                  <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(55vh - 100px)' }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Product Title *</label>
                        <input
                          type="text"
                          maxLength={100}
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Premium Bitcoin Trading Signals"
                          className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as MarketplaceListing['category'] })}
                          className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none text-sm"
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
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Price (USD) *</label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="99.99"
                          className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Description *</label>
                        <textarea
                          rows={3}
                          maxLength={300}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe your product and its value..."
                          className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none resize-none text-sm"
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">{formData.description.length}/300</div>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Seller Name *</label>
                        <input
                          type="text"
                          maxLength={50}
                          value={formData.seller}
                          onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                          placeholder="Your name or company"
                          className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Key Features (min 3) *</label>
                        {formData.features.slice(0, 3).map((feature, idx) => (
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
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none mb-2 text-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW */}
                {listingStep === 3 && (
                  <div className="space-y-3">
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-2">
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                      <h3 className="text-lg font-bold mb-1">Review Your Listing</h3>
                      <p className="text-xs text-gray-400">Confirm everything looks perfect</p>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg space-y-2.5">
                      <div>
                        <div className="text-xs text-gray-500">Title</div>
                        <div className="text-sm font-semibold">{formData.title}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Category</div>
                        <div className="text-sm">{getCategoryLabel(formData.category)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-500">Price</div>
                          <div className="text-base font-bold text-[#ff6b35]">${formData.price}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Seller</div>
                          <div className="text-sm">{formData.seller}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Description</div>
                        <div className="text-xs text-gray-400">{formData.description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Features</div>
                        <ul className="text-xs text-gray-400 space-y-0.5">
                          {formData.features.filter(f => f.trim()).map((f, idx) => (
                            <li key={idx}>✓ {f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-green-300">
                        <strong>✓ Payment Verified</strong> - Your listing will go live within 24 hours after review
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-[#0a0a0a]/50">
                <button
                  onClick={prevStep}
                  disabled={listingStep === 1}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>

                <div className="text-xs text-gray-500">
                  Step {listingStep} of 3
                </div>

                {listingStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitListing}
                    disabled={submittingListing}
                    className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    {submittingListing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        Submit Listing
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl max-w-3xl max-h-[80vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-4 text-[#ff6b35]">Terms of Service & Legal Compliance</h2>

              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">⚠️ Important Disclaimer</h3>
                  <p>
                    All products, services, data, and information provided on the X402 Marketplace are for
                    <strong> INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY</strong>. Nothing on this platform
                    constitutes financial, investment, legal, or tax advice.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">📋 User Responsibilities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You are solely responsible for your investment decisions</li>
                    <li>Conduct your own due diligence before purchasing any product or service</li>
                    <li>Cryptocurrency investments carry significant risk of loss</li>
                    <li>Past performance does not guarantee future results</li>
                    <li>Consult with qualified financial advisors before making investment decisions</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">💰 Platform Fees & Payments</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Sellers pay a one-time {MARKETPLACE_CONFIG.POSTING_FEE_SOL} SOL fee to list products</li>
                    <li>Fees are sent to Solana wallet: <code className="bg-gray-800 px-2 py-0.5 rounded text-xs break-all">{MARKETPLACE_CONFIG.FEE_WALLET_ADDRESS}</code></li>
                    <li>Buyers pay directly to sellers with NO platform fees</li>
                    <li>Supported payment methods: Cryptocurrency (SOL, ETH, USDT, USDC), Credit/Debit cards</li>
                    <li>All sales are final - no refunds unless explicitly stated by seller</li>
                    <li>Buyers are responsible for any applicable taxes</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">🔐 Data Privacy & Security</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>We comply with GDPR, CCPA, and other data protection regulations</li>
                    <li>Personal data is encrypted and stored securely</li>
                    <li>We never sell user data to third parties</li>
                    <li>Wallet addresses may be publicly visible on blockchain explorers</li>
                    <li>Users can request data deletion at any time</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">⚖️ Legal Compliance</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Platform operates in compliance with applicable securities laws</li>
                    <li>Products do not constitute securities offerings</li>
                    <li>No guarantees of profit or returns are made</li>
                    <li>Users must be 18+ years old to use this platform</li>
                    <li>Platform reserves the right to refuse service to users in restricted jurisdictions</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">🛡️ Seller Verification</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Verified sellers have passed identity and background checks</li>
                    <li>Platform does not guarantee performance of any listed product</li>
                    <li>Report suspicious activity to support@futurescan.io</li>
                    <li>Sellers must comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">🚫 Prohibited Activities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Market manipulation, insider trading, or pump-and-dump schemes</li>
                    <li>Selling stolen data, private keys, or compromised accounts</li>
                    <li>Money laundering or financing of illegal activities</li>
                    <li>Impersonation or fraudulent misrepresentation</li>
                    <li>Violating intellectual property rights</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">📞 Contact & Support</h3>
                  <p>
                    For questions, concerns, or legal inquiries, contact us at:
                    <br />
                    Email: <a href="mailto:legal@futurescan.io" className="text-[#ff6b35] hover:underline">legal@futurescan.io</a>
                    <br />
                    Support: <a href="mailto:support@futurescan.io" className="text-[#ff6b35] hover:underline">support@futurescan.io</a>
                  </p>
                </section>

                <div className="pt-4 border-t border-gray-800 text-xs text-gray-500">
                  Last Updated: {new Date().toLocaleDateString()}
                  <br />
                  By using this marketplace, you acknowledge that you have read, understood, and agree to these terms.
                </div>
              </div>

              <button
                onClick={() => setShowTerms(false)}
                className="mt-6 w-full py-3 bg-[#ff6b35] hover:bg-[#ff8c5a] rounded-lg font-semibold transition-colors"
              >
                I Understand & Accept
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
