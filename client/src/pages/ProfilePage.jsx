import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage({ lang }) {
  const { user, profile, updateProfile, updateEmail, updatePassword } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState({ profile: false, email: false, password: false });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || ''
      }));
    }
  }, [user, profile, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(prev => ({ ...prev, profile: true }));
    const { error } = await updateProfile(profile.id, { 
      name: formData.name
    });
    
    setLoading(prev => ({ ...prev, profile: false }));
    
    if (error) {
      showMessage('error', isAr ? 'حدث خطأ أثناء تحديث البيانات' : 'Error updating profile');
    } else {
      showMessage('success', isAr ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully');
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (formData.email === profile?.email) return;

    setLoading(prev => ({ ...prev, email: true }));
    const { error } = await updateEmail(formData.email);
    setLoading(prev => ({ ...prev, email: false }));

    if (error) {
      showMessage('error', isAr ? error.message : error.message);
    } else {
      showMessage('success', isAr ? 'تم إرسال رابط تأكيد إلى بريدك الجديد' : 'Confirmation link sent to your new email');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showMessage('error', isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      showMessage('error', isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    const { error } = await updatePassword(formData.password);
    setLoading(prev => ({ ...prev, password: false }));

    if (error) {
      showMessage('error', isAr ? error.message : error.message);
    } else {
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      showMessage('success', isAr ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isAr ? 'إعدادات الحساب' : 'Account Settings'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isAr ? 'إدارة بياناتك الشخصية وتفضيلات الأمان' : 'Manage your personal info and security preferences'}
          </p>
        </div>

        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-center justify-center gap-3 font-bold ${
              status.type === 'success' 
                ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{status.message}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Profile Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleUpdateProfile}
            className="bg-white dark:bg-midnight-lighter p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="text-primary" size={24} />
              {isAr ? 'البيانات الشخصية' : 'Personal Information'}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading.profile}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-70 shadow-lg shadow-primary/30"
              >
                {loading.profile ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </motion.form>

          {/* Email Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleUpdateEmail}
            className="bg-white dark:bg-midnight-lighter p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail className="text-accent" size={24} />
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'البريد الإلكتروني الجديد' : 'New Email Address'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                dir="ltr"
                required
              />
              <p className="mt-2 text-xs text-slate-500 font-medium">
                {isAr ? '* سيتم إرسال رابط تأكيد إلى البريد الجديد قبل اعتماده، وسيتم تسجيل خروجك مؤقتاً.' : '* A confirmation link will be sent to the new email, and you will be logged out temporarily.'}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading.email || formData.email === profile?.email}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold transition-all disabled:opacity-50 shadow-lg shadow-accent/30"
              >
                {loading.email ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    {isAr ? 'تحديث البريد' : 'Update Email'}
                  </>
                )}
              </button>
            </div>
          </motion.form>

          {/* Password Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleUpdatePassword}
            className="bg-white dark:bg-midnight-lighter p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="text-purple-500" size={24} />
              {isAr ? 'الأمان وكلمة المرور' : 'Security & Password'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  dir="ltr"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  dir="ltr"
                  minLength={6}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading.password || !formData.password}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30"
              >
                {loading.password ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={18} />
                    {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>

      </div>
    </div>
  );
}
