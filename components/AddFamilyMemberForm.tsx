'use client';

import { useState, type SyntheticEvent } from 'react';
import { Plus, UserPlus } from 'lucide-react';

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
import { translations, type Locale } from '@/lib/i18n';
import type { FamilyMember } from '@/types/health';

type Props = {
  locale: Locale;
  onAdd: (member: FamilyMember) => void;
};

export function AddFamilyMemberForm({ locale, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [generation, setGeneration] = useState('1');
  const [familySide, setFamilySide] =
    useState<FamilyMember['family_side']>('unknown');
  const [bloodRelative, setBloodRelative] = useState(true);
  const t = translations[locale];
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      relationship: relationship.trim(),
      generation: Number(generation),
      family_side: familySide,
      blood_relative: bloodRelative,
      conditions: [],
    });

    setName('');
    setRelationship('');
    setGeneration('1');
    setFamilySide('unknown');
    setBloodRelative(true);
    setOpen(false);
  }

  return (
    <>
      <Button variant="outline" size="lg" onClick={() => setOpen(true)}>
        <UserPlus data-icon="inline-start" />
        {t.addMember}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" dir={direction}>
          <DialogHeader>
            <DialogTitle>{t.addMemberTitle}</DialogTitle>
            <DialogDescription>{t.addMemberDescription}</DialogDescription>
          </DialogHeader>
          <form
            id="add-member-form"
            className="grid gap-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="member-name">{t.name}</Label>
              <Input
                id="member-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t.namePlaceholder}
                required
                maxLength={120}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="member-relationship">{t.relationship}</Label>
              <Input
                id="member-relationship"
                value={relationship}
                onChange={(event) => setRelationship(event.target.value)}
                placeholder={t.relationshipPlaceholder}
                required
                maxLength={120}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="member-generation">{t.generation}</Label>
                <select
                  id="member-generation"
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={generation}
                  onChange={(event) => setGeneration(event.target.value)}
                >
                  <option value="0">{t.generationZero}</option>
                  <option value="1">{t.generationOne}</option>
                  <option value="2">{t.generationTwo}</option>
                  <option value="3">{t.generationThree}</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="member-side">{t.familySide}</Label>
                <select
                  id="member-side"
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={familySide}
                  onChange={(event) =>
                    setFamilySide(
                      event.target.value as FamilyMember['family_side'],
                    )
                  }
                >
                  <option value="unknown">{t.unknown}</option>
                  <option value="paternal">{t.paternal}</option>
                  <option value="maternal">{t.maternal}</option>
                  <option value="self">{t.self}</option>
                </select>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3 text-sm">
              <input
                id="blood-relative"
                type="checkbox"
                className="mt-0.5 size-4 accent-[var(--primary)]"
                checked={bloodRelative}
                onChange={(event) => setBloodRelative(event.target.checked)}
              />
              <span>
                <Label
                  htmlFor="blood-relative"
                  className="block cursor-pointer font-medium"
                >
                  {t.bloodRelative}
                </Label>
                <span className="text-xs leading-5 text-muted-foreground">
                  {t.bloodRelativeHint}
                </span>
              </span>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" form="add-member-form">
              <Plus data-icon="inline-start" />
              {t.addMemberSubmit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
