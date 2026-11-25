const symbols = {
  monitor: "M2 3h12v9H2zM5 6h1m4 0h1M5 9h6M5 15h6m-3-3v3",
  file: "M4 2h6l3 3v9H4zM10 2v4h3M6 8h5m-5 3h5",
  coin: "M3 4h10l2 2v4l-2 2H3l-2-2V6zM1 6l2 2h10l2-2",
  shop: "M3 7v7h10V7M2 4l2-2h8l2 2v3H2zM6 14v-4h4v4M6 2v5m4-5v5",
  music: "M2 9V7a6 6 0 0 1 12 0v2M2 8h3v6H2zm9 0h3v6h-3z",
  pool: "M1 9c3-5 5 5 8 0s5 0 6 0M1 13c3-5 5 5 8 0s5 0 6 0M5 1v5m6-5v5M5 3h6",
  letter: "M1 3h14v10H1zM1 4l7 5 7-5",
  oracle: "M8 1v14M1 8h14M4 4l8 8m0-8-8 8",
  plant: "M8 14V6M8 10S2 11 2 4c5 0 6 2 6 5M8 8s6 1 6-6c-5 0-6 2-6 6",
  cup: "M2 6h10v4l-2 4H4l-2-4zM12 7h3v3h-3M5 2v2m4-2v2",
};

export function Symbol({ name }: { name: keyof typeof symbols }) {
  return (
    <svg
      className="symbol"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d={symbols[name]} />
    </svg>
  );
}
