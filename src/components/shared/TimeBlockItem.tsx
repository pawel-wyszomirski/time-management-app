import React from 'react';
import { TimeBlock } from '../../types';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface TimeBlockItemProps {
  timeBlock: TimeBlock;
}

const TimeBlockItem: React.FC<TimeBlockItemProps> = ({ timeBlock }) => {
  const categoryColors = {
    'A': 'bg-blue-50 border-blue-200',
    'B': 'bg-green-50 border-green-200',
    'C': 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`border-l-4 rounded-r-md p-3 ${categoryColors[timeBlock.category]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {format(new Date(timeBlock.start), 'HH:mm')} - {format(new Date(timeBlock.end), 'HH:mm')}
          </span>
        </div>
        <span className="text-xs font-medium text-gray-500">
          {timeBlock.type}
        </span>
      </div>
    </div>
  );
};

export default TimeBlockItem;