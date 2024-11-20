import React from 'react';
import { Category } from '../../types';

interface TaskFiltersProps {
  selectedStatus: string;
  selectedCategory: Category | 'all';
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: Category | 'all') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
}) => {
  const statuses = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'scheduled', label: 'Zaplanowane' },
    { id: 'unscheduled', label: 'Niezaplanowane' },
  ];

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'A', label: 'A - projekty' },
    { id: 'B', label: 'B - rutyny' },
    { id: 'C', label: 'C - rozwój' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <div className="flex space-x-2">
          {statuses.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onStatusChange(id)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedStatus === id
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategoria:</span>
        <div className="flex space-x-2">
          {categories.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onCategoryChange(id)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === id
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;