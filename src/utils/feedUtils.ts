
import { RegulatoryInsight } from '@/types/regulatory';
import { Topic } from '@/types/topics';

// Feed item types
export type FeedItemType = 'tweet' | 'rss' | 'news';

// Feed item interface
export interface FeedItem {
  id: string;
  type: FeedItemType;
  content: string;
  source: string;
  author?: string;
  authorImage?: string;
  date: string;
  url?: string;
  topic: string;
  verified?: boolean;
}

// Mock Twitter handles for AI regulation
const aiTwitterProfiles = [
  { handle: '@AIEthicsLab', name: 'AI Ethics Lab', verified: true },
  { handle: '@AIRegWatch', name: 'AI Regulation Watch', verified: true },
  { handle: '@TechPolicyInst', name: 'Tech Policy Institute', verified: true },
  { handle: '@AIGovernance', name: 'AI Governance Alliance', verified: true },
  { handle: '@AIRegulations', name: 'AI Regulations News', verified: false },
  { handle: '@AIPolicy', name: 'AI Policy Forum', verified: true },
  { handle: '@AILawReview', name: 'AI Law Review', verified: false },
  { handle: '@OpenAI', name: 'OpenAI', verified: true },
  { handle: '@DeepMind', name: 'Google DeepMind', verified: true },
  { handle: '@AnthropicAI', name: 'Anthropic', verified: true },
];

// Mock RSS/news sources for AI regulation
const aiNewsSources = [
  'AI Daily',
  'Tech Policy Report',
  'Regulation Today',
  'AI Governance Bulletin',
  'Ethics in AI Newsletter',
  'The AI Monitor',
  'Digital Rights Watch',
  'Tech Regulation Times',
  'AI Law Journal',
  'Future of AI Digest',
];

// Tweet templates for AI regulation topics
const tweetTemplates = [
  'New policy alert: {topic} regulations are being drafted by EU authorities. This could significantly impact AI development in Europe. #AIRegulation',
  'Just published our analysis on {topic}. The implications for the industry are substantial. Read our full report at techpolicy.org/report',
  'Attended the {topic} summit yesterday. Key takeaway: we need clearer guidelines on AI safety and ethical standards. Thread 🧵',
  'Breaking: New {topic} framework announced that will require additional compliance measures for AI companies. Implementation expected in Q3.',
  'Our research shows that 68% of AI companies are unprepared for the upcoming {topic} legislation. Time to adapt is running short.',
  'Interesting development in {topic}: regulators are now focusing on explainability requirements for high-risk AI systems.',
  'The debate on {topic} is heating up. Industry leaders and policymakers still at odds over the scope of restrictions.',
  'ICYMI: Our webinar on navigating {topic} compliance is now available on-demand. Essential viewing for AI developers.',
  'The latest {topic} directive introduces mandatory risk assessments for autonomous systems. Here\'s what you need to know:',
  'We\'re seeing a significant shift in how {topic} is being approached by regulators. More emphasis on preventative measures than ever before.'
];

// News/RSS templates for AI regulation topics
const newsTemplates = [
  'EU Commission Proposes Stricter Rules on {topic}',
  'Industry Response to New {topic} Guidelines: Mixed Reactions',
  'The Impact of {topic} on Innovation: A Comprehensive Analysis',
  '{topic} Compliance: What Companies Need to Know for 2024',
  'Global Standards for {topic} Begin to Emerge',
  'Researchers Warn of Gaps in Current {topic} Frameworks',
  'Balancing Innovation and Safety: The Challenge of {topic}',
  'How Small AI Companies Are Adapting to {topic} Requirements',
  'Parliamentary Debate on {topic} Scheduled for Next Week',
  'Expert Panel Releases Recommendations on {topic}',
  'The Economic Impact of {topic}: New Study Released',
  '{topic} in Practice: Case Studies from Leading AI Labs',
];

// Generate a random tweet about a specific topic
export const generateMockTweet = (topic: string): FeedItem => {
  const profile = aiTwitterProfiles[Math.floor(Math.random() * aiTwitterProfiles.length)];
  const tweetTemplate = tweetTemplates[Math.floor(Math.random() * tweetTemplates.length)];
  const content = tweetTemplate.replace('{topic}', topic);
  
  // Generate a random time within the last 24 hours
  const minutesAgo = Math.floor(Math.random() * 60);
  const date = minutesAgo <= 0 ? 'Just now' : `${minutesAgo}m ago`;
  
  return {
    id: `tweet-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    type: 'tweet',
    content,
    source: 'Twitter',
    author: profile.name,
    authorImage: `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.handle}`,
    date,
    url: `https://twitter.com/${profile.handle.substring(1)}/status/${Math.floor(Math.random() * 1000000000)}`,
    topic,
    verified: profile.verified,
  };
};

// Generate a random news item about a specific topic
export const generateMockNewsItem = (topic: string): FeedItem => {
  const source = aiNewsSources[Math.floor(Math.random() * aiNewsSources.length)];
  const newsTemplate = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
  const title = newsTemplate.replace('{topic}', topic);
  
  // Generate random content based on the title
  const content = `${title}. New developments in the field of ${topic} are shaping how AI systems will be governed in the coming years. Experts suggest these changes will significantly impact how companies develop and deploy AI technologies.`;
  
  // Generate a random time within the last few hours
  const hoursAgo = Math.floor(Math.random() * 5) + 1;
  const date = `${hoursAgo}h ago`;
  
  return {
    id: `news-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    type: 'rss',
    content,
    source,
    date,
    url: `https://example.com/news/${Math.floor(Math.random() * 10000)}`,
    topic,
  };
};

// Generate a batch of feed items based on selected topics
export const generateMockFeedItems = (topics: Topic[], count: number = 1): FeedItem[] => {
  if (topics.length === 0) return [];
  
  const result: FeedItem[] = [];
  
  for (let i = 0; i < count; i++) {
    // Select a random topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // Randomly decide if this should be a tweet or news item
    const isTweet = Math.random() > 0.5;
    
    if (isTweet) {
      result.push(generateMockTweet(randomTopic.name));
    } else {
      result.push(generateMockNewsItem(randomTopic.name));
    }
  }
  
  return result;
};
