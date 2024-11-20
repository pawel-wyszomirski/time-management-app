import React from 'react';
import { addDays, format, startOfDay, isValid } from 'date-fns';
import { useStore } from '../../store/useStore';
import WeekDay from './WeekDay';
import CurrentTaskTracker from './CurrentTaskTracker';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const WeekView: React.FC = () => {
  const tasks = useStore(state => state.tasks);
  const timeBlocks = useStore(state => state.timeBlocks);
  const updateTask = useStore(state => state.updateTask);
  const startTimeTracking = useStore(state => state.startTimeTracking);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfDay(new Date()), i)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (over.id === 'current-task-tracker') {
      startTimeTracking(active.id as string);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask || !activeTask.date) return;

    const taskDate = new Date(activeTask.date);
    if (!isValid(taskDate)) return;

    const overDate = over.id as string;
    const activeDate = format(startOfDay(taskDate), 'yyyy-MM-dd');

    if (activeDate === overDate) {
      const dayTasks = tasks
        .filter(task => {
          if (!task.date) return false;
          const date = new Date(task.date);
          if (!isValid(date)) return false;
          return format(startOfDay(date), 'yyyy-MM-dd') === overDate;
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const oldIndex = dayTasks.findIndex(t => t.id === active.id);
      const newIndex = dayTasks.findIndex(t => t.id === over.id);

      if (oldIndex !== newIndex && newIndex !== -1) {
        const newOrder = arrayMove(dayTasks, oldIndex, newIndex);
        newOrder.forEach((task, index) => {
          updateTask({ ...task, order: index });
        });
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || over.id === 'current-task-tracker') return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask || !activeTask.date) return;

    const taskDate = new Date(activeTask.date);
    if (!isValid(taskDate)) return;

    const overDate = over.id as string;
    const activeDate = format(startOfDay(taskDate), 'yyyy-MM-dd');

    if (activeDate !== overDate) {
      const newDate = new Date(overDate);
      if (!isValid(newDate)) return;

      const oldDate = new Date(activeTask.date);
      newDate.setHours(oldDate.getHours());
      newDate.setMinutes(oldDate.getMinutes());

      const dayTasks = tasks
        .filter(task => {
          if (!task.date) return false;
          const date = new Date(task.date);
          if (!isValid(date)) return false;
          return format(startOfDay(date), 'yyyy-MM-dd') === overDate;
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      updateTask({
        ...activeTask,
        date: newDate,
        order: dayTasks.length
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Widok tygodnia
      </h2>
      
      <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        <div className="mb-6">
          <CurrentTaskTracker />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weekDays.map(date => (
            <WeekDay
              key={date.toISOString()}
              date={date}
              tasks={tasks}
              timeBlocks={timeBlocks}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default WeekView;