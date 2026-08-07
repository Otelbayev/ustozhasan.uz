import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  '1': 'Parol noto\'g\'ri',
  rate: 'Juda ko\'p urinish. 15 daqiqadan keyin qayta urinib ko\'ring.',
};

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const params = await searchParams;
  const pick = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const error = pick('error');
  const next = pick('next') ?? '/';

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-xl bg-secondary">
            <Lock className="size-5" />
          </div>
          <CardTitle className="text-xl">Ustoz Hasan — Admin</CardTitle>
          <CardDescription>Davom etish uchun parolni kiriting</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Oddiy HTML forma — JavaScript'siz ham ishlaydi */}
          <form action="/api/login" method="post" className="space-y-4">
            <input type="hidden" name="next" value={next} />

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                required
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {ERRORS[error] ?? 'Kirish amalga oshmadi'}
              </p>
            )}

            <Button type="submit" className="w-full">
              Kirish
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
