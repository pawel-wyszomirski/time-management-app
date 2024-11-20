import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import BlocksList from './BlocksList';
import BlockDialog from './BlockDialog';
import { Plus } from 'lucide-react';

const BlocksView: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bloki czasowe</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowy blok
        </button>
      </div>

      <BlocksList />

      <BlockDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

export default BlocksView;