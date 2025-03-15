
import React from 'react';
import { Bell, Settings, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up with the latest updates.",
    });
  };

  return (
    <header className="bg-white border-b border-politix-gray h-16 px-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/90">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar}
          className="mr-2 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <span className={cn(
            "font-bold text-xl tracking-tight text-politix-blue transition-all duration-300",
            "hover:text-politix-blue-light cursor-pointer"
          )}>
            Politix
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNotificationClick}
          className="relative hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-politix-crimson rounded-full"></span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-gray-100 rounded-full overflow-hidden transition-all duration-200"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
