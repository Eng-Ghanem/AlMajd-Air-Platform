import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import BrandsPage from './pages/BrandsPage'
import TestimonialsPage from './pages/TestimonialsPage'
import BrandDetailsPage from './pages/BrandDetailsPage'
import ServiceOptionDetailsPage from './pages/ServiceOptionDetailsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import TechnicianPage from './pages/TechnicianPage'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppRoutes({ lang, setLang, theme, setTheme }) {
  const { profile, user: authUser } = useAuth();
  
  let user = profile;
  if (!user) {
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (localUser) {
      user = localUser;
    } else if (authUser) {
      user = { 
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        role: 'customer' // Default fallback until profile loads
      };
    }
  }
  
  const isAdmin = user?.role === 'admin';
  const isTechnician = user?.role === 'technician';

  return (
    <Routes>
      <Route element={<MainLayout lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}>
        <Route path="/" element={<Home lang={lang} />} />
        <Route path="/brands" element={<BrandsPage lang={lang} />} />
        <Route path="/brands/:id" element={<BrandDetailsPage lang={lang} />} />
        <Route path="/services" element={<ServicesPage lang={lang} />} />
        <Route path="/service-options/:id" element={<ServiceOptionDetailsPage lang={lang} />} />
        <Route path="/about" element={<AboutPage lang={lang} />} />
        <Route path="/testimonials" element={<TestimonialsPage lang={lang} />} />
        <Route path="/login" element={<LoginPage lang={lang} />} />
        <Route path="/signup" element={<SignUpPage lang={lang} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage lang={lang} />} />
        <Route path="/update-password" element={<UpdatePasswordPage lang={lang} />} />
        <Route path="/payment" element={<PaymentPage lang={lang} />} />
        <Route path="/profile" element={user ? <ProfilePage lang={lang} /> : <LoginPage lang={lang} />} />
        <Route path="/technician" element={isTechnician || isAdmin ? <TechnicianPage lang={lang} /> : <Home lang={lang} />} />
        <Route path="*" element={<NotFoundPage lang={lang} />} />
      </Route>
      <Route path="/admin" element={isAdmin ? <AdminDashboard lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} /> : <Home lang={lang} />} />
    </Routes>
  );
}

import WhatsAppButton from './components/WhatsAppButton'

function App() {
  // Check local storage for preferences, or default to light/ar
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ar')

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    // Apply Language and RTL/LTR
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <WhatsAppButton />
        <AppRoutes lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
