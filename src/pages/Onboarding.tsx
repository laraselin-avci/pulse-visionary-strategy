
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface OnboardingProps {
  onWebsiteSubmit?: () => void;
}

const formSchema = z.object({
  websiteUrl: z.string().url({ message: "Please enter a valid website URL" })
});

type FormValues = z.infer<typeof formSchema>;

const Onboarding: React.FC<OnboardingProps> = ({ onWebsiteSubmit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteUrl: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // This would typically be an API call to analyze the website
      console.log('Website URL submitted:', values.websiteUrl);
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate topic selection based on website analysis
      const preselectedTopics = ['1', '3', '6']; // IDs that match some topics from the Topics page
      
      // Store the preselected topics in localStorage (in a real app, this would come from a backend)
      localStorage.setItem('preselectedTopics', JSON.stringify(preselectedTopics));
      
      // Set the flag indicating a website has been submitted
      localStorage.setItem('websiteSubmitted', 'true');
      
      // Call the callback if provided
      if (onWebsiteSubmit) {
        onWebsiteSubmit();
      }
      
      toast({
        title: "Website analyzed successfully",
        description: "We've pre-selected topics based on your website content.",
      });
      
      // Navigate to report page instead of dashboard
      navigate('/report');
    } catch (error) {
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
