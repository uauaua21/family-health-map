import { describe, expect, it } from 'vitest';

import { detectHealthPatterns } from '@/lib/rules';
import type { FamilyMember } from '@/types/health';

function member(
  id: string,
  relationship: string,
  generation: number,
  conditionName?: string,
  diagnosisAge?: number,
  bloodRelative = true,
): FamilyMember {
  return {
    id,
    name: relationship,
    relationship,
    generation,
    family_side: 'unknown',
    blood_relative: bloodRelative,
    conditions: conditionName
      ? [
          {
            id: `${id}-condition`,
            condition_name: conditionName,
            diagnosis_age: diagnosisAge,
          },
        ]
      : [],
  };
}

describe('detectHealthPatterns', () => {
  it('detects a repeated condition in two blood relatives', () => {
    const patterns = detectHealthPatterns([
      member('father', 'Father', 1, 'Heart Disease'),
      member('uncle', 'Uncle', 1, 'heart disease'),
    ]);

    expect(
      patterns.some(
        ({ pattern_type }) => pattern_type === 'repeated_family_condition',
      ),
    ).toBe(true);
  });

  it('detects the same condition across generations', () => {
    const patterns = detectHealthPatterns([
      member('father', 'Father', 1, 'Heart Disease'),
      member('grandfather', 'Grandfather', 2, 'Heart Disease'),
    ]);

    expect(
      patterns.some(
        ({ pattern_type }) => pattern_type === 'multi_generation_pattern',
      ),
    ).toBe(true);
  });

  it('does not create a repeated pattern for one person', () => {
    const patterns = detectHealthPatterns([
      member('father', 'Father', 1, 'Heart Disease'),
    ]);

    expect(
      patterns.some(
        ({ pattern_type }) => pattern_type === 'repeated_family_condition',
      ),
    ).toBe(false);
  });

  it('ignores a non-blood relative in repeated pattern counts', () => {
    const patterns = detectHealthPatterns([
      member('father', 'Father', 1, 'Heart Disease'),
      member('stepfather', 'Stepfather', 1, 'Heart Disease', undefined, false),
    ]);

    expect(patterns).toHaveLength(0);
  });

  it('detects configured early-onset colorectal cancer', () => {
    const patterns = detectHealthPatterns([
      member('father', 'Father', 1, 'Colorectal Cancer', 45),
    ]);

    expect(
      patterns.some(
        ({ pattern_type }) => pattern_type === 'early_onset_pattern',
      ),
    ).toBe(true);
  });

  it('does not invent an early-onset rule for type 2 diabetes', () => {
    const patterns = detectHealthPatterns([
      member('mother', 'Mother', 1, 'Type 2 Diabetes', 45),
    ]);

    expect(
      patterns.some(
        ({ pattern_type }) => pattern_type === 'early_onset_pattern',
      ),
    ).toBe(false);
  });
  it('does not count duplicate condition records as two relatives', () => {
    const father = member('father', 'Father', 1, 'Heart Disease');
    father.conditions.push({
      id: 'duplicate',
      condition_name: ' heart disease ',
    });
    expect(detectHealthPatterns([father])).toEqual([]);
  });

  it('keeps an earlier reported age when a condition is entered twice', () => {
    const father = member('father', 'Father', 1, 'Breast Cancer', 60);
    father.conditions.push({
      id: 'duplicate',
      condition_name: 'breast cancer',
      diagnosis_age: 45,
    });
    const patterns = detectHealthPatterns([father]);
    expect(patterns).toHaveLength(1);
    expect(patterns[0].pattern_type).toBe('early_onset_pattern');
  });

  it('does not count duplicate member IDs as different people', () => {
    expect(
      detectHealthPatterns([
        member('same-id', 'Father', 1, 'Heart Disease'),
        member('same-id', 'Grandfather', 2, 'Heart Disease'),
      ]),
    ).toEqual([]);
  });

  it('requires an age strictly below the configured threshold', () => {
    expect(
      detectHealthPatterns([
        member('father', 'Father', 1, 'Colorectal Cancer', 50),
      ]),
    ).toEqual([]);
  });
});
