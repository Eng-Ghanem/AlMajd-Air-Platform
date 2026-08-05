import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ lang }) {
  const isAr = lang === 'ar';

  return (
    <footer className="bg-white dark:bg-midnight border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block flex items-center gap-3 group">
              <img 
                src="/images/logo.png" 
                alt="AlMajd Air Logo" 
                className="h-12 w-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-lg"
              />
              <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500">
                {isAr ? 'المجد اير' : 'AlMajd Air'}
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {isAr 
                ? 'منصتك الاحترافية الشاملة لجميع خدمات التكييف. جودة عالية وأداء لا يضاهى يطابق المعايير العالمية.' 
                : 'Your professional and comprehensive platform for all AC services. High quality and unmatched performance meeting global standards.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'خدماتنا' : 'Our Services'}
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'الماركات المتوفرة' : 'Available Brands'}
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'آراء العملاء' : 'Testimonials'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {isAr ? 'أهم الخدمات' : 'Top Services'}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/service-options/11" className="block text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'التأسيس والتركيب' : 'Installation & Setup'}
                </Link>
              </li>
              <li>
                <Link to="/service-options/12" className="block text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'الصيانة الدورية' : 'Regular Maintenance'}
                </Link>
              </li>
              <li>
                <Link to="/service-options/13" className="block text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'شحن الفريون' : 'Freon Charging'}
                </Link>
              </li>
              <li>
                <Link to="/service-options/14" className="block text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  {isAr ? 'تنظيف وغسيل الوحدات' : 'Units Cleaning'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span className="text-slate-500 dark:text-slate-400">
                  {isAr ? 'القاهرة، جمهورية مصر العربية' : 'Cairo, Egypt'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={20} />
                <span className="text-slate-500 dark:text-slate-400" dir="ltr">
                  01080925784
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={20} />
                <span className="text-slate-500 dark:text-slate-400">
                  almajdair@gmail.com
                </span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-16 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} {isAr ? 'المجد اير. جميع الحقوق محفوظة.' : 'AlMajd Air. All rights reserved.'}
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy-policy" className="text-slate-500 hover:text-primary transition-colors">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-primary transition-colors">
              {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
