import React from 'react';
import Testimonials from '../components/Testimonials';
import PageHeader from '../components/PageHeader';

export default function TestimonialsPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-20">
      <PageHeader 
        title={isAr ? 'آراء عملائنا' : 'Client Testimonials'} 
        description={isAr ? 'نفخر بثقة عملائنا ونسعى دائماً لتقديم أفضل مستوى من الخدمة يرضي تطلعاتهم.' : 'We take pride in our clients trust and always strive to provide the best service level that meets their expectations.'} 
      />
      <div className="-mt-16 relative z-20">
        <Testimonials lang={lang} />
      </div>
    </main>
  );
}
