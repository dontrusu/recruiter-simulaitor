import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

it('renders the v2 room scene when the v2 preview query is enabled', async () => {
  vi.stubGlobal('location', { search: '?v2=1' });
  const { RootApp } = await import('./RootApp');

  const markup = renderToStaticMarkup(createElement(RootApp));

  expect(markup).toContain('data-camera="A"');
  expect(markup).toContain('h-dvh w-screen');
  expect(markup).toContain('width:1600px');
});

it('keeps the existing app as the default without the v2 preview query', async () => {
  vi.stubGlobal('location', { search: '' });
  const { RootApp } = await import('./RootApp');

  const markup = renderToStaticMarkup(createElement(RootApp));

  expect(markup).toContain('game-world');
  expect(markup).not.toContain('data-camera="A"');
});
