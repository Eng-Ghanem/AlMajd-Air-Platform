import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, description }) {
  return (
    <div className="relative overflow-hidden bg-slate-900 pt-32 pb-24 border-b border-slate-800">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-6"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
