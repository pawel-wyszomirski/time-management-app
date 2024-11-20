import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Task } from '../../types';
import TaskItem from '../shared/TaskItem';
import { Plus } from 'lucide-react';

const InboxView: React.FC = () => {
  const tasks = useStore(state => state.tasks);
  const addTask = useStore(state => state.addTask);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const unscheduledTasks = tasks.filter(task => !task.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false,
      category: 'A',
    };

    addTask(task);
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Dodaj nowe zadanie..."
            className="flex-1 border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dodaj
          </button>
        </div>
      </form>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        {unscheduledTasks.length > 0 ? (
          unscheduledTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Brak niezaplanowanych zadań
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxView;