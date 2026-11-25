import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button, Icon, Popover } from "@talent-os/design-system";

const ToolsHost = createContext<HTMLDivElement | null>(null);

export function ReviewTools({ children }: { children: ReactNode }) {
  const host = useContext(ToolsHost);
  return host ? createPortal(children, host) : null;
}

export function ReviewPanel({
  controls,
  children,
}: {
  controls: ReactNode;
  children: ReactNode;
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <ToolsHost.Provider value={host}>
      {children}
      <div className="review-launcher" lang="uk">
        <Popover
          label="Налаштування макета"
          trigger={
            <Button variant="secondary" aria-label="Налаштування макета">
              <Icon name="sliders" />
              Макет
            </Button>
          }
        >
          <div className="review-console">
            {controls}
            <div ref={setHost} />
          </div>
        </Popover>
      </div>
    </ToolsHost.Provider>
  );
}
