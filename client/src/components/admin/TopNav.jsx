import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, LogOut, Settings, Clock, Globe, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopNav({ isAr, lang, setLang, theme, setTheme, setMobileMenuOpen, requests = [], setCurrentView, setOpenRequestId }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [viewedRequestsCount, setViewedRequestsCount] = useState(() => {
    return parseInt(localStorage.getItem('viewedRequestsCount') || '0', 10);
  });
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    if (setTheme) setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    if (setLang) setLang(lang === 'en' ? 'ar' : 'en');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending').slice(0, 5);
  const hasUnread = pendingRequests.length > viewedRequestsCount;

  const handleOpenNotifications = () => {
    const willShow = !showNotifications;
    setShowNotifications(willShow);
    setShowProfile(false);
    
    if (willShow) {
      setViewedRequestsCount(pendingRequests.length);
      localStorage.setItem('viewedRequestsCount', pendingRequests.length.toString());
    }
  };
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
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleLang}
            className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors font-bold text-sm"
            title="Toggle Language"
          >
            <Globe size={20} className="text-primary dark:text-accent" />
            <span className="sr-only">Toggle Language</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-primary" />}
          </button>
        </div>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-2"></div>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={handleOpenNotifications}
            className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Bell size={22} />
            {hasUnread && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-midnight-lighter"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className={`absolute top-full mt-2 ${isAr ? 'left-0' : 'right-0'} w-80 bg-white dark:bg-midnight border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden z-50`}>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-slate-900 dark:text-white">{isAr ? 'الإشعارات' : 'Notifications'}</h3>
                {pendingRequests.length > 0 && <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg">{pendingRequests.length} {isAr ? 'جديد' : 'New'}</span>}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map(req => (
                    <div 
                      key={req.id} 
                      onClick={() => {
                        if (setCurrentView) setCurrentView('requests');
                        if (setOpenRequestId) setOpenRequestId(req.id);
                        setShowNotifications(false);
                      }}
                      className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex gap-3 items-start cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{isAr ? 'طلب جديد' : 'New Request'}: {req.service_type}</p>
                        <p className="text-xs text-slate-500 mb-1">{req.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock size={12} />
                          <span>{new Date(req.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    {isAr ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 hidden sm:block">Admin</span>
          </button>
          
          {showProfile && (
            <div className={`absolute top-full mt-2 ${isAr ? 'left-0' : 'right-0'} w-48 bg-white dark:bg-midnight border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden z-50`}>
              <div className="p-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-semibold text-start">
                  <LogOut size={18} />
                  <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
