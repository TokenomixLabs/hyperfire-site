
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface HeaderContainerProps {
  isScrolled: boolean;
  children?: ReactNode;
}

const HeaderContainer = ({ isScrolled, children }: HeaderContainerProps) => {
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3">
          {/* This is where the header content will be rendered */}
        </div>
      </header>
      <div className="pt-16">
        {children || <Outlet />}
      </div>
    </>
  );
};

export default HeaderContainer;
