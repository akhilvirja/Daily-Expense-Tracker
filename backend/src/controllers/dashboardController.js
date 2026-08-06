import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * @desc    Get aggregated dashboard data for the authenticated user
 * @route   GET /api/v1/dashboard
 * @access  Private
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Current month boundaries (UTC)
  const now = new Date();
  const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const currentMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  // 6 months ago boundary
  const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  // Run all queries in parallel for performance
  const [
    accounts,
    monthlyAggregates,
    pendingBillsAgg,
    sixMonthTrend,
    categoryExpenses,
  ] = await Promise.all([
    // 1. All active accounts with their transaction sums for Total Balance
    prisma.account.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        openingBalance: true,
        transactions: {
          select: {
            type: true,
            amount: true,
          },
        },
      },
    }),

    // 2. Monthly credit & debit aggregates
    prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        occurredOn: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        OR: [
          { categoryId: null },
          { category: { isSystem: false } }
        ]
      },
      _sum: { amount: true },
    }),

    // 3. Pending bills count & total
    prisma.bill.aggregate({
      where: { userId, status: 'pending' },
      _count: { id: true },
      _sum: { totalAmount: true },
    }),

    // 4. Last 6 months income vs expense (raw transactions for grouping by month)
    prisma.transaction.findMany({
      where: {
        userId,
        occurredOn: {
          gte: sixMonthsAgo,
          lte: currentMonthEnd,
        },
        OR: [
          { categoryId: null },
          { category: { isSystem: false } }
        ]
      },
      select: {
        type: true,
        amount: true,
        occurredOn: true,
      },
    }),

    // 5. Current month expenses by category
    prisma.transaction.findMany({
      where: {
        userId,
        type: 'debit',
        occurredOn: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      select: {
        amount: true,
        category: {
          select: { name: true, isSystem: true },
        },
      },
    }),
  ]);

  // --- Compute Total Balance ---
  let totalBalance = 0;
  for (const account of accounts) {
    let balance = Number(account.openingBalance);
    for (const txn of account.transactions) {
      const amt = Number(txn.amount);
      if (txn.type === 'credit') balance += amt;
      else if (txn.type === 'debit') balance -= amt;
    }
    totalBalance += balance;
  }

  // --- Compute Monthly Credit & Debit ---
  let monthlyCredit = 0;
  let monthlyDebit = 0;
  for (const row of monthlyAggregates) {
    const sum = Number(row._sum.amount) || 0;
    if (row.type === 'credit') monthlyCredit = sum;
    if (row.type === 'debit') monthlyDebit = sum;
  }

  // --- Pending Bills ---
  const pendingBills = {
    count: pendingBillsAgg._count.id || 0,
    totalAmount: Number(pendingBillsAgg._sum.totalAmount) || 0,
  };

  // --- 6-Month Trend ---
  const monthMap = new Map();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    monthMap.set(key, { month: label, income: 0, expense: 0 });
  }

  for (const txn of sixMonthTrend) {
    const d = new Date(txn.occurredOn);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const entry = monthMap.get(key);
    if (entry) {
      const amt = Number(txn.amount);
      if (txn.type === 'credit') entry.income += amt;
      else if (txn.type === 'debit') entry.expense += amt;
    }
  }

  const monthlyTrend = Array.from(monthMap.values());

  // --- Expense by Category ---
  const categoryMap = new Map();
  for (const txn of categoryExpenses) {
    if (txn.category?.isSystem) continue;
    const catName = txn.category?.name || 'Uncategorized';
    const current = categoryMap.get(catName) || 0;
    categoryMap.set(catName, current + Number(txn.amount));
  }

  const expenseByCategory = Array.from(categoryMap.entries())
    .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => b.amount - a.amount);

  // --- Response ---
  return sendSuccess(res, STATUS_CODES.OK, {
    totalBalance: Math.round(totalBalance * 100) / 100,
    monthlyCredit: Math.round(monthlyCredit * 100) / 100,
    monthlyDebit: Math.round(monthlyDebit * 100) / 100,
    pendingBills,
    monthlyTrend,
    expenseByCategory,
  }, 'Dashboard data fetched successfully');
});
