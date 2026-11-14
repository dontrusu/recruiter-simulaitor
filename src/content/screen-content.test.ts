import { expect, it } from 'vitest';
import { applications, vacancy } from './screen-content';

it('authors exactly one fact-supported Mismatch and one matching precise Reason per Application', () => {
  expect(applications.length).toBeGreaterThan(1);
  for (const application of applications) {
    const mismatches = [];
    if (application.reactMonths < vacancy.minimumReactMonths) mismatches.push('React');
    if (application.typescriptMonths === 0) mismatches.push('TypeScript');
    expect(application.teamsLed).toBeGreaterThan(0);
    expect(application.coverLetter).toMatch(/learn/i);
    expect(mismatches).toEqual([application.mismatch]);
    const precise = application.reasons.filter((reason) => reason.kind === 'precise');
    expect(precise).toHaveLength(1);
    expect(precise[0]?.text).toContain(application.mismatch);
    expect(application.reasons.filter((reason) => reason.kind === 'generic')).toHaveLength(2);
  }
});
