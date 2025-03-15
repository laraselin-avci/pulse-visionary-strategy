
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Plus, PenLine, Globe } from 'lucide-react';

interface TopicCardProps {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
  isPublic?: boolean;
  onSelect: (topicId: string) => void;
  onEdit?: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  id,
  name,
  description,
  isSelected,
  isPublic = false,
  onSelect,
  onEdit
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col p-4 rounded-md border transition-all duration-200",
        isSelected 
          ? "border-blue-500 bg-blue-50 shadow-sm" 
          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium text-gray-800">{name}</span>
          {isPublic && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <Globe className="h-3 w-3 mr-1" />
              Public
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
              title="Edit topic"
            >
              <PenLine className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onSelect(id)}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
              isSelected ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            {isSelected ? (
              <Check className="h-4 w-4 text-white" />
            ) : (
              <Plus className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default TopicCard;
