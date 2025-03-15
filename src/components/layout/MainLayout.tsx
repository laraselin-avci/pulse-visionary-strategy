
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSidebarState } from '@/hooks/useSidebarState';
import { MainContent } from './MainContent';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarState();

  return (
    <div className="min-h-screen flex flex-col bg-politix-gray-light">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};
