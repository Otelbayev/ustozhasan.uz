'use client';

/**
 * Voronka: har bir bosqichda nechta odam qolgan.
 *
 * Bitta ohang ishlatilgan (rang bosqich kimligini bildirmaydi) — chunki
 * ma'noni ustunning UZUNLIGI va yonidagi YOZUV tashiydi. Har bosqichga
 * alohida rang berish qo'shimcha ma'lumot bermaydi, faqat rang ko'rligida
 * chalkashlik tug'diradi.
 *
 * Gorizontal ustunlar tanlandi: bosqich nomlari uzun ("Obuna kutilmoqda"),
 * vertikalda ular bir-birining ustiga tushib ketardi.
 */

import { useState } from 'react';

type Stage = { key: string; label: string; count: number };

const BAR_HEIGHT = 22; // ≤24px

export function FunnelChart({ stages, total }: { stages: Stage[]; total: number }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(1, ...stages.map((s) => s.count));

  return (
    <div className="space-y-2.5">
      {stages.map((stage) => {
        const width = (stage.count / max) * 100;
        const share = total ? Math.round((stage.count / total) * 100) : 0;
        const isActive = active === stage.key;

        return (
          <div
            key={stage.key}
            className="group grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-3"
            onMouseEnter={() => setActive(stage.key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(stage.key)}
            onBlur={() => setActive(null)}
            tabIndex={0}
          >
            <span className="truncate text-sm text-muted-foreground">{stage.label}</span>

            <div className="flex items-center gap-2">
              <div className="relative h-[22px] flex-1">
                <div
                  className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[filter]"
                  style={{
                    width: `${Math.max(width, stage.count > 0 ? 1.5 : 0)}%`,
                    height: BAR_HEIGHT,
                    background: 'var(--viz-series-1)',
                    filter: isActive ? 'brightness(1.12)' : undefined,
                  }}
                />
              </div>

              {/* Qiymat ustun uchida — har bosqichda bitta son, ortiqchasi yo'q */}
              <span className="w-20 shrink-0 text-sm tabular-nums">
                <span className="font-semibold">{stage.count}</span>{' '}
                <span className="text-xs text-muted-foreground">{share}%</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
