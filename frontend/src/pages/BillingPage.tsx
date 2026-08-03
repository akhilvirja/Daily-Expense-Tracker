import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { billApi } from '../api/billApi';
import type { Bill } from '../api/billApi';
import { accountApi } from '../api/accountApi';
import type { Account } from '../api/accountApi';
import { trackerApi } from '../api/trackerApi';
import type { TrackerItem } from '../api/trackerApi';
import PayBillModal from '../components/bills/PayBillModal';
import GenerateBillModal from '../components/bills/GenerateBillModal';

const BillingPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [billsData, accountsRes, itemsData] = await Promise.all([
        billApi.getBills(),
        accountApi.getAll(),
        trackerApi.getItems()
      ]);
      setBills(billsData);
      setAccounts((accountsRes.data || []).filter((a: Account) => a.isActive));
      setItems(itemsData.filter((i: TrackerItem) => i.isActive));
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateBill = async (itemId: string, periodStart: string, periodEnd: string) => {
    await billApi.generateBill({ itemId, periodStart, periodEnd });
    fetchData();
  };

  const handlePayBill = async (accountId: string, paidOn: string, remarks?: string) => {
    if (selectedBill) {
      await billApi.payBill(selectedBill.id, { accountId, paidOn, remarks });
      fetchData();
    }
  };

  const handleUndoPayment = async (billId: string) => {
    if (window.confirm('Are you sure you want to undo this payment? It will remove the associated transaction.')) {
      try {
        await billApi.undoPayment(billId);
        fetchData();
      } catch (error) {
        console.error('Failed to undo payment', error);
      }
    }
  };

  const filteredBills = bills.filter(bill => {
    if (statusFilter === 'All') return true;
    return bill.status === statusFilter.toLowerCase();
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDurationDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full">
        {/* Page Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Bills Management</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Track and manage upcoming and past payments.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-body-sm text-body-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            
            <button 
              onClick={() => setIsGenerateModalOpen(true)}
              className="bg-primary text-on-primary font-title-md text-title-md h-10 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus size={18} />
              New Bill
            </button>
          </div>
        </div>

        {/* Bills Table Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Generated On</th>
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Billing Period</th>
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Item / Tracker</th>
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Qty</th>
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Total Amount</th>
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-center">Status</th>
                  <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                      Loading bills...
                    </td>
                  </tr>
                ) : filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <tr key={bill.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                      <td className="px-4 py-4 text-on-surface-variant font-medium whitespace-nowrap">
                        {formatDurationDate(bill.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant text-xs whitespace-nowrap">
                        {formatDurationDate(bill.periodStart)} - {formatDurationDate(bill.periodEnd)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-title-md text-title-md text-on-surface">{bill.item.name}</div>
                        <div className="text-on-surface-variant text-xs">Unit: {bill.item.unit}</div>
                      </td>
                      <td className="px-4 py-4 text-on-surface-variant">
                        {Number(bill.totalQuantity).toFixed(1)}
                      </td>
                      <td className="px-4 py-4 font-tabular-nums text-tabular-nums text-right text-on-surface font-semibold">
                        ₹{Number(bill.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {bill.status === 'pending' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-caps text-label-caps">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps">
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {bill.status === 'pending' ? (
                          <button 
                            onClick={() => { setSelectedBill(bill); setIsPayModalOpen(true); }}
                            className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-body-sm text-body-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <div className="flex justify-end items-center gap-3">
                            <span className="text-on-surface-variant text-xs">
                              {bill.paidAccount?.name}
                            </span>
                            <button 
                              onClick={() => handleUndoPayment(bill.id)}
                              className="text-error hover:bg-error-container hover:text-on-error-container px-2 py-1 rounded transition-colors font-body-sm text-body-sm"
                            >
                              Undo
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-on-surface-variant">
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GenerateBillModal 
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateBill}
        items={items}
      />

      <PayBillModal 
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        onPay={handlePayBill}
        bill={selectedBill}
        accounts={accounts}
      />
    </>
  );
};

export default BillingPage;
