import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServiceSelectionModal from './ServiceSelectionModal';

export default function Brands({ lang }) {
  const isAr = lang === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');

  const capacities = ['1.5', '2.25', '3', '4', '5'];

  const handleSelectCapacity = (e, brandName, capacity) => {
    e.preventDefault(); // Prevent navigating to brand details page
    setSelectedBrand(brandName);
    setSelectedCapacity(capacity);
    setIsModalOpen(true);
  };

  const brands = [
    { 
      id: 'carrier', 
      name: 'Carrier', 
      color: 'from-primary to-primary-light',
      image: '/images/carrier_ac_1783547796361.png',
      descAr: 'تكنولوجيا متقدمة وكفاءة طاقة لا مثيل لها، الخيار الأول للتبريد الفائق.',
      descEn: 'Advanced technology and unmatched energy efficiency, the premier choice for superior cooling.'
    },
    { 
      id: 'midea', 
      name: 'Midea', 
      color: 'from-accent-dark to-accent',
      image: '/images/midea_ac_1783547830436.png',
      descAr: 'تصميم انسيابي هادئ وأداء متين يدوم طويلاً، لراحة تدوم كل فصول السنة.',
      descEn: 'Quiet aerodynamic design and durable performance for year-round comfort.'
    },
    { 
      id: 'freeair', 
      name: 'Free Air', 
      color: 'from-blue-600 to-cyan-400',
      image: '/images/freeair_ac_1783547837994.png',
      descAr: 'البساطة والاعتمادية بأسعار تنافسية. تبريد منعش يناسب جميع المساحات.',
      descEn: 'Simplicity and reliability at competitive prices. Refreshing cooling for all spaces.'
    },
    { 
      id: 'haier', 
      name: 'Haier', 
      color: 'from-indigo-600 to-blue-500',
      image: '/images/haier_ac_1783547846795.png',
      descAr: 'ابتكارات ذكية وتصميمات أنيقة تتناسب مع ديكور منزلك العصري.',
      descEn: 'Smart innovations and elegant designs that complement your modern home decor.'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  return (
    <section className="py-24 relative bg-slate-50 dark:bg-midnight overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {isAr ? 'ماركات التكييفات العالمية' : 'Global AC Brands'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {isAr 
              ? 'نضع بين يديك أحدث التقنيات من أقوى الشركات العالمية لضمان تجربة تبريد لا تضاهى وعمر افتراضي طويل.' 
              : 'We bring you the latest technologies from the world\'s leading companies to ensure an unmatched cooling experience and long lifespan.'}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {brands.map((brand) => (
            <Link to={`/brands/${brand.id}`} key={brand.id} className="block group">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative flex flex-col rounded-[2rem] bg-white dark:bg-midnight-lighter border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,180,216,0.2)] transition-all duration-500 h-full"
              >
                {/* Image Container */}
                <div className="h-56 overflow-hidden relative bg-slate-900">
                  <img 
                    src={brand.image} 
                    alt={brand.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-lighter dark:from-midnight-lighter via-transparent to-transparent opacity-80"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} mix-blend-overlay opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                </div>

                {/* Text Content */}
                <div className="p-8 relative z-10 flex flex-col flex-grow">
                  <h3 className="text-3xl font-black tracking-widest text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-500 uppercase">
                    {brand.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed flex-grow">
                    {isAr ? brand.descAr : brand.descEn}
                  </p>
                  
                  {/* Learn More Arrow (Decorative) */}
                  <div className="mt-6 flex items-center justify-between text-primary dark:text-accent font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="flex items-center gap-2">
                      <span>{isAr ? 'اكتشف المزيد' : 'Discover More'}</span>
                      <span className={isAr ? 'rotate-180' : ''}>&rarr;</span>
                    </span>
                  </div>
                  
                  {/* Capacities Hover Menu */}
                  <div className="absolute left-0 right-0 bottom-0 bg-white/95 dark:bg-midnight/95 backdrop-blur-md p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-b-[2rem] border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    <p className="text-center font-bold text-slate-900 dark:text-white mb-2">
                      {isAr ? 'اختر قدرة التكييف (حصان):' : 'Select AC Capacity (HP):'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {capacities.map(cap => (
                        <button
                          key={cap}
                          onClick={(e) => handleSelectCapacity(e, brand.name, cap)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors shadow-sm"
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subtle Border Glow on Hover */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-primary/50 dark:group-hover:border-accent/30 rounded-[2rem] pointer-events-none transition-colors duration-500`}></div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      <ServiceSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBrand={selectedBrand}
        selectedCapacity={selectedCapacity}
        lang={lang}
      />
    </section>
  );
}
