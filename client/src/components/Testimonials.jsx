import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Quote, Trash2, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Testimonials({ lang }) {
  const isAr = lang === 'ar';
  const [dynamicVideos, setDynamicVideos] = useState([]);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/videos`);
      if (res.ok) {
        const data = await res.json();
        setDynamicVideos(data);
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/videos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        fetchVideos();
      } else {
        alert('Failed to upload video');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading video');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الفيديو؟' : 'Are you sure you want to delete this video?')) return;
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/videos/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchVideos();
      } else {
        alert('Failed to delete video');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting video');
    }
  };

  const testimonials = [
    {
      id: 1,
      name: isAr ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: isAr ? 'عميل سكن' : 'Home Owner',
      text: isAr 
        ? 'خدمة ممتازة وسرعة في الاستجابة. الفنيون محترفون جداً وتم تركيب التكييف بدون أي فوضى.' 
        : 'Excellent service and fast response. The technicians are very professional and the AC was installed without any mess.',
      rating: 5,
    },
    {
      id: 2,
      name: isAr ? 'سارة عبدالله' : 'Sarah Abdallah',
      role: isAr ? 'صاحبة شركة' : 'Business Owner',
      text: isAr
        ? 'نتعامل مع المجد اير لصيانة كافة مكيفات الشركة. التزام بالمواعيد وجودة لا يعلى عليها.'
        : 'We work with AlMajd Air for all our company AC maintenance. Punctual and unbeatable quality.',
      rating: 5,
    },
    {
      id: 3,
      name: isAr ? 'محمود طارق' : 'Mahmoud Tarek',
      role: isAr ? 'عميل سكن' : 'Home Owner',
      text: isAr
        ? 'كان عندي مشكلة معقدة في التكييف المركزي، وفريق المجد اير قدر يحلها في وقت قياسي. شكراً لكم!'
        : 'I had a complex issue with my central AC, and the AlMajd Air team solved it in record time. Thank you!',
      rating: 4,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 40, damping: 15 }
    }
  };

  return (
    <section className="py-24 relative bg-slate-50 dark:bg-midnight overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {isAr ? 'آراء عملائنا وفيديوهات تعريفية' : 'Testimonials & Video Showcases'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light"
          >
            {isAr 
              ? 'شاهد كيف نقدم خدماتنا باحترافية، وتعرف على تجارب عملائنا المميزة معنا.' 
              : 'Watch how we deliver our services professionally, and learn about our customers\' exceptional experiences.'}
          </motion.p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {uploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع فيديو جديد' : 'Upload New Video')}
            </button>
          </div>
        )}

        {/* Video Showcase Section */}
        <div className="mb-24 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {dynamicVideos.map((video, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative shrink-0 snap-center w-[85vw] sm:w-[300px] md:w-[320px] aspect-[9/16] md:aspect-auto md:h-[500px] rounded-[2rem] bg-black overflow-hidden shadow-[0_10px_30px_rgba(0,180,216,0.15)] border border-slate-800 dark:border-slate-700/50 hover:shadow-[0_15px_40px_rgba(0,180,216,0.25)] transition-all duration-500"
              >
                <video 
                  src={`http://${window.location.hostname}:5000${video.url}#t=0.001`} 
                  className="w-full h-full object-contain"
                  controls
                  controlsList="nodownload"
                  playsInline
                  preload="metadata"
                  onContextMenu={(e) => e.preventDefault()}
                />
                
                {/* Admin Delete Overlay */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(video.filename)}
                    className="absolute top-4 right-4 p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all z-20 shadow-lg"
                    title={isAr ? 'حذف الفيديو' : 'Delete Video'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="relative p-10 rounded-[2.5rem] bg-white dark:bg-midnight-lighter border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(2,62,138,0.15)] dark:hover:shadow-[0_20px_50px_rgba(2,62,138,0.2)] transition-all duration-500 group"
            >
              <Quote size={40} className="absolute top-8 right-8 text-slate-100 dark:text-slate-800 rotate-180 group-hover:text-primary/10 transition-colors duration-500" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < testimonial.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"} 
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg font-light relative z-10">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
