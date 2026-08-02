import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, CreditCard, Banknote, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, Loader2, AlertCircle, Phone, PackageCheck, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const defaultDevices = [
  { id: 'carrier_1.5', nameAr: 'تكييف كاريير 1.5 حصان', nameEn: 'Carrier 1.5 HP', price: 0, discount_percentage: 0 },
  { id: 'carrier_2.25', nameAr: 'تكييف كاريير 2.25 حصان', nameEn: 'Carrier 2.25 HP', price: 0, discount_percentage: 0 },
  { id: 'carrier_3', nameAr: 'تكييف كاريير 3 حصان', nameEn: 'Carrier 3 HP', price: 0, discount_percentage: 0 },
  { id: 'carrier_4', nameAr: 'تكييف كاريير 4 حصان', nameEn: 'Carrier 4 HP', price: 0, discount_percentage: 0 },
  { id: 'carrier_5', nameAr: 'تكييف كاريير 5 حصان', nameEn: 'Carrier 5 HP', price: 0, discount_percentage: 0 },
  
  { id: 'midea_1.5', nameAr: 'تكييف ميديا 1.5 حصان', nameEn: 'Midea 1.5 HP', price: 0, discount_percentage: 0 },
  { id: 'midea_2.25', nameAr: 'تكييف ميديا 2.25 حصان', nameEn: 'Midea 2.25 HP', price: 0, discount_percentage: 0 },
  { id: 'midea_3', nameAr: 'تكييف ميديا 3 حصان', nameEn: 'Midea 3 HP', price: 0, discount_percentage: 0 },
  { id: 'midea_4', nameAr: 'تكييف ميديا 4 حصان', nameEn: 'Midea 4 HP', price: 0, discount_percentage: 0 },
  { id: 'midea_5', nameAr: 'تكييف ميديا 5 حصان', nameEn: 'Midea 5 HP', price: 0, discount_percentage: 0 },
  
  { id: 'free_air_1.5', nameAr: 'تكييف فري اير 1.5 حصان', nameEn: 'Free Air 1.5 HP', price: 0, discount_percentage: 0 },
  { id: 'free_air_2.25', nameAr: 'تكييف فري اير 2.25 حصان', nameEn: 'Free Air 2.25 HP', price: 0, discount_percentage: 0 },
  { id: 'free_air_3', nameAr: 'تكييف فري اير 3 حصان', nameEn: 'Free Air 3 HP', price: 0, discount_percentage: 0 },
  { id: 'free_air_4', nameAr: 'تكييف فري اير 4 حصان', nameEn: 'Free Air 4 HP', price: 0, discount_percentage: 0 },
  { id: 'free_air_5', nameAr: 'تكييف فري اير 5 حصان', nameEn: 'Free Air 5 HP', price: 0, discount_percentage: 0 },
  
  { id: 'haier_1.5', nameAr: 'تكييف هاير 1.5 حصان', nameEn: 'Haier 1.5 HP', price: 0, discount_percentage: 0 },
  { id: 'haier_2.25', nameAr: 'تكييف هاير 2.25 حصان', nameEn: 'Haier 2.25 HP', price: 0, discount_percentage: 0 },
  { id: 'haier_3', nameAr: 'تكييف هاير 3 حصان', nameEn: 'Haier 3 HP', price: 0, discount_percentage: 0 },
  { id: 'haier_4', nameAr: 'تكييف هاير 4 حصان', nameEn: 'Haier 4 HP', price: 0, discount_percentage: 0 },
  { id: 'haier_5', nameAr: 'تكييف هاير 5 حصان', nameEn: 'Haier 5 HP', price: 0, discount_percentage: 0 },
];

