import { describe, expect, it } from 'vitest';
import { clipForCamera, scaleForCamera, stageSize, transformCSS } from './camera';

describe('scaleForCamera', () => {
  it('fits the monitor screen at 1920×1080 with no shop', () => {
    expect(scaleForCamera('A', 1920, 1080, false)).toBe(1.72);
  });

  it('fits the monitor screen at 1366×768 with no shop', () => {
    expect(scaleForCamera('A', 1366, 768, false)).toBe(1.2);
  });

  it('fits and clamps the whole room at 1920×1080 with no shop', () => {
    expect(scaleForCamera('B', 1920, 1080, false)).toBeCloseTo(1.1467, 4);
  });

  it('fits the room at 1920×1080 with the shop visible', () => {
    expect(scaleForCamera('B', 1920, 1080, true)).toBe(1.0125);
  });

  it('keeps the room scale above the floor at 1366×768 with the shop visible', () => {
    expect(scaleForCamera('B', 1366, 768, true)).toBeCloseTo(0.66625, 5);
  });

  it('uses the room scale floor at 1100×700 with the shop visible', () => {
    expect(scaleForCamera('B', 1100, 700, true)).toBe(0.65);
  });
});

describe('stageSize', () => {
  it('subtracts the shop width from the stage for State A', () => {
    expect(stageSize(1920, 1080, true).width).toBe(1620);
  });

  it('subtracts the top bar height from the stage for either camera state', () => {
    expect(stageSize(1920, 1080, false).height).toBe(1032);
    expect(stageSize(1920, 1080, true).height).toBe(1032);
  });
});

describe('transformCSS', () => {
  it('centres the monitor using the viewport and scale', () => {
    expect(transformCSS(1620, 1032, 1.0125)).toBe('translate(10px, 66px) scale(1.0125)');
  });
});

describe('clipForCamera', () => {
  it('returns the screen inset for State A', () => {
    expect(clipForCamera('A')).toBe('inset(150px 400px 150px 400px)');
  });

  it('does not clip the room for State B', () => {
    expect(clipForCamera('B')).toBeNull();
  });
});
