import Link from 'next/link';
import { LogOut, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            <span className="hidden sm:inline">Ustoz Hasan</span>
          </Link>

          <MainNav />

          <form action="/api/logout" method="post" className="ml-auto">
            <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
