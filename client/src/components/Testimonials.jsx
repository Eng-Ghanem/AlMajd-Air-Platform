import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Quote } from 'lucide-react';

export default function Testimonials({ lang }) {
  const isAr = lang === 'ar';

  const testimonials = [
    {
      id: 1,
      name: isAr ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: isAr ? 'عميل سكن' : 'Home Owner',
      text: isAr 
        ? 'خدمة ممتازة وسرعة في الاستجابة. الفنيون محترفون جداً وتم تركيب التكييف بدون أي فوضى.' 
        : 'Excellent service and fast response. The technicians are very professional and the AC was installed without any mess.',
      rating: 5,
    },
    {
      id: 2,
      name: isAr ? 'سارة عبدالله' : 'Sarah Abdallah',
      role: isAr ? 'صاحبة شركة' : 'Business Owner',
      text: isAr
        ? 'نتعامل مع المجد اير لصيانة كافة مكيفات الشركة. التزام بالمواعيد وجودة لا يعلى عليها.'
        : 'We work with AlMajd Air for all our company AC maintenance. Punctual and unbeatable quality.',
      rating: 5,
    },
    {
      id: 3,
      name: isAr ? 'محمود طارق' : 'Mahmoud Tarek',
      role: isAr ? 'عميل سكن' : 'Home Owner',
      text: isAr
        ? 'كان عندي مشكلة معقدة في التكييف المركزي، وفريق المجد اير قدر يحلها في وقت قياسي. شكراً لكم!'
        : 'I had a complex issue with my central AC, and the AlMajd Air team solved it in record time. Thank you!',
      rating: 4,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 40, damping: 15 }
    }
  };

  return (
    <section className="py-24 relative bg-slate-50 dark:bg-midnight overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {isAr ? 'آراء عملائنا وفيديوهات تعريفية' : 'Testimonials & Video Showcases'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light"
          >
            {isAr 
              ? 'شاهد كيف نقدم خدماتنا باحترافية، وتعرف على تجارب عملائنا المميزة معنا.' 
              : 'Watch how we deliver our services professionally, and learn about our customers\' exceptional experiences.'}
          </motion.p>
        </div>

        {/* Video Showcase Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-24 relative max-w-5xl mx-auto"
        >
          {/* Custom Video Placeholder */}
          <div className="group relative aspect-video rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-[0_20px_50px_rgba(0,180,216,0.2)] border border-slate-700/50 cursor-pointer">
            {/* Thumbnail Image */}
            <img 
              src="/images/ac_installation_1783547788466.png" 
              alt="AC Installation Showcase" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Dark Overlay with Blur */}
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent opacity-90 z-10"></div>
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-primary/90 group-hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(0,180,216,0.4)] group-hover:shadow-[0_0_60px_rgba(0,180,216,0.8)]">
                <Play size={40} className="text-white ml-2" fill="currentColor" />
              </div>
            </div>

            {/* Video Title */}
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {isAr ? 'كيف يتم تركيب وتأسيس المكيفات بخطوات احترافية؟' : 'How AC Installation is Done Professionally?'}
              </h3>
              <p className="text-slate-300 font-medium">
                {isAr ? 'لمحة سريعة لعملية التأسيس' : 'A quick glimpse of the setup process'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="relative p-10 rounded-[2.5rem] bg-white dark:bg-midnight-lighter border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(2,62,138,0.15)] dark:hover:shadow-[0_20px_50px_rgba(2,62,138,0.2)] transition-all duration-500 group"
            >
              <Quote size={40} className="absolute top-8 right-8 text-slate-100 dark:text-slate-800 rotate-180 group-hover:text-primary/10 transition-colors duration-500" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < testimonial.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"} 
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg font-light relative z-10">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
