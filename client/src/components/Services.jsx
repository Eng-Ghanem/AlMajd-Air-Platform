import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wrench, Wind, Snowflake, Droplets } from 'lucide-react';

const MotionLink = motion(Link);

export default function Services({ lang, hideTitle = false, titleAr, titleEn, subtitleAr, subtitleEn }) {
  const isAr = lang === 'ar';

  const services = [
    {
      id: 11,
      title: isAr ? 'التأسيس والتركيب' : 'Installation & Setup',
      description: isAr 
        ? 'نقوم بتأسيس مسارات النحاس وتركيب جميع أنواع المكيفات باحترافية عالية لضمان أفضل أداء.' 
        : 'We lay copper tracks and install all types of ACs with high professionalism for optimal performance.',
      icon: <Wrench size={40} className="text-accent group-hover:text-primary transition-colors duration-500" />
    },
    {
      id: 12,
      title: isAr ? 'الصيانة الدورية' : 'Regular Maintenance',
      description: isAr
        ? 'فحص شامل للمكيفات وإصلاح الأعطال قبل تفاقمها لضمان هواء نقي وكفاءة تبريد مستمرة.'
        : 'Comprehensive AC inspection and fault repair before they escalate to ensure pure air and continuous cooling efficiency.',
      icon: <Wind size={40} className="text-accent group-hover:text-primary transition-colors duration-500" />
    },
    {
      id: 13,
      title: isAr ? 'شحن الفريون' : 'Freon Charging',
      description: isAr
        ? 'نقدم خدمة شحن فريون عالي الجودة مع فحص التسريبات لضمان تبريد ممتاز وتقليل استهلاك الكهرباء.'
        : 'We provide high-quality freon charging service with leak checks to ensure excellent cooling and reduce electricity consumption.',
      icon: <Snowflake size={40} className="text-accent group-hover:text-primary transition-colors duration-500" />
    },
    {
      id: 14,
      title: isAr ? 'تنظيف وغسيل الوحدات' : 'Units Cleaning & Washing',
      description: isAr
        ? 'غسيل احترافي للوحدات الداخلية والخارجية بالمعدات المتطورة لإزالة الأتربة والبكتيريا.'
        : 'Professional washing of indoor and outdoor units with advanced equipment to remove dust and bacteria.',
      icon: <Droplets size={40} className="text-accent group-hover:text-primary transition-colors duration-500" />
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-white dark:bg-midnight-lighter">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideTitle && (
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              {isAr ? (titleAr || 'خدماتنا المميزة') : (titleEn || 'Our Premium Services')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light"
            >
              {isAr 
                ? (subtitleAr || 'نقدم مجموعة متكاملة من الحلول الذكية لصيانة وتركيب التكييفات بأعلى معايير الجودة.') 
                : (subtitleEn || 'We offer a comprehensive suite of smart solutions for AC maintenance and installation with the highest quality standards.')}
            </motion.p>
          </div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <MotionLink
              to={`/service-options/${service.id}`}
              key={service.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="group relative p-8 rounded-3xl bg-slate-50/50 dark:bg-midnight/50 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,180,216,0.15)] dark:hover:shadow-[0_8px_30px_rgba(0,180,216,0.2)] transition-all duration-500 overflow-hidden block"
            >
              {/* Inner Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="mb-8 relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-midnight-lighter border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                 {/* Icon Background Glow */}
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-500 relative z-10">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light relative z-10">
                {service.description}
              </p>
              
              {/* Decorative Number */}
              <div className="absolute bottom-4 right-8 opacity-5 text-8xl font-black text-slate-900 dark:text-white pointer-events-none select-none transition-opacity duration-500 group-hover:opacity-10">
                0{index + 1}
              </div>
            </MotionLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
