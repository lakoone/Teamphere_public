import { UserType } from '@/entities/User/types';
import { fileDTO } from '@/entities/file/types';
import { z } from 'zod';
export type taskStatus =
  | 'verified'
  | 'process'
  | 'expired'
  | 'sent'
  | 'created';
export type TaskType = {
  id: string;
  createdBy: UserType;
  title: string;
  createdAt: string;
  createdByID: number;
  chatID: string;
  changedAt: string;
  changedByID: number;
  lastChangedAt: string;
  deadline: string;
  status: 'verified' | 'process' | 'expired' | 'sent' | 'created';
  taskText: string;
  taskDescriptionFiles: { file: fileDTO }[];
  usersAssigned: { user: UserType }[];
  answerText: string;
  taskAnswerFiles: { file: fileDTO }[];
};
export type TaskUpdatedDTO = {
  id: string;
  title: string;
  data: Partial<TaskType>;
};

export const ZTaskStatus = z.enum([
  'verified',
  'process',
  'expired',
  'sent',
  'created',
]);
export const TaskSchema = z.object({
  descriptionNewFiles: z.array(z.instanceof(File)),
  answerNewFiles: z.array(
    z.instanceof(File).refine((file) => file.size <= 40 * 1024 * 1024),
  ),
  description: z.string(),
  answer: z.string(),
  status: ZTaskStatus,
});
export type TaskForm = z.infer<typeof TaskSchema>;
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(60, 'Title must be less than 60 characters'),
  responsible: z.array(z.number()).min(1, 'At least one assignee is required'),
  description: z.string().optional(),
  files: z
    .array(z.instanceof(File).refine((file) => file.size <= 1024 * 1024 * 60))
    .max(5, 'max files is 5'),
  deadline: z.date(),
});
export type CreateTaskForm = z.infer<typeof CreateTaskSchema>;
