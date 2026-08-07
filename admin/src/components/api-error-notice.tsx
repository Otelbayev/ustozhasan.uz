import { TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Bot API javob bermaganda ko'rsatiladi.
 * Xatoning texnik tafsiloti emas, nima qilish kerakligi yoziladi.
 */
export function ApiErrorNotice({ error }: { error: string }) {
  return (
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>Ma&apos;lumotni olib bo&apos;lmadi</AlertTitle>
      <AlertDescription>
        <p>{error}</p>
        <p className="text-muted-foreground">Tekshiring:</p>
        <ul className="list-inside list-disc text-muted-foreground">
          <li>
            Bot ishlab turibdimi — <code className="font-mono">cd bot &amp;&amp; npm run dev</code>
          </li>
          <li>
            <code className="font-mono">admin/.env.local</code> dagi{' '}
            <code className="font-mono">BOT_API_URL</code> va{' '}
            <code className="font-mono">BOT_API_KEY</code> to&apos;g&apos;rimi
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
