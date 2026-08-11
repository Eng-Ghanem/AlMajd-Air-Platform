import React from 'react';
import PageHeader from '../components/PageHeader';
import { Info } from 'lucide-react';

export default function TermsPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-20">
      <PageHeader 
        title={isAr ? 'الشروط والأحكام' : 'Terms & Conditions'} 
        description={isAr ? 'يرجى قراءة الشروط والأحكام بعناية قبل استخدام خدماتنا.' : 'Please read the terms and conditions carefully before using our services.'} 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
        <div className="bg-white dark:bg-midnight-lighter p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <Info className="text-accent" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isAr ? 'اتفاقية الاستخدام' : 'User Agreement'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isAr ? 'تاريخ آخر تحديث: أغسطس 2026' : 'Last updated: August 2026'}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed font-light">
            
            {isAr ? (
              <>
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. قبول الشروط</h3>
                  <p>
                    باستخدامك لمنصة "المجد اير"، فإنك توافق التام على الالتزام بجميع الشروط والأحكام المذكورة هنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى الامتناع عن استخدام المنصة أو طلب الخدمات.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. وصف الخدمات وطبيعة العمل</h3>
                  <p>
                    منصة "المجد اير" متخصصة في تقديم خدمات التكييف التي تشمل (توريد، تركيب، صيانة دورية، شحن فريون، وتنظيف). تخضع جميع الخدمات لتوفر الفنيين والمهندسين وجدولة المواعيد مسبقاً، ونحتفظ بالحق في تأجيل أو إلغاء المواعيد في الحالات الطارئة مع إبلاغ العميل.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. سياسة الدفع والأسعار</h3>
                  <p>
                    جميع الأسعار المعروضة على المنصة هي أسعار تقريبية قابلة للتغيير بناءً على حالة الموقع الفعلي والتسعير النهائي الذي يحدده المهندس المختص. الدفع الإلكتروني (إنستاباي/محافظ) يجب أن يتم قبل موعد الزيارة لضمان الجدية، أو نقداً عند استلام الخدمة في حال تم الاتفاق على ذلك. المبالغ المدفوعة مسبقاً غير مستردة إذا تم إلغاء الطلب من قبل العميل قبل موعد التنفيذ بأقل من 24 ساعة.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. مسؤولية العميل (الضمان)</h3>
                  <p>
                    نقدم ضماناً على خدمات التركيب والصيانة وفقاً للمدة المتفق عليها في الفاتورة أو إيصال الاستلام. الضمان لا يشمل سوء الاستخدام، التذبذب في التيار الكهربائي، أو تدخل أي فني غير تابع لمنصتنا في الجهاز بعد صيانتنا له.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. التعديلات على الشروط</h3>
                  <p>
                    نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت دون إشعار مسبق. استمرارك في استخدام المنصة بعد أي تعديلات يعتبر قبولاً منك بالشروط الجديدة.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h3>
                  <p>
                    By using the "AlMajd Air" platform, you fully agree to be bound by all the terms and conditions stated herein. If you do not agree to any of these terms, please refrain from using the platform or requesting services.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Description of Services</h3>
                  <p>
                    "AlMajd Air" specializes in providing AC services including (supply, installation, regular maintenance, freon charging, and cleaning). All services are subject to the availability of technicians and engineers and prior scheduling. We reserve the right to postpone or cancel appointments in emergencies while notifying the customer.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Payment Policy & Pricing</h3>
                  <p>
                    All prices displayed on the platform are approximate and subject to change based on the actual site condition and the final pricing determined by the specialized engineer. Online payments (InstaPay) must be made before the visit to ensure commitment, or in cash upon service receipt if agreed upon. Prepaid amounts are non-refundable if the order is canceled by the customer less than 24 hours before the execution time.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Customer Responsibility & Warranty</h3>
                  <p>
                    We offer a warranty on installation and maintenance services according to the period agreed upon in the invoice or receipt. The warranty does not cover misuse, power fluctuations, or intervention by any third-party technician not affiliated with our platform after our service.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Amendments to Terms</h3>
                  <p>
                    We reserve the right to amend these terms and conditions at any time without prior notice. Your continued use of the platform following any modifications constitutes your acceptance of the new terms.
                  </p>
                </section>
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
