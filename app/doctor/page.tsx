import { ArrowLeft, FileHeart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildFallbackNarratives } from '@/lib/narratives';
import { DEMO_FAMILY } from '@/lib/demo-data';
import { detectHealthPatterns } from '@/lib/rules';

export default function DoctorPage() {
  const patterns = detectHealthPatterns(DEMO_FAMILY);
  const { doctorSummary } = buildFallbackNarratives(patterns, DEMO_FAMILY);

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
          <ArrowLeft data-icon="inline-start" />
          Back to dashboard
        </Link>
        <div className="mt-7 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <FileHeart className="size-6" />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Doctor summary
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Demo family history prepared for a clinical conversation.
            </p>
          </div>
        </div>

        <Card className="mt-7 border-0 shadow-sm ring-1 ring-border">
          <CardHeader className="border-b">
            <CardTitle>Reported family history</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-7">
              {doctorSummary}
            </p>
          </CardContent>
        </Card>

        <div className="mt-5 flex gap-3 rounded-2xl border bg-muted/45 p-4 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          This page is a fictional demo. It does not contain a diagnosis or a
          treatment recommendation.
        </div>
      </div>
    </main>
  );
}
