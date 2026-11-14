// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '@/core/store/workspace';
import { Workspace } from './Workspace';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  useWorkspaceStore.setState({ devCameraState: 'A' });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Workspace', () => {
  it('shows the Screen and Shop without developer controls by default', () => {
    render(<Workspace />);

    expect(screen.getByRole('main', { name: 'Talent.OS Screen' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'Shop' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /camera/i })).toBeNull();
  });

  it('shows an operable camera control when developer mode is enabled', () => {
    window.history.replaceState(null, '', '/?dev=1');
    render(<Workspace />);

    fireEvent.click(screen.getByRole('button', { name: 'Camera: A' }));

    expect(screen.getByRole('button', { name: 'Camera: B' })).toBeTruthy();
    expect(screen.getByRole('main', { name: 'Talent.OS Screen' })).toBeTruthy();
  });

  it('does not enable developer controls for dev=0', () => {
    window.history.replaceState(null, '', '/?dev=0');
    render(<Workspace />);

    expect(screen.queryByRole('button', { name: /camera/i })).toBeNull();
  });
});
