import { Badge } from '@/components/ui/badge';
import { stageLabel } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Voronka bosqichi belgisi.
 *
 * Rang yagona ma'no tashuvchisi emas — yozuv har doim yonida turadi.
 * Shu sabab rang ko'rmaydigan foydalanuvchi ham bosqichni o'qiy oladi.
 */
const TONE: Record<string, string> = {
  started: 'bg-muted text-muted-foreground',
  awaiting_subscription: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  subscribed: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200',
  awaiting_phone: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  phone_shared: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  completed: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
};

export function StageBadge({ stage }: { stage: string }) {
  return (
    <Badge variant="secondary" className={cn('font-normal', TONE[stage])}>
      {stageLabel(stage)}
    </Badge>
  );
}
