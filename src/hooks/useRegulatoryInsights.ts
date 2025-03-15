
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
  topicId: string;
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
          const formattedInsights: RegulatoryInsight[] = data.map(item => {
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
              topicId: item.topic_id || ''
            };
          });
          
          // Add OpenAI regulatory insights
          const openAIMockInsights: RegulatoryInsight[] = [
            {
              id: 'openai-1',
              title: 'EU Commission Investigating OpenAI for Data Privacy Concerns',
              description: 'The European Commission has launched a formal investigation into OpenAI regarding potential GDPR violations related to training data acquisition and privacy safeguards in their large language models.',
              source: 'European Commission Press Release',
              priority: 'high',
              date: 'May 15, 2023',
              topic: 'Data Privacy',
              topicId: '3'
            },
            {
              id: 'openai-2',
              title: 'New Licensing Requirements for LLM Providers',
              description: 'Parliament has proposed new licensing requirements for providers of large language models like OpenAI. The proposal includes mandatory transparency reports and algorithmic auditing.',
              source: 'Parliamentary Committee on AI Safety',
              priority: 'urgent',
              date: 'June 2, 2023',
              topic: 'AI Regulation',
              topicId: '1'
            },
            {
              id: 'openai-3',
              title: 'OpenAI Required to Establish European HQ for Regulatory Compliance',
              description: 'New regulatory framework requires AI companies including OpenAI to establish European headquarters for closer oversight and faster response to compliance issues.',
              source: 'European Digital Authority',
              priority: 'medium',
              date: 'May 28, 2023',
              topic: 'AI Governance',
              topicId: '7'
            },
            {
              id: 'openai-4',
              title: 'OpenAI Releases New Guidelines for Model Transparency',
              description: 'OpenAI has published new guidelines on model transparency, including detailed explanations of training methodologies and dataset composition to address concerns about algorithmic bias.',
              source: 'OpenAI Blog',
              priority: 'medium',
              date: 'June 10, 2023',
              topic: 'AI Transparency',
              topicId: '5'
            },
            {
              id: 'openai-5',
              title: 'Industry Standards Body Created for AI Model Evaluation',
              description: 'A new industry standards body has been established to create evaluation metrics for AI systems like those from OpenAI. Participation will be mandatory for models deployed in critical sectors.',
              source: 'Standards Authority',
              priority: 'low',
              date: 'June 15, 2023',
              topic: 'AI Regulation',
              topicId: '1'
            },
            {
              id: 'openai-6',
              title: 'OpenAI Contributes to Open Source AI Research Initiative',
              description: 'OpenAI has announced a major contribution to an open source AI research initiative, sharing select model architectures and training methodologies to foster collaboration and advancement in the field.',
              source: 'OpenAI Research Blog',
              priority: 'medium',
              date: 'June 20, 2023',
              topic: 'Open Source AI',
              topicId: '8'
            },
            {
              id: 'openai-7',
              title: 'Ethics Board Established for LLM Governance at OpenAI',
              description: 'OpenAI has formed an independent ethics board to oversee decisions related to model deployments, usage policies, and response to misuse, composed of experts from diverse disciplines.',
              source: 'AI Ethics Journal',
              priority: 'high',
              date: 'July 1, 2023',
              topic: 'AI Ethics',
              topicId: '4'
            },
            {
              id: 'openai-8',
              title: 'OpenAI Faces Patent Infringement Claims Over Training Data',
              description: 'A group of content creators has filed intellectual property claims against OpenAI, alleging unauthorized use of copyrighted materials in training datasets for their language models.',
              source: 'Technology Law Review',
              priority: 'high',
              date: 'July 5, 2023',
              topic: 'AI Intellectual Property',
              topicId: '10'
            }
          ];
          
          // Filter OpenAI insights to match selected topics if any are selected
          const filteredOpenAIInsights = selectedTopicIds.length > 0
            ? openAIMockInsights.filter(insight => 
                selectedTopicIds.includes(insight.topicId))
            : openAIMockInsights;
          
          const combinedInsights: RegulatoryInsight[] = [...formattedInsights, ...filteredOpenAIInsights];
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
