import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className = '',
  disabled,
}: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full appearance-none rounded-lg border border-[#cbd5e0] bg-white px-4 py-2.5 pr-10 text-base text-[#2d3748] transition-shadow duration-200 focus:border-[#e53e3e] focus:outline-none focus:ring-[3px] focus:ring-[rgba(229,62,62,0.2)]'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a0aec0]" />
    </div>
  );
}
