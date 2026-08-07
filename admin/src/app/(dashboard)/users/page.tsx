import Link from 'next/link';
import { ChevronRight, Phone, Ban, Sparkles, Radio } from 'lucide-react';
import { getUsers, ApiError } from '@/lib/api';
import { fullName, timeAgo, formatDateTime } from '@/lib/format';
import { StageBadge } from '@/components/stage-badge';
import { UserFilters } from '@/components/user-filters';
import { ApiErrorNotice } from '@/components/api-error-notice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = '50';

export default async function UsersPage({ searchParams }: PageProps<'/users'>) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  let page;
  try {
    page = await getUsers({
      limit: PAGE_SIZE,
      cursor: get('cursor'),
      q: get('q'),
      stage: get('stage'),
      subscribed: get('subscribed'),
      has_phone: get('has_phone'),
      source: get('source'),
    });
  } catch (err) {
    return <ApiErrorNotice error={err instanceof ApiError ? err.message : String(err)} />;
  }

  // Keyingi sahifa havolasi: mavjud filtrlar saqlanadi, faqat cursor almashadi
  const nextParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const single = Array.isArray(value) ? value[0] : value;
    if (single && key !== 'cursor') nextParams.set(key, single);
  }
  if (page.next_cursor) nextParams.set('cursor', page.next_cursor);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Foydalanuvchilar</h1>
        <p className="text-sm text-muted-foreground">
          Botga start bosgan barcha odamlar. Batafsil ko&apos;rish uchun qatorni bosing.
        </p>
      </div>

      <UserFilters />

      <Card className="py-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead className="hidden sm:table-cell">Telefon</TableHead>
                <TableHead>Bosqich</TableHead>
                <TableHead className="hidden lg:table-cell">Manba</TableHead>
                <TableHead className="hidden md:table-cell">Oxirgi faollik</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {page.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Hech narsa topilmadi.
                  </TableCell>
                </TableRow>
              )}

              {page.data.map((user) => (
                <TableRow key={user.telegram_id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/users/${user.telegram_id}`} className="block">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="truncate">{fullName(user)}</span>

                        {user.is_premium && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Sparkles className="size-3.5 shrink-0 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Telegram Premium</TooltipContent>
                          </Tooltip>
                        )}
                        {user.is_subscribed && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Radio className="size-3.5 shrink-0 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Kanalga obuna bo&apos;lgan</TooltipContent>
                          </Tooltip>
                        )}
                        {user.blocked_bot && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Ban className="size-3.5 shrink-0 text-destructive" />
                            </TooltipTrigger>
                            <TooltipContent>Botni bloklagan</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.username ? `@${user.username}` : `ID ${user.telegram_id}`}
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    <Link href={`/users/${user.telegram_id}`} className="block">
                      {user.phone_number ? (
                        <span className="flex items-center gap-1.5 text-sm tabular-nums">
                          <Phone className="size-3.5 text-muted-foreground" />
                          {user.phone_number}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={`/users/${user.telegram_id}`} className="block">
                      <StageBadge stage={user.funnel_stage} />
                    </Link>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <Link href={`/users/${user.telegram_id}`} className="block text-sm text-muted-foreground">
                      {user.source ?? 'to\'g\'ridan-to\'g\'ri'}
                    </Link>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/users/${user.telegram_id}`}
                          className="block text-sm text-muted-foreground"
                        >
                          {timeAgo(user.last_seen_at)}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>{formatDateTime(user.last_seen_at)}</TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Link href={`/users/${user.telegram_id}`} className="block">
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Shu sahifada: <span className="font-medium tabular-nums">{page.count}</span>
        </p>

        {page.has_more && (
          <Button asChild variant="outline">
            <Link href={`/users?${nextParams.toString()}`}>Keyingi sahifa</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
