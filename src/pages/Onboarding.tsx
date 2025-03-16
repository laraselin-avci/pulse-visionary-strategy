
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface OnboardingProps {
  onWebsiteSubmit: (websiteUrl: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onWebsiteSubmit }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl) {
      toast({
        title: "Website URL is required",
        description: "Please enter a website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the analyze-website edge function
      const response = await fetch('https://vlacjeyimegjellrepjv.supabase.co/functions/v1/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze website');
      }

      const data = await response.json();
      console.log('Analysis result:', data);

      // Call the parent handler to store the website URL
      onWebsiteSubmit(websiteUrl);
      
      // Navigate to topics page
      navigate('/topics');
      
      toast({
        title: "Website analyzed successfully",
        description: `${data.topics.length} topics identified for ${websiteUrl}`,
      });
    } catch (error: any) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Error analyzing website",
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Welcome to Politix</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Let's get started</h2>
          <p className="text-gray-700 mb-6">
            Enter your company's website URL below. We'll analyze it to identify relevant policy and regulatory topics that matter to your business.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="website-url" className="block text-sm font-medium text-gray-700">
                Company Website URL
              </label>
              <Input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Website...
                </>
              ) : (
                'Analyze Website'
              )}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Onboarding;
