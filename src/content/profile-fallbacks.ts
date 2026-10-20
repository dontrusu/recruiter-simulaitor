// Low-salience alternatives when the draft pool has no coherent fragment for a role/archetype.
export const profileFallbacks: Record<string, { experience: string; evidence: string }> = {
  'frontend-engineer': {
    experience: 'Works on browser interfaces with attention to rendering, state and accessibility.',
    evidence: 'Submitted interface examples and an explanation of the implementation trade-offs.',
  },
  'backend-engineer': {
    experience: 'Works on application services, data storage and API contracts.',
    evidence: 'Submitted a service design with request examples and database constraints.',
  },
  'fullstack-engineer': {
    experience: 'Connects browser interfaces to application services and data models.',
    evidence: 'Submitted an end-to-end feature with notes on the boundaries between layers.',
  },
  'mobile-engineer': {
    experience:
      'Builds mobile interfaces with attention to unreliable networks and device constraints.',
    evidence: 'Submitted an application example and notes on offline behaviour.',
  },
  'qa-automation-engineer': {
    experience: 'Works on test coverage, failure diagnosis and release confidence.',
    evidence: 'Submitted a test plan with reproducible examples of the failures it catches.',
  },
  'platform-engineer': {
    experience: 'Works on deployment workflows and the systems used by development teams.',
    evidence: 'Submitted a deployment configuration and an explanation of its failure modes.',
  },
  'data-engineer': {
    experience: 'Works on moving, validating and structuring data between systems.',
    evidence: 'Submitted a pipeline example with explicit source and destination contracts.',
  },
  'machine-learning-engineer': {
    experience: 'Works on model evaluation and the services around deployed predictions.',
    evidence: 'Submitted an evaluation report with a baseline and documented limitations.',
  },
  'security-engineer': {
    experience: 'Works on application risk, secure defaults and incident preparation.',
    evidence: 'Submitted a threat model with concrete mitigations and their trade-offs.',
  },
  'product-designer': {
    experience: 'Works on product interfaces informed by research and usability observations.',
    evidence: 'Submitted a case study connecting a design decision to user evidence.',
  },
  'product-manager': {
    experience: 'Works on problem discovery, delivery priorities and product outcomes.',
    evidence: 'Submitted a prioritisation example with assumptions and outcome measures.',
  },
  'engineering-manager': {
    experience: 'Works on team delivery, technical direction and individual development.',
    evidence: 'Submitted a delivery plan explaining responsibilities, risks and review points.',
  },
};
export const skillLabels: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  react: 'React',
  vue: 'Vue',
  nodejs: 'Node.js',
  postgresql: 'PostgreSQL',
  'rest-api': 'REST APIs',
  'html-css': 'HTML / CSS',
  'ci-cd': 'CI / CD',
  python: 'Python',
  docker: 'Docker',
  playwright: 'Playwright',
  kubernetes: 'Kubernetes',
  aws: 'AWS',
  figma: 'Figma',
  'react-native': 'React Native',
  'machine-learning': 'Machine learning',
  'user-research': 'User research',
  'stakeholder-management': 'Stakeholders',
};
