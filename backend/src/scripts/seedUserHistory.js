import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

const TARGET_EMAIL = 'divyrana488@gmail.com';

/**
 * Helper to get date normalized to UTC midnight
 */
function makeUtcDate(year, monthIndex, day) {
  return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
}

async function seedUserData() {
  console.log(`\n🌱 Starting 6-month data seeding for user: ${TARGET_EMAIL}...`);

  try {
    // 1. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: TARGET_EMAIL },
    });

    if (!user) {
      console.log(`👤 User ${TARGET_EMAIL} not found. Creating user...`);
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('Password@123', salt);

      user = await prisma.user.create({
        data: {
          email: TARGET_EMAIL,
          fullName: 'Divy Rana',
          passwordHash,
          isActive: true,
        },
      });
      console.log(`✅ Created new user: ${user.fullName} (${user.id}) with default password: Password@123`);
    } else {
      console.log(`👤 Found existing user: ${user.fullName} (${user.id})`);
    }

    const userId = user.id;

    // 2. Clean up existing records for this user to ensure idempotent, clean seeding
    console.log(`🧹 Cleaning previous transactions, bills, tracker logs for fresh 6-month seed...`);
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.bill.deleteMany({ where: { userId } });
    await prisma.trackerLog.deleteMany({ where: { userId } });
    await prisma.trackerItem.deleteMany({ where: { userId } });
    await prisma.category.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    console.log(`✅ Previous data cleaned.`);

    // 3. Create Accounts
    console.log(`💳 Creating Accounts...`);
    const accountsData = [
      { name: 'HDFC Salary Account', kind: 'bank', openingBalance: 65000, isActive: true },
      { name: 'ICICI Savings Bank', kind: 'bank', openingBalance: 35000, isActive: true },
      { name: 'Cash in Hand', kind: 'cash', openingBalance: 12000, isActive: true },
      { name: 'PayTM / UPI Wallet', kind: 'bank', openingBalance: 8000, isActive: true },
    ];

    const accounts = {};
    for (const acc of accountsData) {
      const created = await prisma.account.create({
        data: { ...acc, userId },
      });
      accounts[acc.name] = created;
    }
    console.log(`✅ Created ${Object.keys(accounts).length} accounts.`);

    // 4. Create Categories
    console.log(`🏷️ Creating Categories...`);
    const categoryNames = [
      // Expenses
      'Groceries & Supermarket',
      'Dining & Food Delivery',
      'Rent & Housing',
      'Utilities & Bills',
      'Transportation & Fuel',
      'Shopping & Clothing',
      'Healthcare & Medical',
      'Entertainment & Subscriptions',
      'Personal Care',
      'Travel & Vacation',
      // Incomes
      'Salary & Bonus',
      'Freelance & Consulting',
      'Investments & Dividends',
      'Cashback & Rewards',
    ];

    const categories = {};
    for (const catName of categoryNames) {
      const created = await prisma.category.create({
        data: {
          name: catName,
          userId,
          isSystem: false,
        },
      });
      categories[catName] = created;
    }
    console.log(`✅ Created ${Object.keys(categories).length} categories.`);

    // 5. Create Tracker Items
    console.log(`📋 Creating Tracker Items...`);
    const trackerItemsData = [
      { name: 'Daily Cow Milk', unit: 'Litre', price: 35 },
      { name: 'Morning Newspaper', unit: 'Copy', price: 5 },
      { name: 'Mineral Water Jar (20L)', unit: 'Jar', price: 40 },
      { name: 'Laundry Service', unit: 'Cloth', price: 15 },
    ];

    const trackerItems = {};
    for (const item of trackerItemsData) {
      const created = await prisma.trackerItem.create({
        data: { ...item, userId, isActive: true },
      });
      trackerItems[item.name] = created;
    }
    console.log(`✅ Created ${Object.keys(trackerItems).length} tracker items.`);

    // 6. Generate 6 Months of Daily Logs, Bills, and Transactions
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth(); // 0 to 11
    const currentDay = now.getUTCDate();

    console.log(`📅 Generating historical data from 5 months ago to current date...`);

    let totalTransactionsCount = 0;
    let totalLogsCount = 0;
    let totalBillsCount = 0;

    // Loop through the last 6 months (5 months ago, 4, 3, 2, 1, 0 = current month)
    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      // Calculate year and month for this iteration
      const d = new Date(Date.UTC(currentYear, currentMonth - monthOffset, 1));
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth();
      const monthName = d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

      // Determine days in this month
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const lastDayToProcess = (monthOffset === 0) ? currentDay : daysInMonth;

      console.log(`  🔹 Processing ${monthName} (Days: 1 to ${lastDayToProcess})...`);

      // -------------------------------------------------------------
      // A. Generate Standard Financial Transactions for this Month
      // -------------------------------------------------------------
      const transactionsToCreate = [];

      // 1. Monthly Salary (1st of month)
      transactionsToCreate.push({
        userId,
        accountId: accounts['HDFC Salary Account'].id,
        categoryId: categories['Salary & Bonus'].id,
        type: 'credit',
        amount: 88000 + Math.floor(Math.random() * 4000),
        description: `Monthly Salary Credit - ${monthName}`,
        occurredOn: makeUtcDate(year, month, 1),
      });

      // 2. House Rent (5th of month)
      if (lastDayToProcess >= 5) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['HDFC Salary Account'].id,
          categoryId: categories['Rent & Housing'].id,
          type: 'debit',
          amount: 22000,
          description: `House Rent Payment - ${monthName}`,
          occurredOn: makeUtcDate(year, month, 5),
        });
      }

      // 3. Freelance income in alternate months (15th of month)
      if (monthOffset % 2 === 1 && lastDayToProcess >= 15) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['ICICI Savings Bank'].id,
          categoryId: categories['Freelance & Consulting'].id,
          type: 'credit',
          amount: 18000 + Math.floor(Math.random() * 7000),
          description: `Freelance Web Project Payment`,
          occurredOn: makeUtcDate(year, month, 15),
        });
      }

      // 4. Investment dividends / returns (20th of month)
      if (monthOffset % 3 === 0 && lastDayToProcess >= 20) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['ICICI Savings Bank'].id,
          categoryId: categories['Investments & Dividends'].id,
          type: 'credit',
          amount: 3500 + Math.floor(Math.random() * 2000),
          description: `Mutual Fund Dividend & Stock Return`,
          occurredOn: makeUtcDate(year, month, 20),
        });
      }

      // 5. Utility & WiFi bills (10th of month)
      if (lastDayToProcess >= 10) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['HDFC Salary Account'].id,
          categoryId: categories['Utilities & Bills'].id,
          type: 'debit',
          amount: 3200 + Math.floor(Math.random() * 900),
          description: `Electricity & High-speed Fiber Bill`,
          occurredOn: makeUtcDate(year, month, 10),
        });
      }

      // 6. Groceries & Supermarket (Multiple times a month)
      const groceryDays = [3, 11, 19, 27];
      for (const gDay of groceryDays) {
        if (lastDayToProcess >= gDay) {
          transactionsToCreate.push({
            userId,
            accountId: gDay % 2 === 0 ? accounts['Cash in Hand'].id : accounts['HDFC Salary Account'].id,
            categoryId: categories['Groceries & Supermarket'].id,
            type: 'debit',
            amount: 1400 + Math.floor(Math.random() * 1800),
            description: `Supermarket groceries & daily kitchen essentials`,
            occurredOn: makeUtcDate(year, month, gDay),
          });
        }
      }

      // 7. Dining & Food delivery (Swiggy / Zomato / Cafes)
      const diningDays = [4, 8, 14, 18, 23, 28];
      for (const dDay of diningDays) {
        if (lastDayToProcess >= dDay) {
          transactionsToCreate.push({
            userId,
            accountId: accounts['PayTM / UPI Wallet'].id,
            categoryId: categories['Dining & Food Delivery'].id,
            type: 'debit',
            amount: 350 + Math.floor(Math.random() * 850),
            description: `Dining out / Food Delivery order`,
            occurredOn: makeUtcDate(year, month, dDay),
          });
        }
      }

      // 8. Transportation & Fuel (Uber, Metro, Petrol)
      const transportDays = [6, 13, 21, 26];
      for (const tDay of transportDays) {
        if (lastDayToProcess >= tDay) {
          transactionsToCreate.push({
            userId,
            accountId: accounts['PayTM / UPI Wallet'].id,
            categoryId: categories['Transportation & Fuel'].id,
            type: 'debit',
            amount: 400 + Math.floor(Math.random() * 1100),
            description: `Fuel refill & Metro / Cab commute`,
            occurredOn: makeUtcDate(year, month, tDay),
          });
        }
      }

      // 9. Shopping & Lifestyle
      if (lastDayToProcess >= 16) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['HDFC Salary Account'].id,
          categoryId: categories['Shopping & Clothing'].id,
          type: 'debit',
          amount: 2500 + Math.floor(Math.random() * 4000),
          description: `Clothing & Online Shopping (Amazon/Myntra)`,
          occurredOn: makeUtcDate(year, month, 16),
        });
      }

      // 10. Healthcare & Pharmacy
      if (lastDayToProcess >= 22) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['PayTM / UPI Wallet'].id,
          categoryId: categories['Healthcare & Medical'].id,
          type: 'debit',
          amount: 450 + Math.floor(Math.random() * 800),
          description: `Pharmacy medicines & healthcare vitamins`,
          occurredOn: makeUtcDate(year, month, 22),
        });
      }

      // 11. Entertainment & Subscriptions
      if (lastDayToProcess >= 25) {
        transactionsToCreate.push({
          userId,
          accountId: accounts['PayTM / UPI Wallet'].id,
          categoryId: categories['Entertainment & Subscriptions'].id,
          type: 'debit',
          amount: 899 + Math.floor(Math.random() * 600),
          description: `Netflix, Spotify & Movie tickets`,
          occurredOn: makeUtcDate(year, month, 25),
        });
      }

      // Insert standard transactions for this month
      for (const txn of transactionsToCreate) {
        await prisma.transaction.create({ data: txn });
        totalTransactionsCount++;
      }

      // -------------------------------------------------------------
      // B. Generate Tracker Logs & Bills for Tracker Items
      // -------------------------------------------------------------
      const milkLogs = [];
      const newspaperLogs = [];
      const waterLogs = [];

      for (let day = 1; day <= lastDayToProcess; day++) {
        const logDate = makeUtcDate(year, month, day);

        // Daily Milk (1 or 2 litres, occasionally 0.5)
        const milkQty = (day % 7 === 0) ? 2 : (day % 5 === 0) ? 1.5 : 1;
        const milkPrice = Number(trackerItems['Daily Cow Milk'].price);
        const createdMilkLog = await prisma.trackerLog.create({
          data: {
            userId,
            itemId: trackerItems['Daily Cow Milk'].id,
            logDate,
            quantity: milkQty,
            amount: milkQty * milkPrice,
            note: milkQty > 1 ? 'Extra milk for tea/dessert' : null,
          },
        });
        milkLogs.push(createdMilkLog);
        totalLogsCount++;

        // Morning Newspaper (1 copy every day)
        const newsPrice = Number(trackerItems['Morning Newspaper'].price);
        const createdNewsLog = await prisma.trackerLog.create({
          data: {
            userId,
            itemId: trackerItems['Morning Newspaper'].id,
            logDate,
            quantity: 1,
            amount: newsPrice,
          },
        });
        newspaperLogs.push(createdNewsLog);
        totalLogsCount++;

        // Water Jar (1 jar every 4 days)
        if (day % 4 === 1) {
          const waterPrice = Number(trackerItems['Mineral Water Jar (20L)'].price);
          const createdWaterLog = await prisma.trackerLog.create({
            data: {
              userId,
              itemId: trackerItems['Mineral Water Jar (20L)'].id,
              logDate,
              quantity: 1,
              amount: waterPrice,
              note: '20L Drinking water jar',
            },
          });
          waterLogs.push(createdWaterLog);
          totalLogsCount++;
        }
      }

      // -------------------------------------------------------------
      // C. Generate Monthly Bills for Past Completed Months
      // -------------------------------------------------------------
      // If this is a past month, generate bills and mark logs as billed
      if (monthOffset > 0) {
        const periodStart = makeUtcDate(year, month, 1);
        const periodEnd = makeUtcDate(year, month, daysInMonth);

        // 1. Milk Bill
        const milkTotalQty = milkLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
        const milkTotalAmt = milkLogs.reduce((sum, l) => sum + Number(l.amount), 0);

        const isMilkPaid = monthOffset > 1; // Month -1 can be pending to show pending bills!
        const milkBill = await prisma.bill.create({
          data: {
            userId,
            itemId: trackerItems['Daily Cow Milk'].id,
            periodStart,
            periodEnd,
            totalQuantity: milkTotalQty,
            totalAmount: milkTotalAmt,
            status: isMilkPaid ? 'paid' : 'pending',
            paidAccountId: isMilkPaid ? accounts['HDFC Salary Account'].id : null,
            paidOn: isMilkPaid ? makeUtcDate(year, month + 1, 2) : null,
          },
        });
        totalBillsCount++;

        // Associate logs with bill
        await prisma.trackerLog.updateMany({
          where: {
            id: { in: milkLogs.map((l) => l.id) },
          },
          data: {
            isBilled: true,
            billId: milkBill.id,
          },
        });

        // If paid, create the payment transaction
        if (isMilkPaid) {
          await prisma.transaction.create({
            data: {
              userId,
              accountId: accounts['HDFC Salary Account'].id,
              categoryId: categories['Groceries & Supermarket'].id,
              type: 'debit',
              amount: milkTotalAmt,
              description: `Bill Paid: Daily Cow Milk (${monthName})`,
              occurredOn: makeUtcDate(year, month + 1, 2),
              billId: milkBill.id,
            },
          });
          totalTransactionsCount++;
        }

        // 2. Newspaper Bill
        const newsTotalQty = newspaperLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
        const newsTotalAmt = newspaperLogs.reduce((sum, l) => sum + Number(l.amount), 0);
        const isNewsPaid = true;

        const newsBill = await prisma.bill.create({
          data: {
            userId,
            itemId: trackerItems['Morning Newspaper'].id,
            periodStart,
            periodEnd,
            totalQuantity: newsTotalQty,
            totalAmount: newsTotalAmt,
            status: 'paid',
            paidAccountId: accounts['Cash in Hand'].id,
            paidOn: makeUtcDate(year, month + 1, 3),
          },
        });
        totalBillsCount++;

        await prisma.trackerLog.updateMany({
          where: {
            id: { in: newspaperLogs.map((l) => l.id) },
          },
          data: {
            isBilled: true,
            billId: newsBill.id,
          },
        });

        await prisma.transaction.create({
          data: {
            userId,
            accountId: accounts['Cash in Hand'].id,
            categoryId: categories['Utilities & Bills'].id,
            type: 'debit',
            amount: newsTotalAmt,
            description: `Bill Paid: Morning Newspaper (${monthName})`,
            occurredOn: makeUtcDate(year, month + 1, 3),
            billId: newsBill.id,
          },
        });
        totalTransactionsCount++;

        // 3. Water Bill (Leave month -1 pending)
        if (waterLogs.length > 0) {
          const waterTotalQty = waterLogs.reduce((sum, l) => sum + Number(l.quantity), 0);
          const waterTotalAmt = waterLogs.reduce((sum, l) => sum + Number(l.amount), 0);
          const isWaterPaid = monthOffset > 1;

          const waterBill = await prisma.bill.create({
            data: {
              userId,
              itemId: trackerItems['Mineral Water Jar (20L)'].id,
              periodStart,
              periodEnd,
              totalQuantity: waterTotalQty,
              totalAmount: waterTotalAmt,
              status: isWaterPaid ? 'paid' : 'pending',
              paidAccountId: isWaterPaid ? accounts['PayTM / UPI Wallet'].id : null,
              paidOn: isWaterPaid ? makeUtcDate(year, month + 1, 4) : null,
            },
          });
          totalBillsCount++;

          await prisma.trackerLog.updateMany({
            where: {
              id: { in: waterLogs.map((l) => l.id) },
            },
            data: {
              isBilled: true,
              billId: waterBill.id,
            },
          });

          if (isWaterPaid) {
            await prisma.transaction.create({
              data: {
                userId,
                accountId: accounts['PayTM / UPI Wallet'].id,
                categoryId: categories['Utilities & Bills'].id,
                type: 'debit',
                amount: waterTotalAmt,
                description: `Bill Paid: Mineral Water Jar (${monthName})`,
                occurredOn: makeUtcDate(year, month + 1, 4),
                billId: waterBill.id,
              },
            });
            totalTransactionsCount++;
          }
        }
      }
    }

    console.log(`\n🎉 SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`=================================================`);
    console.log(`👤 User:           ${user.fullName} (${user.email})`);
    console.log(`💳 Accounts:       ${Object.keys(accounts).length} created`);
    console.log(`🏷️ Categories:     ${Object.keys(categories).length} created`);
    console.log(`📋 Tracker Items:  ${Object.keys(trackerItems).length} created`);
    console.log(`📝 Tracker Logs:   ${totalLogsCount} daily entries across 6 months`);
    console.log(`🧾 Bills:          ${totalBillsCount} monthly bills (paid & pending)`);
    console.log(`💰 Transactions:   ${totalTransactionsCount} credit/debit records`);
    console.log(`=================================================\n`);

  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedUserData();
