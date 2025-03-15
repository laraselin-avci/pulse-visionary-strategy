
import React from 'react';
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { AlertPriority } from '@/components/ui/alert-card';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface InsightItem {
  id: string;
  title: string;
  description: string;
  source: string;
  priority: AlertPriority;
  date: string;
  topic: string;
}

interface InsightsTableProps {
  insights: InsightItem[];
}

export const InsightsTable: React.FC<InsightsTableProps> = ({ insights }) => {
  const { toast } = useToast();

  const handleViewDetails = (insightId: string) => {
    toast({
      title: "Insight details",
      description: "Insight details view would open here.",
    });
  };

  // Get priority icon and color
  const getPriorityDetails = (priority: AlertPriority) => {
    const config = {
      urgent: {
        icon: AlertTriangle,
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
      },
      high: {
        icon: AlertTriangle,
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
      },
      medium: {
        icon: Info,
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      low: {
        icon: Info,
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
      },
      info: {
        icon: Info,
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
      },
    };

    return config[priority];
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Priority</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[150px]">Topic</TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insights.map((insight) => {
            const { icon: PriorityIcon, textColor, bgColor } = getPriorityDetails(insight.priority);
            
            return (
              <TableRow key={insight.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className={cn("flex items-center gap-1.5", textColor)}>
                    <div className={cn("p-1 rounded-full", bgColor)}>
                      <PriorityIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium capitalize">
                      {insight.priority}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{insight.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Source: {insight.source}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {insight.topic}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {insight.date}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                    onClick={() => handleViewDetails(insight.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          
          {insights.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No regulatory insights found for the selected topics.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
