import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Bitta ko'rsatkich.
 *
 * Bu yerda grafik yo'q va bo'lishi ham shart emas: bitta joriy son uchun
 * eng aniq shakl — sonning o'zi. Bitta ustunli diagramma faqat joy egallaydi.
 */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="px-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
        </div>
        <div className="mt-1.5 text-2xl font-semibold">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
