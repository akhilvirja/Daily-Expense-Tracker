import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardData } from '../api/dashboardApi';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Curated color palette for pie chart slices
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

const formatCurrencyCompact = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

// Skeleton loader for cards
const CardSkeleton: React.FC = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-surface-container-high" />
      <div className="h-3 w-20 bg-surface-container-high rounded" />
    </div>
    <div className="h-8 w-32 bg-surface-container-high rounded mb-2" />
    <div className="h-3 w-24 bg-surface-container rounded" />
  </div>
);

// Skeleton for charts
const ChartSkeleton: React.FC = () => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 animate-pulse">
    <div className="h-5 w-40 bg-surface-container-high rounded mb-6" />
    <div className="h-[300px] bg-surface-container rounded-lg" />
  </div>
);

// Custom bar chart tooltip
const BarTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 shadow-lg">
        <p className="font-title-md text-title-md text-on-surface mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-body-sm text-body-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom pie chart tooltip
const PieTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 shadow-lg">
        <p className="font-title-md text-title-md text-on-surface">{payload[0].name}</p>
        <p className="font-tabular-nums text-tabular-nums text-on-surface-variant">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Custom pie chart label
const renderPieLabel = ({ name, percent }: any) => {
  if (percent < 0.05) return null; // Don't show labels for tiny slices
  return `${(percent * 100).toFixed(0)}%`;
};

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await dashboardApi.getData();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = data
    ? [
        {
          label: 'Total Balance',
          value: formatCurrency(data.totalBalance),
          icon: Wallet,
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          subtitle: 'Across all accounts',
        },
        {
          label: 'Monthly Income',
          value: formatCurrency(data.monthlyCredit),
          icon: TrendingUp,
          iconBg: 'bg-secondary-container',
          iconColor: 'text-on-secondary-container',
          subtitle: 'This month',
        },
        {
          label: 'Monthly Expenses',
          value: formatCurrency(data.monthlyDebit),
          icon: TrendingDown,
          iconBg: 'bg-error-container',
          iconColor: 'text-on-error-container',
          subtitle: 'This month',
        },
        {
          label: 'Pending Bills',
          value: data.pendingBills.count.toString(),
          icon: AlertCircle,
          iconBg: 'bg-tertiary-container',
          iconColor: 'text-on-tertiary-container',
          subtitle: data.pendingBills.count > 0
            ? `${formatCurrency(data.pendingBills.totalAmount)} total`
            : 'All clear!',
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-8">
      {/* Page Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-background">Dashboard</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Your financial overview at a glance.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl font-body-sm text-body-sm">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg} transition-transform group-hover:scale-110 duration-200`}
                    >
                      <Icon size={20} className={card.iconColor} />
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-on-surface font-tabular-nums tracking-tight">
                    {card.value}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {card.subtitle}
                  </p>
                </div>
              );
            })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Income vs Expense Bar Chart (wider) */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-on-surface-variant" />
                <h3 className="font-headline-lg text-headline-lg text-on-surface">
                  Income vs Expenses
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant -mt-4 mb-6">
                Last 6 months overview
              </p>

              {data && data.monthlyTrend.some((m) => m.income > 0 || m.expense > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data.monthlyTrend}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-outline-variant)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
                      axisLine={{ stroke: 'var(--color-outline-variant)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatCurrencyCompact}
                      tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--color-surface-container)', radius: 4 }} />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="var(--color-primary)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      dataKey="expense"
                      name="Expenses"
                      fill="var(--color-tertiary)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-on-surface-variant">
                  <BarChart3 size={48} className="text-outline mb-3" />
                  <p className="font-title-md text-title-md text-on-surface">No transaction data yet</p>
                  <p className="font-body-sm text-body-sm mt-1">
                    Start adding transactions to see your trends here.
                  </p>
                </div>
              )}

              {/* Legend */}
              {data && data.monthlyTrend.some((m) => m.income > 0 || m.expense > 0) && (
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-outline-variant">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-tertiary" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Expenses</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expense by Category Pie Chart */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 lg:p-6 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon size={20} className="text-on-surface-variant" />
                <h3 className="font-headline-lg text-headline-lg text-on-surface">
                  Expense by Category
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant -mt-4 mb-6">
                Current month breakdown
              </p>

              {data && data.expenseByCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={data.expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="amount"
                        nameKey="name"
                        label={renderPieLabel}
                        labelLine={false}
                        stroke="var(--color-surface-container-lowest)"
                        strokeWidth={2}
                      >
                        {data.expenseByCategory.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Category List */}
                  <div className="mt-4 space-y-2 max-h-[160px] overflow-y-auto">
                    {data.expenseByCategory.map((cat, index) => (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="font-body-sm text-body-sm text-on-surface truncate">
                            {cat.name}
                          </span>
                        </div>
                        <span className="font-tabular-nums text-tabular-nums text-on-surface-variant ml-3 flex-shrink-0">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-on-surface-variant">
                  <PieChartIcon size={48} className="text-outline mb-3" />
                  <p className="font-title-md text-title-md text-on-surface">No expenses this month</p>
                  <p className="font-body-sm text-body-sm mt-1">
                    Category breakdown will appear when you log expenses.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
