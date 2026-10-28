'use client';

import { useState } from 'react';
import { Check, Clipboard, FileHeart, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { translations, type Locale } from '@/lib/i18n';
import type { AnalysisResponse } from '@/types/health';

type Props = {
  locale: Locale;
  analysis: AnalysisResponse;
};

export function FamilySummary({ locale, analysis }: Props) {
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = translations[locale];
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  async function copySummary() {
    await navigator.clipboard.writeText(analysis.doctorSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <Card className="border-0 bg-[linear-gradient(145deg,var(--card),color-mix(in_oklch,var(--secondary)_32%,var(--card)))] shadow-sm ring-1 ring-border">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-4 text-primary" />
              {t.clearExplanation}
            </CardTitle>
            <Badge variant="outline">
              {analysis.aiAvailable ? t.aiAssisted : t.safeLocalFallback}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm leading-6 text-foreground/85">
            {analysis.aiExplanation}
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => setDoctorOpen(true)}
          >
            <FileHeart data-icon="inline-start" />
            {t.openDoctorSummary}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={doctorOpen} onOpenChange={setDoctorOpen}>
        <DialogContent className="sm:max-w-xl" dir={direction}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileHeart className="size-5 text-primary" />
              {t.doctorSummary}
            </DialogTitle>
            <DialogDescription>{t.doctorSummaryDescription}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[52vh] overflow-y-auto rounded-xl border bg-muted/35 p-4">
            <p className="whitespace-pre-line text-sm leading-6">
              {analysis.doctorSummary}
            </p>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            {t.doctorSafety}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDoctorOpen(false)}>
              {t.close}
            </Button>
            <Button onClick={copySummary}>
              {copied ? (
                <Check data-icon="inline-start" />
              ) : (
                <Clipboard data-icon="inline-start" />
              )}
              {copied ? t.copied : t.copySummary}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
