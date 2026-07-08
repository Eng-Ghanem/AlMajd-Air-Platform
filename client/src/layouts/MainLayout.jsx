import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ lang, setLang, theme, setTheme }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans flex flex-col">
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer lang={lang} />
    </div>
  );
}
