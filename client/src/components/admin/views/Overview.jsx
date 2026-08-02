import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { motion } from 'framer-motion';

export default function Overview({ isAr, requests, users, payments, subscriptions }) {
  // Aggregate real stats
  const standalonePaymentsRevenue = payments
    .filter(p => p.status === 'completed' && !p.request_id)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const requestsRevenue = requests
    .filter(req => req.status === 'paid')
    .reduce((acc, req) => acc + (Number(req.total_price) || 0), 0);
  const totalRevenue = standalonePaymentsRevenue + requestsRevenue;

  const totalCustomers = users.filter(u => u.role === 'customer' || !u.role).length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const totalSubscriptions = subscriptions.length;

  // Generate chart data based on payments
  // Initialize last 90 days for detailed zooming
  const chartData = [];
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    chartData.push({
      dateStr: dateStr,
      fullDate: d,
      name: dateStr, // for XAxis
      revenue: 0,
      requests: 0
    });
  }

  // Populate chart data from payments (standalone)
  payments.forEach(payment => {
    if (payment.status !== 'completed' || payment.request_id) return;
    const pDate = new Date(payment.created_at);
    const dateStr = pDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const dataPoint = chartData.find(d => d.dateStr === dateStr && d.fullDate.getFullYear() === pDate.getFullYear());
    if (dataPoint) {
      dataPoint.revenue += (Number(payment.amount) || 0);
    }
  });

  // Populate requests count and revenue in chart data
  requests.forEach(req => {
    const rDate = new Date(req.created_at);
    const dateStr = rDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const dataPoint = chartData.find(d => d.dateStr === dateStr && d.fullDate.getFullYear() === rDate.getFullYear());
    if (dataPoint) {
      dataPoint.requests += 1;
      if (req.status === 'paid') {
        dataPoint.revenue += (Number(req.total_price) || 0);
      }
    }
  });

  // Calculate percentage change
  let percentageChange = 0;
  if (chartData.length >= 2) {
    const currentMonthRev = chartData[6].revenue;
    const lastMonthRev = chartData[5].revenue;
    if (lastMonthRev > 0) {
      percentageChange = ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100;
    } else if (currentMonthRev > 0) {
      percentageChange = 100;
    }
  }
  const isPositive = percentageChange >= 0;

  const statCards = [
    { titleAr: 'إجمالي الإيرادات', titleEn: 'Total Revenue', value: isAr ? `${totalRevenue} جنيه` : `${totalRevenue} EGP`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { titleAr: 'الطلبات الجديدة', titleEn: 'New Requests', value: pendingRequests, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
    { titleAr: 'العملاء النشطين', titleEn: 'Active Customers', value: totalCustomers, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
    { titleAr: 'الاشتراكات', titleEn: 'Subscriptions', value: totalSubscriptions, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-midnight-lighter p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-5 transition-transform hover:-translate-y-1">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{isAr ? stat.titleAr : stat.titleEn}</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-midnight-lighter p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{isAr ? 'نظرة عامة على الإيرادات' : 'Revenue Overview'}</h3>
              <p className="text-sm text-slate-500">{isAr ? 'إحصائيات الإيرادات مفصلة يومياً (يمكنك التكبير عبر الشريط بالأسفل)' : 'Detailed daily revenue statistics (Use bottom slider to zoom)'}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${isPositive ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
              <TrendingUp size={16} className={isPositive ? '' : 'rotate-180'} />
              <span dir="ltr">{isPositive ? '+' : ''}{percentageChange.toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#00B4D8' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00B4D8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Brush dataKey="name" height={30} stroke="#00B4D8" fill="#1e293b" tickFormatter={() => ''} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Widget */}
        <div className="bg-white dark:bg-midnight-lighter p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'النشاطات الأخيرة' : 'Recent Activity'}</h3>
          <div className="space-y-6 relative before:absolute before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent before:z-0">
            {/* Dynamic style for the before pseudo-element based on language */}
            <style>
              {`
                .recent-activity-timeline::before {
                  ${isAr ? 'right: 19px;' : 'left: 19px;'}
                }
              `}
            </style>
            <div className="recent-activity-timeline contents">
              {requests.slice(0, 4).map((req, i) => (
                <div key={i} className="relative flex items-center group z-10">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-midnight-lighter bg-primary text-white shadow shrink-0 ${isAr ? 'ml-4' : 'mr-4'}`}>
                    <Calendar size={16} />
                  </div>
                  <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate" title={req.name}>{req.name}</h4>
                      <span className="text-xs text-slate-400 font-mono shrink-0 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">#{req.id}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{req.service_type}</p>
                  </div>
                </div>
              ))}
            </div>
            {requests.length === 0 && (
              <p className="text-slate-500 text-center py-4 relative z-10">{isAr ? 'لا توجد نشاطات' : 'No activities found'}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
