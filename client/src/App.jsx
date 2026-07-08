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
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/brands" element={<BrandsPage lang={lang} />} />
          <Route path="/brands/:id" element={<BrandDetailsPage lang={lang} />} />
          <Route path="/services" element={<ServicesPage lang={lang} />} />
          <Route path="/service-options/:id" element={<ServiceOptionDetailsPage lang={lang} />} />
          <Route path="/about" element={<AboutPage lang={lang} />} />
          <Route path="/testimonials" element={<TestimonialsPage lang={lang} />} />
          <Route path="*" element={<NotFoundPage lang={lang} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
