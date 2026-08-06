import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { TrendReportData } from '../../api/reportApi';
import Card from '../ui/Card';

interface TrendBarChartProps {
  data: TrendReportData[];
  isLoading: boolean;
}

const COLOR_INCOME = '#008378'; // rich primary teal
const COLOR_EXPENSE = '#ba1a1a'; // rich crimson red

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCurrencyCompact = (value: number) => {
  if (value === 0) return '₹0';
  if (value >= 10000000) {
    const cr = value / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    const l = value / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 shadow-lg z-50">
        <p className="font-title-md text-title-md text-on-surface font-semibold mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 font-body-sm text-body-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-xs flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-on-surface-variant font-medium">{entry.name}:</span>
              </div>
              <span className="font-tabular-nums font-bold" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TrendBarChart: React.FC<TrendBarChartProps> = ({ data, isLoading }) => {
  const hasData = data && data.length > 0;

  const totalIncome = useMemo(() => {
    return (data || []).reduce((sum, item) => sum + (Number(item.income) || 0), 0);
  }, [data]);

  const totalExpense = useMemo(() => {
    return (data || []).reduce((sum, item) => sum + (Number(item.expense) || 0), 0);
  }, [data]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-title-lg text-title-lg text-on-surface">Credit vs Debit</h3>
          {hasData && !isLoading && (
            <div className="flex items-center gap-2">
              <span className="font-tabular-nums text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
                +{formatCurrency(totalIncome)}
              </span>
              <span className="font-tabular-nums text-xs text-error bg-error/10 px-2 py-0.5 rounded-md font-semibold">
                -{formatCurrency(totalExpense)}
              </span>
            </div>
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
              <BarChart3 size={48} className="text-outline mb-2 opacity-50" />
              <p className="text-sm">No trend data found for this period.</p>
            </div>
          ) : (
            <div className="w-full h-[270px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 12, right: 10, left: -2, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.35} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }}
                    tickFormatter={formatCurrencyCompact}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-container-low)', opacity: 0.7 }} />
                  <Bar 
                    dataKey="income" 
                    name="Credit" 
                    fill={COLOR_INCOME} 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={45}
                  />
                  <Bar 
                    dataKey="expense" 
                    name="Debit" 
                    fill={COLOR_EXPENSE} 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Legend Footer */}
      {hasData && !isLoading && (
        <div className="w-full mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-center gap-6 max-h-[64px] sm:max-h-[72px] px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: COLOR_INCOME }} />
            <span>Credit</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: COLOR_EXPENSE }} />
            <span>Debit</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TrendBarChart;
