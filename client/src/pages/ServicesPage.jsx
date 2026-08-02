import React from 'react';
import Services from '../components/Services';
import ServiceOptions from '../components/ServiceOptions';
import PageHeader from '../components/PageHeader';

export default function ServicesPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-20">
      <PageHeader 
        title={isAr ? 'خدماتنا' : 'Our Services'} 
        description={isAr ? 'نقدم مجموعة متكاملة من خدمات التكييف لتلبية كافة احتياجاتك باحترافية وسرعة.' : 'We offer a comprehensive range of AC services to meet all your needs professionally and swiftly.'} 
      />
      <div className="-mt-16 relative z-20">
        <Services 
          lang={lang} 
          titleAr="خدمات الصيانة والتركيب"
          titleEn="Maintenance & Installation Services"
          subtitleAr="حلول متكاملة لصيانة وتنظيف وتجهيز أجهزة التكييف لضمان أعلى كفاءة وعمر افتراضي أطول."
          subtitleEn="Comprehensive solutions for maintenance, cleaning, and setup of AC units to ensure highest efficiency and longer lifespan."
        />
        <ServiceOptions 
          lang={lang}
          titleAr="شراء وتوريد التكييفات"
          titleEn="AC Purchase & Supply"
          subtitleAr="اختر نظام الشراء الأنسب لك، سواء كنت ترغب في التوريد والتركيب أو التوريد فقط حتى باب المنزل."
          subtitleEn="Choose the purchase system that suits you best, whether you want supply and installation or just supply to your doorstep."
        />
      </div>
    </main>
  );
}
