'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Newspaper,
  TrendingUp,
  Zap,
  Settings,
  FileText,
  Mail,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/insiders', icon: TrendingUp, label: 'Insiders' },
  { href: '/signals', icon: Zap, label: 'Signals' },
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
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-[#2a2a2a] flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="FutureScan" width={48} height={48} />
            <h1 className="text-2xl font-bold gradient-text">FutureScan</h1>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#ff6b35] text-white'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-[#2a2a2a] space-y-2">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#2a2a2a] z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 ${
                  isActive ? 'text-[#ff6b35]' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
