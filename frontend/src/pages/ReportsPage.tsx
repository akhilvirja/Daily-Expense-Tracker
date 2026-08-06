import React, { useState, useEffect } from 'react';
import ReportFilterPanel from '../components/reports/ReportFilterPanel';
import CategoryPieChart from '../components/reports/CategoryPieChart';
import TrendBarChart from '../components/reports/TrendBarChart';
import ReportTransactionTable from '../components/reports/ReportTransactionTable';
import { reportApi } from '../api/reportApi';
import type { CategoryReportData, TrendReportData } from '../api/reportApi';
import { accountApi } from '../api/accountApi';
import type { Account } from '../api/accountApi';
import { categoryApi } from '../api/categoryApi';
import type { Category } from '../api/categoryApi';

export const ReportsPage: React.FC = () => {
  // Date defaults: current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('All');
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [categoryData, setCategoryData] = useState<CategoryReportData[]>([]);
  const [trendData, setTrendData] = useState<TrendReportData[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [accRes, catRes] = await Promise.all([
          accountApi.getAll(),
          categoryApi.getAll()
        ]);
        setAccounts(accRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error('Failed to load accounts/categories', error);
      }
    };
    fetchReferenceData();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const [catRes, trendRes] = await Promise.all([
          reportApi.getCategoryReport(startDate, endDate, accountId, categoryId, type === 'All' ? undefined : type),
          reportApi.getTrendReport(startDate, endDate, 'month', accountId, categoryId, type === 'All' ? undefined : type)
        ]);
        
        setCategoryData(catRes.data || []);
        setTrendData(trendRes.data || []);
      } catch (error) {
        console.error('Failed to load reports', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [startDate, endDate, accountId, categoryId, type]);

  const totalCredits = trendData.reduce((sum, item) => sum + item.income, 0);
  const totalDebits = trendData.reduce((sum, item) => sum + item.expense, 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-8">
      {/* Page Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-background">Reports</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Analyze your spending categories and financial trends over time.
        </p>
      </div>

      {/* Filter Panel */}
      <ReportFilterPanel 
        startDate={startDate}
        endDate={endDate}
        accountId={accountId}
        categoryId={categoryId}
        type={type}
        accounts={accounts}
        categories={categories}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onAccountIdChange={setAccountId}
        onCategoryIdChange={setCategoryId}
        onTypeChange={setType}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categoryData} isLoading={isLoading} />
        <TrendBarChart data={trendData} isLoading={isLoading} />
      </div>

      {/* Transaction Table & Summary */}
      <ReportTransactionTable 
        startDate={startDate}
        endDate={endDate}
        accountId={accountId}
        categoryId={categoryId}
        type={type}
        totalCredits={totalCredits}
        totalDebits={totalDebits}
      />
    </div>
  );
};
