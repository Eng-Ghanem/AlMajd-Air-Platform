import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function UpdatePasswordPage({ lang }) {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Password Complexity Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        isAr 
          ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص واحد على الأقل.' 
          : 'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) throw new Error(error.message);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(isAr ? 'حدث خطأ أثناء تغيير كلمة المرور' : 'Error updating password: ' + err.message);
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
              {isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password Updated Successfully!'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isAr ? 'جاري توجيهك لصفحة تسجيل الدخول...' : 'Redirecting to login...'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isAr ? 'الرجاء إدخال كلمة المرور الجديدة' : 'Please enter your new password'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={loading || newPassword.length < 8}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:scale-100"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    {isAr ? 'حفظ كلمة المرور' : 'Save Password'}
                    <ArrowRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
