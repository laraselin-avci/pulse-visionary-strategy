
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

export const priorityOrder: Record<AlertPriority, number> = {
  urgent: 1,
  high: 2,
  medium: 3,
  low: 4,
  info: 5
};
