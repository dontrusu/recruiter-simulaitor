import { MainWindow } from '../main-window/MainWindow';
import { Stage } from '../scene/Stage';
import { Taskbar } from '../screen/Taskbar';
import { DevPanel } from './DevPanel';
import { Shop } from './Shop';
import { TopBar } from './TopBar';

export function App() {
  const isDev = new URLSearchParams(globalThis.location?.search ?? '').get('dev') === '1';

  return (
    <div className="h-dvh w-screen overflow-hidden bg-[#7a9298]">
      <TopBar />
      <div className="flex" style={{ height: 'calc(100vh - 48px)' }}>
        <div className="relative min-w-0 flex-1">
          <Stage shopVisible={true}>
            <div className="absolute inset-0">
              <Taskbar />
              <MainWindow />
            </div>
          </Stage>
        </div>
        <Shop />
      </div>
      {isDev && <DevPanel />}
    </div>
  );
}
