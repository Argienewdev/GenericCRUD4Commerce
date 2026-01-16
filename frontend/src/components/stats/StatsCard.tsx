import { type StatCard } from '../../types/dashboard';

interface StatsCardProps {
  stat: StatCard;
}

export function StatsCard({ stat }: StatsCardProps) {
  const Icon = stat.icon;
  
  const colorClasses = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      change: 'text-green-600'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      change: 'text-red-500'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      change: 'text-blue-600'
    }
  };

  const colors = colorClasses[stat.color];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{stat.title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
          <p className={`text-sm mt-2 ${colors.change}`}>
            {stat.change}
          </p>
        </div>
        <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
          <Icon className={colors.text} size={24} />
        </div>
      </div>
    </div>
  );
}