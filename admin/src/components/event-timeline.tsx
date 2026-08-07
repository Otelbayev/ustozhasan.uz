import {
  Play,
  MousePointerClick,
  BookOpen,
  Radio,
  RadioTower,
  CircleX,
  Phone,
  PhoneOff,
  Circle,
  type LucideIcon,
} from 'lucide-react';
import type { FunnelEvent } from '@/lib/api';
import { eventLabel, formatDateTime, timeAgo } from '@/lib/format';

/**
 * Foydalanuvchi botda nima qilgani — vaqt bo'yicha, eng yangisi tepada.
 *
 * Har bir hodisa yonida belgi (icon) turadi: holat faqat rang orqali
 * berilmaydi — yozuv va belgi ham bor.
 */
const ICONS: Record<string, LucideIcon> = {
  start: Play,
  begin_funnel_clicked: MousePointerClick,
  course_viewed: BookOpen,
  subscription_required: Radio,
  subscription_confirmed: RadioTower,
  subscription_check_failed: CircleX,
  phone_requested: Phone,
  phone_shared: Phone,
  phone_skipped: PhoneOff,
};

function MetaLine({ meta }: { meta: Record<string, unknown> | null }) {
  if (!meta) return null;

  const entries = Object.entries(meta).filter(([, value]) => value !== null && value !== undefined);
  if (entries.length === 0) return null;

  return (
    <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
      {entries.map(([key, value]) => (
        <span key={key} className="font-mono">
          {key}: {String(value)}
        </span>
      ))}
    </div>
  );
}

export function EventTimeline({ events }: { events: FunnelEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Hodisa yozilmagan. (Bu foydalanuvchi yangilanishdan oldin kelgan bo&apos;lishi mumkin.)
      </p>
    );
  }

  return (
    <ol className="relative space-y-0">
      {events.map((event, index) => {
        const Icon = ICONS[event.event_type] ?? Circle;
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-3 pb-4">
            {/* Ulovchi chiziq */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-7 left-[13px] h-[calc(100%-1rem)] w-px bg-border"
              />
            )}

            <span className="relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border bg-background">
              <Icon className="size-3.5 text-muted-foreground" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium">{eventLabel(event.event_type)}</span>
                <span className="text-xs text-muted-foreground" title={formatDateTime(event.created_at)}>
                  {timeAgo(event.created_at)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDateTime(event.created_at)}
              </div>
              <MetaLine meta={event.meta} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
