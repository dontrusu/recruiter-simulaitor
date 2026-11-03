export function TopBar() {
  return (
    <div
      className="flex h-12 w-full items-center justify-between border-b border-[#dfe6e2] bg-[#dfe6e2]/90 px-4 text-[#1d2a2f] shadow-[inset_0_-1px_0_rgba(60,88,84,0.18)]"
      style={{ height: 48 }}
    >
      <span className="text-sm font-semibold tracking-[0.18em] text-[#1d2a2f]">Talent.OS</span>
      <div className="flex items-center gap-8 text-[10px] font-medium uppercase tracking-[0.22em] text-[#61757c]">
        <span>Credits</span>
        <span>Rejected</span>
      </div>
    </div>
  );
}
