import React, { useState, useEffect } from 'react';
import { trackerApi } from '../api/trackerApi';
import type { TrackerItem, TrackerLog } from '../api/trackerApi';
import TrackerItemModal from '../components/trackers/TrackerItemModal';
import { Plus, Calendar, Receipt, Save, History } from 'lucide-react';

const TrackerPage: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<TrackerItem[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Selection State
  const [selectedItem, setSelectedItem] = useState<TrackerItem | null>(null);
  
  // Single item log states
  const [recentLogs, setRecentLogs] = useState<TrackerLog[]>([]);
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await trackerApi.getItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
  };

  const loadRecentLogs = async (itemId: string) => {
    try {
      setIsLoadingLogs(true);
      const logs = await trackerApi.getRecentLogs(itemId);
      setRecentLogs(logs);
      
      // Find log for current date
      const todayLog = logs.find(l => l.logDate.startsWith(date));
      if (todayLog) {
        setCurrentQuantity(todayLog.quantity);
        setCurrentAmount(todayLog.amount);
      } else {
        setCurrentQuantity(0);
        setCurrentAmount(0);
      }
    } catch (error) {
      console.error('Failed to fetch recent logs', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      loadRecentLogs(selectedItem.id);
    } else {
      setRecentLogs([]);
      setCurrentQuantity(0);
      setCurrentAmount(0);
    }
  }, [selectedItem, date]);

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
        amount: currentAmount
      });
      await loadRecentLogs(selectedItem.id);
    } catch (error) {
      console.error('Failed to save log', error);
    } finally {
      setIsSavingLog(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQ = Math.max(0, currentQuantity + delta);
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
    <>
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left Column: Item Master */}
        <section className="flex-1 lg:max-w-md flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Item Master</h2>
            <button 
              onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
              className="bg-primary text-on-primary h-10 px-4 rounded-lg font-body-sm text-body-sm flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 pb-20">
            {items.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:shadow-sm transition-shadow group cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary bg-primary-container/5' : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface">{item.name}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsModalOpen(true); }}>Click to edit</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-surface-container-highest pt-3 mt-2">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">UNIT</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{item.unit}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">PRICE</span>
                      <span className="font-tabular-nums text-tabular-nums text-on-surface font-semibold">
                        {item.price ? `₹${Number(item.price).toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {items.length === 0 && (
              <div className="text-center p-8 text-on-surface-variant border border-dashed border-outline-variant rounded-xl">
                No items found. Add your first item!
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Daily Logs */}
        <section className="flex-[2] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Daily Logs</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="date" 
                  value={date}
                  onChange={handleDateChange}
                  className="pl-10 pr-4 h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <button className="bg-surface-container-highest text-on-surface h-10 px-4 rounded-lg font-body-sm text-body-sm whitespace-nowrap hover:bg-surface-variant transition-colors border border-outline-variant">
                Copy Prev
              </button>
            </div>
          </div>

          {!selectedItem ? (
            <div className="flex-1 flex items-center justify-center bg-surface-container-lowest rounded-xl border border-outline-variant p-8 shadow-sm">
              <div className="text-center text-on-surface-variant">
                <p className="font-title-md text-title-md mb-2">No Item Selected</p>
                <p className="font-body-sm text-body-sm">Select an item from the left to view and edit its logs.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Logging Form */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">LOGGING FOR</span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface">{selectedItem.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {selectedItem.price ? `₹${Number(selectedItem.price).toFixed(2)} / ${selectedItem.unit}` : `Unit: ${selectedItem.unit}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">QUANTITY</span>
                    <div className="flex items-center border border-outline-variant rounded-full overflow-hidden h-12 bg-surface-container-low">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 text-on-surface-variant hover:bg-surface-container transition-colors text-xl"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={currentQuantity}
                        readOnly
                        className="w-16 text-center border-none bg-transparent p-0 h-full font-tabular-nums text-xl text-on-surface focus:ring-0" 
                      />
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 text-on-surface-variant hover:bg-surface-container transition-colors text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">TOTAL FOR DAY</span>
                    <div className="flex items-center">
                      <span className="font-tabular-nums text-primary font-bold text-3xl mr-1">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={currentAmount}
                        onChange={handleAmountChange}
                        className="w-24 text-right border-none bg-transparent p-0 font-tabular-nums text-primary font-bold text-3xl focus:ring-0 focus:border-b focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-surface-container-highest flex justify-end">
                  <button 
                    onClick={handleSaveEntry}
                    disabled={isSavingLog}
                    className="bg-primary text-on-primary h-10 px-6 rounded-lg font-body-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
                  >
                    <Save size={18} />
                    {isSavingLog ? 'Saving...' : 'Save Entry'}
                  </button>
                </div>
              </div>

              {/* Recent Logs List */}
              <div className="mt-4">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3 px-1">Recent Logs</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant divide-y divide-surface-container-highest">
                  {isLoadingLogs ? (
                    <div className="p-4 text-center text-on-surface-variant">Loading logs...</div>
                  ) : recentLogs.length > 0 ? (
                    recentLogs.map(log => {
                      const logDateStr = new Date(log.logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <div key={log.id} className="p-4 flex justify-between items-center hover:bg-surface-bright transition-colors">
                          <div className="flex items-center gap-3">
                            <History size={18} className="text-on-surface-variant" />
                            <span className="font-body-lg text-body-lg text-on-surface">{logDateStr}</span>
                          </div>
                          <span className="font-tabular-nums text-body-lg text-on-surface-variant">
                            {log.quantity} {selectedItem.unit}{log.quantity !== 1 && !selectedItem.unit.endsWith('s') ? 's' : ''} — <span className="text-on-surface font-semibold">₹{Number(log.amount).toFixed(2)}</span>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-on-surface-variant">No recent logs found.</div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-surface-container-highest text-on-surface h-12 px-8 rounded-xl font-title-md text-title-md flex items-center gap-3 hover:bg-surface-variant transition-colors border border-outline-variant w-full sm:w-auto shadow-sm">
                  <Receipt size={24} />
                  Generate Bill & Select Date Range
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <TrackerItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={selectedItem}
      />
    </>
  );
};

export default TrackerPage;
