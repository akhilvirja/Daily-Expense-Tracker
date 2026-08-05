import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TrendReportData } from '../../api/reportApi';
import Card from '../ui/Card';

interface TrendBarChartProps {
  data: TrendReportData[];
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCurrencyCompact = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 shadow-lg">
        <p className="font-title-md text-title-md text-on-surface mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-body-sm text-body-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-tabular-nums font-bold">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TrendBarChart: React.FC<TrendBarChartProps> = ({ data, isLoading }) => {
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <h3 className="font-title-lg text-title-lg text-on-surface mb-6">Income vs Expenses</h3>
      
      <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center text-on-surface-variant">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
             <p className="text-sm">Loading chart data...</p>
          </div>
        ) : !hasData ? (
          <div className="text-center text-on-surface-variant">
            <p>No data found for this period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
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
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-container)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="var(--color-secondary-container)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
              <Bar 
                dataKey="expense" 
                name="Expense" 
                fill="var(--color-error-container)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default TrendBarChart;
