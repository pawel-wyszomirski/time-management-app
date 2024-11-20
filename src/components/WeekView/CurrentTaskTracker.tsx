import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useDroppable } from '@dnd-kit/core';
import { Play, Pause, X } from 'lucide-react';
import { format, formatDistanceStrict } from 'date-fns';
import { pl } from 'date-fns/locale';

const CurrentTaskTracker: React.FC = () => {
  const activeTimeEntry = useStore(state => state.activeTimeEntry);
  const tasks = useStore(state => state.tasks);
  const pauseTimeTracking = useStore(state => state.pauseTimeTracking);
  const resumeTimeTracking = useStore(state => state.resumeTimeTracking);
  const stopTimeTracking = useStore(state => state.stopTimeTracking);
  const [elapsedTime, setElapsedTime] = useState('0:00');

  const { setNodeRef } = useDroppable({
    id: 'current-task-tracker'
  });

  const activeTask = activeTimeEntry 
    ? tasks.find(t => t.id === activeTimeEntry.taskId)
    : null;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateElapsedTime = () => {
      if (!activeTimeEntry) {
        setElapsedTime('0:00');
        return;
      }

      const now = new Date();
      const start = new Date(activeTimeEntry.startTime);
      let elapsed = now.getTime() - start.getTime() - activeTimeEntry.totalPausedTime;

      if (activeTimeEntry.pausedAt) {
        elapsed -= (now.getTime() - new Date(activeTimeEntry.pausedAt).getTime());
      }

      setElapsedTime(formatDistanceStrict(new Date(0), new Date(elapsed), { locale: pl }));
    };

    if (activeTimeEntry) {
      updateElapsedTime();
      intervalId = setInterval(updateElapsedTime, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeTimeEntry]);

  if (!activeTask) {
    return (
      <div
        ref={setNodeRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-2 border-dashed border-gray-200 dark:border-gray-700"
      >
        <p className="text-center text-gray-500 dark:text-gray-400">
          Przeciągnij zadanie tutaj, aby rozpocząć pomiar czasu
        </p>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Teraz robię</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => activeTimeEntry?.pausedAt ? resumeTimeTracking() : pauseTimeTracking()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {activeTimeEntry?.pausedAt ? (
              <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Pause className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            )}
          </button>
          <button
            onClick={() => stopTimeTracking(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{activeTask.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Od {format(new Date(activeTimeEntry?.startTime || new Date()), 'HH:mm')}
          </span>
          <span className={`text-lg font-medium ${
            activeTimeEntry?.pausedAt ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {elapsedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentTaskTracker;