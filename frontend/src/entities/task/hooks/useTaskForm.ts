import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskForm, TaskSchema, TaskType } from '@/entities/task/types/TaskType';

export const useTaskForm = (
  task: TaskType,
  onSubmit: SubmitHandler<TaskForm>,
) => {
  const { control, handleSubmit, setValue, watch, formState } =
    useForm<TaskForm>({
      mode: 'all',
      resolver: zodResolver(TaskSchema),
      defaultValues: {
        answer: task.answerText,
        status: task.status,
        description: task.taskText,
        answerNewFiles: [],
        descriptionNewFiles: [],
      },
    });

  return { control, handleSubmit, setValue, watch, formState, onSubmit };
};
