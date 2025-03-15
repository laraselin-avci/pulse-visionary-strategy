
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layout, 
  FileText, 
  TrendingUp,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Layout },
  { name: 'Insights', path: '/insights', icon: TrendingUp },
  { name: 'Topics', path: '/topics', icon: FileText },
  { name: 'Live Updates', path: '/live-updates', icon: Radio },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-40 w-56 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
    "lg:translate-x-0 lg:static lg:w-56 lg:shrink-0 lg:shadow-none",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );
  
  const overlayClasses = cn(
    "fixed inset-0 bg-black/40 z-30 transition-opacity duration-300",
    isOpen ? "opacity-100 lg:hidden" : "opacity-0 pointer-events-none hidden"
  );

  return (
    <>
      <div className={overlayClasses} onClick={onClose}></div>
      <aside className={sidebarClasses}>
        <div className="h-full flex flex-col border-r border-politix-gray">
          <div className="p-4 flex justify-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-md">
              <span className="font-bold text-lg">P</span>
            </div>
          </div>
          
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive 
                      ? "text-white bg-blue-600 shadow-sm" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors", 
                      isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"
                    )} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-blue-50"
            >
              <span className="truncate">help@politix.io</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
