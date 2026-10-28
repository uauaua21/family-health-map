import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildFallbackNarratives } from '@/lib/narratives';
import { detectHealthPatterns } from '@/lib/rules';

import { POST } from '@/app/api/analyze/route';
import { DEMO_FAMILY } from '@/lib/demo-data';
import type { AnalysisResponse } from '@/types/health';

function request(body: string) {
  return new Request('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/analyze', () => {
  it('returns the four required demo patterns without an AI key', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    const response = await POST(
      request(JSON.stringify({ familyMembers: DEMO_FAMILY })),
    );
    const result = (await response.json()) as AnalysisResponse;

    expect(response.status).toBe(200);
    expect(result.aiAvailable).toBe(false);
    expect(result.patterns).toHaveLength(4);
    expect(
      result.patterns.map(
        (pattern: { condition: string; pattern_type: string }) =>
          `${pattern.condition}:${pattern.pattern_type}`,
      ),
    ).toEqual([
      'Heart Disease:repeated_family_condition',
      'Heart Disease:multi_generation_pattern',
      'Type 2 Diabetes:repeated_family_condition',
      'Type 2 Diabetes:multi_generation_pattern',
    ]);
    expect(result.aiExplanation).toContain('qualified healthcare professional');
    expect(result.doctorSummary).toContain(
      'Reported diagnosis ages: 44, 47, 58.',
    );
  });

  it('returns the safe message for an empty family', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    const response = await POST(request(JSON.stringify({ familyMembers: [] })));
    const result = (await response.json()) as AnalysisResponse;

    expect(response.status).toBe(200);
    expect(result.patterns).toEqual([]);
    expect(result.aiExplanation).toBe(
      'No notable family pattern was detected from the information provided.',
    );
  });

  it('returns Arabic fallback explanations when requested', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    const response = await POST(
      request(JSON.stringify({ familyMembers: DEMO_FAMILY, locale: 'ar' })),
    );
    const result = (await response.json()) as AnalysisResponse;

    expect(response.status).toBe(200);
    expect(result.aiExplanation).toContain('مختص صحي مؤهل');
    expect(result.doctorSummary).toContain('أمراض القلب');
  });

  it('rejects invalid JSON and invalid family data', async () => {
    const invalidJsonResponse = await POST(request('{'));
    const invalidDataResponse = await POST(
      request(JSON.stringify({ familyMembers: 'not-an-array' })),
    );

    expect(invalidJsonResponse.status).toBe(400);
    expect(invalidDataResponse.status).toBe(400);
  });
  it('rejects duplicate member identities', async () => {
    const response = await POST(
      request(
        JSON.stringify({ familyMembers: [DEMO_FAMILY[1], DEMO_FAMILY[1]] }),
      ),
    );
    expect(response.status).toBe(400);
  });

  it('keeps AI off even if a key exists unless explicitly enabled', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'test-placeholder-not-a-real-key');
    vi.stubEnv('ENABLE_AI_EXPLANATIONS', 'false');
    const response = await POST(
      request(JSON.stringify({ familyMembers: DEMO_FAMILY })),
    );
    const result = (await response.json()) as AnalysisResponse;
    expect(result.aiAvailable).toBe(false);
    expect(result.patterns).toHaveLength(4);
  });

  it('does not include non-blood relatives in a rule-based summary', () => {
    const family = structuredClone(DEMO_FAMILY);
    family.push({
      ...family[1],
      id: 'stepfather',
      relationship: 'Stepfather',
      blood_relative: false,
      conditions: [
        {
          id: 'stepfather-condition',
          condition_name: 'Heart Disease',
          diagnosis_age: 99,
        },
      ],
    });
    const result = buildFallbackNarratives(
      detectHealthPatterns(family),
      family,
    );
    expect(result.doctorSummary).not.toContain('Stepfather');
    expect(result.doctorSummary).not.toContain('99');
  });
});
