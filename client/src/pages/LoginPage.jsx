import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage({ lang }) {
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase login integration
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-midnight transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-midnight-lighter p-10 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isAr ? 'مرحباً بعودتك' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isAr ? 'قم بتسجيل الدخول للوصول إلى حسابك' : 'Sign in to access your account'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                  placeholder="••••••••"
                />
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
                {isAr ? 'دخول' : 'Sign In'}
                <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {isAr ? 'ليس لديك حساب؟ ' : 'Don\'t have an account? '}
          <Link to="/signup" className="font-bold text-primary hover:text-accent transition-colors">
            {isAr ? 'سجل الآن' : 'Sign up now'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
