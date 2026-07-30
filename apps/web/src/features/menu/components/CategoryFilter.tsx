'use client';

import { Category } from '@/types';
import { LayoutGrid, Tag, CupSoda } from 'lucide-react';
import { GiHamburger, GiFrenchFries, GiPizzaSlice, GiSteak, GiDumpling, GiSandwich, GiIceCreamCone } from 'react-icons/gi';
import type { IconType } from 'react-icons';

const CATEGORY_ICONS: Record<string, IconType> = {
  Hamburguesas: GiHamburger, 'Papas Fritas': GiFrenchFries, Papas: GiFrenchFries,
  Pizzas: GiPizzaSlice, Milanesas: GiSteak, Lomitos: GiSteak,
  Bebidas: CupSoda, Empanadas: GiDumpling, Sandwich: GiSandwich,
  Postres: GiIceCreamCone, Promos: Tag,
};

function getIconForCategory(name: string): IconType {
  if (CATEGORY_ICONS[name]) return CATEGORY_ICONS[name];
  const l = name.toLowerCase();
  if (l.includes('hamburguesa') || l.includes('burger')) return GiHamburger;
  if (l.includes('papa') || l.includes('frita')) return GiFrenchFries;
  if (l.includes('pizza')) return GiPizzaSlice;
  if (l.includes('milanesa') || l.includes('lomito') || l.includes('carne')) return GiSteak;
  if (l.includes('bebida') || l.includes('gaseosa') || l.includes('agua')) return CupSoda;
  if (l.includes('empanada')) return GiDumpling;
  if (l.includes('sandwich') || l.includes('sandw') || l.includes('hot dog')) return GiSandwich;
  if (l.includes('postre') || l.includes('helado') || l.includes('dulce')) return GiIceCreamCone;
  if (l.includes('promo') || l.includes('combo')) return Tag;
  return LayoutGrid;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (name: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
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
        {categories.map((c, i) => {
          const name = c.name || `cat-${i}`;
          const Icon = getIconForCategory(name);
          const isLucide = Icon === LayoutGrid || Icon === Tag || Icon === CupSoda;
          return (
            <button
              key={String(name)}
              onClick={() => onSelectCategory(name)}
              className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold transition md:text-sm ${selectedCategory === name ? 'text-[#D9383A]' : 'text-[#757575] hover:text-[#D9383A]'}`}
            >
              {isLucide ? <Icon size={16} className="md:size-[18px]" /> : <Icon size={18} className="md:size-[20px]" />}
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
