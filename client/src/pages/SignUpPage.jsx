import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage({ lang }) {
  const isAr = lang === 'ar';
  const { register, verifyOtp } = useAuth();
  
  // Step 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2 State (OTP)
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  
  // Global State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Password Complexity Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        isAr 
          ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص واحد على الأقل.' 
          : 'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      setLoading(false);
      return;
    }

    // Phone Validation
    if (phone.length !== 11) {
      setError(
        isAr 
          ? 'يجب أن يتكون رقم الهاتف من 11 رقماً.' 
          : 'Phone number must be exactly 11 digits.'
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await register(email, password, name, phone);
      
      if (signUpError) {
        throw signUpError;
      }
      
      setStep(2); // Move to OTP step
    } catch (err) {
      console.error('Signup error:', err);
      let errorMessage = err.message || 'Failed to sign up';
      if (errorMessage === '{}' || errorMessage.includes('AuthRetryableFetchError')) {
        errorMessage = isAr ? 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.' : 'Network error. Please try again later.';
      } else if (errorMessage.includes('already registered')) {
        errorMessage = isAr ? 'هذا البريد الإلكتروني مسجل بالفعل.' : 'This email is already registered.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error: verifyError } = await verifyOtp(email, otp, 'signup');
      
      if (verifyError) {
        throw verifyError;
      }
      
      setStep(3); // Success step
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
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
        {step === 1 ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'إنشاء حساب جديد' : 'Create an Account'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isAr ? 'انضم إلينا اليوم للحصول على أفضل خدمات التكييف' : 'Join us today for the best AC services'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                      placeholder={isAr ? 'اسمك الكريم' : 'John Doe'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 11) setPhone(val);
                      }}
                      maxLength="11"
                      minLength="11"
                      pattern="[0-9]{11}"
                      className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                      placeholder="01234567890"
                      dir="ltr"
                    />
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full ${isAr ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 ${isAr ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:scale-100"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    {isAr ? 'إنشاء حساب' : 'Sign Up'}
                    <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
              <Link to="/login" className="font-bold text-primary hover:text-accent transition-colors">
                {isAr ? 'سجل دخولك' : 'Sign in'}
              </Link>
            </p>
          </>
        ) : step === 2 ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'تأكيد البريد الإلكتروني' : 'Confirm Email'}
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
                    {isAr ? 'تأكيد الحساب' : 'Verify Account'}
                    <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'تم تأكيد الحساب بنجاح!' : 'Account Verified Successfully!'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isAr ? 'جاري توجيهك لصفحة تسجيل الدخول...' : 'Redirecting to login...'}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
