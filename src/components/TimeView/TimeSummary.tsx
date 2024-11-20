import React, { useMemo } from 'react';
import { TimeEntry } from '../../types';
import { useStore } from '../../store/useStore';
import { Clock } from 'lucide-react';

interface TimeSummaryProps {
  entries: TimeEntry[];
  groupBy: 'day' | 'project' | 'category';
}

const TimeSummary: React.FC<TimeSummaryProps> = ({ entries, groupBy }) => {
  const tasks = useStore(state => state.tasks);
  const projects = useStore(state => state.projects);

  const summary = useMemo(() => {
    const result = entries.reduce((acc, entry) => {
      if (!entry.endTime) return acc;

      const task = tasks.find(t => t.id === entry.taskId);
      if (!task) return acc;

      const duration = (new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime() - entry.totalPausedTime) / 1000 / 60;

      let key = '';
      switch (groupBy) {
        case 'day':
          key = new Date(entry.endTime).toISOString().split('T')[0];
          break;
        case 'project':
          key = task.projectId || 'no-project';
          break;
        case 'category':
          key = task.category;
          break;
      }

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += duration;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(result)
      .map(([key, duration]) => ({
        key,
        duration,
        label: (() => {
          switch (groupBy) {
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
            default:
              return key;
          }
        })()
      }))
      .sort((a, b) => b.duration - a.duration);
  }, [entries, groupBy, tasks, projects]);

  const totalTime = summary.reduce((acc, { duration }) => acc + duration, 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Łączny czas: {Math.round(totalTime)} min
        </h3>
      </div>

      <div className="space-y-4">
        {summary.map(({ key, label, duration }) => (
          <div key={key} className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(duration)} min</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100 dark:bg-gray-700">
              <div
                style={{ width: `${(duration / totalTime) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 dark:bg-indigo-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSummary;