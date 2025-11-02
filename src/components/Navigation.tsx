'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Newspaper,
  TrendingUp,
  Zap,
  ShoppingCart,
  Settings,
  FileText,
  Mail,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/insiders', icon: TrendingUp, label: 'Insiders' },
  { href: '/signals', icon: Zap, label: 'Signals' },
  { href: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const secondaryItems = [
  { href: '/whitepaper', icon: FileText, label: 'Whitepaper' },
  { href: '/privacy', icon: FileText, label: 'Privacy Policy' },
  { href: '/support', icon: Mail, label: 'Support' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-black/95 backdrop-blur-xl border-r border-[#ff6b35]/20 flex-col z-50">
        {/* Logo with glow */}
        <div className="p-6 border-b border-[#ff6b35]/20 relative">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff6b35] blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Image
                src="/logo.png"
                alt="FutureScan"
                width={48}
                height={48}
                className="relative z-10"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">FutureScan</h1>
              <p className="text-xs text-[#ff6b35]/60 font-mono">v1.0</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#e85a26] text-white shadow-lg shadow-[#ff6b35]/30'
                    : 'text-gray-400 hover:text-white hover:bg-[#ff6b35]/10'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-[#ff6b35] blur-md opacity-50 rounded-xl"></div>
                )}
                <Icon size={20} className="relative z-10" />
                <span className="font-medium relative z-10">{item.label}</span>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-[#ff6b35]/20 space-y-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-[#ff6b35]/10 text-[#ff6b35]'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-[#ff6b35]/5'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Version info */}
          <div className="pt-4 mt-4 border-t border-[#ff6b35]/10">
            <p className="text-xs text-gray-600 text-center font-mono">
              Powered by AI
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-[#ff6b35]/20 z-50">
        <div className="flex justify-around items-center h-20 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 rounded-lg transition-all ${
                  isActive ? 'text-[#ff6b35]' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent rounded-b-full"></div>
                )}
                <Icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,107,53,0.6)]' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
