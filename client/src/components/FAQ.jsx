import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ({ lang }) {
  const isAr = lang === 'ar';
  
  const faqs = [
    {
      id: 1,
      questionAr: 'كم تستغرق عملية تركيب التكييف؟',
      questionEn: 'How long does the AC installation take?',
      answerAr: 'عادة ما تستغرق عملية التركيب من ساعة إلى ساعتين، حسب طبيعة المكان والمسافة بين الوحدة الداخلية والخارجية.',
      answerEn: 'Usually, the installation process takes from one to two hours, depending on the site conditions and the distance between the indoor and outdoor units.'
    },
    {
      id: 2,
      questionAr: 'هل توفرون ضمان على أجهزة التكييف وقطع الغيار؟',
      questionEn: 'Do you provide a warranty on AC units and spare parts?',
      answerAr: 'نعم، جميع أجهزة التكييف التي نوردها تأتي بضمان الوكيل الرسمي (يصل لـ 5 سنوات). كما نوفر ضماناً على جميع قطع الغيار المستبدلة والتركيب.',
      answerEn: 'Yes, all AC units we supply come with the official dealer warranty (up to 5 years). We also provide a warranty on all replaced spare parts and installation.'
    },
    {
      id: 3,
      questionAr: 'ما هي طرق الدفع المتاحة؟',
      questionEn: 'What are the available payment methods?',
      answerAr: 'نوفر طرق دفع متعددة لتسهيل الأمر عليك، منها الدفع النقدي عند الاستلام/التركيب، التحويلات البنكية، والمحافظ الإلكترونية.',
      answerEn: 'We offer multiple payment methods for your convenience, including Cash on Delivery/Installation, bank transfers, and e-wallets.'
    },
    {
      id: 4,
      questionAr: 'هل تقومون بعمليات الصيانة الدورية وشحن الفريون؟',
      questionEn: 'Do you perform regular maintenance and Freon charging?',
      answerAr: 'بالتأكيد، لدينا فرق متخصصة للصيانة الدورية، غسيل الوحدات بالكيماوي، وشحن الفريون لضمان أعلى كفاءة لجهازك.',
      answerEn: 'Absolutely, we have specialized teams for regular maintenance, chemical unit cleaning, and Freon charging to ensure the highest efficiency for your device.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white dark:bg-midnight transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-slate-500 dark:text-slate-400 font-light"
          >
            {isAr ? 'كل ما تحتاج لمعرفته حول خدماتنا' : 'Everything you need to know about our services'}
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'bg-slate-50 dark:bg-midnight-lighter shadow-md border-primary/50' : 'bg-white dark:bg-midnight hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 flex items-center justify-between text-start focus:outline-none"
              >
                <span className={`text-lg font-bold transition-colors duration-300 ${activeIndex === index ? 'text-primary dark:text-accent' : 'text-slate-800 dark:text-slate-200'}`}>
                  {isAr ? faq.questionAr : faq.questionEn}
                </span>
                <ChevronDown 
                  className={`shrink-0 text-slate-400 transition-transform duration-500 ${activeIndex === index ? (isAr ? '-rotate-180 text-primary' : 'rotate-180 text-primary') : ''}`} 
                  size={24} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 font-light leading-relaxed border-t border-slate-100 dark:border-slate-800/50 mt-2">
                      {isAr ? faq.answerAr : faq.answerEn}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
