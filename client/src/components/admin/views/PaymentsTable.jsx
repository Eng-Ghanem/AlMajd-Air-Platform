import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, ArrowDownRight, CreditCard, Banknote } from 'lucide-react';

export default function PaymentsTable({ isAr, payments, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => {
    const customerName = p.service_requests?.name || p.customer || '';
    const paymentId = p.id?.toString() || '';
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           paymentId.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            {isAr ? 'المعاملات المالية والدفعات' : 'Financial Transactions & Payments'}
          </h2>
          <p className="text-sm text-slate-500">{isAr ? `إجمالي المعاملات: ${filteredPayments.length}` : `Total Transactions: ${filteredPayments.length}`}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm`}
            placeholder={isAr ? 'بحث برقم المعاملة أو العميل...' : 'Search by transaction ID or customer...'}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'رقم المعاملة' : 'Transaction ID'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'العميل' : 'Customer'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'المبلغ' : 'Amount'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'طريقة الدفع' : 'Method'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'التاريخ' : 'Date'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">{isAr ? 'جاري التحميل...' : 'Loading...'}</td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">{isAr ? 'لا توجد معاملات' : 'No transactions found'}</td>
              </tr>
            ) : filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">PAY-{payment.id}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                    {payment.service_requests?.name || payment.customer || (isAr ? 'عميل غير معروف' : 'Unknown')}
                  </div>
                  {payment.request_id && (
                    <div className="text-xs text-slate-500">REQ-#{payment.request_id}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <ArrowUpRight size={16} className="text-green-500" />
                    {isAr ? `${payment.amount} جنيه` : `${payment.amount} EGP`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {payment.method === 'card' || payment.method === 'online' ? (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CreditCard size={16} className="text-primary" /> {isAr ? 'بطاقة / تحويل' : 'Card / Transfer'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Banknote size={16} className="text-green-500" /> {isAr ? 'نقدي' : 'Cash'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400" dir="ltr">
                  {new Date(payment.created_at || payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  {payment.status === 'completed' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{isAr ? 'ناجحة' : 'Successful'}</span>}
                  {payment.status === 'pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{isAr ? 'معلقة' : 'Pending'}</span>}
                  {payment.status === 'failed' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{isAr ? 'فاشلة' : 'Failed'}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
