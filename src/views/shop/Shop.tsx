import { upgradeNames } from '@/content/shop';
import { UpgradeIcon } from './UpgradeIcon';

export function Shop({ colors = false }: { colors?: boolean }) {
  return (
    <section aria-label="Shop" className="min-w-0 w-full max-w-[600px]">
      <ul
        aria-label="Upgrade catalog"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? 122 : -122 });
          } else if (event.key === 'End' || event.key === 'Home') {
            event.preventDefault();
            event.currentTarget.scrollLeft =
              event.key === 'End' ? event.currentTarget.scrollWidth : 0;
          }
        }}
        className="flex gap-2 overflow-x-auto pb-1 focus-visible:outline-3 focus-visible:outline-brand"
      >
        {upgradeNames.map((name) => (
          <li
            key={name}
            className="flex min-h-12 w-[114px] shrink-0 items-center gap-2 border border-border bg-background px-2 py-1 text-xs leading-[1.2]"
          >
            <UpgradeIcon name={name} line={!colors} />
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
