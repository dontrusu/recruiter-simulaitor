import { App } from './App';
import { MainWindow } from './v2/ui/main-window/MainWindow';
import { Stage } from './v2/ui/scene/Stage';
import { Taskbar } from './v2/ui/screen/Taskbar';
import { DevPanel } from './v2/ui/shell/DevPanel';
import { Shop } from './v2/ui/shell/Shop';
import { TopBar } from './v2/ui/shell/TopBar';

export function RootApp() {
  const searchParams = new URLSearchParams(globalThis.location?.search ?? '');
  const isV2Preview = searchParams.get('v2') === '1';
  const isDev = searchParams.get('dev') === '1';

  const preview = isV2Preview ? (
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

  return (
    <>
      {preview}
      {isDev && <DevPanel />}
    </>
  );
}
