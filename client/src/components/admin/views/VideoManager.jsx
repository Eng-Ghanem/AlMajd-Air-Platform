import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Upload, Trash2, X, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function VideoManager({ isAr }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const fetchVideos = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/videos`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      setErrorMsg(isAr ? 'فشل تحميل الفيديوهات.' : 'Failed to load videos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setErrorMsg(isAr ? 'الرجاء اختيار ملف فيديو فقط.' : 'Please select a video file only.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg(isAr ? 'حجم الفيديو كبير جداً (أقصى حد 100 ميجابايت).' : 'Video size too large (max 100MB).');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    const formData = new FormData();
    formData.append('video', file);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      setSuccessMsg(isAr ? 'تم رفع الفيديو بنجاح!' : 'Video uploaded successfully!');
      fetchVideos();
    } catch (err) {
      setErrorMsg(isAr ? `فشل الرفع: ${err.message}` : `Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الفيديو؟' : 'Are you sure you want to delete this video?')) return;
    
    setErrorMsg('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/videos/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Delete failed');
      
      setSuccessMsg(isAr ? 'تم حذف الفيديو بنجاح.' : 'Video deleted successfully.');
      fetchVideos();
    } catch (err) {
      setErrorMsg(isAr ? 'فشل الحذف.' : 'Failed to delete.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="text-primary" size={28} />
            {isAr ? 'إدارة فيديوهات العملاء' : 'Customer Review Videos'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'ارفع الفيديوهات التي تظهر في قسم آراء العملاء بالصفحة الرئيسية.' : 'Upload videos that appear in the Customer Reviews section on the homepage.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isAr ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <div>
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Upload size={20} />
              )}
              {isAr ? (uploading ? 'جاري الرفع...' : 'رفع فيديو جديد') : (uploading ? 'Uploading...' : 'Upload New Video')}
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')}><X size={18} /></button>
        </div>
      )}
      
      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X size={18} /></button>
        </div>
      )}

      {loading && videos.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white dark:bg-midnight-lighter rounded-[2rem] p-12 text-center border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isAr ? 'لا توجد فيديوهات' : 'No videos found'}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {isAr ? 'لم تقم برفع أي فيديوهات بعد. انقر على "رفع فيديو جديد" لإضافة أول فيديو.' : 'You haven\'t uploaded any videos yet. Click "Upload New Video" to add your first one.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map((video) => (
            <motion.div 
              key={video.filename}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-midnight-lighter rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="aspect-video bg-black relative">
                <video 
                  src={`http://${window.location.hostname}:5000${video.url}#t=0.001`} 
                  className="w-full h-full object-contain"
                  controls
                  preload="metadata"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="truncate pr-4">
                  <p className="font-semibold text-slate-900 dark:text-white truncate" title={video.filename}>
                    {video.filename}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(video.filename)}
                  className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                  title={isAr ? 'حذف الفيديو' : 'Delete Video'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
