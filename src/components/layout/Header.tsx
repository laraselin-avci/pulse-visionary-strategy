import React from 'react';
import { Bell, Settings, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
        <Link to="/onboarding" className="flex items-center">
          <span className={cn(
            "font-bold text-xl tracking-tight text-politix-blue transition-all duration-300",
            "hover:text-politix-blue-light cursor-pointer"
          )}>
            Politix
          </span>
        </Link>
      </div>
      
      
    </header>
  );
};
