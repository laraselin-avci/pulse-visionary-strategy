
import { useState, useEffect } from 'react';

export interface Alert {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  date: string;
  topic: string;
}

export interface Topic {
  id: string;
  name: string;
  count: number;
}

export const useDashboardData = () => {
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

  const filteredAlerts = selectedTopics.length > 0
    ? alerts.filter(alert => 
        topics
          .filter(topic => selectedTopics.includes(topic.id))
          .some(topic => alert.topic === topic.name)
      )
    : alerts;

  return {
    topics,
    alerts,
    selectedTopics,
    filteredAlerts,
    handleTopicClick,
  };
};
