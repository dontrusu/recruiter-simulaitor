import { create } from 'zustand';
import { applications } from '@/content/screen-content';
import { rejectApplication, type RunState } from '@/core/engine/rejection';
import type { CameraState } from '../engine/camera';

type WorkspaceStore = {
  run: RunState;
  reject: () => void;
  viewportW: number;
  viewportH: number;
  /** Dev-only camera override. Replaced later by a value derived from owning Culture Fit Oracle. */
  devCameraState: CameraState;
  setViewport: (width: number, height: number) => void;
  toggleDevCameraState: () => void;
};

const initialViewport = () =>
  typeof window === 'undefined'
    ? { width: 0, height: 0 }
    : { width: window.innerWidth, height: window.innerHeight };

/**
 * Shared run and workspace state. Scale, transform and clip are derived by
 * `src/core/engine/camera.ts` and are never stored here.
 */
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  run: { credits: 0, rejected: 0, applicationIndex: 0 },
  reject: () => set((state) => ({ run: rejectApplication(state.run, applications.length) })),
  viewportW: initialViewport().width,
  viewportH: initialViewport().height,
  devCameraState: 'Screen',
  setViewport: (width, height) => set({ viewportW: width, viewportH: height }),
  toggleDevCameraState: () =>
    set((state) => ({ devCameraState: state.devCameraState === 'Screen' ? 'Room' : 'Screen' })),
}));
