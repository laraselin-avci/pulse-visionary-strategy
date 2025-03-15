
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
  // New fields from topic_analyses
  analysisData?: any;
  relevantExtracts?: any;
  keywords?: string[];
  sentiment?: string;
  summary?: string;
  topics?: string[];
  contentId?: string;
  contentType?: string;
  analysisDate?: string;
  analyzedAt?: string;
}

export const priorityOrder: Record<AlertPriority, number> = {
  urgent: 1,
  high: 2,
  medium: 3,
  low: 4,
  info: 5
};
