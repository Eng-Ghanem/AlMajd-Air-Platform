import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageCheck, Home, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServiceSelectionModal({ isOpen, onClose, selectedBrand, selectedCapacity, lang }) {
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSelectService = (serviceId) => {
    // Navigate to the service details page with pre-selected brand and capacity in URL
    navigate(`/service-options/${serviceId}?brand=${selectedBrand}&capacity=${selectedCapacity}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-midnight-lighter rounded-[2rem] shadow-2xl p-8 overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-10 mt-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              {isAr ? 'اختر نوع الخدمة المطلوبة' : 'Select Service Type'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              {isAr 
                ? `لقد اخترت تكييف ${selectedBrand} بقدرة ${selectedCapacity} حصان`
                : `You selected ${selectedBrand} AC with ${selectedCapacity} HP capacity`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Supply & Install */}
            <button
              onClick={() => handleSelectService('1')}
              className="group relative flex flex-col items-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-midnight hover:shadow-[0_10px_40px_rgba(0,180,216,0.15)] border-2 border-transparent hover:border-primary/50 transition-all duration-300 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-10">
                <PackageCheck size={36} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">
                {isAr ? 'توريد وتركيب' : 'Supply & Install'}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed relative z-10 font-medium">
                {isAr 
                  ? 'نقوم بتوصيل التكييف وتركيبه بواسطة فريق هندسي متخصص لضمان أعلى كفاءة.'
                  : 'We deliver and install the AC by a specialized engineering team to ensure top efficiency.'}
              </p>
            </button>

            {/* Option 2: Supply Only */}
            <button
              onClick={() => handleSelectService('2')}
              className="group relative flex flex-col items-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-midnight hover:shadow-[0_10px_40px_rgba(255,107,107,0.15)] border-2 border-transparent hover:border-accent/50 transition-all duration-300 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-dark to-accent flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-10">
                <Home size={36} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">
                {isAr ? 'توريد لحد البيت' : 'Supply to Home'}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed relative z-10 font-medium">
                {isAr 
                  ? 'نوفر لك التكييف بسعر مميز ونقوم بشحنه وتوصيله بأمان حتى باب منزلك.'
                  : 'We provide the AC at a great price and ship it safely to your doorstep.'}
              </p>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
