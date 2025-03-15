
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  name: string;
  category: string;
  description: string;
  following: boolean;
}

const Topics: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Mock data with descriptions
  const categories = [
    'Energy & Environment',
    'Digital & Technology',
    'Healthcare',
    'Finance & Economy',
    'Transportation',
    'Labor & Social',
  ];

  const allTopics: Topic[] = [
    { id: '1', name: 'Solar Subsidies', category: 'Energy & Environment', description: 'Government incentives and financial support for solar energy development and adoption.', following: true },
    { id: '2', name: 'Wind Energy Regulations', category: 'Energy & Environment', description: 'Laws and policies governing the development and operation of wind energy facilities.', following: true },
    { id: '3', name: 'Carbon Pricing', category: 'Energy & Environment', description: 'Mechanisms that put a price on carbon dioxide emissions to reduce greenhouse gas emissions.', following: true },
    { id: '4', name: 'Energy Storage Incentives', category: 'Energy & Environment', description: 'Governmental support for development and deployment of energy storage technologies.', following: false },
    { id: '5', name: 'Energy Taxation', category: 'Energy & Environment', description: 'Tax policies affecting energy production, distribution, and consumption.', following: true },
    { id: '6', name: 'Digital Infrastructure', category: 'Digital & Technology', description: 'Policies regarding broadband development, connectivity, and digital access initiatives.', following: true },
    { id: '7', name: 'AI Regulation', category: 'Digital & Technology', description: 'Emerging rules governing artificial intelligence development and application.', following: true },
    { id: '8', name: 'Data Privacy Laws', category: 'Digital & Technology', description: 'Legislation concerning personal data protection and privacy rights.', following: false },
    { id: '9', name: 'Digital Marketplace Rules', category: 'Digital & Technology', description: 'Regulations affecting online marketplaces, e-commerce, and digital trade.', following: false },
    { id: '10', name: 'Cybersecurity Standards', category: 'Digital & Technology', description: 'Security requirements and protocols for digital systems and networks.', following: false },
    { id: '11', name: 'Healthcare Reform', category: 'Healthcare', description: 'Major legislative changes to healthcare delivery and insurance systems.', following: false },
    { id: '12', name: 'Pharmaceutical Pricing', category: 'Healthcare', description: 'Government policies affecting drug prices and pharmaceutical market dynamics.', following: false },
    { id: '13', name: 'Banking Regulations', category: 'Finance & Economy', description: 'Rules governing banking operations, capital requirements, and financial services.', following: false },
    { id: '14', name: 'Tax Reform', category: 'Finance & Economy', description: 'Major changes to tax codes affecting individuals and businesses.', following: false },
    { id: '15', name: 'Electric Vehicle Incentives', category: 'Transportation', description: 'Government programs encouraging electric vehicle adoption and infrastructure.', following: false },
    { id: '16', name: 'Minimum Wage', category: 'Labor & Social', description: 'Policies setting wage floors and affecting employee compensation.', following: false },
  ];

  const [topics, setTopics] = useState<Topic[]>(allTopics);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setTopics(allTopics);
    } else {
      const filtered = allTopics.filter(topic => 
        topic.name.toLowerCase().includes(query) || 
        topic.category.toLowerCase().includes(query)
      );
      setTopics(filtered);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      if (selectedTopics.length >= 10) {
        toast({
          title: "Maximum topics reached",
          description: "You can select up to 10 topics. Please remove some to add more.",
          variant: "destructive",
        });
        return;
      }
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSaveChanges = () => {
    // Save the selected topics (in a real app this would go to a database)
    localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
    
    toast({
      title: "Topics updated",
      description: `You are now following ${selectedTopics.length} topics.`,
    });
    
    // Navigate to dashboard after saving
    navigate('/');
  };

  const categorizedTopics = categories.map(category => ({
    name: category,
    topics: topics.filter(topic => topic.category === category),
  }));

  // Initialize selected topics on component mount
  useEffect(() => {
    // First check if there are preselected topics from onboarding
    const preselectedTopics = localStorage.getItem('preselectedTopics');
    
    if (preselectedTopics) {
      // If we have preselected topics, use them and remove the key from localStorage
      setSelectedTopics(JSON.parse(preselectedTopics));
      localStorage.removeItem('preselectedTopics');
      
      toast({
        title: "Topics pre-selected",
        description: "We've selected topics based on your website. You can modify this selection.",
      });
    } else {
      // Otherwise, check for previously saved topics or use default following topics
      const savedTopics = localStorage.getItem('selectedTopics');
      if (savedTopics) {
        setSelectedTopics(JSON.parse(savedTopics));
      } else {
        const initialSelected = allTopics
          .filter(topic => topic.following)
          .map(topic => topic.id);
        setSelectedTopics(initialSelected);
      }
    }
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Topics</h1>
        <p className="text-gray-600">Select topics that matter to your organization (5-10 recommended)</p>
      </div>

      <div className="mb-6 animate-slide-up">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedTopics.length}</span> topics selected 
          <span className="text-gray-400"> (recommended: 5-10)</span>
        </div>
        <Button 
          onClick={handleSaveChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>

      <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {categorizedTopics.map((category, index) => (
          category.topics.length > 0 && (
            <div key={category.name} className="bg-white rounded-lg border border-politix-gray p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.topics.map(topic => {
                  const isSelected = selectedTopics.includes(topic.id);
                  
                  return (
                    <div 
                      key={topic.id}
                      className={cn(
                        "flex flex-col p-4 rounded-md border transition-all duration-200",
                        isSelected 
                          ? "border-blue-500 bg-blue-50 shadow-sm" 
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{topic.name}</span>
                        <button
                          onClick={() => handleTopicSelect(topic.id)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                            isSelected ? "bg-blue-600" : "bg-gray-200"
                          )}
                        >
                          {isSelected ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <Plus className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </MainLayout>
  );
};

export default Topics;
