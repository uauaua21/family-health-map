import { translateKnownTerm, type Locale } from '@/lib/i18n';
import type { FamilyMember, HealthPattern } from '@/types/health';

const NO_PATTERN_MESSAGE = {
  en: 'No notable family pattern was detected from the information provided.',
  ar: 'لم يتم اكتشاف نمط عائلي واضح من المعلومات المقدمة.',
};

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function getReportedMembers(condition: string, familyMembers: FamilyMember[]) {
  return familyMembers
    .filter((member) => member.blood_relative)
    .flatMap((member) =>
      member.conditions
        .filter(
          (item) =>
            item.condition_name.trim().toLowerCase() ===
            condition.trim().toLowerCase(),
        )
        .map((item) => ({
          relationship: member.relationship,
          age: item.diagnosis_age,
        })),
    );
}

export function buildFallbackNarratives(
  patterns: HealthPattern[],
  familyMembers: FamilyMember[],
  locale: Locale = 'en',
) {
  if (patterns.length === 0) {
    return {
      aiExplanation: NO_PATTERN_MESSAGE[locale],
      doctorSummary: NO_PATTERN_MESSAGE[locale],
    };
  }

  const conditions = unique(patterns.map(({ condition }) => condition));

  if (locale === 'ar') {
    const explanationParts = conditions.map((condition) => {
      const conditionPatterns = patterns.filter(
        (pattern) => pattern.condition === condition,
      );
      const details = [
        conditionPatterns.some(
          ({ pattern_type }) => pattern_type === 'repeated_family_condition',
        )
          ? 'تم الإبلاغ عنها لدى أكثر من قريب بالدم'
          : null,
        conditionPatterns.some(
          ({ pattern_type }) => pattern_type === 'multi_generation_pattern',
        )
          ? 'وتظهر عبر أكثر من جيل'
          : null,
        conditionPatterns.some(
          ({ pattern_type }) => pattern_type === 'early_onset_pattern',
        )
          ? 'وتشمل حالة أقل من حد البداية المبكرة المحدد'
          : null,
      ].filter(Boolean);

      return `${translateKnownTerm(condition, locale)} ${details.join(' ')}.`;
    });

    const doctorParts = conditions.map((condition) => {
      const reported = getReportedMembers(condition, familyMembers);
      const relationships = reported.map(({ relationship }) =>
        translateKnownTerm(relationship, locale),
      );
      const ages = reported
        .filter(({ age }) => age !== undefined)
        .map(({ age }) => String(age));
      const multiGeneration = patterns.some(
        (pattern) =>
          pattern.condition === condition &&
          pattern.pattern_type === 'multi_generation_pattern',
      );

      return [
        `يشمل التاريخ العائلي ${translateKnownTerm(condition, locale)} لدى ${relationships.join('، ')}.`,
        ages.length > 0
          ? `الأعمار المسجلة عند التشخيص: ${ages.join('، ')}.`
          : null,
        multiGeneration ? 'تظهر الحالة عبر عدة أجيال.' : null,
      ]
        .filter(Boolean)
        .join(' ');
    });

    return {
      aiExplanation: `${explanationParts.join(' ')} قد تكون هذه المعلومات مفيدة لمناقشتها مع مختص صحي مؤهل عند النظر في الرعاية الوقائية.`,
      doctorSummary: doctorParts.join('\n\n'),
    };
  }

  const explanationParts = conditions.map((condition) => {
    const conditionPatterns = patterns.filter(
      (pattern) => pattern.condition === condition,
    );
    const details = [
      conditionPatterns.some(
        ({ pattern_type }) => pattern_type === 'repeated_family_condition',
      )
        ? 'was reported in more than one blood relative'
        : null,
      conditionPatterns.some(
        ({ pattern_type }) => pattern_type === 'multi_generation_pattern',
      )
        ? 'appears across more than one generation'
        : null,
      conditionPatterns.some(
        ({ pattern_type }) => pattern_type === 'early_onset_pattern',
      )
        ? 'includes a case below the configured early-onset threshold'
        : null,
    ].filter(Boolean);

    return `${condition} ${details.join(' and ')}.`;
  });

  const doctorParts = conditions.map((condition) => {
    const reported = getReportedMembers(condition, familyMembers);
    const relationships = reported.map(({ relationship }) => relationship);
    const ages = reported
      .filter(({ age }) => age !== undefined)
      .map(({ age }) => String(age));
    const multiGeneration = patterns.some(
      (pattern) =>
        pattern.condition === condition &&
        pattern.pattern_type === 'multi_generation_pattern',
    );

    return [
      `Family history includes ${condition} in ${relationships.join(', ')}.`,
      ages.length > 0 ? `Reported diagnosis ages: ${ages.join(', ')}.` : null,
      multiGeneration
        ? 'The condition appears across multiple generations.'
        : null,
    ]
      .filter(Boolean)
      .join(' ');
  });

  return {
    aiExplanation: `${explanationParts.join(' ')} This information may be useful to discuss with a qualified healthcare professional when considering preventive care.`,
    doctorSummary: doctorParts.join('\n\n'),
  };
}
