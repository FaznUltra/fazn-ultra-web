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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
            selectedFilter === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {getFilterLabel(filter)}
        </button>
      ))}
    </div>
  );
}
