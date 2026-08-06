import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { CategoryReportData } from '../../api/reportApi';
import Card from '../ui/Card';

interface CategoryPieChartProps {
  data: CategoryReportData[];
  isLoading: boolean;
}

const PIE_COLORS = [
  '#008378', // primary
  '#924628', // tertiary
  '#515f74', // secondary
  '#ba1a1a', // error
  '#6bd8cb', // primary-fixed-dim
  '#ffb59a', // tertiary-fixed-dim
  '#b9c7df', // secondary-fixed-dim
  '#ffdad6', // error-container
  '#005049', // darker teal
  '#773215', // darker coral
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip: React.FC<any> = ({ active, payload, totalDebit }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const value = Number(item.value) || 0;
    const percentage = totalDebit > 0 ? ((value / totalDebit) * 100).toFixed(1) : '0';

    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 shadow-lg z-50 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.payload?.fill || item.color }}
          />
          <p className="font-title-md text-title-md text-on-surface font-semibold truncate max-w-[200px]">
            {item.name}
          </p>
        </div>
        <div className="flex items-baseline justify-between gap-4 mt-1.5">
          <p className="font-tabular-nums text-tabular-nums text-primary font-bold">
            {formatCurrency(value)}
          </p>
          <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
            {percentage}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
      className="pointer-events-none drop-shadow-sm select-none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, isLoading }) => {
  const hasData = data && data.length > 0;

  const totalDebit = useMemo(() => {
    return (data || []).reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  }, [data]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-title-lg text-title-lg text-on-surface">Debits by Category</h3>
          {hasData && !isLoading && (
            <span className="font-tabular-nums text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
              Total: <span className="font-semibold text-on-surface">{formatCurrency(totalDebit)}</span>
            </span>
          )}
        </div>

        <div className="w-full min-h-[260px] sm:min-h-[290px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center text-on-surface-variant py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Loading chart data...</p>
            </div>
          ) : !hasData ? (
            <div className="flex flex-col items-center justify-center text-on-surface-variant py-12">
              <PieChartIcon size={48} className="text-outline mb-2 opacity-50" />
              <p className="text-sm">No debits found for this period.</p>
            </div>
          ) : (
            <div className="w-full h-[270px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={115}
                    innerRadius={0}
                    stroke="var(--color-surface-container-lowest)"
                    strokeWidth={2}
                    dataKey="value"
                    isAnimationActive={true}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalDebit={totalDebit} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Compact HTML Legend with scroll to maximize chart prominence */}
      {hasData && !isLoading && (
        <div className="w-full mt-2 pt-2 border-t border-outline-variant/20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 max-h-[64px] sm:max-h-[72px] overflow-y-auto px-1">
          {data.map((entry, index) => {
            const color = PIE_COLORS[index % PIE_COLORS.length];
            const val = Number(entry.value) || 0;
            const percentage = totalDebit > 0 ? ((val / totalDebit) * 100).toFixed(0) : '0';

            return (
              <div
                key={`legend-${entry.name}-${index}`}
                className="flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-on-surface transition-colors"
                title={`${entry.name}: ${formatCurrency(val)} (${percentage}%)`}
              >
                <span
                  className="w-2 h-2 rounded-xs flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium truncate max-w-[120px] sm:max-w-[160px]">
                  {entry.name}
                </span>
                <span className="text-[10px] text-on-surface-variant/70 font-tabular-nums">
                  ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default CategoryPieChart;
