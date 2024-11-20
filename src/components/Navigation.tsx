import React from 'react';
import { Calendar, CheckSquare, Inbox, Layout, Clock, Timer, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { isDark, toggle } = useTheme();

  const tabs = [
    { id: 'week', label: 'Tydzień', icon: Calendar },
    { id: 'tasks', label: 'Zadania', icon: CheckSquare },
    { id: 'projects', label: 'Projekty', icon: Layout },
    { id: 'blocks', label: 'Bloki', icon: Clock },
    { id: 'time', label: 'Czas', icon: Timer },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === id
                    ? 'border-indigo-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={toggle}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;