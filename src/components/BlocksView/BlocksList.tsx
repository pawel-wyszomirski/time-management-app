import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import BlockDialog from './BlockDialog';
import { Clock, Pencil, Trash2 } from 'lucide-react';

const BlocksList: React.FC = () => {
  const timeBlocks = useStore(state => state.timeBlocks);
  const deleteTimeBlock = useStore(state => state.deleteTimeBlock);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const weekDays = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];

  const sortedBlocks = [...timeBlocks].sort((a, b) => {
    if (a.weekDay !== b.weekDay) {
      return a.weekDay - b.weekDay;
    }
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  const categoryColors = {
    'A': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    'B': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    'C': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  };

  const categoryLabels = {
    'A': 'A - projekty',
    'B': 'B - rutyny',
    'C': 'C - rozwój'
  };

  const handleDelete = (blockId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten blok czasowy?')) {
      deleteTimeBlock(blockId);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const durationInMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return `${Math.abs(durationInMinutes)} min`;
  };

  const groupedBlocks = sortedBlocks.reduce((acc, block) => {
    const day = weekDays[block.weekDay];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(block);
    return acc;
  }, {} as Record<string, typeof timeBlocks>);

  return (
    <div className="space-y-6">
      {weekDays.map(day => (
        <div key={day} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{day}</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {groupedBlocks[day]?.map(block => (
              <div
                key={block.id}
                className={`p-4 ${categoryColors[block.category]} transition-colors duration-150`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {block.startTime} - {block.endTime}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({calculateDuration(block.startTime, block.endTime)})
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{categoryLabels[block.category]}</span>
                        {block.description && (
                          <>
                            <span className="text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-gray-600 dark:text-gray-300">{block.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingBlock(block.id)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!groupedBlocks[day] || groupedBlocks[day].length === 0) && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Brak bloków czasowych
              </div>
            )}
          </div>
        </div>
      ))}

      {editingBlock && (
        <BlockDialog
          isOpen={true}
          onClose={() => setEditingBlock(null)}
          timeBlock={timeBlocks.find(block => block.id === editingBlock)}
        />
      )}
    </div>
  );
};

export default BlocksList;