import { AppShell } from '@/components/app-shell';

/**
 * Himoyalangan sahifalar uchun umumiy ko'rinish.
 * Kirish tekshiruvi src/proxy.ts da — bu yerda takrorlanmaydi.
 */
export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return <AppShell>{children}</AppShell>;
}
