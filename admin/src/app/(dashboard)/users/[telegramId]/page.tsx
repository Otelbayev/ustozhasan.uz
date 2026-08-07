import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageCircle, Phone, Sparkles, Radio, Ban, Bot } from 'lucide-react';
import { getUser, getUserEvents, ApiError } from '@/lib/api';
import { fullName, initials, formatDateTime, timeAgo, stageLabel } from '@/lib/format';
import { StageBadge } from '@/components/stage-badge';
import { EventTimeline } from '@/components/event-timeline';
import { ApiErrorNotice } from '@/components/api-error-notice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

/** Bazadagi bitta maydon — nomi va qiymati */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right text-sm break-words">{value ?? '—'}</span>
    </div>
  );
}

function YesNo({ value }: { value: boolean }) {
  return <span>{value ? 'Ha' : 'Yo\'q'}</span>;
}

export default async function UserDetailPage({ params }: PageProps<'/users/[telegramId]'>) {
  const { telegramId } = await params;

  let user;
  let events;

  try {
    [user, events] = await Promise.all([getUser(telegramId), getUserEvents(telegramId)]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return <ApiErrorNotice error={err instanceof ApiError ? err.message : String(err)} />;
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/users">
          <ArrowLeft className="size-4" />
          Foydalanuvchilar
        </Link>
      </Button>

      {/* ── Sarlavha ───────────────────────────────────────── */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{initials(user)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{fullName(user)}</h1>
              <StageBadge stage={user.funnel_stage} />

              {user.is_premium && (
                <Badge variant="outline" className="font-normal">
                  <Sparkles className="size-3" /> Premium
                </Badge>
              )}
              {user.is_subscribed && (
                <Badge variant="outline" className="font-normal">
                  <Radio className="size-3" /> Kanalga obuna
                </Badge>
              )}
              {user.blocked_bot && (
                <Badge variant="destructive" className="font-normal">
                  <Ban className="size-3" /> Botni bloklagan
                </Badge>
              )}
              {user.is_bot && (
                <Badge variant="outline" className="font-normal">
                  <Bot className="size-3" /> Bot
                </Badge>
              )}
            </div>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {user.username ? `@${user.username} · ` : ''}ID {user.telegram_id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.username && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://t.me/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Telegramda yozish
                </a>
              </Button>
            )}
            {user.phone_number && (
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${user.phone_number.replace(/\s/g, '')}`}>
                  <Phone className="size-4" />
                  {user.phone_number}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Bazadagi barcha ma'lumot ──────────────────────── */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Telegram ma&apos;lumotlari</CardTitle>
              <CardDescription>Telegram bergan barcha maydonlar</CardDescription>
            </CardHeader>
            <CardContent className="divide-y py-0">
              <Field label="Telegram ID" value={<span className="tabular-nums">{user.telegram_id}</span>} />
              <Field label="Username" value={user.username ? `@${user.username}` : '—'} />
              <Field label="Ism" value={user.first_name ?? '—'} />
              <Field label="Familiya" value={user.last_name ?? '—'} />
              <Field label="Til" value={user.language_code ?? '—'} />
              <Field label="Premium" value={<YesNo value={user.is_premium} />} />
              <Field label="Bot akkaunt" value={<YesNo value={user.is_bot} />} />
              <Field label="Chat ID" value={<span className="tabular-nums">{user.chat_id ?? '—'}</span>} />
              <Field label="Chat turi" value={user.chat_type ?? '—'} />
              <Field
                label="Profil rasmi"
                value={user.photo_file_id ? <span className="font-mono text-xs">bor</span> : '—'}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Voronka va aloqa</CardTitle>
              <CardDescription>Bot ichidagi holati</CardDescription>
            </CardHeader>
            <CardContent className="divide-y py-0">
              <Field label="Bosqich" value={stageLabel(user.funnel_stage)} />
              <Field label="Kanalga obuna" value={<YesNo value={user.is_subscribed} />} />
              <Field label="Obuna tekshirilgan" value={formatDateTime(user.subscription_checked_at)} />
              <Field
                label="Telefon"
                value={user.phone_number ? <span className="tabular-nums">{user.phone_number}</span> : '—'}
              />
              <Field label="Telefon berilgan vaqt" value={formatDateTime(user.phone_shared_at)} />
              <Field label="Botni bloklagan" value={<YesNo value={user.blocked_bot} />} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manba va faollik</CardTitle>
              <CardDescription>Qayerdan kelgan va qachon</CardDescription>
            </CardHeader>
            <CardContent className="divide-y py-0">
              <Field label="Manba" value={user.source ?? 'to\'g\'ridan-to\'g\'ri'} />
              <Field label="Deep-link parametri" value={user.start_param ?? '—'} />
              <Field
                label="/start bosgan"
                value={<span className="tabular-nums">{user.start_count} marta</span>}
              />
              <Field label="Birinchi marta" value={formatDateTime(user.first_seen_at)} />
              <Field label="Oxirgi faollik" value={`${formatDateTime(user.last_seen_at)} (${timeAgo(user.last_seen_at)})`} />
              <Field label="Bazaga qo'shilgan" value={formatDateTime(user.created_at)} />
              <Field label="Oxirgi yangilanish" value={formatDateTime(user.updated_at)} />
            </CardContent>
          </Card>
        </div>

        {/* ── Nima qilgani ──────────────────────────────────── */}
        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardHeader>
            <CardTitle className="text-base">Nima qilgan</CardTitle>
            <CardDescription>
              Botdagi barcha harakatlari — eng yangisi tepada ({events.length} ta)
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="max-h-[70vh] overflow-y-auto pt-4">
            <EventTimeline events={events} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
