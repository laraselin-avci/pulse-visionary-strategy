
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertPriority } from '@/components/ui/alert-card';

export interface RegulatoryInsight {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
  topicId?: string;
}

export const useRegulatoryInsights = (selectedTopicIds: string[] = []) => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<RegulatoryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('topic_analyses')
          .select('*')
          .eq('content_type', 'regulatory_insight');

        // Filter by selected topics if any are selected
        if (selectedTopicIds.length > 0) {
          query = query.in('topic_id', selectedTopicIds);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching regulatory insights:', error);
          toast({
            title: "Error fetching insights",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Map database data to RegulatoryInsight format
          const formattedInsights = data.map(item => {
            const analysisData = item.analysis_data as any;
            const relevantExtracts = item.relevant_extracts as any;
            
            return {
              id: item.id,
              title: item.summary || analysisData?.title || '',
              description: relevantExtracts?.description || analysisData?.description || '',
              source: relevantExtracts?.source || analysisData?.source || '',
              priority: (relevantExtracts?.priority || analysisData?.priority || 'medium') as AlertPriority,
              date: relevantExtracts?.date || analysisData?.date || new Date(item.analysis_date).toLocaleString(),
              topic: item.topics && item.topics.length > 0 ? item.topics[0] : '',
              topicId: item.topic_id
            };
          });
          
          // Add mock OpenAI regulatory insights
          const openAIMockInsights: RegulatoryInsight[] = [
            {
              id: 'openai-1',
              title: 'EU Commission Investigating OpenAI for Data Privacy Concerns',
              description: 'The European Commission has launched a formal investigation into OpenAI regarding potential GDPR violations related to training data acquisition and privacy safeguards in their large language models.',
              source: 'European Commission Press Release',
              priority: 'high',
              date: 'May 15, 2023',
              topic: 'AI Regulation',
              topicId: selectedTopicIds.find(id => 
                formattedInsights.some(insight => insight.topicId === id && insight.topic === 'AI Regulation'))
            },
            {
              id: 'openai-2',
              title: 'New Licensing Requirements for LLM Providers',
              description: 'Parliament has proposed new licensing requirements for providers of large language models like OpenAI. The proposal includes mandatory transparency reports and algorithmic auditing.',
              source: 'Parliamentary Committee on AI Safety',
              priority: 'urgent',
              date: 'June 2, 2023',
              topic: 'AI Regulation',
              topicId: selectedTopicIds.find(id => 
                formattedInsights.some(insight => insight.topicId === id && insight.topic === 'AI Regulation'))
            },
            {
              id: 'openai-3',
              title: 'OpenAI Required to Establish European HQ for Regulatory Compliance',
              description: 'New regulatory framework requires AI companies including OpenAI to establish European headquarters for closer oversight and faster response to compliance issues.',
              source: 'European Digital Authority',
              priority: 'medium',
              date: 'May 28, 2023',
              topic: 'AI Regulation',
              topicId: selectedTopicIds.find(id => 
                formattedInsights.some(insight => insight.topicId === id && insight.topic === 'AI Regulation'))
            },
            {
              id: 'openai-4',
              title: 'Public Sector Guidelines for Using OpenAI Tools Released',
              description: 'The Ministry of Digital Affairs has published guidelines for public sector organizations on responsible use of OpenAI and similar AI tools. The guidelines include security protocols and content guidelines.',
              source: 'Ministry of Digital Affairs',
              priority: 'medium',
              date: 'June 10, 2023',
              topic: 'Digital Infrastructure',
              topicId: selectedTopicIds.find(id => 
                formattedInsights.some(insight => insight.topicId === id && insight.topic === 'Digital Infrastructure'))
            },
            {
              id: 'openai-5',
              title: 'Industry Standards Body Created for AI Model Evaluation',
              description: 'A new industry standards body has been established to create evaluation metrics for AI systems like those from OpenAI. Participation will be mandatory for models deployed in critical sectors.',
              source: 'Standards Authority',
              priority: 'low',
              date: 'June 15, 2023',
              topic: 'AI Regulation',
              topicId: selectedTopicIds.find(id => 
                formattedInsights.some(insight => insight.topicId === id && insight.topic === 'AI Regulation'))
            }
          ];
          
          // Only add OpenAI insights if an AI Regulation topic is selected or if no topics are selected
          let combinedInsights = [...formattedInsights];
          
          if (selectedTopicIds.length === 0 || selectedTopicIds.some(id => 
              formattedInsights.some(insight => insight.topicId === id && 
                (insight.topic === 'AI Regulation' || insight.topic === 'Digital Infrastructure')))) {
            // Filter OpenAI insights to only include ones that match selected topics or all if no topics selected
            const filteredOpenAIInsights = openAIMockInsights.filter(insight => 
              !selectedTopicIds.length || (insight.topicId && selectedTopicIds.includes(insight.topicId)));
            
            combinedInsights = [...formattedInsights, ...filteredOpenAIInsights];
          }
          
          setInsights(combinedInsights);
        }
      } catch (error: any) {
        console.error('Error fetching regulatory insights:', error);
        toast({
          title: "Error fetching insights",
          description: "Failed to fetch insights. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedTopicIds, toast]);

  return {
    insights,
    isLoading,
    filteredInsights: insights,
  };
};
