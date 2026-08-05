import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
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

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 shadow-lg">
        <p className="font-title-md text-title-md text-on-surface">{payload[0].name}</p>
        <p className="font-tabular-nums text-tabular-nums text-on-surface-variant mt-1 font-bold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, isLoading }) => {
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <h3 className="font-title-lg text-title-lg text-on-surface mb-6">Expenses by Category</h3>
      
      <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center text-on-surface-variant">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
             <p className="text-sm">Loading chart data...</p>
          </div>
        ) : !hasData ? (
          <div className="text-center text-on-surface-variant">
            <p>No expenses found for this period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default CategoryPieChart;
