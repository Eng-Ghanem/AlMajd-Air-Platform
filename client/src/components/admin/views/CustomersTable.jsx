import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Calendar, User, UserCheck } from 'lucide-react';

export default function CustomersTable({ isAr, users, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter for customers only if there are different roles, or just display all.
  const customers = users.filter(u => u.role === 'customer' || !u.role);

  const filteredCustomers = customers.filter(c => 
    (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.phone && c.phone.includes(searchTerm))
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
            {isAr ? 'قاعدة العملاء' : 'Customers Database'}
          </h2>
          <p className="text-sm text-slate-500">{isAr ? `إجمالي العملاء النشطين: ${filteredCustomers.length}` : `Total Active Customers: ${filteredCustomers.length}`}</p>
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
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الهاتف' : 'Phone'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'تاريخ الانضمام' : 'Joined Date'}</th>
              <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-500">{isAr ? 'جاري التحميل...' : 'Loading...'}</td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-500">{isAr ? 'لا يوجد عملاء بهذا الاسم' : 'No customers found'}</td>
              </tr>
            ) : filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {customer.name ? customer.name.charAt(0).toUpperCase() : <User size={18} />}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {customer.name || (isAr ? 'بدون اسم' : 'Unnamed')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail size={16} className="text-slate-400" />
                    {customer.email || '---'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone size={16} className="text-slate-400" />
                    {customer.phone || '---'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar size={16} className="text-slate-400" />
                    <span dir="ltr">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <UserCheck size={14} />
                    {isAr ? 'نشط' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
