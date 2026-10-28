'use client';

import { useState, type SyntheticEvent } from 'react';
import { ClipboardPlus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translateKnownTerm, translations, type Locale } from '@/lib/i18n';
import type { FamilyMember, MedicalCondition } from '@/types/health';

type Props = {
  locale: Locale;
  familyMembers: FamilyMember[];
  onAdd: (memberId: string, condition: MedicalCondition) => void;
};

export function AddConditionForm({ locale, familyMembers, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [conditionName, setConditionName] = useState('');
  const [diagnosisAge, setDiagnosisAge] = useState('');
  const t = translations[locale];
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const targetMemberId = memberId || familyMembers[0]?.id;
    if (!targetMemberId) return;

    onAdd(targetMemberId, {
      id: crypto.randomUUID(),
      condition_name: conditionName.trim(),
      diagnosis_age: diagnosisAge === '' ? undefined : Number(diagnosisAge),
    });

    setConditionName('');
    setDiagnosisAge('');
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        disabled={familyMembers.length === 0}
        onClick={() => setOpen(true)}
      >
        <ClipboardPlus data-icon="inline-start" />
        {t.addCondition}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" dir={direction}>
          <DialogHeader>
            <DialogTitle>{t.addConditionTitle}</DialogTitle>
            <DialogDescription>{t.addConditionDescription}</DialogDescription>
          </DialogHeader>
          <form
            id="add-condition-form"
            className="grid gap-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="condition-member">{t.familyMember}</Label>
              <select
                id="condition-member"
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                value={memberId || familyMembers[0]?.id || ''}
                onChange={(event) => setMemberId(event.target.value)}
                required
              >
                {familyMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} —{' '}
                    {translateKnownTerm(member.relationship, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="condition-name">{t.conditionName}</Label>
              <Input
                id="condition-name"
                value={conditionName}
                onChange={(event) => setConditionName(event.target.value)}
                placeholder={t.conditionPlaceholder}
                required
                maxLength={120}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="diagnosis-age">{t.diagnosisAge}</Label>
              <Input
                id="diagnosis-age"
                type="number"
                min="0"
                max="130"
                value={diagnosisAge}
                onChange={(event) => setDiagnosisAge(event.target.value)}
                placeholder={t.diagnosisAgePlaceholder}
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" form="add-condition-form">
              <Plus data-icon="inline-start" />
              {t.addConditionSubmit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
