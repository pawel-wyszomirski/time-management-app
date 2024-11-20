import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category, Project } from '../../types';
import { useStore } from '../../store/useStore';

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({ isOpen, onClose, project }) => {
  const addProject = useStore(state => state.addProject);
  const updateProject = useStore(state => state.updateProject);

  const [name, setName] = useState(project?.name || '');
  const [category, setCategory] = useState<Category>(project?.category || 'A');
  const [notes, setNotes] = useState(project?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: Project = {
      id: project?.id || crypto.randomUUID(),
      name,
      category,
      notes: notes || undefined,
    };

    if (project) {
      updateProject(projectData);
    } else {
      addProject(projectData);
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nazwa projektu
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notatki
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Dodaj notatki do projektu..."
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                {project ? 'Zapisz zmiany' : 'Dodaj projekt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDialog;