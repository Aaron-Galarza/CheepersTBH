import { cn } from '@/utils/cn';
import { LogOut } from 'lucide-react';

interface AdminTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  onLogout?: () => void;
  className?: string;
}

export function AdminTabs({ tabs, activeTab, onChange, onLogout, className = '' }: AdminTabsProps) {
  return (
    <div className={cn('flex flex-col bg-[#243b55]', className)}>
      <div className="px-6 py-6">
        <h1 className="font-['Montserrat'] text-xl font-bold text-white">CHEEPERS</h1>
        <p className="text-xs text-[#a0aec0]">Panel Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-[#e53e3e] text-white shadow-[0_4px_10px_rgba(229,62,62,0.3)]'
                : 'text-[#cbd5e0] hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {onLogout && (
        <div className="border-t border-[rgba(255,255,255,0.1)] px-3 py-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#cbd5e0] transition-colors hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
