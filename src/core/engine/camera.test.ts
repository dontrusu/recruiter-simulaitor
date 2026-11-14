import { describe, expect, it } from 'vitest';
import { clipForCamera, scaleForCamera, stageSize, transformCSS } from './camera';

describe('scaleForCamera', () => {
  it('fits the Screen at 1920×1080 with no Shop', () => {
    expect(scaleForCamera('A', 1920, 1080, false)).toBe(2.16);
  });

  it('fits the Screen at 1366×768 with no Shop', () => {
    expect(scaleForCamera('A', 1366, 768, false)).toBe(1.536);
  });

  it('fits the whole Room at 1920×1080 with no Shop', () => {
    expect(scaleForCamera('B', 1920, 1080, false)).toBe(1.2);
  });

  it('fits the room at 1920×1080 with the shop visible', () => {
    expect(scaleForCamera('B', 1920, 1080, true)).toBe(1.0125);
  });

  it('fits the room at 1366×768 with the shop visible', () => {
    expect(scaleForCamera('B', 1366, 768, true)).toBeCloseTo(0.66625, 5);
  });

  it('fits the room at 1100×700 with the shop visible', () => {
    expect(scaleForCamera('B', 1100, 700, true)).toBe(0.5);
  });
});

describe('stageSize', () => {
  it('subtracts the fixed Shop width from the stage', () => {
    expect(stageSize(1920, 1080, true).width).toBe(1620);
  });

  it('uses the full viewport height for either camera state', () => {
    expect(stageSize(1920, 1080, false).height).toBe(1080);
    expect(stageSize(1920, 1080, true).height).toBe(1080);
  });
});

describe('transformCSS', () => {
  it('centres the Monitor using the viewport and scale', () => {
    expect(transformCSS(1620, 1080, 1.0125)).toBe('translate(0px, 84.375px) scale(1.0125)');
  });
});

describe('clipForCamera', () => {
  it('returns the screen inset for State A', () => {
    expect(clipForCamera('A')).toBe('inset(200px 400px 200px 400px)');
  });

  it('does not clip the room for State B', () => {
    expect(clipForCamera('B')).toBeNull();
  });
});
