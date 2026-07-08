import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ShieldCheck, Wrench } from 'lucide-react';

export default function Features({ lang }) {
  const isAr = lang === 'ar';

  const features = [
    {
      id: 1,
      title: isAr ? 'سرعة الاستجابة' : 'Fast Response',
      description: isAr 
        ? 'نصلك في أسرع وقت بمجرد اتصالك لأن راحتك هي أولويتنا القصوى.' 
        : 'We reach you as quickly as possible upon your call because your comfort is our top priority.',
      icon: <Clock size={24} className="text-white" />
    },
    {
      id: 2,
      title: isAr ? 'مهندسون وفنيون خبراء' : 'Expert Engineers & Techs',
      description: isAr
        ? 'فريق عمل مدرب على أعلى مستوى للتعامل مع كافة أعطال التكييف.'
        : 'A highly trained team to handle all types of AC malfunctions.',
      icon: <Users size={24} className="text-white" />
    },
    {
      id: 3,
      title: isAr ? 'قطع غيار أصلية' : 'Original Spare Parts',
      description: isAr
        ? 'نستخدم قطع غيار أصلية معتمدة لضمان أطول فترة عمر للمكيف.'
        : 'We use certified original spare parts to ensure the longest lifespan for the AC.',
      icon: <Wrench size={24} className="text-white" />
    },
    {
      id: 4,
      title: isAr ? 'ضمان على الصيانة' : 'Maintenance Warranty',
      description: isAr
        ? 'نقدم ضماناً حقيقياً على كافة أعمال الصيانة والتركيب التي نقوم بها.'
        : 'We offer a real warranty on all the maintenance and installation work we do.',
      icon: <ShieldCheck size={24} className="text-white" />
    }
  ];

  const leftVariant = {
    hidden: { opacity: 0, x: isAr ? 100 : -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 40, damping: 20, duration: 0.8 }
    }
  };

  const rightVariant = {
    hidden: { opacity: 0, x: isAr ? -100 : 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 40, damping: 20, duration: 0.8 }
    }
  };

  return (
    <section id="features" className="py-24 relative bg-white dark:bg-midnight overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual/Image Side */}
          <motion.div 
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative h-[600px] w-full rounded-[3rem] flex items-end justify-center order-2 lg:order-1 overflow-hidden group shadow-2xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="/images/expert_technician_1783547780235.png" 
                alt="Expert Technician" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent opacity-90 dark:opacity-95"></div>
            </div>

            {/* Central Typography/Icon over the image */}
            <div className="relative z-10 text-center p-10 w-full bg-gradient-to-t from-midnight to-transparent">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent drop-shadow-sm mb-4 tracking-tight">
                {isAr ? 'تميز بلا حدود' : 'Limitless Excellence'}
              </h3>
              <p className="text-slate-200 font-medium text-lg max-w-sm mx-auto leading-relaxed">
                {isAr 
                  ? 'خبرة سنوات نضعها بين يديك لضمان أداء تكييف مثالي وتوفير دائم في الطاقة.' 
                  : 'Years of experience at your fingertips to ensure perfect AC performance and lasting energy savings.'}
              </p>
            </div>
          </motion.div>

          {/* Features List Side */}
          <motion.div 
            variants={rightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              {isAr ? 'لماذا تختار المجد اير؟' : 'Why Choose AlMajd Air?'}
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 font-light leading-relaxed">
              {isAr 
                ? 'لأننا لا نقدم خدمة عادية، بل نقدم تجربة متكاملة تبدأ من أول اتصال وتمتد لما بعد الصيانة.' 
                : 'Because we don\'t just offer a normal service, we offer a complete experience starting from the first call and extending beyond maintenance.'}
            </p>

            <div className="space-y-10">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:shadow-accent/40 transition-all duration-500">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-500">
                      {feature.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
