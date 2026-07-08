import React from 'react';
import Features from '../components/Features';
import PageHeader from '../components/PageHeader';
import FAQ from '../components/FAQ';

export default function AboutPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-20">
      <PageHeader 
        title={isAr ? 'من نحن' : 'About Us'} 
        description={isAr ? 'المجد اير هي شركة رائدة في حلول التكييف، تجمع بين الخبرة الطويلة والتقنيات الحديثة لتوفير راحة مثالية لك ولأسرتك.' : 'AlMajd Air is a pioneer in AC solutions, combining long experience and modern technologies to provide perfect comfort for you and your family.'} 
      />
      <div className="-mt-16 relative z-20">
        <Features lang={lang} />
      </div>
      <FAQ lang={lang} />
    </main>
  );
}
