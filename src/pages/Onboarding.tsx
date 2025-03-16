
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Check, PackageOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingProps {
  onWebsiteSubmit?: () => void;
}

const formSchema = z.object({
  websiteUrl: z.string().url({ message: "Please enter a valid website URL" })
});

type FormValues = z.infer<typeof formSchema>;

// Keywords that will be shown during analysis
const analyzeKeywords = [
  "Analyzing website content",
  "Identifying regulatory topics",
  "Matching policies",
  "Finding relevant legal frameworks",
  "Detecting compliance requirements",
  "Generating topic suggestions",
  "Finalizing recommendations"
];

const Onboarding: React.FC<OnboardingProps> = ({ onWebsiteSubmit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteUrl: ''
    }
  });

  // Effect to handle keyword animation during loading
  useEffect(() => {
    if (!isLoading) return;
    
    const keywordInterval = setInterval(() => {
      setCurrentKeywordIndex(prev => {
        const next = (prev + 1) % analyzeKeywords.length;
        return next;
      });
      
      setProgress(prev => {
        const newProgress = prev + (100 / (analyzeKeywords.length * 1.5));
        return Math.min(newProgress, 95); // Cap at 95% until complete
      });
    }, 800);
    
    return () => clearInterval(keywordInterval);
  }, [isLoading]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setProgress(5);
    setIsComplete(false);
    
    try {
      console.log('Website URL submitted:', values.websiteUrl);
      
      // Call our Supabase Edge Function to analyze the website
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { websiteUrl: values.websiteUrl }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      console.log('Analysis results:', data);
      
      // Set progress to 100% and show completion state
      setProgress(100);
      setIsComplete(true);
      
      // Store the flag indicating a website has been submitted
      localStorage.setItem('websiteSubmitted', 'true');
      
      // Show completion for a moment before navigating
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback if provided
      if (onWebsiteSubmit) {
        onWebsiteSubmit();
      }
      
      toast({
        title: "Website analyzed successfully",
        description: "We've created topics based on your website content.",
      });
      
      // Navigate to report page instead of dashboard
      navigate('/report');
    } catch (error: any) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-politix-gray-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl shadow-lg">
              <span className="font-bold text-2xl">P</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Politix</h1>
          <p className="text-gray-600">Get started by analyzing your website to find relevant regulatory topics.</p>
        </div>

        <Card className="border-politix-gray shadow-md">
          <CardHeader>
            <CardTitle>Analyze Your Website</CardTitle>
            <CardDescription>
              We'll scan your website content to suggest relevant regulatory topics to monitor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-4">
                  {isComplete ? (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                      <Check className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 animate-pulse">
                      <Loader className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="h-5">
                      {isComplete ? (
                        <p className="text-sm font-medium text-green-600">Analysis complete!</p>
                      ) : (
                        <p className="text-sm font-medium text-blue-600">{analyzeKeywords[currentKeywordIndex]}</p>
                      )}
                    </div>
                    <Progress value={progress} className="h-2 mt-2" />
                  </div>
                </div>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4">
                    <PackageOpen className="h-5 w-5 text-gray-400" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <PackageOpen className="h-5 w-5 text-gray-400" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-3/5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <PackageOpen className="h-5 w-5 text-gray-400" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://your-company.com" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your company website to help us understand your business.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Analyzing..." : "Analyze Website"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Already have an account? <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => navigate('/')}>Go to Dashboard</Button></p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
