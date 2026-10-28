import { CircleAlert, UsersRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { translateKnownTerm, translations, type Locale } from '@/lib/i18n';
import type { HealthPattern } from '@/types/health';

type Props = {
  locale: Locale;
  condition: string;
  patterns: HealthPattern[];
};

export function PatternCard({ locale, condition, patterns }: Props) {
  const t = translations[locale];
  const patternLabels: Record<HealthPattern['pattern_type'], string> = {
    repeated_family_condition: t.repeatedPattern,
    multi_generation_pattern: t.multiGenerationPattern,
    early_onset_pattern: t.earlyOnsetPattern,
  };
  const affectedMembers = [
    ...new Set(patterns.flatMap(({ affected_members }) => affected_members)),
  ];

  return (
    <Card className="border-0 bg-card shadow-sm ring-1 ring-border">
      <CardHeader className="border-b bg-[color-mix(in_oklch,var(--accent)_45%,transparent)]">
        <div className="flex items-center justify-between gap-3">
          <Badge className="bg-secondary text-secondary-foreground">
            <CircleAlert data-icon="inline-start" />
            {t.patternDetected}
          </Badge>
          <span className="text-xs text-muted-foreground">{t.ruleBased}</span>
        </div>
        <CardTitle className="mt-2 text-xl">
          {translateKnownTerm(condition, locale)}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <UsersRound className="size-3.5" />
            {t.affectedRelatives}
          </p>
          <div className="flex flex-wrap gap-2">
            {affectedMembers.map((member) => (
              <Badge key={member} variant="secondary">
                {translateKnownTerm(member, locale)}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {patterns.map((pattern) => (
            <div
              key={pattern.pattern_type}
              className="flex items-start gap-2 text-sm leading-5"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {patternLabels[pattern.pattern_type]}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
