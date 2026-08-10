import { filterGroups, type FilterState } from "@/lib/recipes";

type Group = keyof FilterState;

export function FilterSidebar({
  filters,
  onToggle,
  onClear,
}: {
  filters: FilterState;
  onToggle: (group: Group, value: string) => void;
  onClear: () => void;
}) {
  const active = Object.values(filters).flat().length;

  return (
    <aside className="w-full lg:w-56">
      <div className="flex items-baseline justify-between">
        <h2 className="script-title text-4xl">Filter Recipes</h2>
        {active > 0 && (
          <button onClick={onClear} className="text-xs font-bold text-muted-foreground hover:text-primary">
            Clear ({active})
          </button>
        )}
      </div>

      <div className="mt-6 space-y-7">
        {(Object.keys(filterGroups) as Group[]).map((group) => (
          <div key={group}>
            <h3 className="text-2xl font-bold text-primary">{group}</h3>
            <ul className="mt-2 space-y-1.5">
              {filterGroups[group].map((value) => {
                const isActive = filters[group].includes(value);
                return (
                  <li key={value}>
                    <button
                      onClick={() => onToggle(group, value)}
                      aria-pressed={isActive}
                      className={
                        isActive
                          ? "text-left text-base font-extrabold text-primary"
                          : "text-left text-base text-foreground/80 transition-colors hover:text-primary"
                      }
                    >
                      {value}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
