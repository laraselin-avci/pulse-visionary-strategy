
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-auto p-4 lg:p-8">
      <div className="mx-auto max-w-7xl animate-fade-in">
        {children}
      </div>
    </main>
  );
};
