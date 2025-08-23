import React from 'react';
import { Outlet } from 'react-router-dom';
import PremiumHeader from './PremiumHeader';
import Footer from './Footer';

const PremiumLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PremiumHeader />
      <main className="flex-grow pt-10 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PremiumLayout;
