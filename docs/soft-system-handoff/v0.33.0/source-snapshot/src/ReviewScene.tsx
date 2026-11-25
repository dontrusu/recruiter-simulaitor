import { useLayoutEffect, useRef, type ReactNode } from "react";

export function ReviewScene({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const card = scene?.querySelector<HTMLElement>(".review-window");
    if (!scene || !card) return;
    const measureCard = () => {
      scene.style.setProperty("--card-height", `${card.offsetHeight}px`);
      // Read after setting height: the card's centered position depends on it.
      scene.style.setProperty(
        "--card-bottom",
        `${card.offsetTop + card.offsetHeight}px`,
      );
    };
    measureCard();
    const observer = new ResizeObserver(measureCard);
    observer.observe(scene);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="composition-a" ref={sceneRef}>
      {children}
    </div>
  );
}
