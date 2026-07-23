import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage({ lang }) {
  const isAr = lang === 'ar';
  const { register, verifyOtp } = useAuth();
  
  // Step 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

    try {
      const { data, error: signUpError } = await register(email, password, name);
      
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
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'تم التسجيل بنجاح' : 'Registration Successful'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                {isAr 
                  ? `أرسلنا رابط التفعيل إلى بريدك الإلكتروني (${email}). يرجى مراجعة البريد الوارد (أو مجلد الرسائل غير المرغوب فيها) والضغط على الرابط لتفعيل حسابك والبدء في استخدام المنصة.` 
                  : `We sent an activation link to your email (${email}). Please check your inbox (or spam folder) and click the link to activate your account and start using the platform.`}
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link to="/login" className="font-bold text-primary hover:text-accent transition-colors">
                {isAr ? 'العودة لصفحة تسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
