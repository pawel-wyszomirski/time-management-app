import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import ProjectItem from './ProjectItem';
import ProjectDialog from './ProjectDialog';
import { Plus } from 'lucide-react';

const ProjectsView: React.FC = () => {
  const projects = useStore(state => state.projects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projekty</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowy projekt
        </button>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectItem key={project.id} project={project} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">Brak projektów. Dodaj swój pierwszy projekt!</p>
          </div>
        )}
      </div>

      <ProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default ProjectsView;