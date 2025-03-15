
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { 
    topics, 
    alerts, 
    selectedTopics, 
    filteredAlerts, 
    handleTopicClick 
  } = useDashboardData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') return;
    
    toast({
      title: "AI Search Initiated",
      description: `Searching for information about "${searchQuery}"`,
    });
    
    // Reset search field
    setSearchQuery('');
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

      <div className="mb-6 animate-slide-up">
        <form onSubmit={handleSearch} className="relative max-w-xl mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 pr-24"
            placeholder="Ask about any regulatory topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </form>
      </div>

      <StatCards alerts={alerts} topics={topics} />
      
      <TopicFilter 
        topics={topics} 
        selectedTopics={selectedTopics} 
        onTopicClick={handleTopicClick} 
      />
      
      <div className="mt-8 text-center">
        <Button variant="outline" size="sm" asChild>
          <a href="/insights">View All Insights</a>
        </Button>
      </div>
    </MainLayout>
  );
};

export default Index;