export default function SmartPaymentSystem({ isAr, optionTitle, basePrice = 0, requiresDeviceSelection = false }) {
  const { profile, user: authUser } = useAuth();
  
  let user = profile;
  if (!user && authUser) {
    user = { name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Guest' };
  } else if (!user) {
    user = { name: 'Guest' };
  }

  const [searchParams] = useSearchParams();
  const urlBrand = searchParams.get('brand');
  const urlCapacity = searchParams.get('capacity');

  const [devices, setDevices] = useState(defaultDevices);
  const [allPrices, setAllPrices] = useState([]);
  const [pricesLoaded, setPricesLoaded] = useState(!requiresDeviceSelection);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    if (requiresDeviceSelection) {
      fetch(`http://${window.location.hostname}:5000/api/device-prices`)
        .then(res => res.json())
        .then(dbPrices => {
          setAllPrices(dbPrices);
          const merged = defaultDevices.map(d => {
            const match = dbPrices.find(p => p.id === d.id);
            return match ? { ...d, price: match.price, discount_percentage: match.discount_percentage } : d;
          });
          setDevices(merged);
          setPricesLoaded(true);
        })
        .catch(err => {
          console.error('Failed to load prices', err);
          setPricesLoaded(true);
        });
    }
  }, [requiresDeviceSelection]);

  useEffect(() => {
    if (urlBrand && urlCapacity && pricesLoaded) {
      const normalizedBrand = urlBrand.toLowerCase().replace(/\s+/g, '_');
      const targetId = `${normalizedBrand}_${urlCapacity}`;
      const found = devices.find(d => d.id === targetId);
      if (found) {
        setSelectedDevice(found);
        setStep(1);
      }
    }
  }, [urlBrand, urlCapacity, devices, pricesLoaded]);

  const hasUrlSelection = Boolean(urlBrand && urlCapacity);
  const [step, setStep] = useState(requiresDeviceSelection && !hasUrlSelection ? 0 : 1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [exactMethod, setExactMethod] = useState('instapay');
  const [bookingId, setBookingId] = useState('');

  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          if (width > height) {
            if (width > MAX_WIDTH) { height = Math.round((height *= MAX_WIDTH / width)); width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width = Math.round((width *= MAX_HEIGHT / height)); height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          setPaymentScreenshot(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getDeviceFinalPrice = (device) => {
    if (!device || !device.price) return 0;
    const discount = device.discount_percentage || 0;
    return device.price - (device.price * (discount / 100));
  };

  const getInstallationPriceForDevice = (deviceId) => {
    const isInstallationIncluded = optionTitle?.includes('توريد وتركيب') || optionTitle?.includes('Installation');
    if (!isInstallationIncluded) return 0;
    let brandId = deviceId.split('_')[0];
    if (deviceId.startsWith('free_air')) brandId = 'free_air';
    const installService = allPrices.find(p => p.id === `service_install_${brandId}`);
    if (installService) {
      return installService.price - (installService.price * (installService.discount_percentage / 100));
    }
    return 0;
  };

  const selectedDevicePrice = requiresDeviceSelection && selectedDevice ? getDeviceFinalPrice(selectedDevice) : 0;
  const selectedInstallationPrice = requiresDeviceSelection && selectedDevice ? getInstallationPriceForDevice(selectedDevice.id) : 0;
  const finalPrice = requiresDeviceSelection && selectedDevice ? selectedDevicePrice + selectedInstallationPrice : basePrice;

  const handleDeviceNext = () => {
    if (!selectedDevice) {
      setFormError(isAr ? 'يرجى اختيار الجهاز' : 'Please select a device');
      return;
    }
    setFormError('');
    setStep(1);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!date || !address || !phone) {
        setFormError(isAr ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
        return;
      }
      if (!/^\d{11}$/.test(phone)) {
        setFormError(isAr ? 'يجب أن يتكون رقم الهاتف من 11 رقماً' : 'Phone number must be exactly 11 digits');
        return;
      }
      setFormError('');
    }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const handleContinuePayment = () => { nextStep(); };

  const submitBooking = async () => {
    setLoading(true);
    try {
      let message = `Date: ${date}\nAddress: ${address}`;
      if (requiresDeviceSelection && selectedDevice) {
        message = `Device: ${selectedDevice.nameEn}\n` + message;
      }
      if (paymentMethod === 'card' && paymentScreenshot) {
        message += `\nPayment: Online Transfer (Screenshot attached)\n[IMAGE_START]${paymentScreenshot}[IMAGE_END]`;
      } else if (paymentMethod === 'cash') {
        message += `\nPayment: Cash on Delivery`;
      }
      let finalPaymentMethod = paymentMethod;
      if (paymentMethod === 'card') {
         finalPaymentMethod = exactMethod;
      }
      const res = await fetch(`http://${window.location.hostname}:5000/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, phone: phone, serviceType: optionTitle, message: message, totalPrice: finalPrice, paymentMethod: finalPaymentMethod })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingId(data.id || Math.floor(1000 + Math.random() * 9000));
        nextStep(); 
      } else {
        const errorDetail = data.error || data.message || res.statusText;
        alert(isAr ? `حدث خطأ أثناء الحجز: ${errorDetail}` : `Error creating booking: ${errorDetail}`);
      }
    } catch (err) {
      console.error(err);
      alert(isAr ? `فشل الاتصال بالخادم: ${err.message}` : `Server connection failed: ${err.message}`);
    }
    setLoading(false);
  };

  const handleCashSubmit = () => { submitBooking(); };

  const slideVariants = {
    initial: { opacity: 0, x: isAr ? -30 : 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isAr ? 30 : -30 },
  };

  const formattedPrice = new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(finalPrice);

  return (
    <div className="bg-white/80 dark:bg-midnight/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-[0_30px_60px_-15px_rgba(0,180,216,0.15)] rounded-[2.5rem] p-5 sm:p-10 relative overflow-hidden h-[600px] sm:h-[650px] flex flex-col">
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
      {step > 0 && (
        <div className="flex justify-between mb-8 relative z-10">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center gap-2 flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-300 ${step >= num ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {step > num ? <CheckCircle2 size={20} /> : num}
              </div>
              {num !== 3 && (
                <div className={`absolute top-5 ${isAr ? 'left-0 right-1/2' : 'right-0 left-1/2'} h-1 -translate-y-1/2 transition-colors duration-500 ${step > num ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden pr-1 pb-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'اختر نوع الجهاز' : 'Choose Device Type'}</h3>
              <p className="text-slate-500 mb-6">{isAr ? 'يرجى اختيار التكييف المناسب لك لمعرفة السعر.' : 'Please select your preferred AC unit.'}</p>
              {formError && <div className="text-red-500 text-sm mb-4 font-bold">{formError}</div>}
              {pricesLoaded ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 pb-4">
                  {devices.map(device => {
                    const devPrice = getDeviceFinalPrice(device);
                    const instPrice = getInstallationPriceForDevice(device.id);
                    const totPrice = devPrice + instPrice;
                    return (
                    <label key={device.id} className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedDevice?.id === device.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <input type="radio" name="device" value={device.id} className="peer sr-only" onChange={() => setSelectedDevice(device)} />
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${selectedDevice?.id === device.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            <PackageCheck size={24} />
                          </div>
                          <span className="font-bold text-lg text-slate-900 dark:text-white">
                            {isAr ? device.nameAr : device.nameEn}
                          </span>
                        </div>
                        
                        {device.discount_percentage > 0 && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                            {device.discount_percentage}% {isAr ? 'خصم' : 'OFF'}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col items-end">
                        {device.discount_percentage > 0 && (
                          <div className="text-sm text-slate-400 line-through mb-1 font-medium">
                            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(device.price)}
                          </div>
                        )}
                        {instPrice > 0 ? (
                          <div className="flex flex-col items-end mb-1">
                            <span className="text-xs text-slate-500">{isAr ? 'الجهاز: ' : 'Device: '}{new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(devPrice)}</span>
                            <span className="text-xs text-slate-500">{isAr ? 'التركيب: ' : 'Install: '}{new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(instPrice)}</span>
                            <div className="text-2xl font-black text-primary mt-1">
                              {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(totPrice)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-2xl font-black text-primary">
                            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(devPrice)}
                          </div>
                        )}
                      </div>
                    </label>
                  )})}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="text-slate-500 font-medium">{isAr ? 'جاري تحميل الأسعار والموديلات...' : 'Loading prices and models...'}</p>
                </div>
              )}
              <button onClick={handleDeviceNext} className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-colors mt-auto shadow-lg shadow-primary/20 shrink-0">
                {isAr ? 'التالي' : 'Next'} {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between items-start mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'تفاصيل الحجز' : 'Booking Details'}</h3>
                  <p className="text-slate-500">{isAr ? 'يرجى إدخال تفاصيل الموعد والمكان.' : 'Please enter appointment and location details.'}</p>
                </div>
                {finalPrice > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 min-w-[240px] w-full md:w-auto shrink-0 shadow-sm">
                    {selectedInstallationPrice > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                          <span className="text-sm text-slate-500">{isAr ? 'سعر الجهاز' : 'Device Price'}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(selectedDevicePrice)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                          <span className="text-sm text-slate-500">{isAr ? 'سعر التركيب' : 'Installation'}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(selectedInstallationPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{isAr ? 'الإجمالي' : 'Total'}</span>
                          <span className="font-black text-primary text-lg">{formattedPrice}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{isAr ? 'الإجمالي' : 'Total'}</span>
                        <span className="font-black text-primary text-xl">{formattedPrice}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formError && <div className="text-red-500 text-sm mb-4 font-bold">{formError}</div>}
              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={20} />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" maxLength="11" className={`w-full bg-slate-50 dark:bg-midnight-lighter border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'التاريخ' : 'Date'}</label>
                  <div className="relative">
                    <Calendar className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} text-slate-400 pointer-events-none`} size={20} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full bg-slate-50 dark:bg-midnight-lighter border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'العنوان بالتفصيل' : 'Detailed Address'}</label>
                  <div className="relative">
                    <MapPin className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} text-slate-400`} size={20} />
                    <textarea rows="3" value={address} onChange={(e) => setAddress(e.target.value)} className={`w-full bg-slate-50 dark:bg-midnight-lighter border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow resize-none placeholder-slate-400`} placeholder={isAr ? 'اكتب عنوانك هنا...' : 'Enter your address here...'}></textarea>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-auto pt-4 shrink-0">
                {requiresDeviceSelection && !hasUrlSelection && (
                  <button onClick={() => setStep(0)} className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {isAr ? 'رجوع' : 'Back'}
                  </button>
                )}
                <button onClick={nextStep} className={`${requiresDeviceSelection && !hasUrlSelection ? 'w-2/3' : 'w-full'} bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20`}>
                  {isAr ? 'التالي' : 'Next'} {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'طريقة الدفع' : 'Payment Method'}</h3>
              <p className="text-slate-500 mb-4">{isAr ? 'اختر طريقة الدفع الأنسب لك.' : 'Choose your preferred payment method.'}</p>
              
              <div className="space-y-4 flex-1">
                <label className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="card" className="peer sr-only" onChange={() => setPaymentMethod('card')} />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className={paymentMethod === 'card' ? 'text-primary' : 'text-slate-400'} size={24} />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isAr ? 'دفع إلكتروني (فودافون كاش، جميع محافظ الكاش، وإنستاباي)' : 'Online Payment (All Cash Wallets, InstaPay)'}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-slate-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 ms-9">{isAr ? 'تحويل يدوي آمن ومباشر' : 'Secure direct manual transfer'}</p>
                </label>

                <label className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-500/5' : 'border-slate-200 dark:border-slate-700 hover:border-green-500/50'}`}>
                  <input type="radio" name="payment" value="cash" className="peer sr-only" onChange={() => setPaymentMethod('cash')} />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Banknote className={paymentMethod === 'cash' ? 'text-green-500' : 'text-slate-400'} size={24} />
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isAr ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery'}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-green-500' : 'border-slate-300'}`}>
                      {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 ms-9">{isAr ? 'ادفع نقداً للمهندس عند إتمام الخدمة' : 'Pay in cash upon service completion'}</p>
                </label>
              </div>
              
              <div className="flex gap-4 mt-auto pt-4 shrink-0">
                <button onClick={prevStep} disabled={loading} className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {isAr ? 'رجوع' : 'Back'}
                </button>
                <button 
                  onClick={handleContinuePayment} 
                  disabled={!paymentMethod || loading}
                  className={`w-2/3 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg ${paymentMethod ? 'bg-primary hover:bg-primary-dark shadow-primary/20' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : (isAr ? 'متابعة' : 'Continue')} {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
              {paymentMethod === 'card' ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{isAr ? 'الدفع الإلكتروني اليدوي' : 'Manual Online Payment'}</h3>
                      <p className="text-slate-500 text-sm flex items-center gap-1"><ShieldCheck size={16} className="text-primary" /> {isAr ? 'آمن ومباشر' : 'Secure & Direct'}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl w-full sm:w-auto text-center sm:text-right">
                      <p className="text-sm text-primary/70 font-semibold mb-1">{isAr ? 'المبلغ المطلوب دفعه' : 'Required Amount'}</p>
                      <p className="text-2xl font-black text-primary">{formattedPrice}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-midnight-lighter p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 text-sm text-slate-700 dark:text-slate-300 space-y-3">
                    <p className="font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'يرجى تحويل المبلغ إلى أحد الحسابات التالية:' : 'Please transfer the amount to one of the following accounts:'}</p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'اختر وسيلة الدفع التي ستقوم بالتحويل منها:' : 'Select the payment method you will transfer from:'}</label>
                      <select value={exactMethod} onChange={(e) => setExactMethod(e.target.value)} className="w-full bg-white dark:bg-midnight border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary">
                        <option value="instapay">إنستاباي - InstaPay</option>
                        <option value="vodafone_cash">فودافون كاش - Vodafone Cash</option>
                        <option value="we_cash">وي كاش - WE Cash</option>
                        <option value="etisalat_cash">اتصالات كاش - Etisalat Cash</option>
                        <option value="orange_cash">أورانج كاش - Orange Cash</option>

                      </select>
                    </div>

                    <div className="flex justify-between items-center bg-white dark:bg-midnight p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span>{isAr ? 'فودافون كاش:' : 'Vodafone Cash:'}</span>
                      <span className="font-mono font-bold text-primary">010xxxxxxx</span>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-midnight p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span>{isAr ? 'إنستاباي (InstaPay):' : 'InstaPay:'}</span>
                      <span className="font-mono font-bold text-primary">almajdair@instapay</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{isAr ? 'إيصال التحويل (صورة شاشة)' : 'Transfer Receipt (Screenshot)'}</label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-midnight-lighter hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <Upload className="w-6 h-6 mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {fileName ? <span className="font-bold text-primary max-w-[200px] truncate block">{fileName}</span> : (isAr ? 'اضغط هنا لرفع صورة الإيصال' : 'Click to upload receipt')}
                        </p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6 shrink-0">
                    <button onClick={prevStep} disabled={loading} className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-4 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      {isAr ? 'رجوع' : 'Back'}
                    </button>
                    <button onClick={submitBooking} disabled={loading || !paymentScreenshot} className={`w-2/3 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg ${paymentScreenshot ? 'bg-primary hover:bg-primary-dark shadow-primary/20' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}>
                      {loading ? <Loader2 className="animate-spin" /> : (isAr ? 'تأكيد التحويل والحجز' : 'Confirm Transfer & Book')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                   <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                     <Banknote className="text-green-500" size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{isAr ? 'تأكيد الدفع عند الاستلام' : 'Confirm Cash on Delivery'}</h3>
                   <p className="text-slate-500 mb-8 max-w-sm mx-auto">{isAr ? `سيتم تحصيل مبلغ ${formattedPrice} نقداً بواسطة المهندس المختص عند إتمام الخدمة بنجاح.` : `Amount of ${formattedPrice} will be collected in cash by our engineer upon successful completion.`}</p>
                   <div className="flex gap-4 w-full mt-auto shrink-0">
                      <button onClick={prevStep} disabled={loading} className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-4 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        {isAr ? 'رجوع' : 'Back'}
                      </button>
                      <button onClick={handleCashSubmit} disabled={loading} className="w-2/3 bg-green-500 hover:bg-green-600 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20">
                        {loading ? <Loader2 className="animate-spin" /> : (isAr ? 'تأكيد الحجز' : 'Confirm Booking')}
                      </button>
                    </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <CheckCircle2 size={48} className="text-white" />
              </motion.div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{isAr ? 'تم الحجز بنجاح!' : 'Booking Successful!'}</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                {isAr ? 'لقد تم تأكيد حجزك للخدمة. مهندسونا في انتظارك.' : 'Your service booking has been confirmed. Our engineers are ready.'}
              </p>
              <div className="bg-slate-50 dark:bg-midnight-lighter rounded-xl py-3 px-6 mb-8 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-400 mb-1">{isAr ? 'رقم الحجز الخاص بك' : 'Your Booking Reference'}</p>
                <p className="font-mono text-xl font-bold tracking-wider text-primary">#{bookingId || 'ALMAJD-789X'}</p>
              </div>
              <button onClick={() => {setStep(requiresDeviceSelection ? 0 : 1); setDate(''); setAddress(''); setPhone(''); setSelectedDevice(null); setPaymentScreenshot(''); setFileName('');}} className="text-slate-500 hover:text-primary transition-colors font-semibold mt-auto">
                {isAr ? 'حجز خدمة أخرى' : 'Book another service'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
