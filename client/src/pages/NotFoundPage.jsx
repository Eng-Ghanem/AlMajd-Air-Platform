import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-midnight transition-colors duration-500 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          {isAr ? 'عذراً، الصفحة غير موجودة' : 'Oops, Page Not Found'}
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">
          {isAr 
            ? 'يبدو أنك ضللت الطريق. الصفحة التي تبحث عنها غير موجودة أو تم نقلها لمكان آخر.'
            : 'It looks like you got lost. The page you are looking for does not exist or has been moved.'}
        </p>
        <Link 
          to="/" 
          className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,180,216,0.6)]"
        >
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </motion.div>
    </main>
  );
}
