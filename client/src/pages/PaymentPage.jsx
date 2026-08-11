import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2, Banknote, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentPage({ lang }) {
  const isAr = lang === 'ar';
  const location = useLocation();
  const navigate = useNavigate();
  
  const { formData, totalPrice } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [exactMethod, setExactMethod] = useState('instapay');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (!formData) {
      navigate('/');
    }
  }, [formData, navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(isAr ? 'حجم الصورة كبير جداً (الحد الأقصى 5MB)' : 'File size too large (max 5MB)');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          if (width > height) {
            if (width > MAX_WIDTH) { height = Math.round((height *= MAX_WIDTH / width)); width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width = Math.round((width *= MAX_HEIGHT / height)); height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPaymentScreenshot(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;
    if (paymentMethod === 'card' && !paymentScreenshot) {
      setErrorMsg(isAr ? 'يرجى إرفاق صورة إيصال التحويل' : 'Please attach transfer receipt');
      return;
    }
    
    setLoading(true);
    try {
      let finalMessage = formData.message || '';
      
      if (paymentMethod === 'card' && paymentScreenshot) {
        finalMessage += `\nPayment: Online Transfer (Screenshot attached)\n[IMAGE_START]${paymentScreenshot}[IMAGE_END]`;
      } else if (paymentMethod === 'cash') {
        finalMessage += `\nPayment: Cash on Delivery`;
      }
      
      let finalPaymentMethod = paymentMethod;
      if (paymentMethod === 'card') {
         finalPaymentMethod = exactMethod;
      }

      const payload = {
        ...formData,
        message: finalMessage,
        totalPrice: totalPrice || 0,
        paymentMethod: finalPaymentMethod
      };

      const res = await fetch(`http://${window.location.hostname}:5000/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setBookingId(data.id || Math.floor(1000 + Math.random() * 9000));
        setSuccess(true);
      } else {
        setErrorMsg(isAr ? `حدث خطأ أثناء الحجز: ${data.error || data.message}` : `Error creating booking: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrorMsg(isAr ? `فشل الاتصال بالخادم: ${error.message}` : `Server connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  const slideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const formattedPrice = new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(totalPrice || 0);

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
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isAr ? 'تم الحجز بنجاح!' : 'Booking Successful!'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {isAr ? 'تم استلام طلبك وتفاصيل الدفع. سنتواصل معك قريباً لتأكيد الموعد.' : 'Your request and payment details have been received. We will contact you soon.'}
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-8 border border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{isAr ? 'رقم الطلب' : 'Booking Reference'}</p>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">#{bookingId}</p>
          </div>
          <button onClick={() => navigate('/')} className="inline-block px-8 py-3 w-full rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-midnight transition-colors duration-500 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        <motion.div 
          variants={slideVariants} 
          initial="initial" 
          animate="animate" 
          className="bg-white dark:bg-midnight-lighter p-6 sm:p-10 rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-slate-800"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            {isAr ? 'طريقة الدفع' : 'Payment Method'}
          </h3>
          <p className="text-slate-500 mb-6">{isAr ? 'اختر طريقة الدفع الأنسب لك.' : 'Choose your preferred payment method.'}</p>
          
          <div className="space-y-4 mb-6">
            <label className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
              <input type="radio" name="payment" value="card" className="peer sr-only" onChange={() => setPaymentMethod('card')} />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <CreditCard className={paymentMethod === 'card' ? 'text-primary' : 'text-slate-400'} size={24} />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isAr ? 'دفع إلكتروني (إنستاباي)' : 'Online Payment (InstaPay)'}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-slate-300'}`}>
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
              </div>
              <p className="text-sm text-slate-500 ms-9">{isAr ? 'تحويل يدوي آمن ومباشر' : 'Secure direct manual transfer'}</p>
            </label>

            <label className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-500/5' : 'border-slate-200 dark:border-slate-700 hover:border-green-500/50'}`}>
              <input type="radio" name="payment" value="cash" className="peer sr-only" onChange={() => setPaymentMethod('cash')} />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Banknote className={paymentMethod === 'cash' ? 'text-green-500' : 'text-slate-400'} size={24} />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isAr ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery'}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-green-500' : 'border-slate-300'}`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                </div>
              </div>
              <p className="text-sm text-slate-500 ms-9">{isAr ? 'ادفع نقداً للمهندس عند إتمام الخدمة' : 'Pay in cash upon service completion'}</p>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 space-y-3">
                <div className="flex items-center justify-between mb-4">
                   <p className="font-bold text-slate-900 dark:text-white">{isAr ? 'يمكنك الدفع من خلال انستاباي' : 'You can pay via InstaPay'}</p>
                   {totalPrice > 0 && <p className="font-bold text-primary">{formattedPrice}</p>}
                </div>
                
                <div className="flex justify-between items-center bg-white dark:bg-midnight p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{isAr ? 'إنستاباي (InstaPay):' : 'InstaPay:'}</span>
                  <span className="font-mono font-bold text-primary" dir="ltr">01030697778</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'إيصال التحويل (صورة شاشة)' : 'Transfer Receipt (Screenshot)'}</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 font-medium">
                      {paymentScreenshot ? (isAr ? 'تم إرفاق الصورة بنجاح' : 'Image attached successfully') : (isAr ? 'اضغط لإرفاق الإيصال' : 'Click to attach receipt')}
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </motion.div>
          )}

          {errorMsg && <div className="text-red-500 text-sm mb-4 font-bold text-center">{errorMsg}</div>}
          
          <button 
            onClick={handlePayment} 
            disabled={!paymentMethod || loading}
            className={`w-full text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg ${paymentMethod ? 'bg-primary hover:bg-primary-dark shadow-primary/20' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : (isAr ? 'تأكيد الطلب والدفع' : 'Confirm Request & Payment')} 
          </button>
        </motion.div>

      </div>
    </div>
  );
}
