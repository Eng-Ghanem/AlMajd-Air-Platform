import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Phone, Package, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function SubscriptionsTable({ isAr, subscriptions, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscriptions = subscriptions.filter(sub => 
    (sub.customer_name && sub.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (sub.phone && sub.phone.includes(searchTerm)) ||
    (sub.plan_name && sub.plan_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-midnight-lighter rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {isAr ? 'الاشتراكات وباقات الصيانة' : 'Subscriptions & Maintenance Plans'}
          </h2>
          <p className="text-sm text-slate-500">{isAr ? `إجمالي الاشتراكات: ${filteredSubscriptions.length}` : `Total Subscriptions: ${filteredSubscriptions.length}`}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm`}
            placeholder={isAr ? 'بحث' : 'Search'}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'}`}>
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'العميل' : 'Customer'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الباقة' : 'Plan'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'القيمة' : 'Price'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'البداية' : 'Start Date'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'النهاية' : 'End Date'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">{isAr ? 'جاري التحميل...' : 'Loading...'}</td>
              </tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="w-12 h-12 text-slate-300 mb-3" />
                    <p>{isAr ? 'لا توجد اشتراكات مسجلة' : 'No subscriptions found'}</p>
                  </div>
                </td>
              </tr>
            ) : filteredSubscriptions.map((sub) => (
              <tr key={sub.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {sub.customer_name ? sub.customer_name.charAt(0).toUpperCase() : <User size={18} />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                        {sub.customer_name || (isAr ? 'بدون اسم' : 'Unnamed')}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone size={12} /> {sub.phone || '---'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                    <Package size={16} className="text-purple-500" />
                    {sub.plan_name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isAr ? `${sub.price} جنيه` : `${sub.price} EGP`}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400" dir="ltr">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {sub.start_date ? new Date(sub.start_date).toLocaleDateString('en-GB') : '---'}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400" dir="ltr">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {sub.end_date ? new Date(sub.end_date).toLocaleDateString('en-GB') : '---'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {sub.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 size={12} /> {isAr ? 'نشط' : 'Active'}
                    </span>
                  )}
                  {sub.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Clock size={12} /> {isAr ? 'قيد الانتظار' : 'Pending'}
                    </span>
                  )}
                  {sub.status === 'expired' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      <XCircle size={12} /> {isAr ? 'منتهي' : 'Expired'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
