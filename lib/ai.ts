import OpenAI from 'openai';

import type { Locale } from '@/lib/i18n';
import { buildFallbackNarratives } from '@/lib/narratives';
import type { FamilyMember, HealthPattern } from '@/types/health';

export async function generateHealthNarratives(
  patterns: HealthPattern[],
  familyMembers: FamilyMember[],
  locale: Locale = 'en',
) {
  const fallback = buildFallbackNarratives(patterns, familyMembers, locale);
  const apiKey = process.env.OPENAI_API_KEY;

  if (
    process.env.ENABLE_AI_EXPLANATIONS !== 'true' ||
    !apiKey ||
    patterns.length === 0
  ) {
    return { ...fallback, aiAvailable: false };
  }

  const relevantRelationships = new Set(
    patterns.flatMap(({ affected_members }) => affected_members),
  );
  const relevantFamily = familyMembers
    .filter(({ relationship }) => relevantRelationships.has(relationship))
    .map(({ relationship, generation, family_side, conditions }) => ({
      relationship,
      generation,
      family_side,
      conditions: conditions.map(({ condition_name, diagnosis_age }) => ({
        condition_name,
        diagnosis_age,
      })),
    }));

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
      instructions: `You explain family health history patterns.
Do not diagnose diseases. Do not calculate or invent medical probabilities.
Do not recommend medications. Only explain patterns already detected by the rule engine.
Use simple, calm language. Encourage consultation with a qualified healthcare professional when appropriate.
Write both outputs in ${locale === 'ar' ? 'clear Modern Standard Arabic' : 'clear English'}.
Return only valid JSON with two string fields: aiExplanation and doctorSummary.
The doctor summary must be concise and must not add unsupported facts.`,
      input: JSON.stringify({ patterns, relevantFamily }),
    });

    const parsed = JSON.parse(response.output_text) as {
      aiExplanation?: unknown;
      doctorSummary?: unknown;
    };

    if (
      typeof parsed.aiExplanation !== 'string' ||
      typeof parsed.doctorSummary !== 'string'
    ) {
      return { ...fallback, aiAvailable: false };
    }

    return {
      aiExplanation: parsed.aiExplanation,
      doctorSummary: parsed.doctorSummary,
      aiAvailable: true,
    };
  } catch {
    return { ...fallback, aiAvailable: false };
  }
}
