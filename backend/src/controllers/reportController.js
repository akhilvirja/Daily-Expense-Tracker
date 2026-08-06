import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * @desc    Get expenses grouped by category
 * @route   GET /api/v1/reports/category
 * @access  Private
 */
export const getCategoryReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, accountId, categoryId, type } = req.query;
  const userId = req.user.id;

  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date();

  // Set time to end of day for the end date if it's not already
  if (endDate) {
    end.setHours(23, 59, 59, 999);
  }

  const filter = {
    userId,
    occurredOn: {
      gte: start,
      lte: end
    },
    OR: [
      { categoryId: null },
      { category: { isSystem: false } }
    ]
  };

  if (accountId) filter.accountId = accountId;
  if (categoryId) filter.categoryId = categoryId;
  if (type && type !== 'All') {
    filter.type = type;
  } else if (!type) {
    filter.type = 'debit'; // default to debit for category report if not specified
  }

  // Get all transactions in the period matching the filter
  const transactions = await prisma.transaction.findMany({
    where: filter,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          isSystem: true
        }
      }
    }
  });

  const categoryTotals = {};

  transactions.forEach(txn => {
    // If it's a bill payment, we might want to still show it, but maybe group it
    const catName = txn.category ? txn.category.name : 'Uncategorized';
    
    if (!categoryTotals[catName]) {
      categoryTotals[catName] = {
        name: catName,
        value: 0,
        isSystem: txn.category ? txn.category.isSystem : false
      };
    }
    
    categoryTotals[catName].value += Number(txn.amount);
  });

  // Convert to array and sort by value descending
  const reportData = Object.values(categoryTotals).sort((a, b) => b.value - a.value);

  return sendSuccess(res, STATUS_CODES.OK, reportData, 'Category report generated successfully');
});

/**
 * @desc    Get income vs expense trend over time
 * @route   GET /api/v1/reports/trend
 * @access  Private
 */
export const getTrendReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupBy = 'month', accountId, categoryId, type } = req.query; // 'day', 'week', 'month'
  const userId = req.user.id;

  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1); // default to this year
  const end = endDate ? new Date(endDate) : new Date();

  if (endDate) {
    end.setHours(23, 59, 59, 999);
  }

  const filter = {
    userId,
    occurredOn: {
      gte: start,
      lte: end
    },
    OR: [
      { categoryId: null },
      { category: { isSystem: false } }
    ]
  };

  if (accountId) filter.accountId = accountId;
  if (categoryId) filter.categoryId = categoryId;
  if (type && type !== 'All') filter.type = type;

  const transactions = await prisma.transaction.findMany({
    where: filter,
    orderBy: {
      occurredOn: 'asc'
    }
  });

  const periods = {};

  transactions.forEach(txn => {
    let periodKey;
    const date = new Date(txn.occurredOn);

    if (groupBy === 'month') {
      periodKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    } else if (groupBy === 'day') {
      periodKey = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    } else {
      // Default fallback
      periodKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }

    if (!periods[periodKey]) {
      periods[periodKey] = {
        name: periodKey,
        income: 0,
        expense: 0,
        date: date // Store date for sorting
      };
    }

    if (txn.type === 'credit') {
      periods[periodKey].income += Number(txn.amount);
    } else {
      periods[periodKey].expense += Number(txn.amount);
    }
  });

  // Sort by chronological order
  const reportData = Object.values(periods).sort((a, b) => a.date - b.date).map(p => ({
    name: p.name,
    income: p.income,
    expense: p.expense
  }));

  return sendSuccess(res, STATUS_CODES.OK, reportData, 'Trend report generated successfully');
});
