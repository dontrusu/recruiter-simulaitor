import { expect, it } from 'vitest';
import { applications, vacancy } from './screen-content';

it('authors exactly one fact-supported Mismatch per Application', () => {
  expect(applications.length).toBeGreaterThan(1);
  for (const application of applications) {
    const mismatches = [];
    if (application.reactMonths < vacancy.minimumReactMonths) mismatches.push('React');
    if (application.typescriptMonths === 0) mismatches.push('TypeScript');
    expect(application.teamsLed).toBeGreaterThan(0);
    expect(mismatches).toEqual([application.mismatch]);
    expect(application.testing).toBeTruthy();
    expect(application.accessibility).toBeTruthy();
    expect(application.learning).toBeTruthy();
  }
});
