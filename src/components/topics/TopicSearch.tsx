
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TopicSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TopicSearch: React.FC<TopicSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mb-6 animate-slide-up">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          className="pl-10 pr-4 py-2 w-full"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default TopicSearch;
