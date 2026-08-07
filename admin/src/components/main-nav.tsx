'use client';

/**
 * Asosiy menyu.
 *
 * Ro'yxat va ikonkalar shu client komponent ICHIDA turadi: React
 * funksiyalarni (ikonka komponentini) server komponentdan client
 * komponentga uzatishga ruxsat bermaydi — ular seriyalanmaydi.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { href: '/users', label: 'Foydalanuvchilar', icon: Users },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="ml-4 flex items-center gap-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
