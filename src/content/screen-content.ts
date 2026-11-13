// Representative content for the visual slice. The playable sequence belongs to #20.
export const vacancy = {
  title: 'Frontend Developer',
  requirements: ['TypeScript', 'Team player', 'Fast learner', '4+ years React'],
};

export const application = {
  number: 9,
  status: 'Returning',
  name: 'Oleg Marchenko',
  location: 'Kyiv · Hybrid',
  reactExperience: '3 yrs 11 mo',
  typescriptExperience: '4 yrs',
  teamsLed: 3,
  lastRole: 'Foodly · 2023–25',
  coverLetter: 'I rebuilt my gran’s bakery site for free.',
};

export const reasons = [
  { text: 'Short of 4 years of React', credits: 12, kind: 'precise' },
  { text: 'Not a culture fit', credits: 3, kind: 'generic' },
  { text: 'Let’s circle back', credits: 3, kind: 'generic' },
] as const;
