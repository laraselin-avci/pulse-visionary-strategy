
import { Topic } from '@/types/topics';

// Define the topics data
export const allTopics: Topic[] = [
  {
    id: '1',
    name: 'Solar Subsidies',
    category: 'Energy',
    description: 'Government financial incentives designed to promote the adoption of solar energy technologies.',
    following: true
  },
  {
    id: '2',
    name: 'Energy Taxation',
    category: 'Energy',
    description: 'Taxes imposed on energy production, distribution, and consumption to regulate the energy market.',
    following: false
  },
  {
    id: '3',
    name: 'Digital Infrastructure',
    category: 'Technology',
    description: 'The physical and organizational structures needed for the operation of digital technologies.',
    following: true
  },
  {
    id: '4',
    name: 'Renewable Energy',
    category: 'Energy',
    description: 'Energy collected from renewable resources that are naturally replenished on a human timescale.',
    following: false
  },
  {
    id: '5',
    name: 'Carbon Pricing',
    category: 'Environment',
    description: 'An instrument that captures the external costs of greenhouse gas emissions.',
    following: true
  },
  {
    id: '6',
    name: 'AI Regulation',
    category: 'Technology',
    description: 'Legal frameworks governing the development and use of artificial intelligence technologies.',
    following: false
  },
  {
    id: '7',
    name: 'Healthcare Reform',
    category: 'Healthcare',
    description: 'Changes to healthcare systems aimed at improving quality, access, and efficiency.',
    following: true
  },
  {
    id: '8',
    name: 'Pharmaceutical Pricing',
    category: 'Healthcare',
    description: 'Regulations and policies that determine how pharmaceutical products are priced in the market.',
    following: false
  },
  {
    id: '9',
    name: 'Education Funding',
    category: 'Education',
    description: 'Allocation of financial resources to educational institutions and programs.',
    following: true
  },
  {
    id: '10',
    name: 'Tax Reform',
    category: 'Finance',
    description: 'Changes to the way governments collect taxes from individuals and businesses.',
    following: false
  }
];

// Define the categories
export const categories: string[] = ['Energy', 'Technology', 'Environment', 'Healthcare', 'Education', 'Finance'];
