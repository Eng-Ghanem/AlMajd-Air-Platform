import React from 'react';
import Brands from '../components/Brands';
import PageHeader from '../components/PageHeader';

export default function BrandsPage({ lang }) {
  const isAr = lang === 'ar';
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-20">
      <PageHeader 
        title={isAr ? 'الماركات المتوفرة' : 'Available Brands'} 
        description={isAr ? 'نحن نتعامل مع أفضل العلامات التجارية العالمية لضمان تقديم أعلى درجات الجودة والكفاءة.' : 'We partner with top global brands to ensure the highest levels of quality and efficiency.'} 
      />
      <div className="-mt-16 relative z-20">
        <Brands lang={lang} />
      </div>
    </main>
  );
}
