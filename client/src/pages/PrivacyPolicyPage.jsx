import React from 'react';
import PageHeader from '../components/PageHeader';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage({ lang }) {
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500 pb-20">
      <PageHeader 
        title={isAr ? 'سياسة الخصوصية' : 'Privacy Policy'} 
        description={isAr ? 'نحرص على حماية بياناتك وخصوصيتك بأعلى معايير الأمان.' : 'We are committed to protecting your data and privacy with the highest security standards.'} 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
        <div className="bg-white dark:bg-midnight-lighter p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-primary" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isAr ? 'حماية بياناتك أولويتنا' : 'Protecting your data is our priority'}
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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. جمع المعلومات</h3>
                  <p>
                    نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب، أو طلب خدمة صيانة أو توريد تكييفات، أو عند التواصل مع خدمة العملاء. تشمل هذه المعلومات: الاسم، رقم الهاتف، العنوان، تفاصيل الموقع الجغرافي لتقديم الخدمات، وأي تفاصيل أخرى تخص الأجهزة المراد صيانتها.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. استخدام المعلومات</h3>
                  <p>
                    تُستخدم بياناتك لتقديم خدماتنا بأفضل شكل ممكن، وتحديد مواعيد الزيارات الهندسية بدقة، ومعالجة مدفوعاتك بأمان (مثل الدفع الإلكتروني عبر إنستاباي أو المحافظ الإلكترونية). كما نستخدم البيانات لتحسين أداء المنصة وتجربة المستخدم.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. حماية المعلومات ومشاركتها</h3>
                  <p>
                    نلتزم بعدم بيع أو تأجير معلوماتك الشخصية لأي أطراف ثالثة. تتم مشاركة بياناتك فقط مع فريقنا الهندسي والفنيين المكلفين بتنفيذ طلبك لضمان وصول الخدمة إليك. نطبق أعلى معايير التشفير والأمان المعتمدة عالمياً للحفاظ على سرية بياناتك.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. حقوق المستخدم</h3>
                  <p>
                    يحق لك في أي وقت الوصول إلى بياناتك الشخصية، أو طلب تعديلها، أو حذفها نهائياً من أنظمتنا عبر التواصل مع الدعم الفني. كما يمكنك إلغاء الاشتراك في أي رسائل ترويجية أو إشعارات غير ضرورية.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Information Collection</h3>
                  <p>
                    We collect information you provide directly to us when creating an account, requesting maintenance or AC supply services, or contacting customer support. This includes: name, phone number, address, geolocation details for service delivery, and any other details regarding the devices to be maintained.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Use of Information</h3>
                  <p>
                    Your data is used to provide our services in the best possible way, accurately schedule engineering visits, and securely process your payments (such as online payments via InstaPay or e-wallets). We also use the data to improve platform performance and user experience.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Data Protection and Sharing</h3>
                  <p>
                    We are committed not to sell or rent your personal information to any third parties. Your data is only shared with our engineering team and technicians assigned to execute your request to ensure service delivery. We apply the highest globally recognized encryption and security standards to maintain data confidentiality.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. User Rights</h3>
                  <p>
                    You have the right at any time to access your personal data, request its modification, or have it permanently deleted from our systems by contacting technical support. You can also unsubscribe from any promotional messages or non-essential notifications.
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
