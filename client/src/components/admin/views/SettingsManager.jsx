import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Bell, Lock, Shield, X, Save, Mail, Key } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

export default function SettingsManager({ isAr }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  
  // State for forms
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [notifNew, setNotifNew] = useState(localStorage.getItem('notif_new') !== 'false');
  const [notifSystem, setNotifSystem] = useState(localStorage.getItem('notif_system') !== 'false');

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (activeModal === 'account') {
      if (password && password.length < 6) {
        return alert(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      }
      try {
        const updates = {};
        if (email && email !== user?.email) updates.email = email;
        if (password) updates.password = password;
        
        if (Object.keys(updates).length > 0) {
          const { error } = await supabase.auth.updateUser(updates);
          if (error) throw error;
        }
      } catch (error) {
        return alert(isAr ? 'حدث خطأ: ' + error.message : 'Error: ' + error.message);
      }
    } else if (activeModal === 'notifications') {
      localStorage.setItem('notif_new', notifNew.toString());
      localStorage.setItem('notif_system', notifSystem.toString());
    }

    alert(isAr ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
    setActiveModal(null);
    setPassword(''); // clear password field
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-midnight-lighter rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          {isAr ? 'إعدادات المنصة' : 'Platform Settings'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => setActiveModal('account')} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative overflow-hidden">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'إعدادات الحساب' : 'Account Settings'}</h3>
            <p className="text-sm text-slate-500">{isAr ? 'تحديث البريد الإلكتروني وكلمة المرور' : 'Update email and password'}</p>
          </div>

          <div onClick={() => setActiveModal('notifications')} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bell size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'الإشعارات' : 'Notifications'}</h3>
            <p className="text-sm text-slate-500">{isAr ? 'إدارة تنبيهات النظام والطلبات الجديدة' : 'Manage system alerts and new requests'}</p>
          </div>

          <div onClick={() => setActiveModal('security')} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'الأمان والخصوصية' : 'Security & Privacy'}</h3>
            <p className="text-sm text-slate-500">{isAr ? 'إدارة جلسات الدخول والمصادقة' : 'Manage login sessions and authentication'}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-midnight border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    {activeModal === 'account' && <><User className="text-primary" size={20}/> {isAr ? 'إعدادات الحساب' : 'Account Settings'}</>}
                    {activeModal === 'notifications' && <><Bell className="text-green-500" size={20}/> {isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}</>}
                    {activeModal === 'security' && <><Shield className="text-red-500" size={20}/> {isAr ? 'الأمان والخصوصية' : 'Security & Privacy'}</>}
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-full transition-colors shadow-sm">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSave} className="space-y-4">
                    {activeModal === 'account' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                          <div className="relative">
                            <Mail className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} text-slate-400`} size={18} />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                          <div className="relative">
                            <Lock className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} text-slate-400`} size={18} />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors`} />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{isAr ? 'اتركه فارغاً إذا كنت لا تود التغيير' : 'Leave empty if you do not want to change'}</p>
                        </div>
                      </>
                    )}

                    {activeModal === 'notifications' && (
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{isAr ? 'إشعارات الطلبات الجديدة' : 'New Order Alerts'}</p>
                            <p className="text-xs text-slate-500">{isAr ? 'تلقي تنبيه عند وصول طلب صيانة أو توريد جديد' : 'Get notified when a new service request arrives'}</p>
                          </div>
                          <input type="checkbox" checked={notifNew} onChange={(e) => setNotifNew(e.target.checked)} className="w-5 h-5 accent-primary" />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{isAr ? 'إشعارات النظام' : 'System Alerts'}</p>
                            <p className="text-xs text-slate-500">{isAr ? 'تلقي تنبيهات حول أداء وتحديثات النظام' : 'Get notified about system updates and performance'}</p>
                          </div>
                          <input type="checkbox" checked={notifSystem} onChange={(e) => setNotifSystem(e.target.checked)} className="w-5 h-5 accent-primary" />
                        </label>
                      </div>
                    )}

                    {activeModal === 'security' && (
                      <div className="space-y-4">
                        <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2"><Shield size={16} className="text-green-500"/> {isAr ? 'جلسة نشطة' : 'Active Session'}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Windows 11 • Chrome • {isAr ? 'مصر' : 'Egypt'}</p>
                          <p className="text-xs text-slate-400 mb-3">{isAr ? 'تم الدخول منذ ساعتين' : 'Logged in 2 hours ago'}</p>
                          <button type="button" onClick={() => { logout(); navigate('/login'); }} className="text-sm font-bold text-red-500 hover:text-red-600">{isAr ? 'إنهاء هذه الجلسة' : 'End Session'}</button>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Save size={20} />
                        {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
