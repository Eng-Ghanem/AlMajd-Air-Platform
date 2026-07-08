import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon, Sun, Globe } from 'lucide-react';


export default function Navbar({ lang, setLang, theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const navLinkClass = ({ isActive }) => 
    `relative py-2 text-sm uppercase tracking-wider font-semibold transition-colors duration-300 ${
      isActive ? 'text-primary dark:text-accent' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent'
    } group`;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-midnight/80 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <img 
              src="/images/logo.png" 
              alt="AlMajd Air Logo" 
              className="h-10 w-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-lg"
            />
            <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500">
              {lang === 'ar' ? 'المجد اير' : 'AlMajd Air'}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
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
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-sm"
              aria-label="Toggle Language"
            >
              <Globe size={18} className="text-primary dark:text-accent" />
              <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-primary" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
