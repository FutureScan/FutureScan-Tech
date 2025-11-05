'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAppStore } from '@/store/app-store';
import { CryptoAsset } from '@/types';
import { getTopCryptos, searchCrypto } from '@/lib/crypto-api';
import {
  Search,
  Plus,
  Trash2,
  Star,
  Bell,
  Eye,
  Shield,
  Wallet as WalletIcon,
  ShoppingBag,
  Database,
  Settings as SettingsIcon,
  User,
  Mail,
  DollarSign,
  Moon,
  Sun,
  Globe,
  Check,
  AlertTriangle,
  Download,
  Trash,
} from 'lucide-react';
import Image from 'next/image';

type SettingsTab = 'account' | 'notifications' | 'display' | 'watchlist' | 'privacy' | 'marketplace' | 'data';

export default function SettingsPage() {
  const wallet = useWallet();
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();

  // Tab state
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Watchlist search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoAsset[]>([]);
  const [topCryptos, setTopCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Account
    displayName: '',
    email: '',
    // Notifications
    priceAlerts: true,
    signalAlerts: true,
    marketplaceAlerts: true,
    emailNotifications: false,
    pushNotifications: true,
    // Display
    theme: 'dark' as 'dark' | 'light',
    currency: 'USD',
    timeFormat: '24h' as '12h' | '24h',
    language: 'en',
    // Privacy
    dataCollection: true,
    analytics: true,
    publicProfile: false,
    // Marketplace
    defaultPaymentToken: 'SOL' as 'SOL' | 'USDC' | 'USDT',
    autoApprove: false,
    sellerNotifications: true,
  });

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTopCryptos();
    loadSettings();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  async function loadTopCryptos() {
    try {
      setLoading(true);
      const cryptos = await getTopCryptos(50);
      setTopCryptos(cryptos);
    } catch (error) {
      console.error('Error loading top cryptos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const results = await searchCrypto(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cryptos:', error);
    } finally {
      setSearching(false);
    }
  }

  function loadSettings() {
    // Load from localStorage
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings({ ...settings, ...JSON.parse(saved) });
    }
  }

  function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  }

  function handleExportData() {
    const data = {
      settings,
      watchlist,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futurescan-data-${Date.now()}.json`;
    a.click();
    setSaveMessage('Data exported successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  }

  function handleClearCache() {
    if (confirm('Are you sure you want to clear all cached data? This will refresh all information.')) {
      localStorage.clear();
      setSaveMessage('Cache cleared successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  }

  const displayCryptos = searchQuery.length > 1 ? searchResults : topCryptos;

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'display' as SettingsTab, label: 'Display', icon: Eye },
    { id: 'watchlist' as SettingsTab, label: 'Watchlist', icon: Star },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Shield },
    { id: 'marketplace' as SettingsTab, label: 'Marketplace', icon: ShoppingBag },
    { id: 'data' as SettingsTab, label: 'Data & API', icon: Database },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#e85a26]/10">
              <SettingsIcon className="text-[#ff6b35]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Settings</h1>
              <p className="text-gray-400">Manage your preferences and configuration</p>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg flex items-center gap-3">
            <Check className="text-green-400" size={20} />
            <span className="text-green-400 font-medium">{saveMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-4">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#ff6b35] text-white'
                        : 'hover:bg-gray-800 text-gray-400'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="text-[#ff6b35]" size={24} />
                    Account Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Wallet Connection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <WalletIcon size={16} className="inline mr-2" />
                        Connected Wallet
                      </label>
                      <div className="flex items-center gap-3">
                        <WalletMultiButton />
                        {wallet.connected && wallet.publicKey && (
                          <div className="flex-1 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <span className="text-green-400 text-sm font-mono">
                              {wallet.publicKey.toString().slice(0, 8)}...{wallet.publicKey.toString().slice(-8)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Connect your Solana wallet to use marketplace and other features
                      </p>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                        placeholder="Enter your display name"
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Mail size={16} className="inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Optional - for email notifications and alerts
                      </p>
                    </div>

                    <button
                      onClick={saveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                    >
                      Save Account Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Bell className="text-[#ff6b35]" size={24} />
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Price Alerts */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Price Alerts</div>
                        <div className="text-sm text-gray-500">Get notified when prices reach your targets</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, priceAlerts: !settings.priceAlerts })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.priceAlerts ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.priceAlerts ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Signal Alerts */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">AI Signal Alerts</div>
                        <div className="text-sm text-gray-500">Receive notifications for new trading signals</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, signalAlerts: !settings.signalAlerts })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.signalAlerts ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.signalAlerts ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Marketplace Alerts */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Marketplace Alerts</div>
                        <div className="text-sm text-gray-500">New purchases, sales, and marketplace activity</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, marketplaceAlerts: !settings.marketplaceAlerts })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.marketplaceAlerts ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.marketplaceAlerts ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Email Notifications</div>
                        <div className="text-sm text-gray-500">Receive notifications via email</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Push Notifications</div>
                        <div className="text-sm text-gray-500">Browser push notifications</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.pushNotifications ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={saveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                    >
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Eye className="text-[#ff6b35]" size={24} />
                    Display Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Theme
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setSettings({ ...settings, theme: 'dark' })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === 'dark'
                              ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <Moon size={24} className="mx-auto mb-2" />
                          <div className="text-sm font-semibold">Dark Mode</div>
                        </button>
                        <button
                          onClick={() => setSettings({ ...settings, theme: 'light' })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === 'light'
                              ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <Sun size={24} className="mx-auto mb-2" />
                          <div className="text-sm font-semibold">Light Mode</div>
                        </button>
                      </div>
                    </div>

                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <DollarSign size={16} className="inline mr-2" />
                        Display Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="BTC">BTC (₿)</option>
                      </select>
                    </div>

                    {/* Time Format */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Time Format
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setSettings({ ...settings, timeFormat: '12h' })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            settings.timeFormat === '12h'
                              ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-sm font-semibold">12-Hour (AM/PM)</div>
                        </button>
                        <button
                          onClick={() => setSettings({ ...settings, timeFormat: '24h' })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            settings.timeFormat === '24h'
                              ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-sm font-semibold">24-Hour</div>
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Globe size={16} className="inline mr-2" />
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>

                    <button
                      onClick={saveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                    >
                      Save Display Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Watchlist Management */}
            {activeTab === 'watchlist' && (
              <div className="space-y-6">
                {/* Current Watchlist */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="text-[#ff6b35]" size={20} />
                    <h2 className="text-xl font-bold">Your Watchlist</h2>
                    <span className="text-sm text-gray-500">
                      ({watchlist.length} coins)
                    </span>
                  </div>

                  {watchlist.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Your watchlist is empty. Add coins below to track them.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {watchlist.map((item) => (
                        <div
                          key={item.coin_id}
                          className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
                        >
                          <span className="font-medium uppercase">{item.symbol}</span>
                          <button
                            onClick={() => removeFromWatchlist(item.coin_id)}
                            className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-500 transition-colors"
                            title="Remove from watchlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search & Add */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-4">Add Coins to Watchlist</h2>

                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search for cryptocurrencies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-[#ff6b35] transition-colors"
                    />
                    {searching && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#ff6b35] border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Crypto List */}
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg animate-pulse"
                        >
                          <div className="w-10 h-10 bg-gray-800 rounded-full" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-800 rounded w-1/4 mb-2" />
                            <div className="h-3 bg-gray-800 rounded w-1/3" />
                          </div>
                          <div className="h-10 w-24 bg-gray-800 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {displayCryptos.map((crypto) => {
                        const inWatchlist = isInWatchlist(crypto.id);

                        return (
                          <div
                            key={crypto.id}
                            className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors"
                          >
                            {crypto.image && (
                              <Image
                                src={crypto.image}
                                alt={crypto.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            )}

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{crypto.name}</h3>
                              <p className="text-sm text-gray-500 uppercase">
                                {crypto.symbol}
                              </p>
                            </div>

                            <div className="text-right mr-4">
                              <p className="font-mono font-semibold">
                                ${crypto.current_price.toLocaleString()}
                              </p>
                              <p
                                className={`text-sm ${
                                  crypto.price_change_percentage_24h >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }`}
                              >
                                {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                inWatchlist
                                  ? removeFromWatchlist(crypto.id)
                                  : addToWatchlist(crypto.id, crypto.symbol)
                              }
                              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                inWatchlist
                                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                  : 'bg-[#ff6b35] text-white hover:bg-[#e85a26]'
                              }`}
                            >
                              {inWatchlist ? (
                                <>
                                  <Trash2 size={16} />
                                  Remove
                                </>
                              ) : (
                                <>
                                  <Plus size={16} />
                                  Add
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="text-[#ff6b35]" size={24} />
                    Privacy & Security
                  </h2>

                  <div className="space-y-4">
                    {/* Data Collection */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Data Collection</div>
                        <div className="text-sm text-gray-500">Allow us to collect usage data to improve our service</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, dataCollection: !settings.dataCollection })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.dataCollection ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.dataCollection ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Analytics</div>
                        <div className="text-sm text-gray-500">Help us understand how you use the app</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, analytics: !settings.analytics })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.analytics ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.analytics ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Public Profile */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Public Profile</div>
                        <div className="text-sm text-gray-500">Make your marketplace profile visible to others</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, publicProfile: !settings.publicProfile })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.publicProfile ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.publicProfile ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-yellow-200">
                        <strong>Privacy Note:</strong> Your wallet address and transaction history are publicly visible on the Solana blockchain. We never store your private keys.
                      </div>
                    </div>

                    <button
                      onClick={saveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Marketplace Settings */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ShoppingBag className="text-[#ff6b35]" size={24} />
                    Marketplace Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Default Payment Token */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Default Payment Token
                      </label>
                      <select
                        value={settings.defaultPaymentToken}
                        onChange={(e) => setSettings({ ...settings, defaultPaymentToken: e.target.value as any })}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 focus:border-[#ff6b35] rounded-lg transition-colors focus:outline-none"
                      >
                        <option value="SOL">◎ SOL - Solana</option>
                        <option value="USDC">$ USDC - USD Coin</option>
                        <option value="USDT">₮ USDT - Tether USD</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        Your preferred token for marketplace purchases
                      </p>
                    </div>

                    {/* Auto-Approve Purchases */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Auto-Approve Manual Deliveries</div>
                        <div className="text-sm text-gray-500">Automatically approve delivery confirmations for your purchases</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.autoApprove ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.autoApprove ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Seller Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">Seller Notifications</div>
                        <div className="text-sm text-gray-500">Get notified when someone purchases your products</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, sellerNotifications: !settings.sellerNotifications })}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          settings.sellerNotifications ? 'bg-[#ff6b35]' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full transition-transform ${
                            settings.sellerNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={saveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#e85a26] hover:from-[#ff8c5a] hover:to-[#ff6b35] rounded-lg font-semibold transition-all"
                    >
                      Save Marketplace Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data & API Settings */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Database className="text-[#ff6b35]" size={24} />
                    Data Management
                  </h2>

                  <div className="space-y-4">
                    {/* Export Data */}
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold mb-1">Export Your Data</div>
                          <div className="text-sm text-gray-500">Download all your settings and watchlist data</div>
                        </div>
                        <button
                          onClick={handleExportData}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                        >
                          <Download size={16} />
                          Export
                        </button>
                      </div>
                    </div>

                    {/* Clear Cache */}
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold mb-1">Clear Cache</div>
                          <div className="text-sm text-gray-500">Remove all cached data and refresh information</div>
                        </div>
                        <button
                          onClick={handleClearCache}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors"
                        >
                          <Trash size={16} />
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* API Keys Section */}
                    <div className="p-4 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-gray-700">
                      <div className="text-center py-6">
                        <Database className="mx-auto mb-3 text-gray-600" size={40} />
                        <div className="font-semibold mb-1">API Access</div>
                        <div className="text-sm text-gray-500 mb-4">
                          API keys for developers coming soon
                        </div>
                        <div className="text-xs text-gray-600">
                          Connect to FutureScan data programmatically
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
