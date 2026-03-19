'use client';

interface FilterChipsProps {
  filters: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterChips({ filters, selectedFilter, onFilterChange }: FilterChipsProps) {
  const getFilterLabel = (filter: string) => {
    return filter.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            background: selectedFilter === filter ? 'var(--ultra-primary)' : 'var(--ultra-primary-light)',
            color: selectedFilter === filter ? 'white' : 'var(--ultra-primary)',
          }}
        >
          {getFilterLabel(filter)}
        </button>
      ))}
    </div>
  );
}
