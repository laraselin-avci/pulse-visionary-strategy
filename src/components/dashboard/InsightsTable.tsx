
import React, { useState } from 'react';
import { AlertCard, AlertPriority } from '@/components/ui/alert-card';
import { useToast } from '@/components/ui/use-toast';
import { RegulatoryInsight } from '@/hooks/useRegulatoryInsights';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InsightsTableProps {
  insights: RegulatoryInsight[];
}

export const InsightsTable: React.FC<InsightsTableProps> = ({ insights }) => {
  const { toast } = useToast();
  const [selectedInsight, setSelectedInsight] = useState<RegulatoryInsight | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (insight: RegulatoryInsight) => {
    setSelectedInsight(insight);
    setIsDialogOpen(true);
  };

  // Log insights for debugging
  console.log('Rendering insights table with insights:', insights);

  return (
    <>
      <div className="w-full overflow-auto space-y-4">
        {Array.isArray(insights) && insights.length > 0 ? (
          insights.map((insight) => {
            // Validate insight data before rendering
            if (!insight || !insight.id) {
              console.error('Invalid insight data:', insight);
              return null;
            }
            
            return (
              <AlertCard
                key={insight.id}
                title={insight.title || 'Untitled Insight'}
                description={insight.description || 'No description available'}
                source={insight.source || 'Unknown source'}
                priority={insight.priority || 'medium'}
                date={insight.date || 'Unknown date'}
                topic={insight.topic || 'Unspecified topic'}
                onClick={() => handleViewDetails(insight)}
              />
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
            No regulatory insights found. 
            <div className="mt-2 text-sm">
              Check Supabase for data in the topic_analyses table or adjust your filters.
            </div>
          </div>
        )}
      </div>

      {/* Dialog for showing relevant extracts */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedInsight && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{selectedInsight.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedInsight.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    selectedInsight.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                    selectedInsight.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    selectedInsight.priority === 'low' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedInsight.priority.charAt(0).toUpperCase() + selectedInsight.priority.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">{selectedInsight.date}</span>
                  <span className="text-xs font-medium text-gray-600">{selectedInsight.topic}</span>
                </div>
              </DialogHeader>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedInsight.description}</p>
                
                <h3 className="text-sm font-medium text-gray-700 mb-2">Relevant Extracts</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  {selectedInsight.relevantExtracts ? (
                    Array.isArray(selectedInsight.relevantExtracts) ? (
                      <div className="space-y-3">
                        {selectedInsight.relevantExtracts.map((extract, index) => (
                          <div key={index} className="border-l-2 border-blue-400 pl-3 py-1">
                            <p className="text-sm text-gray-700">{extract}</p>
                          </div>
                        ))}
                      </div>
                    ) : typeof selectedInsight.relevantExtracts === 'object' ? (
                      <div className="space-y-3">
                        {Object.entries(selectedInsight.relevantExtracts).map(([key, value], index) => (
                          <div key={index} className="border-l-2 border-blue-400 pl-3 py-1">
                            <p className="text-sm font-medium text-gray-700">{key}</p>
                            <p className="text-sm text-gray-600">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {typeof selectedInsight.relevantExtracts === 'string' 
                          ? selectedInsight.relevantExtracts 
                          : JSON.stringify(selectedInsight.relevantExtracts)}
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500 italic">No relevant extracts available</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                  <div>Source: {selectedInsight.source}</div>
                  <div>ID: {selectedInsight.id}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
