import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Category, Task } from '../../types';
import TaskFilters from './TaskFilters';
import TaskItem from '../shared/TaskItem';
import TaskDialog from '../shared/TaskDialog';
import { Plus } from 'lucide-react';

const TasksView: React.FC = () => {
  const tasks = useStore(state => state.tasks);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (selectedStatus === 'scheduled' && !task.date) return false;
    if (selectedStatus === 'unscheduled' && task.date) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zadania</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowe zadanie
        </button>
      </div>

      <TaskFilters
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        onStatusChange={setSelectedStatus}
        onCategoryChange={setSelectedCategory}
      />

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} showDate={true} />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Brak zadań spełniających wybrane kryteria
          </div>
        )}
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default TasksView;