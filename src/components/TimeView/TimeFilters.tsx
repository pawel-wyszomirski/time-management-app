import React from 'react';

interface TimeFiltersProps {
  dateRange: 'all' | 'today' | 'week' | 'custom';
  customStartDate: string;
  customEndDate: string;
  groupBy: 'day' | 'project' | 'category';
  onDateRangeChange: (range: 'all' | 'today' | 'week' | 'custom') => void;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
  onGroupByChange: (groupBy: 'day' | 'project' | 'category') => void;
}

const TimeFilters: React.FC<TimeFiltersProps> = ({
  dateRange,
  customStartDate,
  customEndDate,
  groupBy,
  onDateRangeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onGroupByChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zakres dat
          </label>
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'Wszystkie' },
              { id: 'today', label: 'Dziś' },
              { id: 'week', label: 'Ten tydzień' },
              { id: 'custom', label: 'Własny' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onDateRangeChange(id as typeof dateRange)}
                className={`px-3 py-1 text-sm rounded-full ${
                  dateRange === id
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {dateRange === 'custom' && (
          <div className="flex space-x-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Od
              </label>
              <input
                type="date"
                id="startDate"
                value={customStartDate}
                onChange={(e) => onCustomStartDateChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Do
              </label>
              <input
                type="date"
                id="endDate"
                value={customEndDate}
                onChange={(e) => onCustomEndDateChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Grupuj według
        </label>
        <div className="flex space-x-2">
          {[
            { id: 'day', label: 'Dni' },
            { id: 'project', label: 'Projektów' },
            { id: 'category', label: 'Kategorii' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onGroupByChange(id as typeof groupBy)}
              className={`px-3 py-1 text-sm rounded-full ${
                groupBy === id
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

export default TimeFilters;