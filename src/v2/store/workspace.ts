import { create } from 'zustand';
import type { CameraState } from '../engine/camera';

type WorkspaceStore = {
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
 * The shell's minimal state. Scale, transform and clip are derived from it by
 * `src/v2/engine/camera.ts` and are never stored here.
 */
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  viewportW: initialViewport().width,
  viewportH: initialViewport().height,
  devCameraState: 'A',
  setViewport: (width, height) => set({ viewportW: width, viewportH: height }),
  toggleDevCameraState: () =>
    set((state) => ({ devCameraState: state.devCameraState === 'A' ? 'B' : 'A' })),
}));
