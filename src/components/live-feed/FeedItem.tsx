
import React from 'react';
import { FeedItem as FeedItemType } from '@/utils/feedUtils';
import { Twitter, Newspaper, ExternalLink, ArrowRight, VerifiedIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TopicBadge } from '@/components/ui/topic-badge';

interface FeedItemProps {
  item: FeedItemType;
}

export const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
  // Get icon based on feed item type
  const getItemIcon = () => {
    switch (item.type) {
      case 'tweet':
        return <Twitter className="h-5 w-5 text-blue-500" />;
      case 'rss':
      case 'news':
      default:
        return <Newspaper className="h-5 w-5 text-orange-500" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border p-5 shadow-sm hover:shadow-md transition-all duration-200",
        item.type === 'tweet' ? 'border-blue-100' : 'border-orange-100'
      )}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-1">
          {getItemIcon()}
        </div>
        <div className="flex-1">
          {item.type === 'tweet' && item.author && (
            <div className="flex items-center gap-2 mb-2">
              {item.authorImage && (
                <img 
                  src={item.authorImage} 
                  alt={item.author} 
                  className="w-8 h-8 rounded-full bg-gray-200"
                />
              )}
              <div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900">{item.author}</span>
                  {item.verified && (
                    <span className="ml-1">
                      <VerifiedIcon className="h-4 w-4 text-blue-500" />
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm">@{item.author.replace(/\s+/g, '').toLowerCase()}</div>
              </div>
            </div>
          )}
          
          <p className="text-gray-800 mb-3">{item.content}</p>
          
          <div className="flex justify-between items-center text-sm mt-3">
            <div className="flex items-center gap-2">
              <TopicBadge label={item.topic} />
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{item.date}</span>
            </div>
            
            {item.url && (
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0">
                {item.type === 'tweet' ? 'View tweet' : 'Read more'} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
