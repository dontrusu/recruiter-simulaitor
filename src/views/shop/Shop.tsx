import { SHOP_WIDTH } from '@/core/engine/camera';

const upgrades = [
  {
    name: 'Smart Reject',
    abbreviation: 'SR',
    decoration: 'text-brand/10',
    description: 'Find the reason you reach for most. Let the dashboard call it a strategy.',
  },
  {
    name: 'Talent Pool',
    abbreviation: 'TP',
    decoration: 'text-foreground/5',
    description: 'Keep familiar faces close, without making any promises about what comes next.',
  },
];

export function Shop() {
  return (
    <aside
      className="shop-column h-full flex-none overflow-y-auto border-l border-border bg-secondary/60 px-6 py-10"
      style={{ width: SHOP_WIDTH }}
      aria-label="Shop"
    >
      <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Shop
      </h2>
      <div className="mt-7 space-y-5">
        {upgrades.map((upgrade) => (
          <article
            key={upgrade.name}
            className="relative min-h-[250px] overflow-hidden border border-border bg-card p-6 shadow-[0_8px_24px_var(--paper-shadow)]"
          >
            <p className="ui-label">Upgrade preview</p>
            <h3 className="mt-6 font-serif text-[32px] leading-none tracking-[-0.05em]">
              {upgrade.name}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {upgrade.description}
            </p>
            <span
              aria-hidden="true"
              className={`absolute -right-2 -bottom-5 font-serif text-[100px] leading-none ${upgrade.decoration}`}
            >
              {upgrade.abbreviation}
            </span>
          </article>
        ))}
      </div>
    </aside>
  );
}
