'use client';

import { Category } from '@/types';
import { LayoutGrid } from 'lucide-react';
import { getCategoryIcon } from '@/features/admin/productos/components/IconPicker';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (name: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const active = categories.filter((c) => c.isActive !== false && (c as any).active !== false);

  return (
    <div className="border-b border-[#e0e0e0] bg-[#FFFDF7]">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-3 py-2.5 md:gap-x-5 md:py-3">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold transition md:text-sm ${!selectedCategory ? 'text-[#D9383A]' : 'text-[#757575] hover:text-[#D9383A]'}`}
        >
          <LayoutGrid size={16} className="md:size-[18px]" />
          Todos
        </button>
        {active.map((c) => {
          const Icon = getCategoryIcon(c.icon);
          return (
            <button
              key={c.name}
              onClick={() => onSelectCategory(c.name)}
              className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold transition md:text-sm ${selectedCategory === c.name ? 'text-[#D9383A]' : 'text-[#757575] hover:text-[#D9383A]'}`}
            >
              <Icon size={20} />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
