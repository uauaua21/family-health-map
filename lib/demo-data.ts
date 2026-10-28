import type { FamilyMember } from '@/types/health';

export const DEMO_FAMILY: FamilyMember[] = [
  {
    id: 'ahmed',
    name: 'Ahmed',
    relationship: 'Self',
    generation: 0,
    family_side: 'self',
    blood_relative: true,
    gender: 'male',
    birth_year: 1998,
    living_status: 'living',
    conditions: [],
  },
  {
    id: 'mohammed',
    name: 'Mohammed',
    relationship: 'Father',
    generation: 1,
    family_side: 'paternal',
    blood_relative: true,
    gender: 'male',
    living_status: 'living',
    conditions: [
      {
        id: 'mohammed-heart-disease',
        condition_name: 'Heart Disease',
        diagnosis_age: 44,
      },
    ],
  },
  {
    id: 'ali',
    name: 'Ali',
    relationship: 'Paternal Uncle',
    generation: 1,
    family_side: 'paternal',
    blood_relative: true,
    gender: 'male',
    living_status: 'living',
    conditions: [
      {
        id: 'ali-heart-disease',
        condition_name: 'Heart Disease',
        diagnosis_age: 47,
      },
    ],
  },
  {
    id: 'saleh',
    name: 'Saleh',
    relationship: 'Paternal Grandfather',
    generation: 2,
    family_side: 'paternal',
    blood_relative: true,
    gender: 'male',
    living_status: 'deceased',
    conditions: [
      {
        id: 'saleh-heart-disease',
        condition_name: 'Heart Disease',
        diagnosis_age: 58,
      },
    ],
  },
  {
    id: 'fatimah',
    name: 'Fatimah',
    relationship: 'Mother',
    generation: 1,
    family_side: 'maternal',
    blood_relative: true,
    gender: 'female',
    living_status: 'living',
    conditions: [
      {
        id: 'fatimah-diabetes',
        condition_name: 'Type 2 Diabetes',
        diagnosis_age: 46,
      },
    ],
  },
  {
    id: 'noura',
    name: 'Noura',
    relationship: 'Maternal Grandmother',
    generation: 2,
    family_side: 'maternal',
    blood_relative: true,
    gender: 'female',
    living_status: 'living',
    conditions: [
      {
        id: 'noura-diabetes',
        condition_name: 'Type 2 Diabetes',
        diagnosis_age: 51,
      },
    ],
  },
];
