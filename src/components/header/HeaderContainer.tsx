
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';

interface HeaderContainerProps {
  isScrolled: boolean;
  children?: ReactNode;
}

const HeaderContainer = ({ isScrolled, children }: HeaderContainerProps) => {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {children || <Outlet />}
      </div>
    </>
  );
};

export default HeaderContainer;
