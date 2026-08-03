import prisma from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * @desc    Get all bills for the authenticated user
 * @route   GET /api/v1/bills
 * @access  Private
 */
export const getBills = asyncHandler(async (req, res) => {
  const bills = await prisma.bill.findMany({
    where: { userId: req.user.id },
    include: {
      item: { select: { name: true, unit: true } },
      paidAccount: { select: { name: true } },
    },
    orderBy: { periodStart: 'desc' },
  });

  return sendSuccess(res, STATUS_CODES.OK, bills, 'Bills fetched successfully');
});

/**
 * @desc    Generate a bill for a specific item and date range
 * @route   POST /api/v1/bills/generate
 * @access  Private
 */
export const generateBill = asyncHandler(async (req, res) => {
  const { itemId, periodStart, periodEnd } = req.body;

  const start = new Date(periodStart);
  const end = new Date(periodEnd);
  
  // Ensure the time is set to start and end of day in UTC
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  // Check if item belongs to user
  const item = await prisma.trackerItem.findFirst({
    where: { id: itemId, userId: req.user.id },
  });

  if (!item) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Tracker item not found');
  }



  // Aggregate logs that haven't been billed yet
  const logs = await prisma.trackerLog.findMany({
    where: {
      itemId,
      logDate: {
        gte: start,
        lte: end,
      },
      isBilled: false,
    },
  });

  if (logs.length === 0) {
    // Check if a bill already exists exactly for this period
    const existingBill = await prisma.bill.findFirst({
      where: {
        itemId,
        periodStart: start,
        periodEnd: end,
      }
    });

    if (existingBill) {
      return sendError(res, STATUS_CODES.CONFLICT, 'A bill is already generated for this item in this period');
    }

    return sendError(res, STATUS_CODES.BAD_REQUEST, 'No unbilled logs found for this item in the specified period');
  }

  // Calculate totals
  let totalQuantity = 0;
  let totalAmount = 0;
  logs.forEach(log => {
    totalQuantity += Number(log.quantity);
    totalAmount += Number(log.amount);
  });

  // Create Bill and mark logs as billed using a transaction
  const bill = await prisma.$transaction(async (tx) => {
    const newBill = await tx.bill.create({
      data: {
        userId: req.user.id,
        itemId,
        periodStart: start,
        periodEnd: end,
        totalQuantity,
        totalAmount,
        status: 'pending',
      },
      include: {
        item: true,
      }
    });

    // Mark the fetched logs as billed
    await tx.trackerLog.updateMany({
      where: {
        id: {
          in: logs.map(l => l.id),
        }
      },
      data: {
        isBilled: true,
        billId: newBill.id,
      }
    });

    return newBill;
  });

  return sendSuccess(res, STATUS_CODES.CREATED, bill, 'Bill generated successfully');
});

/**
 * @desc    Pay a pending bill
 * @route   PUT /api/v1/bills/:id/pay
 * @access  Private
 */
export const payBill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { accountId, paidOn, remarks } = req.body;

  const bill = await prisma.bill.findFirst({
    where: { id, userId: req.user.id },
    include: { item: true },
  });

  if (!bill) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Bill not found');
  }

  if (bill.status === 'paid') {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Bill is already paid');
  }

  const account = await prisma.account.findFirst({
    where: { id: accountId, userId: req.user.id, isActive: true },
  });

  if (!account) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Active account not found');
  }

  const paymentDate = new Date(paidOn);

  // We need a transaction to ensure both bill status and ledger are updated safely
  const result = await prisma.$transaction(async (tx) => {
    // Ensure Category exists for this bill
    const categoryName = `Bill: ${bill.item.name}`;
    let category = await tx.category.findFirst({
      where: {
        userId: req.user.id,
        name: categoryName
      }
    });

    if (!category) {
      category = await tx.category.create({
        data: {
          userId: req.user.id,
          name: categoryName,
          isSystem: true
        }
      });
    }

    // 1. Create Transaction in ledger
    const transaction = await tx.transaction.create({
      data: {
        userId: req.user.id,
        accountId: account.id,
        categoryId: category.id,
        type: 'debit',
        amount: bill.totalAmount,
        description: `Bill Payment: ${bill.item.name} (${bill.periodStart.toISOString().split('T')[0]}) ${remarks ? '- ' + remarks : ''}`,
        occurredOn: paymentDate,
        billId: bill.id,
      },
    });

    // 2. Update Bill to Paid
    const updatedBill = await tx.bill.update({
      where: { id: bill.id },
      data: {
        status: 'paid',
        paidAccountId: account.id,
        paidOn: paymentDate,
      },
      include: {
        item: { select: { name: true, unit: true } },
        paidAccount: { select: { name: true } },
      }
    });

    return updatedBill;
  });

  return sendSuccess(res, STATUS_CODES.OK, result, 'Bill paid successfully');
});

/**
 * @desc    Undo a bill payment
 * @route   PUT /api/v1/bills/:id/undo
 * @access  Private
 */
export const undoPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!bill) {
    return sendError(res, STATUS_CODES.NOT_FOUND, 'Bill not found');
  }

  if (bill.status !== 'paid') {
    return sendError(res, STATUS_CODES.BAD_REQUEST, 'Only paid bills can be undone');
  }

  await prisma.$transaction(async (tx) => {
    // 1. Delete associated transactions
    await tx.transaction.deleteMany({
      where: { billId: bill.id },
    });

    // 2. Revert Bill to Pending
    await tx.bill.update({
      where: { id: bill.id },
      data: {
        status: 'pending',
        paidAccountId: null,
        paidOn: null,
      },
    });
  });

  // Fetch updated bill with relations
  const updatedBill = await prisma.bill.findUnique({
    where: { id: bill.id },
    include: {
      item: { select: { name: true, unit: true } },
      paidAccount: { select: { name: true } },
    }
  });

  return sendSuccess(res, STATUS_CODES.OK, updatedBill, 'Bill payment undone successfully');
});
