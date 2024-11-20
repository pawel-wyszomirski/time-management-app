import React from 'react';
import { TimeEntry } from '../../types';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface TimeEntryListProps {
  entries: TimeEntry[];
  groupBy: 'day' | 'project' | 'category';
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries, groupBy }) => {
  const tasks = useStore(state => state.tasks);
  const projects = useStore(state => state.projects);

  const groupedEntries = entries.reduce((acc, entry) => {
    const task = tasks.find(t => t.id === entry.taskId);
    if (!task || !entry.endTime) return acc;

    let groupKey = '';
    switch (groupBy) {
      case 'day':
        groupKey = format(new Date(entry.endTime), 'yyyy-MM-dd');
        break;
      case 'project':
        groupKey = task.projectId || 'no-project';
        break;
      case 'category':
        groupKey = task.category;
        break;
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push({ entry, task });
    return acc;
  }, {} as Record<string, Array<{ entry: TimeEntry; task: typeof tasks[0] }>>);

  const formatGroupTitle = (key: string) => {
    switch (groupBy) {
      case 'day':
        return format(new Date(key), 'd MMMM yyyy', { locale: pl });
      case 'project': {
        if (key === 'no-project') return 'Bez projektu';
        const project = projects.find(p => p.id === key);
        return project?.name || 'Nieznany projekt';
      }
      case 'category':
        return {
          'A': 'A - projekty',
          'B': 'B - rutyny',
          'C': 'C - rozwój'
        }[key] || key;
    }
  };

  const calculateDuration = (entry: TimeEntry) => {
    if (!entry.endTime) return 0;
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    return (end.getTime() - start.getTime() - entry.totalPausedTime) / 1000 / 60;
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedEntries).map(([key, groupEntries]) => (
        <div key={key} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {formatGroupTitle(key)}
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {groupEntries.map(({ entry, task }) => (
              <div key={entry.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.startTime), 'HH:mm')} - {
                        entry.endTime ? format(new Date(entry.endTime), 'HH:mm') : 'w trakcie'
                      }
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round(calculateDuration(entry))} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeEntryList;