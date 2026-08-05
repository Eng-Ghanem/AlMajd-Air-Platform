import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Search, RefreshCw, Tag, DollarSign, Percent } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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
  // Maintenance Services
  { id: 'service_maintenance', nameAr: 'صيانة دورية', nameEn: 'Periodic Maintenance', brand: 'Services' },
  { id: 'service_installation', nameAr: 'تأسيس وتركيب عام', nameEn: 'General Installation', brand: 'Services' },
  { id: 'service_cleaning', nameAr: 'تنظيف وغسيل', nameEn: 'Cleaning', brand: 'Services' },
  { id: 'service_freon', nameAr: 'شحن فريون', nameEn: 'Freon Recharge', brand: 'Services' },
  { id: 'service_install_carrier', nameAr: 'تركيب تكييف كاريير', nameEn: 'Carrier Installation', brand: 'Services' },
  { id: 'service_install_midea', nameAr: 'تركيب تكييف ميديا', nameEn: 'Midea Installation', brand: 'Services' },
  { id: 'service_install_free_air', nameAr: 'تركيب تكييف فري اير', nameEn: 'Free Air Installation', brand: 'Services' },
  { id: 'service_install_haier', nameAr: 'تركيب تكييف هاير', nameEn: 'Haier Installation', brand: 'Services' },
];

export default function PricesManager({ isAr }) {
  const [activeTab, setActiveTab] = useState('devices');
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
      const { data: dbPrices, error } = await supabase.from('device_prices').select('*');
      if (error) throw error;
      
      // Merge (dbPrices || []) with defaultDevicesInfo
      const mergedData = defaultDevicesInfo.map(device => {
        const dbPrice = (dbPrices || []).find(p => p.id === device.id);
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
    setPricesData(prev => prev.map(p => p.id === id ? { ...p, price: newPrice === '' ? '' : Number(newPrice) } : p));
    setSaveSuccess(false);
  };

  const handleDiscountChange = (id, newDiscount) => {
    setPricesData(prev => prev.map(p => p.id === id ? { ...p, discount_percentage: newDiscount === '' ? '' : Number(newDiscount) } : p));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const pricesToSave = pricesData.map(({ id, price, discount_percentage }) => ({
        id, 
        price: Number(price) || 0, 
        discount_percentage: Number(discount_percentage) || 0
      }));
      
      const { error } = await supabase.from('device_prices').upsert(pricesToSave, { onConflict: 'id' });
      
      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error saving prices:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredData = pricesData.filter(d => {
    let matchesTab = false;
    if (activeTab === 'devices') {
      matchesTab = !d.id.startsWith('service_');
    } else if (activeTab === 'services') {
      matchesTab = d.id.startsWith('service_') && !d.id.startsWith('service_install_');
    } else if (activeTab === 'installations') {
      matchesTab = d.id.startsWith('service_install_');
    }
    
    const matchesSearch = (d.nameAr.includes(searchTerm)) || 
                          (d.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (d.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

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

      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-colors ${
            activeTab === 'devices' 
              ? 'border-primary text-primary bg-white dark:bg-midnight' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {isAr ? 'التكييفات والماركات' : 'Air Conditioners & Brands'}
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-colors ${
            activeTab === 'services' 
              ? 'border-primary text-primary bg-white dark:bg-midnight' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {isAr ? 'الصيانة والخدمات' : 'Maintenance & Services'}
        </button>
        <button
          onClick={() => setActiveTab('installations')}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-colors ${
            activeTab === 'installations' 
              ? 'border-primary text-primary bg-white dark:bg-midnight' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {isAr ? 'التركيبات' : 'Installations'}
        </button>
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
              const safePrice = Number(device.price) || 0;
              const safeDiscount = Number(device.discount_percentage) || 0;
              const finalPrice = safePrice - (safePrice * (safeDiscount / 100));
              
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
                        value={device.price === 0 ? '' : device.price}
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
                        value={device.discount_percentage === 0 ? '' : device.discount_percentage}
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
