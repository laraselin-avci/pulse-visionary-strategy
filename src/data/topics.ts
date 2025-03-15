
import { Topic } from '@/types/topics';

// Define the topics data
export const allTopics: Topic[] = [
  {
    id: '1',
    name: 'AI Regulation',
    category: 'Technology',
    description: 'Legal frameworks governing the development and use of artificial intelligence technologies.',
    following: true
  },
  {
    id: '2',
    name: 'LLM Safety',
    category: 'Technology',
    description: 'Guidelines and measures to ensure large language models operate safely and ethically.',
    following: false
  },
  {
    id: '3',
    name: 'Data Privacy',
    category: 'Technology',
    description: 'Regulations around data collection, storage, and usage for AI training and operations.',
    following: true
  },
  {
    id: '4',
    name: 'AI Ethics',
    category: 'Technology',
    description: 'Principles and frameworks for ethical AI development and deployment.',
    following: false
  },
  {
    id: '5',
    name: 'AI Transparency',
    category: 'Technology',
    description: 'Requirements for making AI systems and their decision-making processes understandable.',
    following: true
  },
  {
    id: '6',
    name: 'Algorithmic Bias',
    category: 'Technology',
    description: 'Regulations addressing biases in AI algorithms and their societal impacts.',
    following: false
  },
  {
    id: '7',
    name: 'AI Governance',
    category: 'Technology',
    description: 'Frameworks for governing AI development and use across organizations and jurisdictions.',
    following: true
  },
  {
    id: '8',
    name: 'Open Source AI',
    category: 'Technology',
    description: 'Policies regarding open source AI development, transparency, and accessibility.',
    following: false
  },
  {
    id: '9',
    name: 'AI Research',
    category: 'Technology',
    description: 'Academic and industry research initiatives advancing AI capabilities and understanding.',
    following: true
  },
  {
    id: '10',
    name: 'AI Intellectual Property',
    category: 'Technology',
    description: 'Legal frameworks for AI-related intellectual property, including patents and copyrights.',
    following: false
  }
];

// Define the categories
export const categories: string[] = ['Technology', 'Ethics', 'Policy', 'Research', 'Industry'];
