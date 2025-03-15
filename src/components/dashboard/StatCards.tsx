
import React from 'react';
import { StatCard } from '@/components/ui/stat-card';
import { Bell, Bookmark, TrendingUp, FileText } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: string;
  date: string;
  topic: string;
}

interface Topic {
  id: string;
  name: string;
  count: number;
}

interface StatCardsProps {
  alerts: Alert[];
  topics: Topic[];
}

export const StatCards: React.FC<StatCardsProps> = ({ alerts, topics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <StatCard 
        title="Total Alerts" 
        value={alerts.length} 
        icon={Bell}
        change={{ value: 12, type: 'increase' }}
        subtitle="Last 7 days"
      />
      <StatCard 
        title="Monitored Topics" 
        value={topics.length} 
        icon={Bookmark}
        subtitle="Active tracking"
      />
      <StatCard 
        title="Discussion Intensity" 
        value="Moderate" 
        icon={TrendingUp}
        change={{ value: 5, type: 'decrease' }}
        subtitle="Compared to last week"
      />
      <StatCard 
        title="Upcoming Reports" 
        value={3} 
        icon={FileText}
        subtitle="Within next 14 days"
      />
    </div>
  );
};
