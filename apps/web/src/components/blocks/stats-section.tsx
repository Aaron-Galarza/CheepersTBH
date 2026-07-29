import { cn } from '@/utils/cn';

interface StatCardData {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface StatsSectionProps {
  stats: StatCardData[];
  className?: string;
}

export function StatsSection({ stats, className = '' }: StatsSectionProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 max-md:grid-cols-1',
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-[0_3px_10px_rgba(0,0,0,0.08)]"
        >
          {stat.icon && (
            <div className="text-[#e53e3e]">{stat.icon}</div>
          )}
          <div>
            <p className="text-2xl font-bold text-[#2d3748]">{stat.value}</p>
            <p className="text-sm text-[#718096]">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
