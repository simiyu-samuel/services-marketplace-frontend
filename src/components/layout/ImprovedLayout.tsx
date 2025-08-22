import React from 'react';
import { Outlet } from 'react-router-dom';
import ImprovedHeader from './ImprovedHeader';
import Footer from './Footer';

const ImprovedLayout: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ImprovedHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ImprovedLayout;