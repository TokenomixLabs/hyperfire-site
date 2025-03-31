
import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

export const PageTitle = ({ children, subtitle }: PageTitleProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">{children}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};
