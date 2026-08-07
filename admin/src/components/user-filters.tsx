'use client';

/**
 * Qidiruv va filtrlar.
 *
 * Oddiy GET forma:
 *   • JavaScript'siz ham ishlaydi (tugmani bosish yetarli);
 *   • tanlangan qiymatlar server tomonda darhol ko'rinadi — Radix Select
 *     esa qiymat yozuvini faqat hidratsiyadan keyin chizadi, ya'ni sahifa
 *     ochilganda filtrlar bir lahza BO'SH ko'rinardi;
 *   • holat URL da: sahifani yangilash yoki havolani yuborish ayni o'sha
 *     ko'rinishni ochadi;
 *   • `cursor` formada yo'q — filtr o'zgarsa paginatsiya o'zi boshidan
 *     boshlanadi.
 *
 * JS bo'lsa — tanlov o'zgarishi bilan forma avtomatik yuboriladi.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { STAGE_ORDER, stageLabel } from '@/lib/format';
import { cn } from '@/lib/utils';

const selectClass = cn(
  'h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
);

export function UserFilters() {
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const submit = () => formRef.current?.requestSubmit();

  const stage = params.get('stage') ?? '';
  const hasPhone = params.get('has_phone') ?? '';
  const subscribed = params.get('subscribed') ?? '';
  const query = params.get('q') ?? '';
  const isFiltered = Boolean(query || stage || hasPhone || subscribed);

  return (
    <form ref={formRef} method="get" action="/users" className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={query}
          placeholder="Ism, username yoki telefon…"
          className="pl-8"
        />
      </div>

      <select name="stage" defaultValue={stage} onChange={submit} className={selectClass}>
        <option value="">Barcha bosqichlar</option>
        {STAGE_ORDER.map((item) => (
          <option key={item} value={item}>
            {stageLabel(item)}
          </option>
        ))}
      </select>

      <select name="has_phone" defaultValue={hasPhone} onChange={submit} className={selectClass}>
        <option value="">Telefon: hammasi</option>
        <option value="true">Raqami bor</option>
        <option value="false">Raqami yo&apos;q</option>
      </select>

      <select name="subscribed" defaultValue={subscribed} onChange={submit} className={selectClass}>
        <option value="">Obuna: hammasi</option>
        <option value="true">Obuna bo&apos;lgan</option>
        <option value="false">Obuna bo&apos;lmagan</option>
      </select>

      <Button type="submit" variant="secondary">
        Qidirish
      </Button>

      {isFiltered && (
        <Button asChild variant="ghost">
          <Link href="/users">Tozalash</Link>
        </Button>
      )}
    </form>
  );
}
