import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon, Sun, Globe, Menu, X, User, LogIn } from 'lucide-react';

export default function Navbar({ lang, setLang, theme, setTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    `relative py-2 text-sm uppercase tracking-wider font-semibold transition-colors duration-300 ${
      isActive ? 'text-primary dark:text-accent' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent'
    } group`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-300 ${
      isActive ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-midnight/80 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={closeMenu}>
            <img 
              src="/images/logo.png" 
              alt="AlMajd Air Logo" 
              className="h-10 w-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-lg"
            />
            <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500">
              {lang === 'ar' ? 'المجد اير' : 'AlMajd Air'}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
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
            <NavLink to="/testimonials" className={navLinkClass}>
              {lang === 'ar' ? 'آراء العملاء' : 'Testimonials'}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </NavLink>
          </div>

          {/* Desktop Menu & Toggles */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-sm"
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

            <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors">
              <LogIn size={18} />
              {lang === 'ar' ? 'دخول' : 'Login'}
            </Link>
            <Link to="/signup" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold hover:scale-105 transition-all shadow-md">
              <User size={18} />
              {lang === 'ar' ? 'حساب جديد' : 'Sign Up'}
            </Link>
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-midnight border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[calc(100vh-80px)] transition-all">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </NavLink>
            <NavLink to="/brands" className={mobileNavLinkClass} onClick={closeMenu}>
              {lang === 'ar' ? 'الماركات' : 'Brands'}
            </NavLink>
            <NavLink to="/services" className={mobileNavLinkClass} onClick={closeMenu}>
              {lang === 'ar' ? 'خدماتنا' : 'Services'}
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMenu}>
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </NavLink>
            <NavLink to="/testimonials" className={mobileNavLinkClass} onClick={closeMenu}>
              {lang === 'ar' ? 'آراء العملاء' : 'Testimonials'}
            </NavLink>
            
            <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>
            
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-primary dark:border-accent text-primary dark:text-accent font-bold">
                <LogIn size={20} />
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Link>
              <Link to="/signup" onClick={closeMenu} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md">
                <User size={20} />
                {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
