import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Mail, Phone, Lock, X, Loader2, Search, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function TechniciansManager({ isAr }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'technician');
      
      if (error) throw error;
      setTechnicians(data || []);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/admin/technicians`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create technician');
      }

      setSuccess(isAr ? 'تم إضافة الفني بنجاح!' : 'Technician added successfully!');
      setFormData({ name: '', email: '', phone: '', password: '' });
      fetchTechnicians(); // Refresh list

      setTimeout(() => {
        setIsAddModalOpen(false);
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-primary" />
            {isAr ? 'إدارة الفنيين' : 'Technicians Management'}
          </h2>
          <p className="text-slate-500 mt-1">
            {isAr ? 'إضافة ومتابعة حسابات الفنيين في المنصة' : 'Add and manage technician accounts on the platform'}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 font-bold"
        >
          <Plus size={20} />
          {isAr ? 'إضافة فني جديد' : 'Add New Technician'}
        </button>
      </div>

      {/* Technicians List */}
      <div className="bg-white dark:bg-midnight-lighter rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-slate-500">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : technicians.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {isAr ? 'لا يوجد فنيين مسجلين' : 'No Technicians Found'}
            </h3>
            <p className="text-slate-500">
              {isAr ? 'لم تقم بإضافة أي فنيين حتى الآن.' : 'You haven\'t added any technicians yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                <tr className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                  <th className="p-4 text-start">{isAr ? 'الاسم' : 'Name'}</th>
                  <th className="p-4 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="p-4 text-start">{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {technicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-start font-bold text-slate-900 dark:text-white">
                      {tech.name}
                    </td>
                    <td className="p-4 text-start text-slate-600 dark:text-slate-300 font-mono text-sm">
                      {tech.email}
                    </td>
                    <td className="p-4 text-start text-slate-600 dark:text-slate-300">
                      <span dir="ltr" className="inline-block text-start">{tech.phone || '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-midnight border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-3">
                  <Plus className="text-primary" size={24}/>
                  {isAr ? 'إضافة فني جديد' : 'Add New Technician'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-full transition-colors shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {success}
                  </div>
                )}

                <form onSubmit={handleAddTechnician} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {isAr ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                        placeholder={isAr ? 'اسم الفني' : 'Technician Name'}
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
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                        placeholder="tech@almajd-air.com"
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
                        name="phone"
                        required
                        maxLength={11}
                        pattern="[0-9]{11}"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-left`}
                        dir="ltr"
                        placeholder="010XXXXXXXX"
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
                        name="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
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

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {isAr ? 'جاري الإضافة...' : 'Adding...'}
                        </>
                      ) : (
                        isAr ? 'إنشاء حساب الفني' : 'Create Technician Account'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
