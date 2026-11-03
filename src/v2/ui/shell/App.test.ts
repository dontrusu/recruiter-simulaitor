import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { App } from './App';

afterEach(() => {
  vi.unstubAllGlobals();
});

it('renders the v2 shell as the default app layout', () => {
  vi.stubGlobal('location', { search: '' });

  const markup = renderToStaticMarkup(createElement(App));

  expect(markup).toContain('data-camera="A"');
  expect(markup).toContain('h-dvh w-screen');
  expect(markup).toContain('Talent.OS');
  expect(markup).toContain('vacancy_panel');
  expect(markup).toContain('shop-column');
  expect(markup).toContain('taskbar');
  expect(markup).not.toContain('game-world');
});

it('renders the dev camera toggle when the dev query flag is enabled', () => {
  vi.stubGlobal('location', { search: '?dev=1' });

  const markup = renderToStaticMarkup(createElement(App));

  expect(markup).toContain('Camera: A');
  expect(markup).toContain('dev-panel');
});
