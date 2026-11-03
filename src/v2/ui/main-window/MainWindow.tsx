export function MainWindow() {
  return (
    <div
      className="absolute overflow-hidden border border-[#c8c8c8] bg-[#f7f7f7] shadow-[0_8px_18px_rgba(0,0,0,0.14)]"
      style={{
        left: 180,
        top: 90,
        width: 440,
        height: 340,
      }}
    >
      <div className="flex h-6 items-center justify-between border-b border-[#d7d7d7] bg-[#dfe2df] px-2 text-[10px] font-medium tracking-[0.18em] text-[#4b5760]">
        <span className="uppercase">Talent.OS</span>
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full border border-[#9aa5a7] bg-[#f3f3f3]" />
          <span className="h-2.5 w-2.5 rounded-full border border-[#9aa5a7] bg-[#f3f3f3]" />
          <span className="h-2.5 w-2.5 rounded-full border border-[#9aa5a7] bg-[#f3f3f3]" />
        </div>
      </div>

      <div className="relative h-[calc(100%-24px)] bg-[#fdfdfd]">
        <div
          data-slot="vacancy_panel"
          className="absolute border border-[#d9d9d9] bg-[#f9f9f9]"
          style={{ left: 8, top: 32, width: 126, height: 200 }}
        />

        <div
          data-slot="candidate_card"
          className="absolute border border-[#d9d9d9] bg-[#f9f9f9]"
          style={{ left: 142, top: 32, width: 290, height: 200 }}
        />

        <div
          data-slot="reason_buttons"
          className="absolute border border-[#d9d9d9] bg-[#f9f9f9]"
          style={{ left: 8, top: 240, width: 424, height: 92 }}
        >
          <button
            type="button"
            className="absolute left-0 top-0 border border-[#d9d9d9] bg-[#f3f3f3] text-left text-[10px] uppercase tracking-[0.14em] text-[#505d65]"
            style={{ width: 424, height: 28 }}
            aria-label="reason_button_1"
          />
          <button
            type="button"
            className="absolute left-0 top-[32px] border border-[#d9d9d9] bg-[#f3f3f3] text-left text-[10px] uppercase tracking-[0.14em] text-[#505d65]"
            style={{ width: 424, height: 28 }}
            aria-label="reason_button_2"
          />
          <button
            type="button"
            className="absolute left-0 top-[64px] border border-[#d9d9d9] bg-[#f3f3f3] text-left text-[10px] uppercase tracking-[0.14em] text-[#505d65]"
            style={{ width: 424, height: 28 }}
            aria-label="reason_button_3"
          />
        </div>
      </div>
    </div>
  );
}
