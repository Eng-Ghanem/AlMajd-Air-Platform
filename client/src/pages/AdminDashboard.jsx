import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// Layout Components
import Sidebar from '../components/admin/Sidebar';
import TopNav from '../components/admin/TopNav';

// Views
import Overview from '../components/admin/views/Overview';
import RequestsTable from '../components/admin/views/RequestsTable';
import PaymentsTable from '../components/admin/views/PaymentsTable';
import CustomersTable from '../components/admin/views/CustomersTable';
import SubscriptionsTable from '../components/admin/views/SubscriptionsTable';
import PricesManager from '../components/admin/views/PricesManager';
import SettingsManager from '../components/admin/views/SettingsManager';
import TechniciansManager from '../components/admin/views/TechniciansManager';

export default function AdminDashboard({ lang, setLang, theme, setTheme }) {
  const isAr = lang === 'ar';
  
  const [currentView, setCurrentView] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRequestId, setOpenRequestId] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers = { 'Authorization': `Bearer ${token}` };

      const [reqRes, usersRes, payRes, subRes] = await Promise.all([
        fetch(`http://${window.location.hostname}:5000/api/requests`, { headers }).then(r => r.json()),
        fetch(`http://${window.location.hostname}:5000/api/users`, { headers }).then(r => r.json()),
        fetch(`http://${window.location.hostname}:5000/api/payments`, { headers }).then(r => r.json()),
        fetch(`http://${window.location.hostname}:5000/api/subscriptions`, { headers }).then(r => r.json())
      ]);

      if (Array.isArray(reqRes)) setRequests(reqRes);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(payRes)) setPayments(payRes);
      if (Array.isArray(subRes)) setSubscriptions(subRes);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview isAr={isAr} requests={requests} users={users} payments={payments} subscriptions={subscriptions} />;
      case 'prices':
        return <PricesManager isAr={isAr} />;
      case 'requests':
        return <RequestsTable isAr={isAr} requests={requests} loading={loading} fetchRequests={fetchAllData} openRequestId={openRequestId} setOpenRequestId={setOpenRequestId} />;
      case 'payments':
        return <PaymentsTable isAr={isAr} payments={payments} loading={loading} />;
      case 'subscriptions':
        return <SubscriptionsTable isAr={isAr} subscriptions={subscriptions} loading={loading} />;
      case 'customers':
        return <CustomersTable isAr={isAr} users={users} loading={loading} />;
      case 'technicians':
        return <TechniciansManager isAr={isAr} />;
      case 'settings':
        return <SettingsManager isAr={isAr} />;
      default:
        return <Overview isAr={isAr} requests={requests} users={users} payments={payments} subscriptions={subscriptions} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-midnight transition-colors duration-500">
      
      {/* Sidebar */}
      <Sidebar isAr={isAr} currentView={currentView} setCurrentView={setCurrentView} />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: isAr ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: isAr ? '100%' : '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${isAr ? 'right-0' : 'left-0'} z-40 lg:hidden`}
            >
              <Sidebar isMobile={true} isAr={isAr} currentView={currentView} setCurrentView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <TopNav isAr={isAr} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} setMobileMenuOpen={setMobileMenuOpen} requests={requests} setCurrentView={setCurrentView} setOpenRequestId={setOpenRequestId} />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

    </div>
  );
}
