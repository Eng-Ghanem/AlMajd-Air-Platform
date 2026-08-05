import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Phone, User, Settings, Banknote, Calendar, MessageSquare, Plus, ArrowRight, ArrowLeft, Clock, XCircle, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function TechnicianPage({ lang }) {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cashOrders'); // 'cashOrders' or 'manualAdd'
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newRequest, setNewRequest] = useState({ 
    name: '', 
    phone: '', 
    serviceType: lang === 'ar' ? 'تأسيس وتركيب' : 'Installation', 
    date: '', 
    totalPrice: '', 
    message: '' 
  });

  useEffect(() => {
    setNewRequest(prev => ({
      ...prev,
      serviceType: lang === 'ar' ? 
        (prev.serviceType === 'Installation' ? 'تأسيس وتركيب' : prev.serviceType) : 
        (prev.serviceType === 'تأسيس وتركيب' ? 'Installation' : prev.serviceType)
    }));
  }, [lang]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (!error) {
        fetchRequests();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const cashOrders = requests.filter(req => 
    req.message && req.message.includes('Cash on Delivery') &&
    (req.name.toLowerCase().includes(searchTerm.toLowerCase()) || req.phone.includes(searchTerm))
  );

  const handleAddRequest = async (e) => {
    e.preventDefault();
    
    if (newRequest.phone.length !== 11) {
      alert(isAr ? 'يجب أن يتكون رقم الهاتف من 11 رقماً بالضبط' : 'Phone number must be exactly 11 digits');
      return;
    }
    
    setIsAdding(true);
    try {
      const payload = {
        name: newRequest.name,
        phone: newRequest.phone,
        service_type: newRequest.serviceType,
        message: newRequest.message || `Cash collection by technician. Date: ${newRequest.date || new Date().toISOString()}`,
        total_price: Number(newRequest.totalPrice),
        status: 'paid'
      };
      
      const { data, error } = await supabase
        .from('service_requests')
        .insert([payload])
        .select()
        .single();
        
      if (error) throw error;
      
      const paymentPayload = {
        request_id: data.id,
        amount: Number(newRequest.totalPrice),
        status: 'completed',
        method: 'cash'
      };
      
      let { error: paymentError } = await supabase.from('payments').insert([paymentPayload]);
      if (paymentError && paymentError.message.includes('method')) {
          delete paymentPayload.method;
          await supabase.from('payments').insert([paymentPayload]);
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNewRequest({ name: '', phone: '', serviceType: isAr ? 'تأسيس وتركيب' : 'Installation', date: '', totalPrice: '', message: '' });
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Add request error:', error);
      alert(isAr ? 'حدث خطأ في الاتصال بالسيرفر' : 'Server connection error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Enforce 11 digits for phone
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setNewRequest(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setNewRequest(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {isAr ? 'بوابة الفنيين' : 'Technicians Portal'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {isAr 
              ? 'أدخل بيانات العمليات التي قمت بتنفيذها ميدانياً وتسجيل المدفوعات النقدية مباشرة في النظام.'
              : 'Enter details of field operations and record cash payments directly into the system.'}
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl inline-flex gap-2 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('cashOrders')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'cashOrders'
                  ? 'bg-white dark:bg-midnight shadow-md text-primary dark:text-accent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'طلبات الدفع عند الاستلام' : 'Cash on Delivery Orders'}
            </button>
            <button
              onClick={() => setActiveTab('manualAdd')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'manualAdd'
                  ? 'bg-white dark:bg-midnight shadow-md text-primary dark:text-accent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'تسجيل عملية جديدة' : 'Record New Operation'}
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/80 dark:bg-midnight-lighter/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden ${activeTab === 'manualAdd' ? 'max-w-3xl mx-auto' : ''}`}
        >
          {activeTab === 'cashOrders' ? (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm`}
                    placeholder={isAr ? 'بحث' : 'Search'}
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : cashOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  {isAr ? 'لا توجد طلبات دفع عند الاستلام حالياً.' : 'No cash on delivery orders found.'}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cashOrders.map(order => (
                    <div key={order.id} className="bg-slate-50 dark:bg-slate-800/80 p-5 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="grid grid-cols-2 lg:grid-cols-5 items-center gap-4 lg:gap-6">
                        
                        {/* Customer Name */}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{isAr ? 'اسم العميل' : 'Customer Name'}</span>
                          <span className="font-black text-slate-900 dark:text-white text-lg lg:text-xl truncate">{order.name}</span>
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{isAr ? 'رقم الهاتف' : 'Phone'}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-base">{order.phone}</span>
                        </div>

                        {/* Service Type */}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{isAr ? 'نوع الخدمة' : 'Service Type'}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-base truncate">{order.service_type}</span>
                        </div>

                        {/* Collected Amount */}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{isAr ? 'المبلغ المحصل' : 'Amount'}</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-xl lg:text-2xl">{order.total_price} <span className="text-sm font-bold">{isAr ? 'جنيه' : 'EGP'}</span></span>
                        </div>

                        {/* Status Select */}
                        <div className="col-span-2 lg:col-span-1 flex items-center lg:justify-end mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`w-full lg:w-auto rounded-xl px-4 py-2.5 text-base font-black border-2 focus:outline-none appearance-none cursor-pointer shadow-sm text-center transition-colors ${
                              order.status === 'paid' || order.status === 'completed' 
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800' 
                                : order.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800'
                                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <option value="pending" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                            <option value="paid" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold">{isAr ? 'مدفوع' : 'Paid'}</option>
                          </select>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                  {isAr ? 'تم تسجيل الطلب بنجاح!' : 'Request recorded successfully!'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {isAr ? 'تمت إضافة المبلغ لرصيد المنصة وتوثيق الطلب.' : 'Amount added to platform balance and request documented.'}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleAddRequest}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      {isAr ? 'اسم العميل' : 'Customer Name'} *
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="name"
                      value={newRequest.name} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                      placeholder={isAr ? 'أدخل اسم العميل' : 'Enter customer name'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone size={16} className="text-primary" />
                      {isAr ? 'رقم الهاتف' : 'Phone Number'} *
                    </label>
                    <input 
                      required 
                      type="tel" 
                      name="phone"
                      value={newRequest.phone} 
                      onChange={handleChange} 
                      maxLength={11}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                      placeholder="01xxxxxxxxx"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? 'مطلوب 11 رقماً بالضبط' : 'Exactly 11 digits required'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Settings size={16} className="text-primary" />
                      {isAr ? 'نوع الخدمة / الصيانة' : 'Service Type'} *
                    </label>
                    <div className="relative">
                      <select 
                        required 
                        name="serviceType"
                        value={newRequest.serviceType} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value={isAr ? 'تأسيس وتركيب' : 'Installation'}>{isAr ? 'تأسيس وتركيب' : 'Installation'}</option>
                        <option value={isAr ? 'صيانة دورية' : 'Maintenance'}>{isAr ? 'صيانة دورية' : 'Maintenance'}</option>
                        <option value={isAr ? 'شحن فريون' : 'Freon Charging'}>{isAr ? 'شحن فريون' : 'Freon Charging'}</option>
                        <option value={isAr ? 'توريد وتركيب' : 'Supply & Install'}>{isAr ? 'توريد وتركيب' : 'Supply & Install'}</option>
                      </select>
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Banknote size={16} className="text-primary" />
                      {isAr ? 'السعر المحصل (جنيه)' : 'Collected Price (EGP)'} *
                    </label>
                    <input 
                      required 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      name="totalPrice"
                      value={newRequest.totalPrice} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      {isAr ? 'التاريخ والوقت' : 'Date & Time'}
                    </label>
                    <input 
                      type="datetime-local" 
                      name="date"
                      value={newRequest.date} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? 'اتركه فارغاً لاستخدام الوقت الحالي' : 'Leave empty to use current time'}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MessageSquare size={16} className="text-primary" />
                      {isAr ? 'ملاحظات' : 'Notes'}
                    </label>
                    <textarea 
                      rows="3" 
                      name="message"
                      value={newRequest.message} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder={isAr ? 'أي ملاحظات إضافية عن العملية...' : 'Any additional notes...'}
                    ></textarea>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="submit" 
                    disabled={isAdding} 
                    className="w-full py-4 rounded-xl font-bold bg-primary hover:bg-primary-dark text-white transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-primary/30"
                  >
                    {isAdding ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Plus size={20} />
                        {isAr ? 'حفظ الطلب وتسجيل المبلغ' : 'Save Request & Record Amount'}
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
