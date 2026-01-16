// components/estadisticas/EstadisticasPanel.tsx

import { DollarSign, BarChart3 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { type StatCard } from '../../types/dashboard.ts';
import { SalesChart } from '../sales/SalesChart.tsx';

export function StatsPanel() {
  const stats: StatCard[] = [
    {
      title: 'Ventas Totales',
      value: '$523,800',
      change: '+12% vs mes anterior',
      isPositive: true,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Gastos',
      value: '$187,500',
      change: '-5% vs mes anterior',
      isPositive: false,
      icon: DollarSign,
      color: 'red'
    },
    {
      title: 'Balance',
      value: '$336,300',
      change: '+15% vs mes anterior',
      isPositive: true,
      icon: BarChart3,
      color: 'blue'
    }
  ];

  const chartData = [65, 85, 45, 92, 78, 88, 95, 72, 68, 82, 90, 75, 88, 95];
  const chartLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Sales Chart */}
      <SalesChart data={chartData} labels={chartLabels} />
    </div>
  );
}