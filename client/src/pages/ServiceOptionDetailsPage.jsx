import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, PackageCheck, Home, Truck, CreditCard, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceOptionDetailsPage({ lang }) {
  const { id } = useParams();
  const isAr = lang === 'ar';

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
      paymentMethodsAr: ['دفع كاش عند التركيب', 'دفع إلكتروني مقدم (فيزا/ماستركارد)'],
      paymentMethodsEn: ['Cash on Installation', 'Online Prepaid (Visa/Mastercard)'],
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
      title: isAr ? 'خدمة توصيل قطع الغيار' : 'Spare Parts Delivery',
      color: 'from-primary to-accent',
      icon: <Truck size={64} className="text-white" />,
      descriptionAr: 'إذا كنت تحتاج إلى قطع غيار أصلية ومضمونة، نوفر لك خدمة التوصيل السريع لجميع قطع الغيار لمختلف ماركات التكييفات.',
      descriptionEn: 'If you need original and guaranteed spare parts, we offer fast delivery service for all spare parts for various AC brands.',
      stepsAr: ['تحديد قطعة الغيار المطلوبة', 'التأكد من التوافر', 'الشحن السريع', 'التسليم والدفع'],
      stepsEn: ['Identify required spare part', 'Check availability', 'Fast shipping', 'Delivery and payment'],
      paymentMethodsAr: ['الدفع عند الاستلام', 'المحافظ الإلكترونية (فودافون كاش وغيرها)'],
      paymentMethodsEn: ['Cash on Delivery', 'E-Wallets (Vodafone Cash, etc.)'],
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Details & Steps */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                {isAr ? 'عن الخدمة' : 'About Service'}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-10">
                {isAr ? option.descriptionAr : option.descriptionEn}
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {isAr ? 'خطوات التنفيذ' : 'Execution Steps'}
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                {(isAr ? option.stepsAr : option.stepsEn).map((step, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-midnight-lighter bg-slate-100 dark:bg-slate-800 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {idx + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-midnight transition-colors">
                      <p className="font-semibold text-slate-900 dark:text-white">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Booking Area */}
            <div className="bg-slate-50 dark:bg-midnight rounded-3xl p-8 border border-slate-200 dark:border-slate-800 h-fit">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <CreditCard className="text-accent" />
                {isAr ? 'طرق الدفع المتاحة' : 'Available Payment Methods'}
              </h3>
              
              <div className="space-y-4 mb-10">
                {(isAr ? option.paymentMethodsAr : option.paymentMethodsEn).map((method, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-midnight-lighter border border-slate-100 dark:border-slate-700 shadow-sm">
                    <Banknote className="text-green-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{method}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                  {isAr ? 'للتأكيد وحجز الخدمة، يرجى التواصل معنا' : 'To confirm and book the service, please contact us'}
                </p>
                <a 
                  href="https://wa.me/201002691611" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {isAr ? 'حجز عبر واتساب' : 'Book via WhatsApp'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
