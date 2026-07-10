import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';


export default function Home({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50 dark:bg-midnight transition-colors duration-500">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_smart_ac_1783547772153.png" 
            alt="Smart AC Interior" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity dark:opacity-40 transition-opacity duration-500"
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-slate-50 dark:from-midnight/90 dark:via-midnight/80 dark:to-midnight"></div>
        </div>

        {/* Abstract Background Orbs (Kept for subtle glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 dark:bg-accent/30 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-tight"
            >
              {isAr ? 'مرحباً بكم في ' : 'Welcome to '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">
                {isAr ? 'المجد اير' : 'AlMajd Air'}
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-2xl sm:text-3xl text-slate-700 dark:text-slate-200 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-md"
            >
              {isAr 
                ? 'منصتك الاحترافية الشاملة لجميع خدمات التكييف. جودة عالية وأداء لا يضاهى يضاهي المعايير العالمية.' 
                : 'Your professional and comprehensive platform for all AC services. High quality and unmatched performance meeting global standards.'}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-14 flex flex-col sm:flex-row justify-center gap-6"
            >
              <a 
                href="#contact" 
                className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,180,216,0.6)] hover:shadow-[0_0_60px_-15px_rgba(0,180,216,0.9)]"
              >
                {isAr ? 'اتصل بنا للحجز' : 'Contact to Book'}
              </a>
              <Link 
                to="/services" 
                className="px-10 py-4 rounded-full bg-white/80 dark:bg-midnight/80 backdrop-blur-md text-slate-900 dark:text-white font-bold text-xl hover:scale-105 transition-all duration-300 shadow-xl border border-slate-200 dark:border-slate-700 hover:border-accent dark:hover:border-accent group"
              >
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                  {isAr ? 'تصفح خدماتنا' : 'Explore Services'}
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Quick Highlights Section */}
      <section className="py-20 bg-white dark:bg-midnight transition-colors duration-500 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Highlight 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2rem] bg-slate-50 dark:bg-midnight-lighter border border-slate-200 dark:border-slate-800 text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {isAr ? 'سرعة في التنفيذ' : 'Fast Execution'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isAr ? 'نلتزم بالمواعيد المحددة وننجز المهام بأعلى سرعة وكفاءة لتوفير وقتك.' : 'We commit to deadlines and complete tasks swiftly to save your time.'}
              </p>
            </motion.div>

            {/* Highlight 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2rem] bg-slate-50 dark:bg-midnight-lighter border border-slate-200 dark:border-slate-800 text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {isAr ? 'جودة معتمدة' : 'Certified Quality'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isAr ? 'نتعامل مع أفضل الماركات العالمية لضمان أجهزة وقطع غيار أصلية 100%.' : 'We deal with the best global brands to ensure 100% original units and parts.'}
              </p>
            </motion.div>

            {/* Highlight 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-[2rem] bg-slate-50 dark:bg-midnight-lighter border border-slate-200 dark:border-slate-800 text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {isAr ? 'فريق هندسي متخصص' : 'Expert Engineering Team'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isAr ? 'فنيون ومهندسون على أعلى مستوى من التدريب لحل أصعب المشاكل باحترافية.' : 'Highly trained technicians and engineers to solve the hardest problems professionally.'}
              </p>
            </motion.div>

          </div>
        </div>
      </section>
      {/* Contact Us Section */}
      <section id="contact" className="py-24 bg-slate-50 dark:bg-midnight overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                {isAr ? 'تواصل معنا' : 'Contact Us'}
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-10">
                {isAr 
                  ? 'نحن هنا لخدمتك على مدار الساعة. تواصل معنا للحجز أو الاستفسار وسيقوم فريقنا بالرد عليك فوراً.' 
                  : 'We are here to serve you around the clock. Contact us for booking or inquiries, and our team will respond immediately.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* WhatsApp Button */}
                <a 
                  href="https://wa.me/201002691611" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_50px_-15px_rgba(34,197,94,0.9)]"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {isAr ? 'واتساب' : 'WhatsApp'}
                </a>
                
                {/* Phone Call Button */}
                <a 
                  href="tel:+201002691611" 
                  className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(0,180,216,0.6)] hover:shadow-[0_0_50px_-15px_rgba(0,180,216,0.9)]"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {isAr ? 'اتصال هاتفي' : 'Phone Call'}
                </a>
              </div>
              
              <p className="mt-10 text-slate-600 dark:text-slate-400 font-bold text-2xl tracking-wider" dir="ltr">
                +20 100 269 1611
              </p>
            </motion.div>

            {/* Right: Contact Form */}
            <div className="w-full">
              <ContactForm lang={lang} />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
