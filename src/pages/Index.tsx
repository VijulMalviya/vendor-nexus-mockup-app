
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Auth from './Auth';
import Layout from '../components/layout/Layout';
import VendorDashboard from '../components/dashboard/VendorDashboard';
import ProductManagement from '../components/products/ProductManagement';
import VendorOnboarding from '../components/onboarding/VendorOnboarding';
import Settings from '../components/settings/Settings';
import BuyerDashboard from '../components/buyer/BuyerDashboard';

const Index = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(
    localStorage.getItem('vendorOnboarded') === 'true'
  );

  if (!user) {
    return <Auth />;
  }

  if (user.userType === 'buyer') {
    return <BuyerDashboard />;
  }

  // Show onboarding if vendor hasn't completed it
  if (user.userType === 'vendor' && !isOnboarded) {
    return (
      <VendorOnboarding 
        onComplete={() => setIsOnboarded(true)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <VendorDashboard />;
      case 'products':
        return <ProductManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
