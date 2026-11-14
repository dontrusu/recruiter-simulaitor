import type { ReasonKind } from '@/core/engine/rejection';

export type Reason = { text: string; kind: ReasonKind };

type Application = {
  number: number;
  status: string;
  name: string;
  location: string;
  reactMonths: number;
  typescriptMonths: number;
  teamsLed: number;
  lastRole: string;
  coverLetter: string;
  mismatch: 'React' | 'TypeScript';
  reasons: readonly [Reason, Reason, Reason];
};

export const vacancy = {
  title: 'Frontend Developer',
  minimumReactMonths: 48,
  requirements: ['TypeScript', 'Team player', 'Fast learner', '4+ years React'],
};

const genericReasons = [
  { text: 'Not a culture fit', kind: 'generic' },
  { text: 'Let’s circle back', kind: 'generic' },
] as const;

export const applications: readonly Application[] = [
  {
    number: 9,
    status: 'Returning',
    name: 'Oleg Marchenko',
    location: 'Kyiv · Hybrid',
    reactMonths: 47,
    typescriptMonths: 48,
    teamsLed: 3,
    lastRole: 'Foodly · 2023–25',
    coverLetter: 'I learned a new stack to rebuild my gran’s bakery site with her team.',
    mismatch: 'React',
    reasons: [{ text: 'Short of 4 years of React', kind: 'precise' }, ...genericReasons],
  },
  {
    number: 10,
    status: 'New',
    name: 'Marta Kovalenko',
    location: 'Lviv · Hybrid',
    reactMonths: 60,
    typescriptMonths: 0,
    teamsLed: 2,
    lastRole: 'Parcel · 2021–26',
    coverLetter: 'Our team learned React in a week. We still ship JavaScript together.',
    mismatch: 'TypeScript',
    reasons: [{ text: 'No TypeScript experience', kind: 'precise' }, ...genericReasons],
  },
  {
    number: 11,
    status: 'New',
    name: 'Danylo Melnyk',
    location: 'Dnipro · Hybrid',
    reactMonths: 36,
    typescriptMonths: 60,
    teamsLed: 4,
    lastRole: 'Ledger · 2022–26',
    coverLetter: 'I learn quickly and pair with the whole team. Our last migration took a week.',
    mismatch: 'React',
    reasons: [{ text: 'Short of 4 years of React', kind: 'precise' }, ...genericReasons],
  },
];
