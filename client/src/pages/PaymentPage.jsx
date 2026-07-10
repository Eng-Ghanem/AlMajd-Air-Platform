import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentPage({ lang }) {
  const isAr = lang === 'ar';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 250, requestId: null }) // In real app, pass requestId
      });
      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-midnight p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-midnight-lighter p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full border border-slate-100 dark:border-slate-800"
        >
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
            {isAr ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {isAr ? 'تم استلام طلبك ومبلغ الدفع بنجاح. سنتواصل معك قريباً لتأكيد الموعد.' : 'Your request and payment have been received. We will contact you soon.'}
          </p>
          <a href="/" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold hover:scale-105 transition-transform">
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-midnight transition-colors duration-500">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: isAr ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-midnight-lighter p-8 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {isAr ? 'ملخص الطلب' : 'Order Summary'}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">{isAr ? 'الخدمة' : 'Service'}</span>
              <span className="font-bold text-slate-900 dark:text-white">{isAr ? 'صيانة تكييف' : 'AC Maintenance'}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">{isAr ? 'رسوم الزيارة' : 'Visit Fee'}</span>
              <span className="font-bold text-slate-900 dark:text-white">250 EGP</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-2xl font-black text-primary">250 EGP</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>{isAr ? 'مدفوعات آمنة ومشفرة 100%' : '100% Secure & Encrypted Payments'}</span>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div 
          initial={{ opacity: 0, x: isAr ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-midnight-lighter p-8 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            {isAr ? 'بيانات الدفع' : 'Payment Details'}
          </h3>
          
          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'الاسم على البطاقة' : 'Name on Card'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'رقم البطاقة' : 'Card Number'}
              </label>
              <input
                type="text"
                required
                maxLength="16"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="0000 0000 0000 0000"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  required
                  maxLength="3"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="123"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 px-6 mt-4 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:scale-100"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (isAr ? 'تأكيد الدفع 250 EGP' : 'Pay 250 EGP')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
