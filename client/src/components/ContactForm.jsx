import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactForm({ lang }) {
  const isAr = lang === 'ar';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', serviceType: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-midnight-lighter p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800"
    >
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        {isAr ? 'نموذج طلب خدمة' : 'Service Request Form'}
      </h3>
      
      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-center font-bold mb-6">
          {isAr ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.' : 'Request sent successfully! We will contact you soon.'}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isAr ? 'الاسم بالكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isAr ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {isAr ? 'نوع الخدمة' : 'Service Type'}
          </label>
          <select
            name="serviceType"
            required
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          >
            <option value="">{isAr ? 'اختر الخدمة...' : 'Select service...'}</option>
            <option value="maintenance">{isAr ? 'صيانة دورية' : 'Periodic Maintenance'}</option>
            <option value="installation">{isAr ? 'تأسيس وتركيب' : 'Installation'}</option>
            <option value="cleaning">{isAr ? 'تنظيف وغسيل' : 'Cleaning'}</option>
            <option value="freon">{isAr ? 'شحن فريون' : 'Freon Recharge'}</option>
            <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {isAr ? 'تفاصيل الطلب' : 'Request Details'}
          </label>
          <textarea
            name="message"
            rows="4"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:scale-100"
        >
          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
            <>
              {isAr ? 'إرسال الطلب' : 'Send Request'}
              <Send className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
