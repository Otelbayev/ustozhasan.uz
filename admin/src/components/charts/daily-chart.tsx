'use client';

/**
 * Oxirgi 30 kun: yangi foydalanuvchilar va raqam qoldirganlar.
 *
 * Ikki qator — shuning uchun izoh (legend) doim ko'rinadi va oxirgi
 * nuqtalar to'g'ridan-to'g'ri belgilanadi: kimlik faqat rangga bog'liq
 * bo'lib qolmasin.
 *
 * Hover: vertikal ko'rsatkich chiziq eng yaqin kunga yopishadi va bitta
 * oynachada IKKALA qatorning qiymati chiqadi — sichqonchani aynan chiziq
 * ustiga olib borish shart emas.
 */

import { useState } from 'react';
import { useChartWidth } from './use-chart-width';

type Point = { date: string; new_users: number; with_phone: number };

const HEIGHT = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 34 };

const SERIES = [
  { key: 'new_users' as const, label: 'Yangi foydalanuvchi', color: 'var(--viz-series-1)' },
  { key: 'with_phone' as const, label: 'Raqam qoldirgan', color: 'var(--viz-series-2)' },
];

function niceMax(value: number): number {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function shortDate(iso: string) {
  const [, month, day] = iso.split('-');
  return `${Number(day)}.${month}`;
}

export function DailyChart({ data }: { data: Point[] }) {
  const { ref, width } = useChartWidth();
  const [active, setActive] = useState<number | null>(null);

  const plotWidth = Math.max(1, width - PAD.left - PAD.right);
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const max = niceMax(Math.max(1, ...data.flatMap((d) => [d.new_users, d.with_phone])));
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  const x = (index: number) => PAD.left + index * stepX;
  const y = (value: number) => PAD.top + plotHeight - (value / max) * plotHeight;

  const path = (key: 'new_users' | 'with_phone') =>
    data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(point[key])}`).join(' ');

  // Y o'qi belgilari — butun sonlar (odam soni kasr bo'lmaydi)
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((max / 4) * i));

  const point = active !== null ? data[active] : null;

  return (
    <div ref={ref} className="w-full">
      {/* Izoh — ikki va undan ortiq qator uchun majburiy */}
      <div className="mb-2 flex flex-wrap items-center gap-4">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="h-0.5 w-4 rounded-full"
              style={{ background: series.color }}
            />
            {series.label}
          </span>
        ))}
      </div>

      <div className="relative">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label="Oxirgi 30 kunlik yangi foydalanuvchilar grafigi"
          onMouseLeave={() => setActive(null)}
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const relative = event.clientX - bounds.left - PAD.left;
            const index = stepX ? Math.round(relative / stepX) : 0;
            setActive(Math.min(data.length - 1, Math.max(0, index)));
          }}
        >
          {/* To'r — soch tolasidek ingichka, uzluksiz, fonga yaqin */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--viz-grid)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y(tick) + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] tabular-nums"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* X o'qi: har 5-kun */}
          {data.map((item, i) =>
            i % 5 === 0 || i === data.length - 1 ? (
              <text
                key={item.date}
                x={x(i)}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {shortDate(item.date)}
              </text>
            ) : null,
          )}

          {/* Ko'rsatkich chiziq */}
          {active !== null && (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + plotHeight}
              stroke="var(--viz-axis)"
              strokeWidth={1}
            />
          )}

          {SERIES.map((series) => (
            <path
              key={series.key}
              d={path(series.key)}
              fill="none"
              stroke={series.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Oxirgi nuqtalar: 2px fon halqasi bilan — ustma-ust tushsa ham ko'rinadi */}
          {SERIES.map((series) => {
            const last = data.length - 1;
            if (last < 0) return null;
            return (
              <circle
                key={series.key}
                cx={x(last)}
                cy={y(data[last][series.key])}
                r={4}
                fill={series.color}
                stroke="var(--viz-surface)"
                strokeWidth={2}
              />
            );
          })}

          {/* Hover nuqtalari */}
          {active !== null &&
            SERIES.map((series) => (
              <circle
                key={series.key}
                cx={x(active)}
                cy={y(data[active][series.key])}
                r={4}
                fill={series.color}
                stroke="var(--viz-surface)"
                strokeWidth={2}
              />
            ))}
        </svg>

        {point && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-36 rounded-lg border bg-popover p-2.5 text-popover-foreground shadow-md"
            style={{
              left: Math.min(Math.max(0, x(active!) - 70), Math.max(0, width - 150)),
            }}
          >
            <div className="mb-1.5 text-xs text-muted-foreground">{point.date}</div>
            {SERIES.map((series) => (
              <div key={series.key} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden
                  className="h-0.5 w-3 shrink-0 rounded-full"
                  style={{ background: series.color }}
                />
                {/* Qiymat birinchi va to'q — o'quvchi aynan shuni izlaydi */}
                <span className="font-semibold tabular-nums">{point[series.key]}</span>
                <span className="truncate text-xs text-muted-foreground">{series.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
