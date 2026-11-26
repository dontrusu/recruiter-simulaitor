import { expect, it } from 'vitest';
import { rejectApplication } from './rejection';

it('awards one Credit and advances, wrapping without resetting counters', () => {
  expect(rejectApplication({ credits: 8, rejected: 8, applicationIndex: 2 }, 3)).toEqual({
    credits: 9,
    rejected: 9,
    applicationIndex: 0,
  });
});
