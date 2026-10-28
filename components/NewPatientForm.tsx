'use client';

import { useState, type SyntheticEvent } from 'react';
import { Plus, UserRoundPlus } from 'lucide-react';

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
import type { Locale } from '@/lib/i18n';
import type { FamilyMember } from '@/types/health';

type Props = {
  locale: Locale;
  onCreate: (patient: FamilyMember) => void;
  className?: string;
};

const copy = {
  en: {
    button: 'New patient',
    title: 'Create a patient record',
    description:
      'Start a new family-history review. Add relatives and reported conditions next.',
    name: 'Patient name',
    namePlaceholder: 'e.g. Ahmed Mohammed',
    birthYear: 'Birth year (optional)',
    gender: 'Gender (optional)',
    notRecorded: 'Not recorded',
    male: 'Male',
    female: 'Female',
    cancel: 'Cancel',
    create: 'Create patient',
  },
  ar: {
    button: 'مريض جديد',
    title: 'إنشاء ملف مريض',
    description:
      'ابدأ مراجعة جديدة للتاريخ العائلي، ثم أضف الأقارب والحالات المسجلة.',
    name: 'اسم المريض',
    namePlaceholder: 'مثال: أحمد محمد',
    birthYear: 'سنة الميلاد (اختياري)',
    gender: 'الجنس (اختياري)',
    notRecorded: 'غير مسجل',
    male: 'ذكر',
    female: 'أنثى',
    cancel: 'إلغاء',
    create: 'إنشاء الملف',
  },
} as const;

export function NewPatientForm({ locale, onCreate, className }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const t = copy[locale];
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreate({
      id: crypto.randomUUID(),
      name: name.trim(),
      relationship: 'Self',
      generation: 0,
      family_side: 'self',
      blood_relative: true,
      birth_year: birthYear ? Number(birthYear) : undefined,
      gender: gender || undefined,
      living_status: 'living',
      conditions: [],
    });

    setName('');
    setBirthYear('');
    setGender('');
    setOpen(false);
  }

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        <UserRoundPlus data-icon="inline-start" />
        {t.button}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" dir={direction}>
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>
          <form
            id="new-patient-form"
            className="grid gap-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="patient-name">{t.name}</Label>
              <Input
                id="patient-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.namePlaceholder}
                required
                maxLength={120}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="patient-birth-year">{t.birthYear}</Label>
                <Input
                  id="patient-birth-year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={birthYear}
                  onChange={(event) => setBirthYear(event.target.value)}
                  placeholder="1998"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="patient-gender">{t.gender}</Label>
                <select
                  id="patient-gender"
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                >
                  <option value="">{t.notRecorded}</option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                </select>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" form="new-patient-form">
              <Plus data-icon="inline-start" />
              {t.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
