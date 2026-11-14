import { describe, expect, it } from 'vitest';
import { rejectApplication } from './rejection';

describe('Rejection', () => {
  it('awards 12 Credits and advances exactly one Application for a precise Reason', () => {
    expect(
      rejectApplication({ credits: 0, rejected: 0, applicationIndex: 0 }, 'precise', 3),
    ).toEqual({
      credits: 12,
      rejected: 1,
      applicationIndex: 1,
    });
  });
  it('awards 3 Credits for each generic activation and wraps deterministically', () => {
    let run = { credits: 12, rejected: 1, applicationIndex: 1 };
    run = rejectApplication(run, 'generic', 3);
    expect(run).toEqual({ credits: 15, rejected: 2, applicationIndex: 2 });
    run = rejectApplication(run, 'generic', 3);
    expect(run).toEqual({ credits: 18, rejected: 3, applicationIndex: 0 });
    expect(rejectApplication(run, 'precise', 3)).toEqual({
      credits: 30,
      rejected: 4,
      applicationIndex: 1,
    });
  });
});
