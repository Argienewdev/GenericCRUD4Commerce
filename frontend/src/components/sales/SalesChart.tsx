interface SalesChartProps {
  data: number[];
  labels: string[];
}

export function SalesChart({ data, labels }: SalesChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Ventas últimos 30 días
      </h3>
      
      {/* Chart */}
      <div className="h-64 flex items-end justify-around gap-4">
        {data.map((height, i) => (
          <div 
            key={i} 
            className="flex-1 bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-all cursor-pointer" 
            style={{ height: `${height}%` }}
            title={`${height}%`}
          />
        ))}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-4 text-xs text-slate-500">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}