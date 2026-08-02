import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ContactForm({ lang }) {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    serviceType: '',
    message: ''
  });
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    fetch(`http://${window.location.hostname}:5000/api/device-prices`)
      .then(res => res.json())
      .then(data => {
        const pricesMap = {};
        data.forEach(item => {
          pricesMap[item.id] = {
            price: Number(item.price),
            discount: Number(item.discount_percentage || 0)
          };
        });
        setPrices(pricesMap);
      })
      .catch(err => console.error('Failed to fetch prices:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let totalPrice = 0;
      const getFinalPrice = (id) => {
        const item = prices[id];
        if (!item) return 0;
        return item.price - (item.price * (item.discount / 100));
      };
      if (formData.serviceType === (isAr ? 'صيانة دورية' : 'Periodic Maintenance')) totalPrice = getFinalPrice('service_maintenance');
      if (formData.serviceType === (isAr ? 'تأسيس وتركيب' : 'Installation')) totalPrice = getFinalPrice('service_installation');
      if (formData.serviceType === (isAr ? 'تنظيف وغسيل' : 'Cleaning')) totalPrice = getFinalPrice('service_cleaning');
      if (formData.serviceType === (isAr ? 'شحن فريون' : 'Freon Recharge')) totalPrice = getFinalPrice('service_freon');

      const payload = {
        ...formData,
        totalPrice
      };

      navigate('/payment', { 
        state: { 
          formData: payload,
          totalPrice
        }
      });
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
            {isAr ? 'العنوان بالتفصيل' : 'Detailed Address'}
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
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
            {[
              { id: 'service_maintenance', ar: 'صيانة دورية', en: 'Periodic Maintenance' },
              { id: 'service_installation', ar: 'تأسيس وتركيب', en: 'Installation' },
              { id: 'service_cleaning', ar: 'تنظيف وغسيل', en: 'Cleaning' },
              { id: 'service_freon', ar: 'شحن فريون', en: 'Freon Recharge' }
            ].map(service => {
              const priceData = prices[service.id];
              let priceText = '';
              if (priceData && priceData.price > 0) {
                if (priceData.discount > 0) {
                  const finalPrice = priceData.price - (priceData.price * (priceData.discount / 100));
                  priceText = isAr 
                    ? `(${finalPrice} ج.م بدلاً من ${priceData.price} ج.م)`
                    : `(${finalPrice} EGP instead of ${priceData.price} EGP)`;
                } else {
                  priceText = isAr ? `(${priceData.price} ج.م)` : `(${priceData.price} EGP)`;
                }
              }
              return (
                <option key={service.id} value={isAr ? service.ar : service.en}>
                  {isAr ? service.ar : service.en} {priceText}
                </option>
              );
            })}
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
