// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '@/core/store/workspace';
import { Workspace } from './Workspace';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  useWorkspaceStore.setState({ devCameraState: 'Screen' });
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

    expect(screen.getByRole('main', { name: 'Talent.OS Screen' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /camera/i })).not.toBeInTheDocument();
  });

  it('shows an operable camera control when developer mode is enabled', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/?dev=1');
    render(<Workspace />);

    await user.click(screen.getByRole('button', { name: 'Camera: Screen' }));

    expect(screen.getByRole('button', { name: 'Camera: Room' })).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Talent.OS Screen' })).toBeInTheDocument();
  });

  it('does not enable developer controls for dev=0', () => {
    window.history.replaceState(null, '', '/?dev=0');
    render(<Workspace />);

    expect(screen.queryByRole('button', { name: /camera/i })).not.toBeInTheDocument();
  });
});
