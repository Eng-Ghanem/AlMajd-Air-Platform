import React from 'react';
import { motion } from 'framer-motion';
import { PackageCheck, Home, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceOptions({ lang }) {
  const isAr = lang === 'ar';

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
            {isAr ? 'طرق الخدمة' : 'Service Options'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light"
          >
            {isAr 
              ? 'اختر الطريقة التي تناسب احتياجاتك من بين خياراتنا المتعددة والمريحة.' 
              : 'Choose the method that fits your needs from our multiple and convenient options.'}
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
            <Link to={`/service-options/${option.id}`} key={option.id} className="block group">
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
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
