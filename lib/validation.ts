import { z } from 'zod';

const conditionSchema = z.object({
  id: z.string().min(1).max(120),
  condition_name: z.string().trim().min(1).max(120),
  diagnosis_age: z.number().int().min(0).max(130).optional(),
  notes: z.string().trim().max(500).optional(),
});

const familyMemberSchema = z.object({
  id: z.string().min(1).max(120),
  name: z.string().trim().min(1).max(120),
  relationship: z.string().trim().min(1).max(120),
  generation: z.number().int().min(0).max(8),
  family_side: z.enum(['paternal', 'maternal', 'self', 'unknown']),
  blood_relative: z.boolean(),
  gender: z.string().trim().max(40).optional(),
  birth_year: z.number().int().min(1800).max(2200).optional(),
  living_status: z.enum(['living', 'deceased']).optional(),
  conditions: z.array(conditionSchema).max(50),
});

export const analyzeRequestSchema = z.object({
  familyMembers: z
    .array(familyMemberSchema)
    .max(200)
    .superRefine((members, context) => {
      const seen = new Set<string>();
      for (const [index, member] of members.entries()) {
        if (seen.has(member.id)) {
          context.addIssue({
            code: 'custom',
            message: 'Family member IDs must be unique.',
            path: [index, 'id'],
          });
        }
        seen.add(member.id);
      }
    }),
  locale: z.enum(['en', 'ar']).optional().default('en'),
});
