import React, { useState, useEffect, useMemo } from 'react';
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
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 lg:p-6 animate-pulse h-full flex flex-col justify-between">
    <div>
      <div className="h-5 w-40 bg-surface-container-high rounded mb-2" />
      <div className="h-3 w-28 bg-surface-container rounded mb-6" />
      <div className="h-[320px] bg-surface-container rounded-lg" />
    </div>
    <div className="h-4 w-48 bg-surface-container rounded mt-4 mx-auto" />
  </div>
);

// Custom bar chart tooltip
const BarTooltip: React.FC<any> = ({ active, payload, label }) => {
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
                  style={{ backgroundColor: entry.fill || entry.color }}
                />
                <span className="text-on-surface-variant font-medium">{entry.name}:</span>
              </div>
              <span className="font-tabular-nums font-bold" style={{ color: entry.fill || entry.color }}>
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

// Custom pie chart tooltip
const PieTooltip: React.FC<any> = ({ active, payload, totalExpense }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const value = Number(item.value) || 0;
    const percentage = totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : '0';

    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 shadow-lg z-50">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-xs flex-shrink-0"
            style={{ backgroundColor: item.payload?.fill || item.color }}
          />
          <p className="font-title-md text-title-md text-on-surface font-semibold truncate max-w-[180px]">
            {item.name}
          </p>
        </div>
        <div className="flex items-baseline justify-between gap-4 mt-1">
          <p className="font-tabular-nums text-tabular-nums text-on-surface font-bold">
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

// Custom pie chart label
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null; // Don't show labels for tiny slices < 5%
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
      className="pointer-events-none drop-shadow select-none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
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

  const totalCurrentMonthExpense = useMemo(() => {
    return (data?.expenseByCategory || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [data]);

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
          label: 'Monthly Credit',
          value: formatCurrency(data.monthlyCredit),
          icon: TrendingUp,
          iconBg: 'bg-secondary-container',
          iconColor: 'text-on-secondary-container',
          subtitle: 'This month',
        },
        {
          label: 'Monthly Debit',
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Credit vs Debit Bar Chart */}
        <div className="lg:col-span-7 flex flex-col">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 lg:p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 size={20} className="text-on-surface-variant" />
                      <h3 className="font-headline-lg text-headline-lg text-on-surface">
                        Credit vs Debit
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Last 6 months overview
                    </p>
                  </div>
                </div>

                {data && data.monthlyTrend.some((m) => m.income > 0 || m.expense > 0) ? (
                  <div className="w-full h-[300px] sm:h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.monthlyTrend}
                        margin={{ top: 10, right: 8, left: -2, bottom: 0 }}
                        barGap={4}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--color-outline-variant)"
                          opacity={0.35}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
                          axisLine={{ stroke: 'var(--color-outline-variant)' }}
                          tickLine={false}
                          dy={6}
                        />
                        <YAxis
                          tickFormatter={formatCurrencyCompact}
                          tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }}
                          axisLine={false}
                          tickLine={false}
                          width={48}
                        />
                        <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--color-surface-container-low)', opacity: 0.7 }} />
                        <Bar
                          dataKey="income"
                          name="Credit"
                          fill="#008378"
                          radius={[5, 5, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="expense"
                          name="Debit"
                          fill="#ba1a1a"
                          radius={[5, 5, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] sm:h-[320px] flex flex-col items-center justify-center text-on-surface-variant">
                    <BarChart3 size={48} className="text-outline mb-3 opacity-50" />
                    <p className="font-title-md text-title-md text-on-surface">No transaction data yet</p>
                    <p className="font-body-sm text-body-sm mt-1">
                      Start adding transactions to see your trends here.
                    </p>
                  </div>
                )}
              </div>

              {/* Legend Footer */}
              {data && data.monthlyTrend.some((m) => m.income > 0 || m.expense > 0) && (
                <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: '#008378' }} />
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: '#ba1a1a' }} />
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Debit</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Debit by Category Pie Chart */}
        <div className="lg:col-span-5 flex flex-col">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 lg:p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <PieChartIcon size={20} className="text-on-surface-variant" />
                      <h3 className="font-headline-lg text-headline-lg text-on-surface">
                        Expense by Category
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Current month breakdown
                    </p>
                  </div>
                  {totalCurrentMonthExpense > 0 && (
                    <span className="font-tabular-nums text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md font-semibold">
                      {formatCurrency(totalCurrentMonthExpense)}
                    </span>
                  )}
                </div>

                {data && data.expenseByCategory.length > 0 ? (
                  <>
                    {/* Big Prominent Donut Chart */}
                    <div className="w-full h-[250px] sm:h-[265px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
                          <Pie
                            data={data.expenseByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={102}
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
                          <Tooltip content={<PieTooltip totalExpense={totalCurrentMonthExpense} />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Compact 2-Column Category Grid with Minimal Height & Smooth Scroll */}
                    <div className="mt-2 pt-2 border-t border-outline-variant/20 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[72px] overflow-y-auto pr-1">
                      {data.expenseByCategory.map((cat, index) => {
                        const percentage = totalCurrentMonthExpense > 0
                          ? ((cat.amount / totalCurrentMonthExpense) * 100).toFixed(0)
                          : '0';
                        return (
                          <div
                            key={cat.name}
                            className="flex items-center justify-between gap-1.5 px-2 py-1 rounded-md bg-surface-container-low/60 hover:bg-surface-container-low transition-colors text-[11px]"
                            title={`${cat.name}: ${formatCurrency(cat.amount)} (${percentage}%)`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="w-2 h-2 rounded-xs flex-shrink-0"
                                style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                              />
                              <span className="font-medium text-on-surface truncate max-w-[85px] sm:max-w-[110px]">
                                {cat.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-[10px] text-on-surface-variant/70 font-tabular-nums">
                                {percentage}%
                              </span>
                              <span className="font-tabular-nums font-semibold text-on-surface text-[10px]">
                                {formatCurrency(cat.amount)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-[300px] sm:h-[320px] flex flex-col items-center justify-center text-on-surface-variant">
                    <PieChartIcon size={48} className="text-outline mb-3 opacity-50" />
                    <p className="font-title-md text-title-md text-on-surface">No debits this month</p>
                    <p className="font-body-sm text-body-sm mt-1">
                      Category breakdown will appear when you log debits.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
