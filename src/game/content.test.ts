import { describe, it, expect } from 'vitest';
import {
  candidateNames,
  candidateDecisionFragments,
  candidateDecisionTextEn,
} from '../../spec/candidate-decision-content';
import {
  candidateProfileFragments,
  candidateProfileTextEn,
} from '../../spec/candidate-profile-fragments';
import { roles, archetypes, skills } from '../../spec/candidate-core-data';
import {
  specialCandidates,
  validateSpecialCandidateContent,
} from '../../spec/special-candidate-content';
import { candidateFor } from './content';
import { upgrades } from './config';
import { eventCopy } from '../content/events';
import { reactions } from '../content/reactions';
describe('bundled production content', () => {
  it('resolves every upgrade, prerequisite and event definition', () => {
    expect(upgrades).toHaveLength(35);
    expect(new Set(upgrades.map((u) => u.id)).size).toBe(35);
    for (const u of upgrades) {
      expect(u.cost).toBeGreaterThan(0);
      for (const id of u.requires) expect(upgrades.some((p) => p.id === id)).toBe(true);
      if (['choice', 'interrupt', 'sprint', 'automation', 'exception'].includes(u.kind))
        expect(eventCopy[u.id]).toBeDefined();
    }
  });
  it('resolves authored fragment and special references', () => {
    validateSpecialCandidateContent();
    for (const pool of [
      candidateNames,
      candidateDecisionFragments,
      candidateProfileFragments,
      roles,
      archetypes,
      skills,
      specialCandidates,
    ])
      expect(new Set(pool.map((i) => i.id)).size).toBe(pool.length);
    for (const f of [...candidateDecisionFragments, ...candidateProfileFragments]) {
      const text = { ...candidateDecisionTextEn, ...candidateProfileTextEn }[f.textKey];
      expect(text, f.id).toBeTruthy();
      expect(text.length, f.id).toBeLessThan(500);
      for (const role of f.compatibleRoleIds ?? [])
        expect(
          roles.some((r) => r.id === role),
          f.id,
        ).toBe(true);
    }
    expect(archetypes.length).toBeGreaterThanOrEqual(24);
    expect(roles.length).toBeGreaterThanOrEqual(12);
    expect(specialCandidates.length).toBeGreaterThanOrEqual(24);
  });
  it('validates contextual copy pools and placeholders', () => {
    const minimum = {
      rejection: 40,
      streak: 20,
      mira: 60,
      manager: 35,
      wellbeing: 25,
      appeal: 24,
      achievement: 25,
    };
    for (const channel of Object.keys(reactions) as (keyof typeof reactions)[]) {
      const pool = reactions[channel];
      expect(pool.length).toBeGreaterThanOrEqual(minimum[channel]);
      expect(new Set(pool).size).toBe(pool.length);
      for (const line of pool) {
        expect(line.trim()).not.toBe('');
        expect(line).not.toMatch(/\{[^}]+\}/);
      }
    }
  });
  it('composes 1,000 unique coherent routine identities per seed', () => {
    for (const seed of ['alpha', 'beta', 'gamma']) {
      const names = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        const c = candidateFor(
          seed,
          i,
          upgrades.slice(0, i % 33).map((u) => u.id),
          specialCandidates.map((s) => s.id),
        );
        expect(names.has(c.name), c.name).toBe(false);
        names.add(c.name);
        expect(c.summary).toBeTruthy();
        expect(c.evidence).toBeTruthy();
        expect(c.concern).toBeTruthy();
        expect(c.years).toBeGreaterThanOrEqual(0);
        expect(c.skills.length).toBeGreaterThan(0);
        expect(c.match).toBeGreaterThanOrEqual(0);
        expect(c.match).toBeLessThanOrEqual(100);
        expect(c).toEqual(
          candidateFor(
            seed,
            i,
            upgrades.slice(0, i % 33).map((u) => u.id),
            specialCandidates.map((s) => s.id),
          ),
        );
      }
    }
  });
});
