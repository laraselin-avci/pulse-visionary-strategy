
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term")
});

type SearchFormValues = z.infer<typeof searchSchema>;

const Report = () => {
  const { 
    topics, 
    alerts, 
    selectedTopics, 
    filteredAlerts, 
    handleTopicClick 
  } = useDashboardData();
  
  const { toast } = useToast();

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
    
    // Reset form
    form.reset({ query: '' });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 animate-slide-up">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <div className="relative max-w-xl">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          className="pl-10 pr-24 bg-white border-gray-200 focus-visible:ring-blue-500 shadow-sm"
                          placeholder="Ask about any regulatory topic..."
                          {...field}
                        />
                        <Button 
                          type="submit" 
                          variant="default"
                          size="sm"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!form.formState.isValid}
                        >
                          Search
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Monitored Topics */}
      <TopicFilter 
        topics={topics} 
        selectedTopics={selectedTopics} 
        onTopicClick={handleTopicClick} 
      />
      
      {/* Insights/Alerts */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Regulatory Alerts</h2>
        <AlertsList alerts={filteredAlerts} />
      </div>
    </MainLayout>
  );
};

export default Report;
