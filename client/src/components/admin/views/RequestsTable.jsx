import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock, X, MessageSquare, Phone, User, Calendar, Trash2 } from 'lucide-react';

export default function RequestsTable({ isAr, requests, loading, fetchRequests, openRequestId, setOpenRequestId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (openRequestId && requests.length > 0) {
      const req = requests.find(r => r.id === openRequestId);
      if (req) {
        setSelectedRequest(req);
      }
      if (setOpenRequestId) setOpenRequestId(null);
    }
  }, [openRequestId, requests, setOpenRequestId]);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        if (fetchRequests) fetchRequests();
        setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      } else {
        alert(isAr ? 'حدث خطأ أثناء تحديث الحالة، يرجى التأكد من اتصال الإنترنت' : 'Error updating status, please check connection');
      }
    } catch (error) {
      console.error('Update status error:', error);
      alert(isAr ? 'حدث خطأ في الاتصال بالسيرفر' : 'Server connection error');
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${deleteConfirmId}`, { method: 'DELETE' });
      if (response.ok) {
        if (fetchRequests) fetchRequests();
        setDeleteConfirmId(null);
      } else {
        alert(isAr ? 'حدث خطأ أثناء الحذف، يرجى التأكد من اتصال الإنترنت' : 'Error deleting request, please check connection');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(isAr ? 'حدث خطأ في الاتصال بالسيرفر' : 'Server connection error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="w-3.5 h-3.5" /> {isAr ? 'قيد الانتظار' : 'Pending'}</span>;
      case 'paid': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><CheckCircle2 className="w-3.5 h-3.5" /> {isAr ? 'مدفوع' : 'Paid'}</span>;
      case 'completed': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> {isAr ? 'مكتمل' : 'Completed'}</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3.5 h-3.5" /> {isAr ? 'ملغي' : 'Cancelled'}</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">{status}</span>;
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-midnight-lighter rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {isAr ? 'إدارة الطلبات والحجوزات' : 'Requests & Bookings Management'}
            </h2>
            <p className="text-sm text-slate-500">{isAr ? `إجمالي الطلبات: ${filteredRequests.length}` : `Total Requests: ${filteredRequests.length}`}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm`}
                placeholder={isAr ? 'بحث بالاسم، الخدمة أو الكود...' : 'Search by name, service or ID...'}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full sm:w-48 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none cursor-pointer`}
              >
                <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
                <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                <option value="paid">{isAr ? 'مدفوع' : 'Paid'}</option>
                <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isAr ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'كود الطلب' : 'Request ID'}</th>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'نوع الخدمة' : 'Service Type'}</th>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'تاريخ الطلب' : 'Date'}</th>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'الإجمالي' : 'Total'}</th>
                <th className="px-6 py-4 text-start whitespace-nowrap">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">{isAr ? 'تفاصيل' : 'Details'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      {isAr ? 'جاري تحميل البيانات...' : 'Loading data...'}
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-500">
                    {isAr ? 'لا توجد نتائج تطابق بحثك' : 'No results found matching your search'}
                  </td>
                </tr>
              ) : filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-start font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">#{req.id}</td>
                  <td className="px-6 py-4 text-start font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {req.name}
                  </td>
                  <td className="px-6 py-4 text-start text-slate-500 font-mono whitespace-nowrap" dir="ltr">
                    {req.phone}
                  </td>
                  <td className="px-6 py-4 text-start whitespace-nowrap">
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                      {req.service_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-start text-slate-600 dark:text-slate-400 whitespace-nowrap" dir="ltr">
                    {new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-start font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {req.total_price ? (isAr ? `${req.total_price} جنيه` : `${req.total_price} EGP`) : '-'}
                  </td>
                  <td className="px-6 py-4 text-start whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="px-4 py-2 text-sm font-bold text-primary hover:text-white border border-primary hover:bg-primary rounded-lg transition-all"
                      >
                        {isAr ? 'عرض' : 'View'}
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(req.id)}
                        className="p-2 text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded-lg transition-all"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-midnight-lighter w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      {isAr ? 'تفاصيل الطلب' : 'Request Details'}
                      <span className="text-primary font-mono text-lg">#{selectedRequest.id}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 rounded-full transition-colors shadow-sm"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'حالة الطلب الحالية:' : 'Current Status:'}
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'بيانات العميل' : 'Customer Info'}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-0.5">{isAr ? 'الاسم' : 'Name'}</p>
                            <p className="font-bold">{selectedRequest.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                            <Phone size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-0.5">{isAr ? 'رقم الهاتف' : 'Phone'}</p>
                            <p className="font-bold font-mono" dir="ltr">{selectedRequest.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'بيانات الخدمة' : 'Service Info'}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-0.5">{isAr ? 'الخدمة المطلوبة' : 'Requested Service'}</p>
                            <p className="font-bold">{selectedRequest.service_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-0.5">{isAr ? 'تاريخ الطلب' : 'Request Date'}</p>
                            <p className="font-bold font-mono" dir="ltr">
                              {new Date(selectedRequest.created_at).toLocaleString('en-GB')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message/Comments */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare size={16} />
                      {isAr ? 'الرسالة / التفاصيل الإضافية' : 'Message / Additional Details'}
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 min-h-[100px]">
                      {selectedRequest.message ? (
                        (() => {
                          const message = selectedRequest.message;
                          const imgStartIdx = message.indexOf('[IMAGE_START]');
                          const imgEndIdx = message.indexOf('[IMAGE_END]');
                          
                          let textPart = message;
                          let base64Image = null;
                          
                          if (imgStartIdx !== -1 && imgEndIdx !== -1) {
                            textPart = message.substring(0, imgStartIdx);
                            base64Image = message.substring(imgStartIdx + 13, imgEndIdx);
                          }

                          if (isAr) {
                            textPart = textPart
                              .replace(/Device:/g, 'الجهاز:')
                              .replace(/Date:/g, 'التاريخ:')
                              .replace(/Address:/g, 'العنوان:')
                              .replace(/Payment: Online Transfer \(Screenshot attached\)/g, 'الدفع: تحويل إلكتروني (مرفق إيصال)')
                              .replace(/Payment: Online Transfer \(Ref:/g, 'الدفع: تحويل إلكتروني (رقم المرجع:')
                              .replace(/Payment: Cash on Delivery/g, 'الدفع: الدفع عند الاستلام');
                          }
                          
                          return (
                            <div className="space-y-4">
                              <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                                {textPart.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                                  <p key={idx} className="bg-white dark:bg-midnight border border-slate-100 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm">
                                    <span dir="auto">{line}</span>
                                  </p>
                                ))}
                              </div>
                              {base64Image && (
                                <div className="mt-4 bg-white dark:bg-midnight p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                  <p className="text-sm font-bold text-slate-500 mb-3">{isAr ? 'صورة الإيصال المرفقة:' : 'Attached Receipt:'}</p>
                                  <img 
                                    src={base64Image} 
                                    alt="Payment Receipt" 
                                    className="max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm max-h-48 object-contain cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all" 
                                    onClick={() => {
                                      const w = window.open('');
                                      if (w) {
                                        w.document.write(`<html style="background:#0f172a;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;"><body style="margin:0;display:flex;justify-content:center;align-items:center;"><img src="${base64Image}" style="max-width:100%;max-height:100vh;object-fit:contain;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.5);"/></body></html>`);
                                        w.document.title = isAr ? 'إيصال الدفع' : 'Payment Receipt';
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-slate-400 mt-2 text-center">{isAr ? 'اضغط على الصورة لتكبيرها' : 'Click image to enlarge'}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <p className="text-slate-400 italic text-center py-6">
                          {isAr ? 'لم يقم العميل بترك أي رسالة إضافية' : 'Customer did not leave any additional message'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{isAr ? 'تغيير الحالة:' : 'Change Status:'}</span>
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value)}
                      className="bg-white dark:bg-midnight border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                    >
                      <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                      <option value="paid">{isAr ? 'مدفوع' : 'Paid'}</option>
                      <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-midnight-lighter w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mx-auto flex items-center justify-center mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                {isAr ? 'تأكيد الحذف' : 'Confirm Deletion'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {isAr ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to permanently delete this request? This action cannot be undone.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-1"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/30 flex-1 flex justify-center items-center gap-2"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    isAr ? 'نعم، احذف' : 'Yes, Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
