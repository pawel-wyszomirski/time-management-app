import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, Project, TimeBlock, TimeEntry } from '../types';

interface Store {
  tasks: Task[];
  projects: Project[];
  timeBlocks: TimeBlock[];
  timeEntries: TimeEntry[];
  activeTimeEntry?: TimeEntry;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTimeBlock: (timeBlock: TimeBlock) => void;
  updateTimeBlock: (timeBlock: TimeBlock) => void;
  deleteTimeBlock: (id: string) => void;
  startTimeTracking: (taskId: string) => void;
  pauseTimeTracking: () => void;
  resumeTimeTracking: () => void;
  stopTimeTracking: (completed?: boolean) => void;
  addTimeEntry: (entry: TimeEntry) => void;
}

const initialState = {
  tasks: [] as Task[],
  projects: [] as Project[],
  timeBlocks: [] as TimeBlock[],
  timeEntries: [] as TimeEntry[],
  activeTimeEntry: undefined as TimeEntry | undefined,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === project.id ? project : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      addTimeBlock: (timeBlock) =>
        set((state) => ({ timeBlocks: [...state.timeBlocks, timeBlock] })),
      updateTimeBlock: (timeBlock) =>
        set((state) => ({
          timeBlocks: state.timeBlocks.map((t) =>
            t.id === timeBlock.id ? timeBlock : t
          ),
        })),
      deleteTimeBlock: (id) =>
        set((state) => ({
          timeBlocks: state.timeBlocks.filter((t) => t.id !== id),
        })),
      startTimeTracking: (taskId) => {
        const currentEntry = get().activeTimeEntry;
        if (currentEntry) {
          get().stopTimeTracking(false);
        }

        const newEntry: TimeEntry = {
          id: crypto.randomUUID(),
          taskId,
          startTime: new Date(),
          totalPausedTime: 0,
          completed: false,
        };

        set((state) => ({
          activeTimeEntry: newEntry,
          timeEntries: [...state.timeEntries, newEntry],
        }));
      },
      pauseTimeTracking: () => {
        set((state) => {
          const entry = state.activeTimeEntry;
          if (!entry || entry.pausedAt) return state;

          return {
            activeTimeEntry: {
              ...entry,
              pausedAt: new Date(),
            },
          };
        });
      },
      resumeTimeTracking: () => {
        set((state) => {
          const entry = state.activeTimeEntry;
          if (!entry || !entry.pausedAt) return state;

          const pauseDuration = Date.now() - new Date(entry.pausedAt).getTime();
          return {
            activeTimeEntry: {
              ...entry,
              pausedAt: undefined,
              totalPausedTime: entry.totalPausedTime + pauseDuration,
            },
          };
        });
      },
      stopTimeTracking: (completed = false) => {
        set((state) => {
          const entry = state.activeTimeEntry;
          if (!entry) return state;

          const endTime = new Date();
          const updatedEntry = {
            ...entry,
            endTime,
            completed,
            pausedAt: undefined,
          };

          return {
            activeTimeEntry: undefined,
            timeEntries: state.timeEntries.map((e) =>
              e.id === entry.id ? updatedEntry : e
            ),
          };
        });
      },
      addTimeEntry: (entry) =>
        set((state) => ({ timeEntries: [...state.timeEntries, entry] })),
    }),
    {
      name: 'time-management-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        return {
          ...initialState,
          ...persistedState,
          tasks: Array.isArray(persistedState.tasks) ? persistedState.tasks : [],
          projects: Array.isArray(persistedState.projects) ? persistedState.projects : [],
          timeBlocks: Array.isArray(persistedState.timeBlocks) ? persistedState.timeBlocks : [],
          timeEntries: Array.isArray(persistedState.timeEntries) ? persistedState.timeEntries : [],
        };
      },
    }
  )
);