import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function Overview({ isAr, requests, users, payments, subscriptions }) {
  // Aggregate real stats
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalCustomers = users.filter(u => u.role === 'customer' || !u.role).length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const totalSubscriptions = subscriptions.length;

  // Generate chart data based on payments
  // Initialize last 7 months
  const chartData = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    chartData.push({
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      name: monthNames[d.getMonth()],
      revenue: 0,
      requests: 0
    });
  }

  // Populate chart data from payments
  payments.forEach(payment => {
    if (payment.status !== 'completed') return;
    const pDate = new Date(payment.created_at);
    const dataPoint = chartData.find(d => d.monthIndex === pDate.getMonth() && d.year === pDate.getFullYear());
    if (dataPoint) {
      dataPoint.revenue += (payment.amount || 0);
    }
  });

  // Populate requests count in chart data
  requests.forEach(req => {
    const rDate = new Date(req.created_at);
    const dataPoint = chartData.find(d => d.monthIndex === rDate.getMonth() && d.year === rDate.getFullYear());
    if (dataPoint) {
      dataPoint.requests += 1;
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
              <p className="text-sm text-slate-500">{isAr ? 'إحصائيات الإيرادات خلال الأشهر السبعة الماضية' : 'Revenue statistics over the last 7 months'}</p>
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Widget */}
        <div className="bg-white dark:bg-midnight-lighter p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{isAr ? 'النشاطات الأخيرة' : 'Recent Activity'}</h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
            {requests.slice(0, 4).map((req, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-midnight-lighter bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isAr ? 'ml-4 md:ml-0' : 'mr-4 md:mr-0'}`}>
                  <Calendar size={16} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{req.name}</h4>
                    <span className="text-xs text-slate-400">#{req.id}</span>
                  </div>
                  <p className="text-sm text-slate-500">{req.service_type}</p>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-slate-500 text-center py-4">{isAr ? 'لا توجد نشاطات' : 'No activities found'}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
