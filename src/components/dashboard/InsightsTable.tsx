
import React, { useState } from 'react';
import { AlertCard, AlertPriority } from '@/components/ui/alert-card';
import { useToast } from '@/components/ui/use-toast';
import { RegulatoryInsight } from '@/hooks/useRegulatoryInsights';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightsTableProps {
  insights: RegulatoryInsight[];
  showFullData?: boolean;
}

export const InsightsTable: React.FC<InsightsTableProps> = ({ insights, showFullData = false }) => {
  const { toast } = useToast();
  const [selectedInsight, setSelectedInsight] = useState<RegulatoryInsight | null>(null);

  const handleViewDetails = (insight: RegulatoryInsight) => {
    setSelectedInsight(insight);
  };

  const closeDialog = () => {
    setSelectedInsight(null);
  };

  // Format data for display in the detail dialog
  const formatDataItem = (label: string, value: any) => {
    if (value === null || value === undefined) return null;
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
          <pre className="mt-1 p-2 bg-gray-100 rounded-md text-xs overflow-auto">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
          <div className="mt-1">
            {value.map((item, i) => (
              <div key={i} className="bg-gray-100 rounded-md px-2 py-1 text-sm inline-block mr-2 mb-2">
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    );
  };

  return (
    <div className="w-full overflow-auto space-y-4">
      {insights.map((insight) => (
        <AlertCard
          key={insight.id}
          title={insight.title}
          description={insight.description}
          source={insight.source}
          priority={insight.priority}
          date={insight.date}
          topic={insight.topic}
          onClick={() => handleViewDetails(insight)}
        />
      ))}
      
      {insights.length === 0 && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
          No regulatory insights found for the selected topics.
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={selectedInsight !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle>{selectedInsight?.title}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Complete insight data from topic_analyses
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {formatDataItem("ID", selectedInsight.id)}
                  {formatDataItem("Title", selectedInsight.title)}
                  {formatDataItem("Description", selectedInsight.description)}
                  {formatDataItem("Source", selectedInsight.source)}
                  {formatDataItem("Priority", selectedInsight.priority)}
                  {formatDataItem("Date", selectedInsight.date)}
                  {formatDataItem("Topic", selectedInsight.topic)}
                  {formatDataItem("Topic ID", selectedInsight.topicId)}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedInsight.analysisData && formatDataItem("Analysis Data", selectedInsight.analysisData)}
                  {selectedInsight.relevantExtracts && formatDataItem("Relevant Extracts", selectedInsight.relevantExtracts)}
                  {selectedInsight.keywords && formatDataItem("Keywords", selectedInsight.keywords)}
                  {selectedInsight.sentiment && formatDataItem("Sentiment", selectedInsight.sentiment)}
                  {selectedInsight.summary && formatDataItem("Summary", selectedInsight.summary)}
                  {selectedInsight.topics && formatDataItem("Topics", selectedInsight.topics)}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
