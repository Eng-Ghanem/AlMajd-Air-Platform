import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Settings, Bell, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function AdminDashboard({ lang }) {
  const isAr = lang === 'ar';
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = requests.reduce((acc, req) => acc + (req.total_price || 0), 0);
  const totalCustomers = new Set(requests.map(req => req.phone)).size;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'مرحباً بعودتك! نظرة عامة على نشاط المنصة.' : 'Welcome back! Overview of platform activity.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white dark:bg-midnight-lighter border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white dark:bg-midnight-lighter border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-midnight-lighter p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-xl">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-semibold">{isAr ? 'الطلبات الجديدة' : 'New Requests'}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{requests.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-midnight-lighter p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-4 bg-accent/10 text-accent rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-semibold">{isAr ? 'العملاء' : 'Customers'}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{totalCustomers}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-midnight-lighter p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-4 bg-green-500/10 text-green-500 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-semibold">{isAr ? 'الإيرادات' : 'Revenue'}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{totalRevenue} EGP</p>
            </div>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white dark:bg-midnight-lighter rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'أحدث الطلبات' : 'Recent Requests'}
            </h2>
            <div className="relative w-full sm:w-auto">
              <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className={`w-full sm:w-64 ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                placeholder={isAr ? 'بحث عن طلب...' : 'Search request...'}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>ID</th>
                  <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'العميل' : 'Customer'}</th>
                  <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الخدمة' : 'Service'}</th>
                  <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th className={`px-6 py-4 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الإجمالي' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr>
                ) : requests.map((req) => (
                  <tr key={req.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">REQ-{req.id}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{req.name}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{req.service_type}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300" dir="ltr">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {req.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{isAr ? 'قيد الانتظار' : 'Pending'}</span>}
                      {req.status === 'paid' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3.5 h-3.5" />{isAr ? 'مدفوع' : 'Paid'}</span>}
                      {req.status === 'completed' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3.5 h-3.5" />{isAr ? 'مكتمل' : 'Completed'}</span>}
                      {req.status === 'cancelled' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3.5 h-3.5" />{isAr ? 'ملغي' : 'Cancelled'}</span>}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{req.total_price} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
