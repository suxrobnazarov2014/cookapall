import { useCallback, useState } from "react";
import { emptyFilters, type FilterState } from "@/lib/recipes";

export function useFilters(initial: FilterState = emptyFilters) {
  const [filters, setFilters] = useState<FilterState>(initial);

  const toggle = useCallback((group: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const list = prev[group];
      return {
        ...prev,
        [group]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  }, []);

  const clear = useCallback(() => setFilters(emptyFilters), []);

  return { filters, toggle, clear };
}
