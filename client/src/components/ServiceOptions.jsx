import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageCheck, Home, Wrench, X, Settings2, ShieldCheck, Wind, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServiceOptions({ lang, titleAr, titleEn, subtitleAr, subtitleEn }) {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const options = [
    {
      id: 1,
      title: isAr ? 'توريد وتركيب' : 'Supply & Installation',
      description: isAr 
        ? 'نوفر لك التكييف ونقوم بتركيبه وتجهيزه للعمل بكفاءة عالية على يد مهندسين خبراء.' 
        : 'We provide the AC, install it, and get it ready to work with high efficiency by expert engineers.',
      icon: <PackageCheck size={36} className="text-white" />,
      color: 'from-primary to-primary-light'
    },
    {
      id: 2,
      title: isAr ? 'توريد لحد البيت بس' : 'Supply to Home Only',
      description: isAr
        ? 'نقوم بتوريد الجهاز وتوصيله حتى باب منزلك مع ضمان سلامة المنتج.'
        : 'We supply the device and deliver it right to your door, guaranteeing product safety.',
      icon: <Home size={36} className="text-white" />,
      color: 'from-accent-dark to-accent'
    },
    {
      id: 3,
      title: isAr ? 'خدمات الصيانة' : 'Maintenance Services',
      description: isAr
        ? 'خدمة صيانة دورية وإصلاح فوري لجميع أعطال التكييفات بقطع غيار أصلية.'
        : 'Regular maintenance and immediate repair service for all AC faults with original spare parts.',
      icon: <Wrench size={36} className="text-white" />,
      color: 'from-primary to-accent'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 50, damping: 20 }
    }
  };

  return (
    <section className="py-24 relative bg-slate-50 dark:bg-midnight overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 dark:bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {isAr ? (titleAr || 'طرق الخدمة') : (titleEn || 'Service Options')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light"
          >
            {isAr 
              ? (subtitleAr || 'اختر الطريقة التي تناسب احتياجاتك من بين خياراتنا المتعددة والمريحة.') 
              : (subtitleEn || 'Choose the method that fits your needs from our multiple and convenient options.')}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {options.map((option) => (
            <div 
              key={option.id} 
              onClick={() => {
                if (option.id === 3) {
                  setShowMaintenanceModal(true);
                } else {
                  navigate(`/service-options/${option.id}`);
                }
              }}
              className="block group cursor-pointer"
            >
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="relative bg-white dark:bg-midnight-lighter rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,180,216,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,180,216,0.2)] transition-all duration-500 border border-slate-100 dark:border-slate-800 h-full"
              >
                {/* Top Colored Bar Glow */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[2.5rem]`}></div>
                
                <div className="mb-8 relative z-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                    {option.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-500 relative z-10">
                  {option.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light relative z-10">
                  {option.description}
                </p>

                {/* Decorative Number */}
                <div className="absolute bottom-4 right-8 opacity-5 text-8xl font-black text-slate-900 dark:text-white pointer-events-none select-none transition-opacity duration-500 group-hover:opacity-10">
                  0{option.id}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Maintenance Sub-options Modal */}
      <AnimatePresence>
        {showMaintenanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMaintenanceModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-midnight border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-3">
                  <Wrench className="text-primary" size={24}/>
                  {isAr ? 'اختر نوع خدمة الصيانة' : 'Select Maintenance Type'}
                </h3>
                <button onClick={() => setShowMaintenanceModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-full transition-colors shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 11, title: isAr ? 'تأسيس وتركيب' : 'Installation & Setup', icon: <Settings2 size={24} /> },
                  { id: 12, title: isAr ? 'صيانة دورية' : 'Regular Maintenance', icon: <ShieldCheck size={24} /> },
                  { id: 13, title: isAr ? 'شحن فريون' : 'Freon Charging', icon: <Wind size={24} /> },
                  { id: 14, title: isAr ? 'تنظيف وغسيل الوحدات' : 'Unit Cleaning', icon: <Droplets size={24} /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/service-options/${item.id}`)}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-right group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
