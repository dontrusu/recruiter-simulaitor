import { writeFileSync } from 'node:fs';
import { it, expect } from 'vitest';
import { simulate, type Profile } from './simulation';
it('balances deterministic player profiles', () => {
  const profiles: Profile[] = ['basic', 'active', 'optimized', 'interview-heavy', 'passive'];
  const count = Number(process.env.SIMULATION_SEEDS ?? 1);
  const results = profiles.flatMap((p) =>
    Array.from({ length: count }, (_, i) => simulate(`balance-${i}`, p)),
  );
  if (count > 1)
    writeFileSync(
      'notes/balance-results.json',
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          seeds: count,
          profiles: profiles.map((p) => {
            const rows = results.filter((r) => r.profile === p);
            return {
              profile: p,
              runs: count,
              corporate: rows.filter((r) => r.ending === 'corporate').length,
              minMinutes: Math.min(...rows.map((r) => r.minutes)),
              maxMinutes: Math.max(...rows.map((r) => r.minutes)),
              meanMinutes: rows.reduce((s, r) => s + r.minutes, 0) / count,
              minFinalMinute: Math.min(...rows.map((r) => r.finalMinute)),
              maxFinalMinute: Math.max(...rows.map((r) => r.finalMinute)),
              sample: rows[0],
            };
          }),
        },
        null,
        2,
      ) + '\n',
    );
  for (const p of profiles) {
    const rows = results.filter((r) => r.profile === p);
    console.log(
      JSON.stringify({
        profile: p,
        runs: count,
        min: Math.min(...rows.map((r) => r.minutes)),
        max: Math.max(...rows.map((r) => r.minutes)),
        sample: rows[0],
      }),
    );
  }
  for (const r of results)
    if (r.profile !== 'passive') {
      expect(r.ending, JSON.stringify(r)).toBe('corporate');
      expect(r.owned).toBe(35);
      expect(r.passiveShare).toBeGreaterThan(0.6);
      expect(r.minutes).toBeGreaterThan(13);
      expect(r.minutes).toBeLessThan(20);
      expect(r.specials).toBeGreaterThanOrEqual(6);
      expect(r.specials).toBeLessThanOrEqual(10);
    }
}, 120000);
