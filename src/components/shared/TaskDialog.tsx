import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category, Task } from '../../types';
import { useStore } from '../../store/useStore';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  defaultProjectId?: string;
  defaultCategory?: Category;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ 
  isOpen, 
  onClose, 
  task,
  defaultProjectId,
  defaultCategory 
}) => {
  const projects = useStore(state => state.projects);
  const addTask = useStore(state => state.addTask);
  const updateTask = useStore(state => state.updateTask);

  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState<Category>(task?.category || defaultCategory || 'A');
  const [projectId, setProjectId] = useState(task?.projectId || defaultProjectId || '');
  const [date, setDate] = useState(task?.date ? new Date(task.date).toISOString().split('T')[0] : '');
  const [time, setTime] = useState(task?.date ? new Date(task.date).toLocaleTimeString('en-GB').slice(0, 5) : '');
  const [duration, setDuration] = useState(task?.duration?.toString() || '');
  const [notes, setNotes] = useState(task?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let taskDate: Date | undefined;
    if (date) {
      taskDate = new Date(date);
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        taskDate.setHours(hours, minutes);
      }
    }

    const taskData: Task = {
      id: task?.id || crypto.randomUUID(),
      title,
      category,
      completed: task?.completed || false,
      projectId: projectId || undefined,
      date: taskDate,
      duration: duration ? parseInt(duration, 10) : undefined,
      notes: notes || undefined,
    };

    if (task) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tytuł
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kategoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="A">A - projekty</option>
                <option value="B">B - rutyny</option>
                <option value="C">C - rozwój</option>
              </select>
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Projekt
              </label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Brak projektu</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Godzina
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={!date}
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Czas trwania (minuty)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notatki
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                {task ? 'Zapisz zmiany' : 'Dodaj zadanie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;