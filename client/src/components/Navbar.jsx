import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Globe, Menu, X, User, LogIn, Home, Tags, Wrench, Info, MessageSquare, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ lang, setLang, theme, setTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, user: authUser, logout } = useAuth();
  
  // Failsafe: Try to get user from profile, then localStorage, then Supabase auth session
  let user = profile;
  if (!user) {
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (localUser) {
      user = localUser;
    } else if (authUser) {
      user = { 
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        role: 'customer' // Default fallback
      };
    }
  }

  // Safe display name logic
  const displayName = user?.name ? user.name.trim().split(' ')[0] : (user?.email?.split('@')[0] || 'User');

  const handleLogout = () => {
    logout(); // Initiates background signout and clears state synchronously
    navigate('/login'); // Seamless React Router navigation
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) => 
    `relative py-2 text-sm uppercase tracking-wider font-bold transition-all duration-300 ${
      isActive 
        ? 'text-primary dark:text-accent scale-105' 
        : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:-translate-y-0.5'
    } group`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-4 rounded-2xl text-[1.05rem] font-bold transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 translate-x-1' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-1'
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-midnight/80 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4 lg:gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={closeMenu}>
              <img 
                src="/images/logo.png" 
                alt="AlMajd Air Logo" 
                className="h-10 w-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-lg"
              />
              <span className="text-2xl xl:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500 whitespace-nowrap">
                {lang === 'ar' ? 'المجد اير' : 'AlMajd Air'}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-4 xl:gap-8">
              <NavLink to="/" className={navLinkClass}>
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </NavLink>
              <NavLink to="/brands" className={navLinkClass}>
                {lang === 'ar' ? 'الماركات' : 'Brands'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </NavLink>
              <NavLink to="/services" className={navLinkClass}>
                {lang === 'ar' ? 'خدماتنا' : 'Services'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                {lang === 'ar' ? 'من نحن' : 'About Us'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </NavLink>
              {(user?.role === 'technician' || user?.role === 'admin') && (
                <NavLink to="/technician" className={navLinkClass}>
                  {lang === 'ar' ? 'بوابة الفنيين' : 'Technicians'}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </NavLink>
              )}
              <NavLink to="/testimonials" className={navLinkClass}>
                {lang === 'ar' ? 'آراء العملاء' : 'Testimonials'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </NavLink>
            </div>

            {/* Desktop Menu & Toggles */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 xl:gap-2 px-3 py-2 xl:px-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-sm"
                aria-label="Toggle Language"
              >
                <Globe size={18} className="text-primary dark:text-accent" />
                <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-primary" />}
              </button>

              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

              {user ? (
                <div className="flex items-center gap-2 xl:gap-4 ml-1 xl:ml-2">
                  <Link to="/profile" className="flex items-center gap-1.5 xl:gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full transition-colors truncate max-w-[120px] xl:max-w-none">
                    <User size={18} className="text-primary shrink-0" />
                    <span className="truncate">{displayName || 'User'}</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-sm font-bold text-primary hover:text-accent transition-colors">
                      {lang === 'ar' ? 'لوحة التحكم' : 'Admin'}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                    {lang === 'ar' ? 'خروج' : 'Logout'}
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors">
                    <LogIn size={18} />
                    {lang === 'ar' ? 'دخول' : 'Login'}
                  </Link>
                  <Link to="/signup" className="flex items-center gap-1.5 xl:gap-2 px-4 py-2 xl:px-5 xl:py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                    <User size={18} className="shrink-0" />
                    <span className="whitespace-nowrap">{lang === 'ar' ? 'حساب جديد' : 'Sign Up'}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-primary" />}
              </button>
              <button
                onClick={toggleLang}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              >
                <Globe size={20} className={lang === 'en' ? 'text-primary' : 'text-accent'} />
              </button>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar (Rendered outside nav to avoid backdrop-blur containing block issues) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-80 max-w-[85vw] bg-white dark:bg-midnight shadow-2xl z-[70] overflow-y-auto flex flex-col lg:hidden`}
            >
              <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {lang === 'ar' ? 'القائمة' : 'Menu'}
                </span>
                <button onClick={closeMenu} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="px-5 pt-6 pb-12 flex flex-col flex-1">
                <div className="space-y-2 flex-1">
                  <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>
                    <Home size={22} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                    {lang === 'ar' ? 'الرئيسية' : 'Home'}
                  </NavLink>
                  <NavLink to="/brands" className={mobileNavLinkClass} onClick={closeMenu}>
                    <Tags size={22} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                    {lang === 'ar' ? 'الماركات' : 'Brands'}
                  </NavLink>
                  <NavLink to="/services" className={mobileNavLinkClass} onClick={closeMenu}>
                    <Wrench size={22} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                    {lang === 'ar' ? 'خدماتنا' : 'Services'}
                  </NavLink>
                  <NavLink to="/about" onClick={closeMenu} className={mobileNavLinkClass}>
                    <Info size={22} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                    {lang === 'ar' ? 'من نحن' : 'About Us'}
                  </NavLink>
                  {(user?.role === 'technician' || user?.role === 'admin') && (
                    <NavLink to="/technician" onClick={closeMenu} className={mobileNavLinkClass}>
                      <ShieldCheck size={22} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                      {lang === 'ar' ? 'بوابة الفنيين' : 'Technicians'}
                    </NavLink>
                  )}
                  <NavLink to="/testimonials" className={mobileNavLinkClass} onClick={closeMenu}>
                    <MessageSquare size={22} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                    {lang === 'ar' ? 'آراء العملاء' : 'Testimonials'}
                  </NavLink>
                </div>
                
                <div className="my-6 border-t border-slate-200/60 dark:border-slate-800/60 w-full mx-auto"></div>
                
                <div className="flex flex-col gap-3 mt-auto">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={closeMenu} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg transition-colors shadow-sm">
                        <User size={22} className="text-primary shrink-0" />
                        <span className="truncate">{displayName || 'User'}</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={closeMenu} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 text-primary dark:text-primary-light font-bold text-lg transition-colors">
                          <ShieldCheck size={22} />
                          {lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 font-bold text-lg transition-colors mt-1">
                        <LogOut size={22} />
                        {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl border-2 border-primary/20 dark:border-accent/20 bg-white dark:bg-midnight hover:bg-slate-50 dark:hover:bg-slate-800 text-primary dark:text-accent font-bold text-lg transition-colors shadow-sm">
                        <LogIn size={22} />
                        {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                      </Link>
                      <Link to="/signup" onClick={closeMenu} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                        <User size={22} />
                        {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
