import Link from 'next/link';
import { Users, Radio, Phone, Ban, Sparkles, Clock } from 'lucide-react';
import { getStats, getUsers, ApiError } from '@/lib/api';
import { STAGE_ORDER, stageLabel, eventLabel, fullName, timeAgo } from '@/lib/format';
import { StatTile } from '@/components/stat-tile';
import { DailyChart } from '@/components/charts/daily-chart';
import { FunnelChart } from '@/components/charts/funnel-chart';
import { ApiErrorNotice } from '@/components/api-error-notice';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let stats;
  let recent;

  try {
    [stats, recent] = await Promise.all([getStats(), getUsers({ limit: '8' })]);
  } catch (err) {
    return <ApiErrorNotice error={err instanceof ApiError ? err.message : String(err)} />;
  }

  const stages = STAGE_ORDER.map((key) => ({
    key,
    label: stageLabel(key),
    count: stats.by_stage[key] ?? 0,
  }));

  // Oxirgi ro'yxatdan o'tganlar tepada tursin
  const latest = [...recent.data].reverse();

  const topSources = Object.entries(stats.by_source).slice(0, 6);
  const topEvents = Object.entries(stats.by_event).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Boshqaruv paneli</h1>
        <p className="text-sm text-muted-foreground">
          Botga start bosgan barcha foydalanuvchilar va voronka holati
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Jami foydalanuvchi" value={stats.total_users} icon={Users} />
        <StatTile
          label="Kanalga obuna"
          value={stats.subscribed}
          hint={`${stats.conversion.subscribed_pct}% konversiya`}
          icon={Radio}
        />
        <StatTile
          label="Raqam qoldirgan"
          value={stats.with_phone}
          hint={`${stats.conversion.phone_pct}% konversiya`}
          icon={Phone}
        />
        <StatTile
          label="24 soatda yangi"
          value={stats.new_24h}
          hint={`7 kunda: ${stats.new_7d}`}
          icon={Clock}
        />
        <StatTile label="Premium" value={stats.premium} icon={Sparkles} />
        <StatTile label="Botni bloklagan" value={stats.blocked} icon={Ban} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Oxirgi 30 kun</CardTitle>
            <CardDescription>Kunlik yangi foydalanuvchilar va raqam qoldirganlar</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyChart data={stats.daily} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voronka</CardTitle>
            <CardDescription>Har bosqichda nechta odam turibdi</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelChart stages={stages} total={stats.total_users} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Oxirgi kelganlar</CardTitle>
            <CardDescription>Eng so&apos;nggi harakat qilgan foydalanuvchilar</CardDescription>
            {/* CardAction — CardHeader gridining o'ng ustuni */}
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/users">Hammasi</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y">
            {latest.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Hozircha hech kim start bosmagan.
              </p>
            )}
            {latest.map((user) => (
              <Link
                key={user.telegram_id}
                href={`/users/${user.telegram_id}`}
                className="flex items-center gap-3 py-2.5 hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{fullName(user)}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {user.username ? `@${user.username}` : user.telegram_id}
                    {user.phone_number && ` · ${user.phone_number}`}
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {stageLabel(user.funnel_stage)}
                </Badge>
                <span className="hidden w-28 shrink-0 text-right text-xs text-muted-foreground sm:block">
                  {timeAgo(user.last_seen_at)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manbalar</CardTitle>
              <CardDescription>Foydalanuvchi qayerdan kelgan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {topSources.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between text-sm">
                  <span className="truncate text-muted-foreground">
                    {source === 'direct' ? 'To\'g\'ridan-to\'g\'ri' : source}
                  </span>
                  <span className="font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Harakatlar</CardTitle>
              <CardDescription>Botda nima qilingan (jami)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {topEvents.map(([type, count]) => (
                <div key={type} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-muted-foreground">{eventLabel(type)}</span>
                  <span className="shrink-0 font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
