import { generateHealthNarratives } from '@/lib/ai';
import { detectHealthPatterns } from '@/lib/rules';
import { analyzeRequestSchema } from '@/lib/validation';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const parsed = analyzeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: 'Family data is invalid.',
        details: parsed.error.issues.map(({ path, message }) => ({
          path,
          message,
        })),
      },
      { status: 400 },
    );
  }

  const patterns = detectHealthPatterns(parsed.data.familyMembers);
  const narratives = await generateHealthNarratives(
    patterns,
    parsed.data.familyMembers,
    parsed.data.locale,
  );

  return Response.json({ patterns, ...narratives });
}
