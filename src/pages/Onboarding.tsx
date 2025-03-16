
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import TopicCard from '@/components/topics/TopicCard';
import { categorizeTopics } from '@/utils/topicUtils';

interface OnboardingProps {
  onWebsiteSubmit: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onWebsiteSubmit }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Handle website submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website) {
      toast({
        title: "Website URL is required",
        description: "Please enter a website URL to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    let formattedUrl = website;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function to analyze the website
      const response = await fetch('https://vlacjeyimegjellrepjv.supabase.co/functions/v1/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteUrl: formattedUrl }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log('Website analysis response:', data);
      
      // Format topics for display
      if (data.topics && data.topics.length > 0) {
        setGeneratedTopics(data.topics.map((topic: any, index: number) => ({
          id: data.addedTopics[index]?.id || `temp-${index}`,
          name: topic.name,
          description: topic.description,
          following: true,
          category: 'Automatically Generated'
        })));
        
        // Automatically select all topics
        if (data.addedTopics && data.addedTopics.length > 0) {
          const topicIds = data.addedTopics.map((t: any) => t.id);
          setSelectedTopics(topicIds);
          
          // Store generated topic IDs and analyzed website URL
          localStorage.setItem('analyzedWebsiteTopicIds', JSON.stringify(topicIds));
          localStorage.setItem('analyzedWebsite', formattedUrl);
          console.log('Stored topic IDs for website:', topicIds);
        }
      } else {
        setGeneratedTopics([]);
        toast({
          title: "No topics found",
          description: "We couldn't identify specific topics for this website. You can add custom topics later.",
        });
      }
      
      // Mark website as submitted
      localStorage.setItem('websiteSubmitted', 'true');
      onWebsiteSubmit();
      
    } catch (error: any) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle topic selection
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };
  
  // Handle continue to dashboard
  const handleContinue = () => {
    if (selectedTopics.length > 0) {
      // Store selected topics for later use
      localStorage.setItem('preselectedTopics', JSON.stringify(selectedTopics));
    }
    
    navigate('/topics');
  };
  
  // Group topics by category
  const categorizedTopics = categorizeTopics(generatedTopics);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container max-w-5xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Politix</h1>
          <p className="mt-2 text-lg text-gray-600">
            Enter your company's website URL to get started with personalized regulatory monitoring.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Company Website URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="example.com"
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !website}>
                  {isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll analyze your website to identify relevant regulatory topics.
              </p>
            </div>
          </form>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Analyzing your website</h2>
              <p className="text-gray-600">This may take a minute...</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : generatedTopics.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                We've identified {generatedTopics.length} topics for your organization
              </h2>
              <p className="text-gray-600">
                These topics are based on your website content. You can customize this selection later.
              </p>
            </div>
            
            <div className="space-y-8">
              {categorizedTopics.map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.topics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        isSelected={selectedTopics.includes(topic.id)}
                        onSelect={() => handleTopicSelect(topic.id)}
                        onEdit={() => {}} // No edit functionality in onboarding
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleContinue} 
                size="lg"
                className="px-8"
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        ) : localStorage.getItem('websiteSubmitted') === 'true' ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              You're all set!
            </h2>
            <p className="text-gray-600 mb-6">
              You can now continue to the dashboard or add custom topics.
            </p>
            <Button onClick={handleContinue}>
              Continue to Dashboard
            </Button>
          </div>
        ) : null}
      </main>
      
      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Politix - AI-Powered Regulatory Monitoring
      </footer>
    </div>
  );
};

export default Onboarding;
