import React, { useState } from 'react';
import { Project, Task } from '../../types';
import { useStore } from '../../store/useStore';
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, AlignLeft } from 'lucide-react';
import TaskItem from '../shared/TaskItem';
import ProjectDialog from './ProjectDialog';
import TaskDialog from '../shared/TaskDialog';

interface ProjectItemProps {
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const tasks = useStore(state => state.tasks);
  const deleteProject = useStore(state => state.deleteProject);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const projectTasks = tasks.filter(task => task.projectId === project.id);

  const categoryColors = {
    'A': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    'B': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    'C': 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800'
  };

  const categoryLabels = {
    'A': 'A - projekty',
    'B': 'B - rutyny',
    'C': 'C - rozwój'
  };

  const handleDelete = () => {
    if (window.confirm('Czy na pewno chcesz usunąć ten projekt?')) {
      deleteProject(project.id);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[project.category]}`}>
                    {categoryLabels[project.category]}
                  </span>
                  {project.notes && (
                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsNewTaskDialogOpen(true)}
                className="inline-flex items-center px-2 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Zadanie
              </button>
              <button
                onClick={() => setIsEditDialogOpen(true)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showNotes && project.notes && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm text-gray-700 dark:text-gray-300">
              {project.notes}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {projectTasks.length > 0 ? (
                projectTasks.map(task => (
                  <TaskItem key={task.id} task={task} showDate={true} />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Brak zadań w tym projekcie
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ProjectDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        project={project}
      />

      <TaskDialog
        isOpen={isNewTaskDialogOpen}
        onClose={() => setIsNewTaskDialogOpen(false)}
        defaultProjectId={project.id}
        defaultCategory={project.category}
      />
    </>
  );
};

export default ProjectItem;