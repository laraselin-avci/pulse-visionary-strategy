
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Newspaper, Calendar, ExternalLink, AlertCircle, ArrowRight, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { TopicBadge } from '@/components/ui/topic-badge';

// Mock news interface
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  topic: string;
  type: 'article' | 'legislation' | 'announcement';
  importance: 'high' | 'medium' | 'low';
}

const LiveUpdates = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  
  // Fetch selected topics
  useEffect(() => {
    const savedTopics = localStorage.getItem('selectedTopics');
    if (savedTopics) {
      setSelectedTopics(JSON.parse(savedTopics));
    }
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Generate mock news data
  useEffect(() => {
    // Mock news data (will be replaced with real data later)
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'New Solar Subsidy Program Announced',
        summary: 'The government has announced a new subsidy program for residential solar installations, offering up to 40% coverage of installation costs.',
        source: 'Ministry of Energy',
        date: '2 hours ago',
        url: '#',
        topic: 'Solar Subsidies',
        type: 'announcement',
        importance: 'high'
      },
      {
        id: '2',
        title: 'Carbon Tax Increase Scheduled for Next Quarter',
        summary: 'The carbon tax will increase from €25 to €35 per ton starting next quarter, according to a new policy document released yesterday.',
        source: 'Environmental Agency',
        date: '1 day ago',
        url: '#',
        topic: 'Carbon Pricing',
        type: 'legislation',
        importance: 'high'
      },
      {
        id: '3',
        title: 'Healthcare Reform Bill Enters Final Reading',
        summary: 'The comprehensive healthcare reform bill has entered its final reading in parliament, with a vote expected next week.',
        source: 'Parliament News',
        date: '3 days ago',
        url: '#',
        topic: 'Healthcare Reform',
        type: 'legislation',
        importance: 'medium'
      },
      {
        id: '4',
        title: 'New Report on Renewable Energy Implementation',
        summary: 'A new industry report shows that renewable energy implementation has increased by 27% in the last fiscal year.',
        source: 'Energy Commission',
        date: '5 days ago',
        url: '#',
        topic: 'Renewable Energy',
        type: 'article',
        importance: 'medium'
      },
      {
        id: '5',
        title: 'AI Ethics Guidelines Published',
        summary: 'The Technology Council has published new ethics guidelines for AI implementation in public services.',
        source: 'Technology Council',
        date: '1 week ago',
        url: '#',
        topic: 'AI Regulation',
        type: 'announcement',
        importance: 'medium'
      },
      {
        id: '6',
        title: 'Education Funding Increase Approved',
        summary: 'Parliament has approved a 12% increase in education funding for the next fiscal year, with a focus on digital learning resources.',
        source: 'Education Ministry',
        date: '1 week ago',
        url: '#',
        topic: 'Education Funding',
        type: 'legislation',
        importance: 'medium'
      },
      {
        id: '7',
        title: 'Pharmaceutical Price Controls Under Review',
        summary: 'The Health Commission is reviewing the current price control mechanisms for essential medications.',
        source: 'Health Commission',
        date: '2 weeks ago',
        url: '#',
        topic: 'Pharmaceutical Pricing',
        type: 'article',
        importance: 'low'
      }
    ];
    
    setNewsItems(mockNews);
  }, []);
  
  // Filter news based on selected topics
  useEffect(() => {
    if (selectedTopics.length === 0) {
      setFilteredNews(newsItems);
    } else {
      const filtered = newsItems.filter(news => 
        selectedTopics.some(topicId => {
          // This is a simplification; in a real app, you'd match topic IDs to names more robustly
          const topicMap: {[key: string]: string} = {
            '1': 'Solar Subsidies',
            '5': 'Carbon Pricing',
            '7': 'Healthcare Reform',
            '4': 'Renewable Energy',
            '6': 'AI Regulation',
            '9': 'Education Funding',
            '8': 'Pharmaceutical Pricing'
          };
          return news.topic === topicMap[topicId];
        })
      );
      setFilteredNews(filtered);
    }
  }, [newsItems, selectedTopics]);
  
  // Get icon based on news type
  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <Newspaper className="h-5 w-5 text-blue-500" />;
      case 'legislation':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'announcement':
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Newspaper className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Feed refreshed",
        description: "Your news feed has been updated with the latest information.",
      });
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Updates</h1>
        <p className="text-gray-600">Real-time regulatory information and updates</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing updates for your selected topics
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Refresh Feed
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg border p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-3">
                <div className="shrink-0 mt-1">
                  {getNewsIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{item.title}</h3>
                    <TopicBadge label={item.topic} className="shrink-0" />
                  </div>
                  <p className="text-gray-600 mt-2 mb-3">{item.summary}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Tag className="h-3 w-3" />
                      <span>{item.source}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0">
                      Read more <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
            <Newspaper className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2">No updates found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            There are no updates for your selected topics. Try selecting more topics from the Topics page.
          </p>
          <Button 
            onClick={() => window.location.href = '/topics'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Manage Topics
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default LiveUpdates;
