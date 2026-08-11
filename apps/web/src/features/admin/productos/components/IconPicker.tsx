'use client';

import { useState } from 'react';
import { Utensils, Beef, Flame, Soup, Pizza, IceCreamCone, Sandwich, LayoutGrid, Tag, CupSoda, Cookie, Star, Grid3x3, Croissant, Apple } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type IconEntry = { name: string; Icon: LucideIcon };

export const CATEGORY_ICON_OPTIONS: IconEntry[] = [
  { name: 'Beef', Icon: Beef },
  { name: 'Croissant', Icon: Croissant },
  { name: 'Pizza', Icon: Pizza },
  { name: 'Sandwich', Icon: Sandwich },
  { name: 'Flame', Icon: Flame },
  { name: 'Soup', Icon: Soup },
  { name: 'Utensils', Icon: Utensils },
  { name: 'CupSoda', Icon: CupSoda },
  { name: 'IceCreamCone', Icon: IceCreamCone },
  { name: 'Cookie', Icon: Cookie },
  { name: 'Apple', Icon: Apple },
  { name: 'Star', Icon: Star },
  { name: 'Tag', Icon: Tag },
  { name: 'Grid3x3', Icon: Grid3x3 },
];

export function getCategoryIcon(iconKey?: string): LucideIcon {
  if (iconKey) {
    const found = CATEGORY_ICON_OPTIONS.find((o) => o.name === iconKey);
    if (found) return found.Icon;
  }
  return LayoutGrid;
}

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const Selected = getCategoryIcon(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#D9383A] transition w-full"
      >
        <Selected size={18} className="text-[#D9383A]" />
        <span className="text-sm text-[#757575]">{value || 'Seleccionar icono'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-5 gap-2 w-[280px]">
          {CATEGORY_ICON_OPTIONS.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => { onChange(name); setOpen(false); }}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                value === name ? 'bg-[#D9383A] text-white' : 'bg-gray-100 hover:bg-gray-200 text-[#757575]'
              }`}
              title={name}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
