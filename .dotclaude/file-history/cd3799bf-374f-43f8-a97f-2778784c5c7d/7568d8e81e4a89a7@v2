'use client';

import { useEffect, useState } from 'react';
import { MarketplaceListing } from '@/types';
import { getMarketplaceListings, calculatePlatformFee, MARKETPLACE_CONFIG } from '@/lib/marketplace-api';
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
  AlertTriangle,
  Info,
  ExternalLink,
  Search,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceListing['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    loadListings();
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
                X403 Marketplace
              </h1>
              <p className="text-gray-400">
                Premium crypto data, signals, tools, and research from verified sellers
              </p>
            </div>
          </div>

          {/* Legal Banner */}
          <div className="card p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-200">
                <strong>Legal Notice:</strong> All products are for informational and educational purposes only.
                Not financial advice. Platform takes {MARKETPLACE_CONFIG.PLATFORM_FEE_PERCENTAGE}% fee on all transactions.
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
          <div className="card p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg mb-2">No listings found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const platformFee = calculatePlatformFee(listing.price);
              const sellerReceives = listing.price - platformFee;

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
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-2xl font-bold text-[#ff6b35]">
                        ${listing.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">USD</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Platform fee: ${platformFee.toFixed(2)} • Seller receives: ${sellerReceives.toFixed(2)}
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

        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl max-w-3xl max-h-[80vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-4 text-[#ff6b35]">Terms of Service & Legal Compliance</h2>

              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-2">⚠️ Important Disclaimer</h3>
                  <p>
                    All products, services, data, and information provided on the X403 Marketplace are for
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
                    <li>Platform charges a {MARKETPLACE_CONFIG.PLATFORM_FEE_PERCENTAGE}% fee on all transactions</li>
                    <li>Fees are deducted automatically and sent to: <code className="bg-gray-800 px-2 py-0.5 rounded text-xs">{MARKETPLACE_CONFIG.FEE_WALLET_ADDRESS}</code></li>
                    <li>Supported payment methods: Cryptocurrency (ETH, USDT, USDC), Credit/Debit cards</li>
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
