import React from 'react';
import { Outlet } from 'react-router-dom';
import PremiumHeader from './PremiumHeader';
import Footer from './Footer';

const PremiumLayout: React.FC = () => {
  return (
    <div className="bg-background text-foreground">
      <PremiumHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PremiumLayout;
