
import { AlertPriority } from '@/components/ui/alert-card';

// Define priority order for sorting
export const priorityOrder: { [key in AlertPriority]: number } = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4
};

// Regulatory insight interface
export interface RegulatoryInsight {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
  relevantExtracts?: any; // Can be string[], object, or string
  topicId?: string;
  contentId?: string;
  contentType?: string;
}
