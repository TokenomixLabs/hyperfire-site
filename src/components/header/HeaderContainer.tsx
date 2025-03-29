
import React, { ReactNode } from 'react';

interface HeaderContainerProps {
  isScrolled: boolean;
  children: ReactNode;
}

const HeaderContainer = ({ isScrolled, children }: HeaderContainerProps) => {
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-subtle' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        {children}
      </div>
    </header>
  );
};

export default HeaderContainer;
