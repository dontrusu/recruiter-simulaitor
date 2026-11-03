import { App } from './App';
import { MainWindow } from './v2/ui/main-window/MainWindow';
import { Stage } from './v2/ui/scene/Stage';
import { Taskbar } from './v2/ui/screen/Taskbar';
import { Shop } from './v2/ui/shell/Shop';
import { TopBar } from './v2/ui/shell/TopBar';

export function RootApp() {
  const isV2Preview = new URLSearchParams(globalThis.location?.search ?? '').get('v2') === '1';

  return isV2Preview ? (
    <div className="h-dvh w-screen overflow-hidden bg-[#7a9298]">
      <TopBar />
      <div className="flex" style={{ height: 'calc(100vh - 48px)' }}>
        <Shop />
        <div className="relative min-w-0 flex-1">
          <Stage shopVisible={true}>
            <div className="absolute inset-0">
              <Taskbar />
              <MainWindow />
            </div>
          </Stage>
        </div>
      </div>
    </div>
  ) : (
    <App />
  );
}
