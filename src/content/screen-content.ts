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
  testing: string;
  accessibility: string;
  learning: string;
};

export const vacancy = {
  title: 'Frontend Developer',
  minimumReactMonths: 48,
  requirements: [
    'React · 4+ years',
    'TypeScript · 2+ years',
    'Testing · 2+ years',
    'Accessibility · Experience',
    'Collaboration · Team player',
    'Fast learner',
  ],
};

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
    testing: '2+ years',
    accessibility: 'Experience',
    learning: 'Learned a new stack',
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
    testing: '2+ years',
    accessibility: 'Experience',
    learning: 'Learned React in a week',
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
    testing: '2+ years',
    accessibility: 'Experience',
    learning: 'Completed a migration in a week',
  },
];
