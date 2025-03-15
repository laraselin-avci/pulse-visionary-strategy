
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AlertCard, AlertPriority } from '@/components/ui/alert-card';
import { TopicBadge } from '@/components/ui/topic-badge';
import { StatCard } from '@/components/ui/stat-card';
import { Bell, Bookmark, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
}

interface Topic {
  id: string;
  name: string;
  count: number;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Mock data for the dashboard
  const topics: Topic[] = [
    { id: '1', name: 'Solar Subsidies', count: 12 },
    { id: '2', name: 'Energy Taxation', count: 8 },
    { id: '3', name: 'Digital Infrastructure', count: 15 },
    { id: '4', name: 'Renewable Energy', count: 7 },
    { id: '5', name: 'Carbon Pricing', count: 10 },
    { id: '6', name: 'AI Regulation', count: 5 },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      title: 'New Solar Subsidy Legislation Proposed',
      description: 'The Ministry of Energy has proposed new legislation that would increase solar subsidies by 15% for commercial installations.',
      source: 'German Parliament',
      priority: 'urgent',
      date: 'Today, 10:30 AM',
      topic: 'Solar Subsidies',
    },
    {
      id: '2',
      title: 'Digital Infrastructure Funding Debate',
      description: 'Ongoing debate in parliament about increasing funding for rural digital infrastructure projects by €2.5 billion.',
      source: 'Parliamentary Proceedings',
      priority: 'high',
      date: 'Yesterday, 2:45 PM',
      topic: 'Digital Infrastructure',
    },
    {
      id: '3',
      title: 'Energy Minister Statement on Carbon Pricing',
      description: 'Minister Schmidt issued a statement suggesting potential increases to carbon pricing mechanisms starting next quarter.',
      source: 'Ministry Press Release',
      priority: 'medium',
      date: 'May 12, 2023',
      topic: 'Carbon Pricing',
    },
    {
      id: '4',
      title: 'AI Regulation Framework Draft Released',
      description: 'The regulatory committee has released a draft framework for AI applications in public infrastructure.',
      source: 'Regulatory Committee',
      priority: 'medium',
      date: 'May 10, 2023',
      topic: 'AI Regulation',
    },
  ];

  // Load selected topics from localStorage
  useEffect(() => {
    const savedTopics = localStorage.getItem('selectedTopics');
    if (savedTopics) {
      setSelectedTopics(JSON.parse(savedTopics));
    }
  }, []);

  const handleTopicClick = (topicId: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter((id) => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const handleAlertClick = (alertId: string) => {
    toast({
      title: "Alert details",
      description: "Alert details view would open here.",
    });
  };

  const handleManageTopics = () => {
    navigate('/topics');
  };

  const filteredAlerts = selectedTopics.length > 0
    ? alerts.filter(alert => 
        topics
          .filter(topic => selectedTopics.includes(topic.id))
          .some(topic => alert.topic === topic.name)
      )
    : alerts;

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

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

      <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Monitored Topics</h2>
          <Button variant="outline" size="sm" onClick={handleManageTopics}>
            Manage Topics
          </Button>
        </div>
        <div className="bg-white p-4 rounded-lg border border-politix-gray">
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <TopicBadge
                key={topic.id}
                label={`${topic.name} (${topic.count})`}
                selected={selectedTopics.includes(topic.id)}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              description={alert.description}
              source={alert.source}
              priority={alert.priority}
              date={alert.date}
              topic={alert.topic}
              onClick={() => handleAlertClick(alert.id)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
