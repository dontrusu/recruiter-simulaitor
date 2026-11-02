import { App } from './App';
import { Stage } from './v2/ui/scene/Stage';

export function RootApp() {
  const isV2Preview = new URLSearchParams(globalThis.location?.search ?? '').get('v2') === '1';

  return isV2Preview ? <Stage /> : <App />;
}
