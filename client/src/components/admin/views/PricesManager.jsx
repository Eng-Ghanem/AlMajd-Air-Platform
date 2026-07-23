import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Search, RefreshCw, Tag, DollarSign, Percent } from 'lucide-react';

// Default devices metadata to match IDs
const defaultDevicesInfo = [
  { id: 'carrier_1.5', nameAr: 'تكييف كاريير 1.5 حصان', nameEn: 'Carrier 1.5 HP', brand: 'Carrier' },
  { id: 'carrier_2.25', nameAr: 'تكييف كاريير 2.25 حصان', nameEn: 'Carrier 2.25 HP', brand: 'Carrier' },
  { id: 'carrier_3', nameAr: 'تكييف كاريير 3 حصان', nameEn: 'Carrier 3 HP', brand: 'Carrier' },
  { id: 'carrier_4', nameAr: 'تكييف كاريير 4 حصان', nameEn: 'Carrier 4 HP', brand: 'Carrier' },
  { id: 'carrier_5', nameAr: 'تكييف كاريير 5 حصان', nameEn: 'Carrier 5 HP', brand: 'Carrier' },
  { id: 'midea_1.5', nameAr: 'تكييف ميديا 1.5 حصان', nameEn: 'Midea 1.5 HP', brand: 'Midea' },
  { id: 'midea_2.25', nameAr: 'تكييف ميديا 2.25 حصان', nameEn: 'Midea 2.25 HP', brand: 'Midea' },
  { id: 'midea_3', nameAr: 'تكييف ميديا 3 حصان', nameEn: 'Midea 3 HP', brand: 'Midea' },
  { id: 'midea_4', nameAr: 'تكييف ميديا 4 حصان', nameEn: 'Midea 4 HP', brand: 'Midea' },
  { id: 'midea_5', nameAr: 'تكييف ميديا 5 حصان', nameEn: 'Midea 5 HP', brand: 'Midea' },
  { id: 'free_air_1.5', nameAr: 'تكييف فري اير 1.5 حصان', nameEn: 'Free Air 1.5 HP', brand: 'Free Air' },
  { id: 'free_air_2.25', nameAr: 'تكييف فري اير 2.25 حصان', nameEn: 'Free Air 2.25 HP', brand: 'Free Air' },
  { id: 'free_air_3', nameAr: 'تكييف فري اير 3 حصان', nameEn: 'Free Air 3 HP', brand: 'Free Air' },
  { id: 'free_air_4', nameAr: 'تكييف فري اير 4 حصان', nameEn: 'Free Air 4 HP', brand: 'Free Air' },
  { id: 'free_air_5', nameAr: 'تكييف فري اير 5 حصان', nameEn: 'Free Air 5 HP', brand: 'Free Air' },
  { id: 'haier_1.5', nameAr: 'تكييف هاير 1.5 حصان', nameEn: 'Haier 1.5 HP', brand: 'Haier' },
  { id: 'haier_2.25', nameAr: 'تكييف هاير 2.25 حصان', nameEn: 'Haier 2.25 HP', brand: 'Haier' },
  { id: 'haier_3', nameAr: 'تكييف هاير 3 حصان', nameEn: 'Haier 3 HP', brand: 'Haier' },
  { id: 'haier_4', nameAr: 'تكييف هاير 4 حصان', nameEn: 'Haier 4 HP', brand: 'Haier' },
  { id: 'haier_5', nameAr: 'تكييف هاير 5 حصان', nameEn: 'Haier 5 HP', brand: 'Haier' },
];

export default function PricesManager({ isAr }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pricesData, setPricesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/device-prices');
      const dbPrices = await res.json();
      
      // Merge dbPrices with defaultDevicesInfo
      const mergedData = defaultDevicesInfo.map(device => {
        const dbPrice = dbPrices.find(p => p.id === device.id);
        return {
          ...device,
          price: dbPrice ? Number(dbPrice.price) : 0,
          discount_percentage: dbPrice ? Number(dbPrice.discount_percentage) : 0
        };
      });
      
      setPricesData(mergedData);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setPricesData(prev => prev.map(p => p.id === id ? { ...p, price: Number(newPrice) } : p));
    setSaveSuccess(false);
  };

  const handleDiscountChange = (id, newDiscount) => {
    setPricesData(prev => prev.map(p => p.id === id ? { ...p, discount_percentage: Number(newDiscount) } : p));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const pricesToSave = pricesData.map(({ id, price, discount_percentage }) => ({
        id, price, discount_percentage
      }));
      
      const res = await fetch('http://localhost:5000/api/device-prices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: pricesToSave })
      });
      
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving prices:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredData = pricesData.filter(d => 
    (d.nameAr.includes(searchTerm)) || 
    (d.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-midnight-lighter rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Tag className="text-primary" size={24} />
            {isAr ? 'إدارة التسعير والخصومات' : 'Pricing & Discounts Management'}
          </h2>
          <p className="text-sm text-slate-500">{isAr ? 'تحكم في أسعار جميع الأجهزة ونسب الخصم على المنصة بالكامل' : 'Control prices and discount percentages for all devices across the platform'}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm`}
              placeholder={isAr ? 'بحث عن جهاز...' : 'Search device...'}
            />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
              saveSuccess 
                ? 'bg-green-500 text-white shadow-green-500/30' 
                : 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5'
            } disabled:opacity-70 disabled:hover:translate-y-0`}
          >
            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            {saveSuccess ? (isAr ? 'تم الحفظ' : 'Saved') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'}`}>
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">{isAr ? 'الماركة والجهاز' : 'Brand & Device'}</th>
              <th className="px-6 py-4">{isAr ? 'السعر الأصلي (EGP)' : 'Original Price (EGP)'}</th>
              <th className="px-6 py-4">{isAr ? 'نسبة الخصم (%)' : 'Discount (%)'}</th>
              <th className="px-6 py-4">{isAr ? 'السعر النهائي' : 'Final Price'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-500 flex flex-col items-center justify-center">
                   <RefreshCw className="animate-spin mb-2 text-primary" size={24} />
                   {isAr ? 'جاري تحميل الأسعار...' : 'Loading prices...'}
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-500">{isAr ? 'لا يوجد أجهزة' : 'No devices found'}</td>
              </tr>
            ) : filteredData.map((device) => {
              const finalPrice = device.price - (device.price * (device.discount_percentage / 100));
              
              return (
                <tr key={device.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white mb-0.5">{isAr ? device.nameAr : device.nameEn}</div>
                    <div className="text-xs text-slate-500 font-mono">{device.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative w-32">
                      <DollarSign className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} text-slate-400`} size={14} />
                      <input 
                        type="number"
                        min="0"
                        value={device.price}
                        onChange={(e) => handlePriceChange(device.id, e.target.value)}
                        className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 ${isAr ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-slate-900 dark:text-white focus:outline-none focus:border-primary font-bold`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative w-24">
                      <Percent className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} text-slate-400`} size={14} />
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={device.discount_percentage}
                        onChange={(e) => handleDiscountChange(device.id, e.target.value)}
                        className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 ${isAr ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-slate-900 dark:text-white focus:outline-none focus:border-primary font-bold`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {device.discount_percentage > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through">
                          {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(device.price)}
                        </span>
                        <span className="font-bold text-green-500">
                          {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(finalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-900 dark:text-white">
                        {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(finalPrice)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
