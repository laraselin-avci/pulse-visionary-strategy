
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { InsightsList } from '@/components/dashboard/AlertsList';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term")
});

type SearchFormValues = z.infer<typeof searchSchema>;

const Report = () => {
  const { 
    topics, 
    alerts: insights, 
    selectedTopics, 
    filteredAlerts: filteredInsights, 
    handleTopicClick 
  } = useDashboardData();
  
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    toast({
      title: "AI Search Initiated",
      description: `Searching for information about "${values.query}"`,
    });
    
    // Close the dialog after submission
    setDialogOpen(false);
    
    // Reset form
    form.reset({ query: '' });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

      {/* Search Button with Dialog */}
      <div className="mb-6 animate-slide-up">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white border-gray-200 shadow-sm hover:bg-gray-50 text-gray-700 gap-2 px-4"
            >
              <Search className="h-4 w-4" />
              <span>Ask about any regulatory topic...</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>AI Regulatory Search</DialogTitle>
              <DialogDescription>
                Ask a question about any regulatory topic to get AI-powered insights.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            className="pl-10 pr-4 bg-white border-gray-200 focus-visible:ring-blue-500"
                            placeholder="What would you like to know?"
                            {...field}
                            autoFocus
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="default"
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    disabled={!form.formState.isValid}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Monitored Topics */}
      <TopicFilter 
        topics={topics} 
        selectedTopics={selectedTopics} 
        onTopicClick={handleTopicClick} 
      />
      
      {/* Insights */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Regulatory Insights</h2>
        <InsightsList insights={filteredInsights} showHeader={false} />
      </div>
    </MainLayout>
  );
};

export default Report;
