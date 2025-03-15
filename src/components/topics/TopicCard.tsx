
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

interface TopicCardProps {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: (topicId: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  id,
  name,
  description,
  isSelected,
  onSelect,
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
        <span className="font-medium text-gray-800">{name}</span>
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
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default TopicCard;
