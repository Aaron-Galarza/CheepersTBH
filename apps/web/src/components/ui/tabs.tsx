import { cn } from '@/utils/cn';

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'default' | 'pills';
}

export function Tabs({ tabs, activeTab, onChange, className = '', variant = 'default' }: TabsProps) {
  return (
    <div
      className={`
        flex
        ${variant === 'default' ? 'border-b border-[#e2e8f0]' : 'gap-1'}
        ${className}
      `}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200',
            variant === 'default' &&
              cn(
                'border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-[#e53e3e] text-[#e53e3e]'
                  : 'border-transparent text-[#718096] hover:text-[#2d3748]'
              ),
            variant === 'pills' &&
              cn(
                'rounded-lg',
                activeTab === tab.id
                  ? 'bg-[#e53e3e] text-white shadow-[0_4px_10px_rgba(229,62,62,0.3)]'
                  : 'bg-white text-[#555] border border-[#ccc] hover:bg-[#f0f2f5]'
              )
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
