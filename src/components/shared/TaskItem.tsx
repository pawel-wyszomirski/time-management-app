import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { CheckSquare, Square, Clock, Pencil, Calendar, GripVertical } from 'lucide-react';
import TaskDialog from './TaskDialog';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
  showDate?: boolean;
  isDraggable?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, showDate = false, isDraggable = false }) => {
  const updateTask = useStore(state => state.updateTask);
  const projects = useStore(state => state.projects);
  const activeTimeEntry = useStore(state => state.activeTimeEntry);
  const stopTimeTracking = useStore(state => state.stopTimeTracking);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const project = projects.find(p => p.id === task.projectId);
  
  const categoryLabels = {
    'A': 'A - projekty',
    'B': 'B - rutyny',
    'C': 'C - rozwój'
  };
  
  const categoryColors = {
    'A': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    'B': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    'C': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  useEffect(() => {
    if (task.completed && activeTimeEntry?.taskId === task.id) {
      stopTimeTracking(true);
    }
  }, [task.completed, activeTimeEntry, stopTimeTracking, task.id]);

  const toggleComplete = () => {
    updateTask({ ...task, completed: !task.completed });
  };

  const formatDateTime = (date: Date) => {
    const taskDate = new Date(date);
    const hasTime = taskDate.getHours() !== 0 || taskDate.getMinutes() !== 0;
    if (hasTime) {
      return format(taskDate, 'd MMM, HH:mm', { locale: pl });
    }
    return format(taskDate, 'd MMM', { locale: pl });
  };

  const hasTime = task.date ? new Date(task.date).getHours() !== 0 || new Date(task.date).getMinutes() !== 0 : false;
  const isCurrentlyTracked = activeTimeEntry?.taskId === task.id;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md group ${
          isCurrentlyTracked ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}
      >
        {isDraggable && (
          <button
            className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>
        )}
        
        <button
          onClick={toggleComplete}
          className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {task.completed ? (
            <CheckSquare className="w-5 h-5" />
          ) : (
            <Square className="w-5 h-5" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[task.category]}`}>
                {categoryLabels[task.category]}
              </span>
              {project && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {project.name}
                </span>
              )}
              {showDate && task.date && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateTime(new Date(task.date))}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          
          <p className={`text-sm ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </p>
          
          <div className="flex items-center space-x-4 mt-1">
            {task.duration && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {task.duration} min
              </div>
            )}
            {!showDate && task.date && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {hasTime ? format(new Date(task.date), 'HH:mm', { locale: pl }) : format(new Date(task.date), 'd MMM', { locale: pl })}
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={task}
      />
    </>
  );
};

export default TaskItem;