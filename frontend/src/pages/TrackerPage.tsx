import React, { useState, useEffect, useCallback } from 'react';
import { trackerApi } from '../api/trackerApi';
import type { TrackerItem, TrackerLog } from '../api/trackerApi';
import type { PaginationMeta } from '../types';
import { billApi } from '../api/billApi';
import TrackerItemModal from '../components/trackers/TrackerItemModal';
import GenerateBillModal from '../components/bills/GenerateBillModal';
import { Plus, Calendar, Receipt, Save, History, Edit2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Pagination from '../components/ui/Pagination';

const renderLogStatusBadge = (status?: string) => {
  switch (status) {
    case 'billed_paid':
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wider whitespace-nowrap">
          Paid
        </span>
      );
    case 'billed_unpaid':
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps bg-error-container text-on-error-container font-semibold uppercase tracking-wider whitespace-nowrap">
          Billed (Unpaid)
        </span>
      );
    case 'unbilled':
    default:
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps bg-surface-container-high text-on-surface-variant font-medium uppercase tracking-wider whitespace-nowrap">
          Unbilled
        </span>
      );
  }
};

const TrackerPage: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<TrackerItem[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'info'
  });
  
  // Selection State
  const [selectedItem, setSelectedItem] = useState<TrackerItem | null>(null);
  
  // Single item log states & Pagination
  const [recentLogs, setRecentLogs] = useState<TrackerLog[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(10);
  const [logsPagination, setLogsPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await trackerApi.getItems();
      setItems(data);
      setSelectedItem(prev => {
        if (!prev) return null;
        return data.find(i => i.id === prev.id) || prev;
      });
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
  };

  const loadRecentLogs = useCallback(async (itemId: string, pageNum = logsPage, limitNum = logsPageSize) => {
    try {
      setIsLoadingLogs(true);
      const res = await trackerApi.getRecentLogs(itemId, pageNum, limitNum);
      setRecentLogs(res.data);
      if (res.pagination) {
        setLogsPagination(res.pagination);
      }
      
      // Find log for current date from loaded data
      const todayLog = res.data.find(l => l.logDate.startsWith(date));
      if (todayLog) {
        setCurrentQuantity(Number(todayLog.quantity));
        setCurrentAmount(Number(todayLog.amount));
      } else {
        setCurrentQuantity(0);
        setCurrentAmount(0);
      }
    } catch (error) {
      console.error('Failed to fetch recent logs', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [logsPage, logsPageSize, date]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      loadRecentLogs(selectedItem.id, logsPage, logsPageSize);
    } else {
      setRecentLogs([]);
      setCurrentQuantity(0);
      setCurrentAmount(0);
    }
  }, [selectedItem, date, logsPage, logsPageSize, loadRecentLogs]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSaveItem = async (data: Omit<TrackerItem, 'id' | 'isActive'>) => {
    if (selectedItem) {
      await trackerApi.updateItem(selectedItem.id, data);
    } else {
      await trackerApi.createItem(data);
    }
    fetchItems();
  };

  const handleSaveEntry = async () => {
    if (!selectedItem) return;
    try {
      setIsSavingLog(true);
      await trackerApi.upsertLog({
        itemId: selectedItem.id,
        logDate: date,
        quantity: currentQuantity,
        amount: currentAmount,
      });
      await loadRecentLogs(selectedItem.id);
      setToast({
        isVisible: true,
        message: 'Log saved successfully!',
        type: 'success',
      });
    } catch (error: any) {
      console.error('Failed to save log', error);
      setToast({
        isVisible: true,
        message: error?.response?.data?.message || 'Failed to save log',
        type: 'error',
      });
    } finally {
      setIsSavingLog(false);
    }
  };

  const handleOpenGenerateBillModal = () => {
    if (!selectedItem) {
      setToast({
        isVisible: true,
        message: 'Please select an item first to generate a bill.',
        type: 'warning'
      });
      return;
    }
    setIsGenerateBillModalOpen(true);
  };

  const handleGenerateBill = async (itemId: string, periodStart: string, periodEnd: string) => {
    try {
      await billApi.generateBill({ itemId, periodStart, periodEnd });
      setToast({
        isVisible: true,
        message: 'Bill generated successfully!',
        type: 'success'
      });
      if (selectedItem) {
        await loadRecentLogs(selectedItem.id);
      }
    } catch (error: any) {
      setToast({
        isVisible: true,
        message: error.message || 'Failed to generate bill',
        type: 'error'
      });
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQ = Math.max(0, Number(currentQuantity) + delta);
    setCurrentQuantity(newQ);
    if (selectedItem?.price) {
      setCurrentAmount(newQ * Number(selectedItem.price));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setCurrentAmount(val);
    } else {
      setCurrentAmount(0);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] bg-surface rounded-xl border border-surface-container-highest shadow-sm lg:overflow-hidden">
      {/* Left Sidebar: Item Master (Fixed Width on Desktop) */}
      <section className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-surface-container-highest bg-surface-container-lowest max-h-[45vh] lg:max-h-none">
        {/* Sidebar Header */}
        <div className="px-4 border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest z-10 sticky top-0 min-h-[72px] lg:h-[72px]">
          <h2 className="text-xl font-bold text-on-surface">Item Master</h2>
          <Button 
            size="sm"
            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
            icon={<Plus size={16} />}
          >
            Add Item
          </Button>
        </div>
        
        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-6 lg:pb-8">
          {items.map(item => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div 
                key={item.id} 
                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-200 cursor-pointer group ${
                  isSelected 
                    ? 'bg-primary/5 border border-primary/30 shadow-sm' 
                    : 'bg-surface border border-outline-variant hover:border-outline hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedItem(item);
                  setLogsPage(1);
                }}
              >
                {/* Selection Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-4">
                    <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-on-surface'} group-hover:text-primary transition-colors line-clamp-1`}>
                      {item.name}
                    </h3>
                  </div>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsModalOpen(true); }}
                    icon={<Edit2 size={16} />}
                    className="!px-2 h-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full"
                    title="Edit Item"
                  />
                </div>
                
                <div className="flex justify-between items-end mt-3">
                  <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
                    {item.unit}
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {item.price ? `₹${Number(item.price).toFixed(2)}` : 'N/A'}
                  </span>
                </div>
              </div>
            );
          })}
          
          {items.length === 0 && (
            <div className="text-center p-8 text-on-surface-variant border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center gap-3">
              <Plus size={32} className="text-outline" />
              <p className="text-sm">No items found. Add your first item!</p>
            </div>
          )}
        </div>
      </section>

      {/* Right Content: Daily Logs */}
      <section className="flex-1 flex flex-col min-w-0 bg-surface">
        {/* Header Toolbar */}
        <div className="px-4 py-3 lg:py-0 lg:px-8 border-b border-surface-container-highest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest sticky top-0 z-10 min-h-[72px] lg:h-[72px]">
          <div>
            <h2 className="text-2xl font-bold text-on-surface hidden sm:block">Daily Logs</h2>
          </div>
          
          <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-[180px]">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="date" 
                value={date}
                onChange={handleDateChange}
                className="w-full pl-10 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>

            <Button 
              onClick={handleOpenGenerateBillModal}
              icon={<Receipt size={16} />} 
              className="flex-1 sm:flex-none"
            >
              <span className="hidden lg:inline">Generate Bill</span>
              <span className="lg:hidden">Bill</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          {!selectedItem ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
                <Receipt size={40} className="text-on-surface-variant/50" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">No Item Selected</h3>
              <p className="text-on-surface-variant">Select an item from the sidebar to start logging quantities and amounts for the selected date.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 w-full">
              {/* Logging Form Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 lg:p-6 shadow-sm w-full">
                {(() => {
                  const selectedDateLog = recentLogs.find(l => l.logDate.startsWith(date));
                  return (
                    <div className="flex justify-between items-center mb-5 border-b border-surface-container-highest pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold tracking-wider text-primary uppercase">Logging For</span>
                          {selectedDateLog && renderLogStatusBadge(selectedDateLog.status)}
                        </div>
                        <h3 className="text-2xl font-bold text-on-surface leading-tight">{selectedItem.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-on-surface-variant font-medium bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/50">
                          {selectedItem.price ? `₹${Number(selectedItem.price).toFixed(2)} / ${selectedItem.unit}` : `Unit: ${selectedItem.unit}`}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col sm:flex-row items-end gap-4 lg:gap-6 w-full">
                  {/* Quantity Stepper */}
                  <div className="flex flex-col gap-1.5 w-full sm:flex-[1.2]">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Quantity</label>
                    <div className="flex items-center bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm h-12 w-full transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="w-14 h-full flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors active:bg-surface-variant"
                      >
                        <span className="text-2xl font-light">-</span>
                      </button>
                      <div className="flex-1 h-full border-x border-outline-variant">
                        <input 
                          type="number" 
                          value={currentQuantity}
                          readOnly
                          className="w-full h-full text-center bg-transparent text-lg font-bold text-on-surface focus:outline-none" 
                        />
                      </div>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="w-14 h-full flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors active:bg-surface-variant"
                      >
                        <span className="text-2xl font-light">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex flex-col gap-1.5 w-full sm:flex-[2]">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Total Amount</label>
                    <div className="flex items-center bg-surface border border-outline-variant rounded-xl px-4 h-12 w-full shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                      <span className="text-xl font-bold text-primary mr-2">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={currentAmount}
                        onChange={handleAmountChange}
                        className="w-full text-right bg-transparent text-2xl font-black text-on-surface focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="w-full sm:flex-[1]">
                    <Button 
                      size="lg"
                      onClick={handleSaveEntry}
                      isLoading={isSavingLog}
                      icon={!isSavingLog ? <Save size={18} /> : undefined}
                      fullWidth
                    >
                      {isSavingLog ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recent Logs List */}
              <div>
                <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                  <History size={16} />
                  Recent Logs
                </h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
                  {/* Table Header for Desktop/Tablet */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 bg-surface-container-low border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                    <div className="col-span-4">Date</div>
                    <div className="col-span-3 text-right">Quantity</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-3 text-right">Status</div>
                  </div>

                  {isLoadingLogs ? (
                    <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm">Loading history...</p>
                    </div>
                  ) : recentLogs.length > 0 ? (
                    <div className="divide-y divide-surface-container-highest">
                      {recentLogs.map(log => {
                        const isToday = log.logDate.startsWith(date);
                        const logDateStr = new Date(log.logDate).toLocaleDateString('en-US', { 
                          weekday: 'short', month: 'short', day: 'numeric' 
                        });
                        return (
                          <div 
                            key={log.id} 
                            className={`px-4 sm:px-5 py-3.5 transition-colors hover:bg-surface-container-low/60 ${
                              isToday ? 'bg-primary/5' : ''
                            }`}
                          >
                            {/* Desktop & Tablet Grid View */}
                            <div className="hidden sm:grid sm:grid-cols-12 sm:items-center gap-4">
                              {/* Col 1: Date */}
                              <div className="col-span-4 flex items-center gap-3 min-w-0">
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isToday ? 'bg-primary ring-4 ring-primary/20' : 'bg-outline-variant'}`} />
                                <div className="truncate flex items-center gap-2">
                                  <span className={`text-sm font-medium ${isToday ? 'text-primary font-semibold' : 'text-on-surface'}`}>
                                    {logDateStr}
                                  </span>
                                  {isToday && (
                                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                      Selected
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Col 2: Quantity */}
                              <div className="col-span-3 text-right">
                                <span className="text-sm font-medium text-on-surface-variant font-tabular-nums">
                                  {Number(log.quantity)} <span className="text-xs uppercase text-on-surface-variant/80">{selectedItem.unit}{Number(log.quantity) !== 1 && !selectedItem.unit.endsWith('s') ? 's' : ''}</span>
                                </span>
                              </div>

                              {/* Col 3: Amount */}
                              <div className="col-span-2 text-right">
                                <span className="text-base font-bold text-on-surface font-tabular-nums">
                                  ₹{Number(log.amount).toFixed(2)}
                                </span>
                              </div>

                              {/* Col 4: Status */}
                              <div className="col-span-3 flex justify-end items-center">
                                {renderLogStatusBadge(log.status)}
                              </div>
                            </div>

                            {/* Mobile View */}
                            <div className="flex flex-col gap-2.5 sm:hidden">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isToday ? 'bg-primary ring-2 ring-primary/20' : 'bg-outline-variant'}`} />
                                  <span className={`text-sm font-medium truncate ${isToday ? 'text-primary font-semibold' : 'text-on-surface'}`}>
                                    {logDateStr} {isToday ? '(Selected)' : ''}
                                  </span>
                                </div>
                                <div className="flex-shrink-0">
                                  {renderLogStatusBadge(log.status)}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/30 text-sm">
                                <span className="text-on-surface-variant font-medium">
                                  {Number(log.quantity)} <span className="text-xs uppercase">{selectedItem.unit}{Number(log.quantity) !== 1 && !selectedItem.unit.endsWith('s') ? 's' : ''}</span>
                                </span>
                                <span className="text-base font-bold text-on-surface font-tabular-nums">
                                  ₹{Number(log.amount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-2">
                      <History size={24} className="text-outline" />
                      <p className="text-sm">No recent logs found for this item.</p>
                    </div>
                  )}

                  {/* Pagination for Recent Logs */}
                  {recentLogs.length > 0 && (
                    <Pagination
                      pagination={logsPagination}
                      onPageChange={(p) => setLogsPage(p)}
                      onPageSizeChange={(size) => {
                        setLogsPageSize(size);
                        setLogsPage(1);
                      }}
                      pageSizeOptions={[5, 10, 15, 30]}
                      isLoading={isLoadingLogs}
                      itemLabel="logs"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <TrackerItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={selectedItem}
      />

      <GenerateBillModal
        isOpen={isGenerateBillModalOpen}
        onClose={() => setIsGenerateBillModalOpen(false)}
        onGenerate={handleGenerateBill}
        items={items.filter(i => i.isActive)}
        defaultItemId={selectedItem?.id}
      />

      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default TrackerPage;
