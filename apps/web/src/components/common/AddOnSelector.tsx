import { cn } from '@/utils/cn';
import { CartAddon, IAddOn } from '@/types';

interface AddOnSelectorProps {
  availableAddOns: IAddOn[];
  selectedAddOns: CartAddon[];
  onToggle: (addon: IAddOn) => void;
  className?: string;
}

export function AddOnSelector({
  availableAddOns,
  selectedAddOns,
  onToggle,
  className = '',
}: AddOnSelectorProps) {
  if (availableAddOns.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {availableAddOns.map((addon) => {
        const isSelected = selectedAddOns.some((s) => s._id === addon._id);
        return (
          <button
            key={addon._id}
            onClick={() => onToggle(addon)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200',
              isSelected
                ? 'border-[#e53e3e] bg-[#e53e3e] text-white'
                : 'border-[#ccc] bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0]'
            )}
          >
            {addon.name}
          </button>
        );
      })}
    </div>
  );
}
