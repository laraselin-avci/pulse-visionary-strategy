
import { RegulatoryInsight } from '@/types/regulatory';

export const getOpenAIMockInsights = (): RegulatoryInsight[] => [
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
