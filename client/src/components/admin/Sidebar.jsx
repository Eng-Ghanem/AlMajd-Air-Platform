import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, CreditCard, Users, Settings, LogOut, Package, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isAr, currentView, setCurrentView, isMobile }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { id: 'requests', icon: FileText, labelAr: 'الطلبات والحجوزات', labelEn: 'Requests & Bookings' },
    { id: 'prices', icon: Tag, labelAr: 'الأسعار والخصومات', labelEn: 'Prices & Discounts' },
    { id: 'payments', icon: CreditCard, labelAr: 'الدفعات والمعاملات', labelEn: 'Payments' },
    { id: 'subscriptions', icon: Package, labelAr: 'الاشتراكات', labelEn: 'Subscriptions' },
    { id: 'customers', icon: Users, labelAr: 'العملاء', labelEn: 'Customers' },
    { id: 'technicians', icon: Users, labelAr: 'إدارة الفنيين', labelEn: 'Technicians' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`w-64 h-screen flex flex-col bg-white dark:bg-midnight-lighter border-l dark:border-l-slate-800 border-r dark:border-r-slate-800 border-slate-200 sticky top-0 transition-colors ${isMobile ? '' : 'hidden lg:flex'}`}>
      <div className="p-6 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2">
           <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">M</div>
           <span className="text-xl font-bold text-slate-900 dark:text-white">Admin Pro</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : ''} />
              <span>{isAr ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button 
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            currentView === 'settings' 
              ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings size={20} className={currentView === 'settings' ? 'text-white' : ''} />
          <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
        </button>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold">
          <LogOut size={20} />
          <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
