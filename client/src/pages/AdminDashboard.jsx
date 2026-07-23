import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

export default function AdminDashboard({ lang }) {
  const isAr = lang === 'ar';
  
  const [currentView, setCurrentView] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [reqRes, usersRes, payRes, subRes] = await Promise.all([
        fetch('http://localhost:5000/api/requests'),
        fetch('http://localhost:5000/api/users'),
        fetch('http://localhost:5000/api/payments'),
        fetch('http://localhost:5000/api/subscriptions')
      ]);

      if (reqRes.ok) setRequests(await reqRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (payRes.ok) setPayments(await payRes.json());
      if (subRes.ok) setSubscriptions(await subRes.json());

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
        return <RequestsTable isAr={isAr} requests={requests} loading={loading} fetchRequests={fetchAllData} />;
      case 'payments':
        return <PaymentsTable isAr={isAr} payments={payments} loading={loading} />;
      case 'subscriptions':
        return <SubscriptionsTable isAr={isAr} subscriptions={subscriptions} loading={loading} />;
      case 'customers':
        return <CustomersTable isAr={isAr} users={users} loading={loading} />;
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
              <Sidebar isAr={isAr} currentView={currentView} setCurrentView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <TopNav isAr={isAr} setMobileMenuOpen={setMobileMenuOpen} />
        
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
