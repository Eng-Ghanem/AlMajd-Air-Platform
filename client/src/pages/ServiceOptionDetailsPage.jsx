import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, PackageCheck, Home, Wrench, CreditCard, Banknote, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SmartPaymentSystem from '../components/SmartPaymentSystem';
import { supabase } from '../lib/supabase';

export default function ServiceOptionDetailsPage({ lang }) {
  const { id } = useParams();
  const isAr = lang === 'ar';

  const [basePrice, setBasePrice] = useState(id === '3' || parseInt(id) >= 11 ? 500 : 0);

  useEffect(() => {
    if (id === '3' || parseInt(id) >= 11) {
      supabase.from('device_prices').select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          let serviceDbId = 'service_maintenance';
          if (id === '11') serviceDbId = 'service_installation';
          else if (id === '12' || id === '3') serviceDbId = 'service_maintenance';
          else if (id === '13') serviceDbId = 'service_freon';
          else if (id === '14') serviceDbId = 'service_cleaning';

          const service = data.find(p => p.id === serviceDbId);
          if (service) {
            const finalPrice = service.price - (service.price * (service.discount_percentage / 100));
            setBasePrice(finalPrice);
          }
        })
        .catch(err => console.error('Failed to load service price', err));
    } else {
      setBasePrice(0);
    }
  }, [id]);

  // Hardcoded detailed data for demonstration
  const optionsData = {
    '1': {
      title: isAr ? 'توريد وتركيب' : 'Supply & Installation',
      color: 'from-primary to-primary-light',
      icon: <PackageCheck size={64} className="text-white" />,
      descriptionAr: 'نقوم بتوفير جهاز التكييف المناسب لمساحتك، ثم إرسال فريق من المهندسين والفنيين المتخصصين لتركيبه وتشغيله والتأكد من كفاءته.',
      descriptionEn: 'We provide the right AC unit for your space, then send a team of specialized engineers and technicians to install, operate, and ensure its efficiency.',
      stepsAr: ['معاينة المكان', 'اختيار الجهاز المناسب', 'التوريد السريع', 'التركيب والتشغيل', 'المتابعة بعد البيع'],
      stepsEn: ['Site inspection', 'Choosing the right unit', 'Fast supply', 'Installation and operation', 'After-sales follow-up'],
      paymentMethodsAr: ['دفع كاش عند التركيب', 'دفع إلكتروني مقدم (محافظ كاش/إنستاباي)'],
      paymentMethodsEn: ['Cash on Installation', 'Online Prepaid (Wallets/InstaPay)'],
    },
    '2': {
      title: isAr ? 'توريد لحد البيت بس' : 'Supply to Home Only',
      color: 'from-accent-dark to-accent',
      icon: <Home size={64} className="text-white" />,
      descriptionAr: 'نوفر لك جهاز التكييف الذي تختاره بأسعار الجملة ونقوم بتوصيله وتأمينه حتى باب منزلك دون تدخل منا في عملية التركيب.',
      descriptionEn: 'We provide the AC unit of your choice at wholesale prices and deliver it safely to your door without our intervention in the installation process.',
      stepsAr: ['تأكيد الطلب', 'تجهيز الجهاز من المخازن', 'الشحن السريع والآمن', 'التسليم عند باب المنزل'],
      stepsEn: ['Order confirmation', 'Preparing the unit from warehouses', 'Fast and safe shipping', 'Delivery at doorstep'],
      paymentMethodsAr: ['دفع إلكتروني مقدم لضمان الجدية', 'الدفع عند الاستلام (بشروط)'],
      paymentMethodsEn: ['Online Prepaid for confirmation', 'Cash on Delivery (conditions apply)'],
    },
    '3': {
      title: isAr ? 'خدمات الصيانة الدورية والفورية' : 'Regular & Immediate Maintenance',
      color: 'from-primary to-accent',
      icon: <Wrench size={64} className="text-white" />,
      descriptionAr: 'نقدم خدمات الصيانة الدورية للحفاظ على كفاءة جهازك، بالإضافة إلى خدمة الإصلاح الفوري لأي أعطال بواسطة مهندسين متخصصين باستخدام قطع غيار أصلية.',
      descriptionEn: 'We offer regular maintenance to keep your device efficient, plus immediate repair for any faults by specialized engineers using original spare parts.',
      stepsAr: ['تسجيل طلب الصيانة', 'تحديد موعد الزيارة', 'الفحص وتحديد العطل', 'الإصلاح أو الصيانة الدورية'],
      stepsEn: ['Register maintenance request', 'Schedule visit', 'Inspection and fault diagnosis', 'Repair or regular maintenance'],
      paymentMethodsAr: ['الدفع بعد إتمام الصيانة', 'دفع إلكتروني مقدم'],
      paymentMethodsEn: ['Payment after maintenance', 'Online Prepaid'],
    },
    '11': {
      title: isAr ? 'التأسيس والتركيب' : 'Installation & Setup',
      color: 'from-blue-600 to-blue-400',
      icon: <Wrench size={64} className="text-white" />,
      descriptionAr: 'نقوم بتأسيس مسارات النحاس وتركيب جميع أنواع المكيفات باحترافية عالية لضمان أفضل أداء.',
      descriptionEn: 'We lay copper tracks and install all types of ACs with high professionalism for optimal performance.',
      stepsAr: ['معاينة الموقع', 'تجهيز مسارات النحاس', 'التركيب الاحترافي', 'التشغيل والاختبار'],
      stepsEn: ['Site inspection', 'Preparing copper tracks', 'Professional installation', 'Testing & operation'],
      paymentMethodsAr: ['الدفع بعد إتمام الخدمة', 'دفع إلكتروني مقدم'],
      paymentMethodsEn: ['Payment after service', 'Online Prepaid']
    },
    '12': {
      title: isAr ? 'الصيانة الدورية' : 'Regular Maintenance',
      color: 'from-accent-dark to-accent',
      icon: <Wrench size={64} className="text-white" />,
      descriptionAr: 'فحص شامل للمكيفات وإصلاح الأعطال قبل تفاقمها لضمان هواء نقي وكفاءة تبريد مستمرة.',
      descriptionEn: 'Comprehensive AC inspection and fault repair before they escalate to ensure pure air and continuous cooling efficiency.',
      stepsAr: ['الفحص الشامل', 'تنظيف الفلاتر', 'مراجعة الدوائر', 'الاختبار والتسليم'],
      stepsEn: ['Comprehensive check', 'Cleaning filters', 'Circuit review', 'Testing and handover'],
      paymentMethodsAr: ['الدفع بعد إتمام الصيانة', 'دفع إلكتروني مقدم'],
      paymentMethodsEn: ['Payment after maintenance', 'Online Prepaid']
    },
    '13': {
      title: isAr ? 'شحن الفريون' : 'Freon Charging',
      color: 'from-cyan-600 to-cyan-400',
      icon: <Wrench size={64} className="text-white" />,
      descriptionAr: 'نقدم خدمة شحن فريون عالي الجودة مع فحص التسريبات لضمان تبريد ممتاز وتقليل استهلاك الكهرباء.',
      descriptionEn: 'We provide high-quality freon charging service with leak checks to ensure excellent cooling and reduce electricity consumption.',
      stepsAr: ['قياس مستوى الفريون', 'فحص التسريبات', 'الشحن الآمن', 'مراجعة التبريد'],
      stepsEn: ['Measure freon level', 'Leak check', 'Safe charging', 'Cooling review'],
      paymentMethodsAr: ['الدفع بعد إتمام الخدمة', 'دفع إلكتروني مقدم'],
      paymentMethodsEn: ['Payment after service', 'Online Prepaid']
    },
    '14': {
      title: isAr ? 'تنظيف وغسيل الوحدات' : 'Units Cleaning & Washing',
      color: 'from-teal-600 to-teal-400',
      icon: <Wrench size={64} className="text-white" />,
      descriptionAr: 'غسيل احترافي للوحدات الداخلية والخارجية بالمعدات المتطورة لإزالة الأتربة والبكتيريا.',
      descriptionEn: 'Professional washing of indoor and outdoor units with advanced equipment to remove dust and bacteria.',
      stepsAr: ['فك الأغطية', 'غسيل الوحدة الداخلية', 'غسيل الوحدة الخارجية', 'التجفيف والتشغيل'],
      stepsEn: ['Remove covers', 'Wash indoor unit', 'Wash outdoor unit', 'Drying and operation'],
      paymentMethodsAr: ['الدفع بعد إتمام الخدمة', 'دفع إلكتروني مقدم'],
      paymentMethodsEn: ['Payment after service', 'Online Prepaid']
    }
  };

  const option = optionsData[id];

  if (!option) {
    return (
      <main className="py-32 text-center min-h-screen bg-slate-50 dark:bg-midnight">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {isAr ? 'لم يتم العثور على الخدمة' : 'Service not found'}
        </h1>
        <Link to="/services" className="text-primary hover:underline">
          {isAr ? 'العودة للخدمات' : 'Back to Services'}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-24">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${option.color} pt-32 pb-24`}>
        <div className="absolute inset-0 bg-midnight/20 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-32 h-32 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-2xl"
          >
            {option.icon}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black text-white mb-4 drop-shadow-lg"
          >
            {option.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white dark:bg-midnight-lighter rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-12 lg:p-16">
          
          <Link to="/services" className="inline-flex items-center gap-2 text-primary dark:text-accent font-semibold hover:underline mb-10">
            {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span>{isAr ? 'العودة للخدمات' : 'Back to Services'}</span>
          </Link>
          
          <div className="flex flex-col gap-12">
            {/* Details & Steps - Side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* About Service */}
              <div className="bg-white dark:bg-midnight/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Info size={20} />
                  </span>
                  {isAr ? 'عن الخدمة' : 'About Service'}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isAr ? option.descriptionAr : option.descriptionEn}
                </p>
              </div>

              {/* Execution Steps */}
              <div className="bg-white dark:bg-midnight/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </span>
                  {isAr ? 'خطوات التنفيذ' : 'Execution Steps'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(isAr ? option.stepsAr : option.stepsEn).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Payment & Booking System */}
            <div>
              <SmartPaymentSystem 
                isAr={isAr} 
                optionTitle={option.title} 
                basePrice={basePrice} 
                requiresDeviceSelection={id === '1' || id === '2'} 
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
