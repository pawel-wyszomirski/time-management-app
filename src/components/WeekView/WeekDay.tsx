import React from 'react';
import { format, isToday, startOfDay, isValid } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Task, TimeBlock, WeekDay as WeekDayType } from '../../types';
import TaskItem from '../shared/TaskItem';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface WeekDayProps {
  date: Date;
  tasks: Task[];
  timeBlocks: TimeBlock[];
}

const WeekDay: React.FC<WeekDayProps> = ({ date, tasks, timeBlocks }) => {
  const dayTasks = tasks
    .filter(task => {
      if (!task.date) return false;
      const taskDate = new Date(task.date);
      if (!isValid(taskDate)) return false;
      return format(startOfDay(taskDate), 'yyyy-MM-dd') === format(startOfDay(date), 'yyyy-MM-dd');
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  
  const weekDay = date.getDay() as WeekDayType;
  const dayBlocks = timeBlocks.filter(block => block.weekDay === weekDay);

  const { setNodeRef } = useDroppable({
    id: format(date, 'yyyy-MM-dd'),
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${isToday(date) ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(date, 'EEEE', { locale: pl })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {format(date, 'd MMMM', { locale: pl })}
        </p>
      </div>

      <div className="space-y-4">
        {dayBlocks.map(block => (
          <div
            key={block.id}
            className={`p-3 rounded-md ${
              block.category === 'A' ? 'bg-blue-50 dark:bg-blue-900/20' :
              block.category === 'B' ? 'bg-green-50 dark:bg-green-900/20' :
              'bg-purple-50 dark:bg-purple-900/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {block.startTime} - {block.endTime}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {block.description}
                </span>
              </div>
              <span className={`text-xs font-medium ${
                block.category === 'A' ? 'text-blue-800 dark:text-blue-200' :
                block.category === 'B' ? 'text-green-800 dark:text-green-200' :
                'text-purple-800 dark:text-purple-200'
              }`}>
                {block.category === 'A' ? 'A - projekty' :
                 block.category === 'B' ? 'B - rutyny' :
                 'C - rozwój'}
              </span>
            </div>
          </div>
        ))}
        
        <div ref={setNodeRef} className="min-h-[50px]">
          <SortableContext 
            items={dayTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {dayTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task}
                isDraggable
              />
            ))}
          </SortableContext>

          {dayBlocks.length === 0 && dayTasks.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Brak zaplanowanych zadań
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeekDay;