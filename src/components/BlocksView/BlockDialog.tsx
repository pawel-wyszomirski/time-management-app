import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Category, TimeBlock, WeekDay } from '../../types';
import { useStore } from '../../store/useStore';

interface BlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timeBlock?: TimeBlock;
}

const BlockDialog: React.FC<BlockDialogProps> = ({
  isOpen,
  onClose,
  timeBlock,
}) => {
  const addTimeBlock = useStore(state => state.addTimeBlock);
  const updateTimeBlock = useStore(state => state.updateTimeBlock);

  const [weekDay, setWeekDay] = useState<WeekDay>(timeBlock?.weekDay ?? 1);
  const [startTime, setStartTime] = useState(timeBlock?.startTime || '09:00');
  const [endTime, setEndTime] = useState(timeBlock?.endTime || '10:00');
  const [category, setCategory] = useState<Category>(timeBlock?.category || 'A');
  const [description, setDescription] = useState(timeBlock?.description || '');

  const weekDays = [
    { value: 1, label: 'Poniedziałek' },
    { value: 2, label: 'Wtorek' },
    { value: 3, label: 'Środa' },
    { value: 4, label: 'Czwartek' },
    { value: 5, label: 'Piątek' },
    { value: 6, label: 'Sobota' },
    { value: 0, label: 'Niedziela' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      alert('Czas zakończenia musi być późniejszy niż czas rozpoczęcia');
      return;
    }

    const blockData: TimeBlock = {
      id: timeBlock?.id || crypto.randomUUID(),
      weekDay,
      startTime,
      endTime,
      category,
      description,
    };

    if (timeBlock) {
      updateTimeBlock(blockData);
    } else {
      addTimeBlock(blockData);
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
              <label htmlFor="weekDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dzień tygodnia
              </label>
              <select
                id="weekDay"
                value={weekDay}
                onChange={(e) => setWeekDay(Number(e.target.value) as WeekDay)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {weekDays.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Czas rozpoczęcia
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Czas zakończenia
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Opis
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="np. Praca głęboka, Spotkanie, Rutyna poranna"
                required
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                {timeBlock ? 'Zapisz zmiany' : 'Dodaj blok'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlockDialog;