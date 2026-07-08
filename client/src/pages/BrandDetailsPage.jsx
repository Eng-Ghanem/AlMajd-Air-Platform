import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BrandDetailsPage({ lang }) {
  const { id } = useParams();
  const isAr = lang === 'ar';

  // Hardcoded detailed data for demonstration
  const brandsData = {
    carrier: {
      name: 'Carrier',
      color: 'from-primary to-primary-light',
      image: '/images/carrier_ac_1783547796361.png',
      descAr: 'تكنولوجيا متقدمة وكفاءة طاقة لا مثيل لها، الخيار الأول للتبريد الفائق.',
      descEn: 'Advanced technology and unmatched energy efficiency, the premier choice for superior cooling.',
      longDescAr: 'كاريير هي الشركة الرائدة عالمياً في مجال التبريد والتدفئة. بفضل الابتكار المستمر والتكنولوجيا الفائقة، تضمن لك أجهزة كاريير أداءً مستقراً في أصعب الظروف وتوفيراً هائلاً في استهلاك الكهرباء.',
      longDescEn: 'Carrier is the global leader in heating and cooling solutions. With continuous innovation and superior technology, Carrier units ensure stable performance in the toughest conditions and massive energy savings.',
      featuresAr: ['توفير حتى 50% من استهلاك الكهرباء', 'فلاتر منقية للهواء من البكتيريا', 'صوت هادئ جداً أثناء التشغيل', 'ضمان 5 سنوات على الكباس'],
      featuresEn: ['Save up to 50% of energy consumption', 'Air purifying filters from bacteria', 'Ultra-quiet operation', '5-year warranty on the compressor']
    },
    midea: {
      name: 'Midea',
      color: 'from-accent-dark to-accent',
      image: '/images/midea_ac_1783547830436.png',
      descAr: 'تصميم انسيابي هادئ وأداء متين يدوم طويلاً، لراحة تدوم كل فصول السنة.',
      descEn: 'Quiet aerodynamic design and durable performance for year-round comfort.',
      longDescAr: 'ميديا تقدم تشكيلة واسعة من المكيفات التي تجمع بين التصميم العصري الجذاب والتكنولوجيا الموثوقة. مكيفات ميديا مصممة لتدوم وتوفر تبريداً سريعاً وتوزيعاً ذكياً للهواء.',
      longDescEn: 'Midea offers a wide range of air conditioners that combine modern attractive design with reliable technology. Midea units are built to last, providing rapid cooling and smart air distribution.',
      featuresAr: ['تبريد تيربو سريع', 'توزيع هواء ثلاثي الأبعاد', 'خاصية التنظيف الذاتي', 'أسعار اقتصادية تنافسية'],
      featuresEn: ['Turbo fast cooling', '3D air distribution', 'Self-cleaning feature', 'Competitive economic prices']
    },
    freeair: {
      name: 'Free Air',
      color: 'from-blue-600 to-cyan-400',
      image: '/images/freeair_ac_1783547837994.png',
      descAr: 'البساطة والاعتمادية بأسعار تنافسية. تبريد منعش يناسب جميع المساحات.',
      descEn: 'Simplicity and reliability at competitive prices. Refreshing cooling for all spaces.',
      longDescAr: 'مكيفات فري إير توفر الحل الأمثل للباحثين عن الجودة بتكلفة معقولة. أداء قوي يتحمل العمل الشاق، وتصميم بسيط يناسب جميع الديكورات.',
      longDescEn: 'Free Air units provide the perfect solution for those seeking quality at a reasonable cost. Powerful performance built for heavy duty, and a simple design that fits all decors.',
      featuresAr: ['شاشة ديجيتال لعرض درجات الحرارة', 'مقاوم للصدأ والعوامل الجوية', 'صيانة سهلة ومتوفرة', 'تبريد قوي للمساحات الكبيرة'],
      featuresEn: ['Digital display for temperature', 'Rust and weather resistant', 'Easy and available maintenance', 'Powerful cooling for large spaces']
    },
    haier: {
      name: 'Haier',
      color: 'from-indigo-600 to-blue-500',
      image: '/images/haier_ac_1783547846795.png',
      descAr: 'ابتكارات ذكية وتصميمات أنيقة تتناسب مع ديكور منزلك العصري.',
      descEn: 'Smart innovations and elegant designs that complement your modern home decor.',
      longDescAr: 'تتميز هاير بتقنياتها الذكية مثل الواي فاي والتحكم عن بعد من الهاتف المحمول. أجهزة هاير مصممة لتكون جزءاً من منزلك الذكي مع تصميمات فضية ومعدنية غاية في الأناقة.',
      longDescEn: 'Haier stands out with smart technologies like Wi-Fi and mobile app control. Haier devices are designed to be part of your smart home with highly elegant silver and metallic designs.',
      featuresAr: ['تحكم ذكي عبر الواي فاي', 'تصميمات معدنية وفضية بريميوم', 'تدفق هواء طويل المدى', 'تشغيل ذكي وصديق للبيئة'],
      featuresEn: ['Smart Wi-Fi control', 'Premium metallic and silver designs', 'Long-distance airflow', 'Smart and eco-friendly operation']
    }
  };

  const brand = brandsData[id];

  if (!brand) {
    return (
      <main className="py-32 text-center min-h-screen bg-slate-50 dark:bg-midnight">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {isAr ? 'لم يتم العثور على الماركة' : 'Brand not found'}
        </h1>
        <Link to="/brands" className="text-primary hover:underline">
          {isAr ? 'العودة للماركات' : 'Back to Brands'}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-24">
      {/* Dynamic Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${brand.color} pt-32 pb-24`}>
        <div className="absolute inset-0 bg-midnight/30 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black text-white uppercase tracking-widest drop-shadow-xl"
          >
            {brand.name}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white dark:bg-midnight-lighter rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-12 lg:p-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Section */}
            <motion.div 
              initial={{ opacity: 0, x: isAr ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl overflow-hidden shadow-2xl relative group bg-slate-900"
            >
              <img 
                src={brand.image} 
                alt={brand.name} 
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent"></div>
            </motion.div>

            {/* Details Section */}
            <motion.div 
              initial={{ opacity: 0, x: isAr ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/brands" className="inline-flex items-center gap-2 text-primary dark:text-accent font-semibold hover:underline mb-8">
                {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                <span>{isAr ? 'العودة للماركات' : 'Back to Brands'}</span>
              </Link>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {isAr ? 'لماذا تختار ' : 'Why Choose '} {brand.name}؟
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 font-light leading-relaxed mb-10">
                {isAr ? brand.longDescAr : brand.longDescEn}
              </p>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {isAr ? 'أهم المميزات' : 'Key Features'}
              </h3>
              
              <ul className="space-y-4">
                {(isAr ? brand.featuresAr : brand.featuresEn).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                    <CheckCircle className="text-green-500 shrink-0" size={24} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
                <a 
                  href="#contact" 
                  className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-xl hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  {isAr ? `احجز تكييف ${brand.name} الآن` : `Book ${brand.name} Now`}
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
