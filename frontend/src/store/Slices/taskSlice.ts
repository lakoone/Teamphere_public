import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskType, TaskUpdatedDTO } from '@/entities/task/types/TaskType';

type TasksType = {
  tasksForMe: TaskType[];
  tasksCreatedByMe: TaskType[];
};
const initialState: TasksType = {
  tasksForMe: [],
  tasksCreatedByMe: [],
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskCreatedByMe(state, action: PayloadAction<TaskType[]>) {
      state.tasksCreatedByMe = action.payload;
    },
    setTaskForMe(state, action: PayloadAction<TaskType[]>) {
      state.tasksForMe = action.payload;
    },
    addTaskForMe(state, action: PayloadAction<TaskType[]>) {
      state.tasksForMe = [...state.tasksForMe, ...action.payload];
    },
    addTaskCreatedByMe(state, action: PayloadAction<TaskType[]>) {
      state.tasksCreatedByMe = [...state.tasksCreatedByMe, ...action.payload];
    },
    updateTaskForMe(state, action: PayloadAction<TaskUpdatedDTO>) {
      const index = state.tasksForMe.findIndex(
        (task) => task.id === action.payload.id,
      );

      if (index >= 0) {
        const updatedTasks = [...state.tasksForMe];
        updatedTasks[index] = {
          ...updatedTasks[index],
          ...action.payload.data,
        };

        state.tasksForMe = updatedTasks;
      } else {
        const index = state.tasksCreatedByMe.findIndex(
          (task) => task.id === action.payload.id,
        );
        if (index >= 0) {
          const updatedTasks = [...state.tasksCreatedByMe];
          updatedTasks[index] = {
            ...updatedTasks[index],
            ...action.payload.data,
          };

          state.tasksCreatedByMe = updatedTasks;
        }
      }
    },
  },
});

export const {
  updateTaskForMe,
  setTaskForMe,
  setTaskCreatedByMe,
  addTaskCreatedByMe,
  addTaskForMe,
} = taskSlice.actions;
export default taskSlice.reducer;
