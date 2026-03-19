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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border"
            style={{
              background: isSelected ? '#7C8CFF' : 'rgba(124,140,255,0.08)',
              color: isSelected ? '#05070b' : '#7C8CFF',
              borderColor: isSelected ? '#7C8CFF' : 'rgba(124,140,255,0.2)',
            }}
          >
            {getFilterLabel(filter)}
          </button>
        );
      })}
    </div>
  );
}
