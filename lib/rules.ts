import type { FamilyMember, HealthPattern } from '@/types/health';

export const EARLY_ONSET_RULES: Record<string, number> = {
  'colorectal cancer': 50,
  'breast cancer': 50,
};

export function normalizeCondition(value: string): string {
  return value.trim().toLowerCase();
}

type ConditionEntry = {
  displayName: string;
  member: FamilyMember;
  diagnosisAge?: number;
};

export function detectHealthPatterns(
  familyMembers: FamilyMember[],
): HealthPattern[] {
  const grouped = new Map<string, ConditionEntry[]>();

  const seenMembers = new Set<string>();
  for (const member of familyMembers) {
    if (!member.blood_relative || seenMembers.has(member.id)) continue;
    seenMembers.add(member.id);

    for (const condition of member.conditions) {
      const normalized = normalizeCondition(condition.condition_name);
      if (!normalized) continue;

      const existing = grouped.get(normalized) ?? [];
      const duplicate = existing.find((entry) => entry.member.id === member.id);
      if (duplicate) {
        // A repeated record is still one person. Keep the earliest reported age.
        if (
          condition.diagnosis_age !== undefined &&
          (duplicate.diagnosisAge === undefined ||
            condition.diagnosis_age < duplicate.diagnosisAge)
        ) {
          duplicate.diagnosisAge = condition.diagnosis_age;
        }
        continue;
      }
      existing.push({
        displayName: condition.condition_name.trim(),
        member,
        diagnosisAge: condition.diagnosis_age,
      });
      grouped.set(normalized, existing);
    }
  }

  const patterns: HealthPattern[] = [];

  for (const [normalized, entries] of grouped) {
    const condition = entries[0].displayName;
    const affectedMembers = entries.map(({ member }) => member.relationship);
    const generations = [
      ...new Set(entries.map(({ member }) => member.generation)),
    ].sort((a, b) => a - b);

    if (entries.length >= 2) {
      patterns.push({
        condition,
        pattern_type: 'repeated_family_condition',
        affected_members: affectedMembers,
        attention_level: 'attention',
      });
    }

    if (generations.length >= 2) {
      patterns.push({
        condition,
        pattern_type: 'multi_generation_pattern',
        affected_members: affectedMembers,
        generations,
        attention_level: 'attention',
      });
    }

    const threshold = EARLY_ONSET_RULES[normalized];
    if (threshold !== undefined) {
      const earlyEntries = entries.filter(
        ({ diagnosisAge }) =>
          diagnosisAge !== undefined && diagnosisAge < threshold,
      );

      if (earlyEntries.length > 0) {
        patterns.push({
          condition,
          pattern_type: 'early_onset_pattern',
          affected_members: earlyEntries.map(
            ({ member }) => member.relationship,
          ),
          generations: [
            ...new Set(earlyEntries.map(({ member }) => member.generation)),
          ].sort((a, b) => a - b),
          attention_level: 'attention',
        });
      }
    }
  }

  return patterns;
}
