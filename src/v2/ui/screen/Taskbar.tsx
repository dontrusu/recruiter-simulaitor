export function Taskbar() {
  return (
    <div
      className="taskbar absolute left-0 bg-[#dfe4df]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
      style={{
        top: 568,
        width: 800,
        height: 32,
        borderTop: '1px solid rgba(99, 109, 109, 0.55)',
      }}
    >
      <div
        className="absolute left-0 top-0 flex h-full items-center justify-center border-r border-[#bbc3bf] bg-gradient-to-r from-[#d5d7d4] via-[#c9ceca] to-[#bfc7c2] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3d4d50]"
        style={{ width: 96, height: 32 }}
      >
        Start
      </div>
      <div className="absolute left-[104px] top-0 h-full" style={{ width: 488 }} />
      <div className="absolute left-[600px] top-0 h-full" style={{ width: 200 }} />
    </div>
  );
}
