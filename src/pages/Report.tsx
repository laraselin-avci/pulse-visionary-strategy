
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCards } from '@/components/dashboard/StatCards';
import { TopicFilter } from '@/components/dashboard/TopicFilter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, SendIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from "@/components/ui/textarea";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { InsightsTable } from '@/components/dashboard/InsightsTable';
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';

const chatSchema = z.object({
  message: z.string().min(1, "Please enter a message")
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Report = () => {
  const { 
    topics, 
    alerts: insights, 
    selectedTopics, 
    filteredAlerts: filteredInsights, 
    handleTopicClick 
  } = useDashboardData();
  
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (values: ChatFormValues) => {
    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: values.message,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I've analyzed your query about "${values.message}". Here's what I found in our regulatory database...`,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      toast({
        title: "AI Response Generated",
        description: "New regulatory insights have been provided.",
      });
    }, 1500);
    
    // Reset form
    form.reset({ message: '' });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report</h1>
        <p className="text-gray-600">Monitor and analyze key regulatory developments</p>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[600px] rounded-lg border"
      >
        {/* Left Panel - Topics and Insights */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full p-4 overflow-auto flex flex-col">
            {/* Monitored Topics */}
            <TopicFilter 
              topics={topics} 
              selectedTopics={selectedTopics} 
              onTopicClick={handleTopicClick} 
            />
            
            {/* Insights Table */}
            <div className="mt-8 flex-1">
              <h2 className="text-lg font-semibold mb-4">Regulatory Insights</h2>
              <InsightsTable insights={filteredInsights} />
            </div>
          </div>
        </ResizablePanel>
        
        {/* Resize Handle */}
        <ResizableHandle withHandle />
        
        {/* Right Panel - Chat Interface */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">AI Regulatory Assistant</h2>
              <p className="text-gray-600">Ask any question about regulations and get AI-powered insights.</p>
            </div>
            
            {/* Chat Input at top */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            className="pl-4 pr-12 py-3 bg-white border-gray-200 focus-visible:ring-blue-500 min-h-[80px] resize-none"
                            placeholder="What would you like to know about regulations?"
                            {...field}
                            rows={3}
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="absolute bottom-2 right-2 h-8 w-8 p-0"
                            disabled={!form.formState.isValid || isProcessing}
                          >
                            <SendIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            
            {/* Chat History below input */}
            <div className="flex-1 border rounded-md p-4 overflow-y-auto">
              {chatHistory.length > 0 ? (
                <>
                  {chatHistory.map((message) => (
                    <div 
                      key={message.id}
                      className={`mb-3 ${message.isUser ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}
                    >
                      <div 
                        className={`p-3 rounded-lg ${
                          message.isUser 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center space-x-2 text-gray-500 mb-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Search className="h-12 w-12 mb-2 text-gray-400" />
                  <p className="text-center">Ask any question about regulations</p>
                  <p className="text-center text-sm">For example: "What are the latest updates on data privacy?"</p>
                </div>
              )}
            </div>
            
            {/* Clear button */}
            {chatHistory.length > 0 && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setChatHistory([]);
                  form.reset({ message: '' });
                }}
              >
                Clear conversation
              </Button>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </MainLayout>
  );
};

export default Report;
