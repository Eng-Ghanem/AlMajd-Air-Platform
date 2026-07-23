import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

export default function TopNav({ isAr, setMobileMenuOpen }) {
  return (
    <header className="h-20 bg-white dark:bg-midnight-lighter border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex relative max-w-md w-full">
          <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={20} />
          <input 
            type="text" 
            placeholder={isAr ? 'بحث عن طلب، عميل...' : 'Search request, customer...'}
            className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-2.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-midnight-lighter"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <button className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 hidden sm:block">Admin</span>
        </button>
      </div>
    </header>
  );
}
