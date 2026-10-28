export type MedicalCondition = {
  id: string;
  condition_name: string;
  diagnosis_age?: number;
  notes?: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  generation: number;
  family_side: 'paternal' | 'maternal' | 'self' | 'unknown';
  blood_relative: boolean;
  gender?: string;
  birth_year?: number;
  living_status?: 'living' | 'deceased';
  conditions: MedicalCondition[];
};

export type HealthPattern = {
  condition: string;
  pattern_type:
    | 'repeated_family_condition'
    | 'multi_generation_pattern'
    | 'early_onset_pattern';
  affected_members: string[];
  generations?: number[];
  attention_level: 'info' | 'attention';
};

export type AnalysisResponse = {
  patterns: HealthPattern[];
  aiExplanation: string;
  doctorSummary: string;
  aiAvailable?: boolean;
};
