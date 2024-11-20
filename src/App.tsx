import React, { useState } from 'react';
import Navigation from './components/Navigation';
import WeekView from './components/WeekView';
import TasksView from './components/TasksView';
import ProjectsView from './components/ProjectsView';
import BlocksView from './components/BlocksView';
import TimeView from './components/TimeView';
import InboxView from './components/InboxView';

function App() {
  const [activeTab, setActiveTab] = useState('week');

  const renderContent = () => {
    switch (activeTab) {
      case 'week':
        return <WeekView />;
      case 'tasks':
        return <TasksView />;
      case 'projects':
        return <ProjectsView />;
      case 'blocks':
        return <BlocksView />;
      case 'time':
        return <TimeView />;
      case 'inbox':
        return <InboxView />;
      default:
        return (
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Content for {activeTab} tab will be implemented next</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;