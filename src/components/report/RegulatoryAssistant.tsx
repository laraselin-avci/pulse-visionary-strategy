
import React, { useState } from 'react';
import { SendIcon, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { useRegulatoryInsights } from '@/hooks/useRegulatoryInsights';

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

export const RegulatoryAssistant: React.FC = () => {
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get access to the insights directly from the hook for AI analysis
  const { insights } = useRegulatoryInsights(
    [], // Empty array to get all topics
    [], // No topic filter to get all insights
    ['urgent', 'high', 'medium', 'low', 'info'] // All priorities
  );

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: ChatFormValues) => {
    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: values.message,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Call the Supabase Edge Function with the user's query and the insights
      const { data, error } = await supabase.functions.invoke('regulatory-assistant', {
        body: {
          query: values.message,
          insights: insights,
        },
      });

      if (error) {
        console.error('Error calling regulatory-assistant function:', error);
        throw new Error('Failed to get a response from the AI. Please try again.');
      }

      // Add AI response to chat history
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I could not analyze the regulatory insights. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      
      toast({
        title: "AI Analysis Complete",
        description: "Regulatory insights have been analyzed based on your query.",
      });
    } catch (error) {
      console.error('Error in regulatory AI assistant:', error);
      
      // Add error message to chat history
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while analyzing the regulatory insights. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      // Reset form
      form.reset({ message: '' });
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">AI Regulatory Assistant</h2>
        <p className="text-gray-600">Ask questions about the regulatory insights to get AI-powered analysis.</p>
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
                      placeholder="What would you like to know about the regulatory insights?"
                      {...field}
                      rows={3}
                      disabled={isProcessing}
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
                <span className="text-sm ml-2">Analyzing regulatory insights...</span>
              </div>
            )}
          </>
        ) : insights.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-center">Ask any question about the regulatory insights</p>
            <p className="text-center text-sm">For example: "What are the latest updates on data privacy?" or "Summarize the most urgent regulatory concerns."</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <AlertCircle className="h-12 w-12 mb-2 text-amber-500" />
            <p className="text-center font-medium">No regulatory insights available</p>
            <p className="text-center text-sm">Please select some topics to monitor or check your data source.</p>
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
  );
};
