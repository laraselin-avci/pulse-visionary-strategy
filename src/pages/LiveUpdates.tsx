
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Newspaper, Calendar, ExternalLink, AlertCircle, ArrowRight, Tag, Clock, Bell, Twitter, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { TopicBadge } from '@/components/ui/topic-badge';
import { allTopics } from '@/data/topics';
import { Topic } from '@/types/topics';
import { FeedItem as FeedItemType, generateMockFeedItems } from '@/utils/feedUtils';
import { FeedItem } from '@/components/live-feed/FeedItem';
import { TopicFilter } from '@/components/dashboard/TopicFilter';

const LiveUpdates = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  
  // Load topics and selected topics from localStorage
  useEffect(() => {
    // Get selected topics from localStorage
    const savedTopics = localStorage.getItem('selectedTopics');
    if (savedTopics) {
      setSelectedTopicIds(JSON.parse(savedTopics));
    }
    
    // Filter to only AI-related topics for this demo
    const aiTopics = allTopics.filter(topic => 
      topic.name.toLowerCase().includes('ai') || 
      topic.category?.toLowerCase().includes('ai') ||
      topic.description.toLowerCase().includes('ai')
    );
    
    setTopics(aiTopics);
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Generate initial feed items
  useEffect(() => {
    if (!loading && topics.length > 0) {
      const selectedTopics = topics.filter(topic => selectedTopicIds.includes(topic.id));
      const topicsToUse = selectedTopics.length > 0 ? selectedTopics : topics;
      
      // Generate 5 initial items
      const initialItems = generateMockFeedItems(topicsToUse, 5);
      setFeedItems(initialItems);
      
      // Start the "real-time" updates
      const intervalId = setInterval(() => {
        const newItem = generateMockFeedItems(topicsToUse, 1)[0];
        
        // Add the new item at the top of the feed
        setFeedItems(prev => [newItem, ...prev].slice(0, 20)); // Keep only last 20 items
        
        // Notify with a toast occasionally (1 in 3 chance)
        if (Math.random() > 0.7) {
          toast({
            title: newItem.type === 'tweet' ? "New Tweet" : "New Article",
            description: newItem.content.substring(0, 80) + "...",
          });
        }
      }, 5000 + Math.floor(Math.random() * 5000)); // Random interval between 5-10 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [loading, topics, selectedTopicIds, toast]);
  
  // Handle topic selection/deselection
  const handleTopicClick = (topicId: string) => {
    setSelectedTopicIds(prev => {
      const newSelection = prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
      
      localStorage.setItem('selectedTopics', JSON.stringify(newSelection));
      return newSelection;
    });
  };
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Generate new items on refresh
      const selectedTopics = topics.filter(topic => selectedTopicIds.includes(topic.id));
      const topicsToUse = selectedTopics.length > 0 ? selectedTopics : topics;
      const newItems = generateMockFeedItems(topicsToUse, 5);
      setFeedItems(newItems);
      
      setLoading(false);
      toast({
        title: "Feed refreshed",
        description: "Your live feed has been updated with the latest information.",
      });
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Updates</h1>
        <p className="text-gray-600">Real-time regulatory information and updates</p>
      </div>
      
      {/* Topic filter section */}
      <TopicFilter 
        topics={topics}
        selectedTopics={selectedTopicIds}
        onTopicClick={handleTopicClick}
      />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4 text-blue-500" />
          <span>Live updates for your selected topics</span>
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
      ) : feedItems.length > 0 ? (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
            <Rss className="h-12 w-12" />
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
