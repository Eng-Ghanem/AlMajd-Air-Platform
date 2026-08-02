import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage({ lang }) {
  const isAr = lang === 'ar';
  const { resetPassword, verifyOtp } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await resetPassword(email); // Sending OTP via Supabase
      
      if (error) throw new Error(error.message);
      
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(isAr ? 'حدث خطأ: ' + err.message : 'Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify OTP for password recovery
      const { data, error: verifyError } = await verifyOtp(email, otp, 'recovery');
      
      if (verifyError) {
        throw verifyError;
      }
      
      setSuccess(true);
      setTimeout(() => {
        // Redirect to Update Password page after successful verification
        navigate('/update-password');
      }, 1500);
    } catch (err) {
      console.error('OTP verify error:', err);
      setError(isAr ? 'رمز التحقق غير صحيح أو منتهي الصلاحية.' : 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-midnight transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-midnight-lighter p-10 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800"
      >
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {isAr ? 'تم التحقق بنجاح!' : 'Verified Successfully!'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {isAr ? 'جاري توجيهك لصفحة تغيير كلمة المرور...' : 'Redirecting to change password page...'}
            </p>
          </div>
        ) : step === 1 ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'استعادة كلمة المرور' : 'Reset Password'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isAr ? 'أدخل بريدك الإلكتروني وسنرسل لك رمزاً للاستعادة' : 'Enter your email and we\'ll send you a recovery code'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:scale-100"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    {isAr ? 'إرسال الرمز' : 'Send Code'}
                    <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="font-bold text-primary hover:text-accent transition-colors">
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
              </Link>
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'أدخل الرمز' : 'Enter Code'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isAr ? `أرسلنا رمز تحقق إلى ${email}` : `We sent a verification code to ${email}`}
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {isAr ? 'رمز التأكيد' : 'Verification Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] text-2xl py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="00000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:scale-100"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    {isAr ? 'تأكيد الرمز' : 'Verify Code'}
                    <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
