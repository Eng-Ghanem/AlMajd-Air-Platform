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
        <Services lang={lang} />
        <ServiceOptions lang={lang} />
      </div>
    </main>
  );
}
