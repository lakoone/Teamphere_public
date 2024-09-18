import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { v4 as uuidv4 } from 'uuid';
import * as chalk from 'chalk';
import { writeLog } from '../helpers/log';
import { StorageService } from '../storage/storage.service';
import { fileDTO } from '../chat/dto/init-message.dto';
import { TaskDTO } from './dto/task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
const taskSBgColor = chalk.bgRgb(151, 252, 181).black;
const taskTextColor = chalk.bgRgb(151, 252, 181);
@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}
  async getTasksforUser(userID: number) {
    const tasks = await this.prisma.task.findMany({
      where: { usersAssigned: { some: { userId: userID } } },
      include: {
        taskDescriptionFiles: { select: { file: true } },
        taskAnswerFiles: { select: { file: true } },
        createdBy: { select: { id: true, profile: true } },
        usersAssigned: {
          select: { user: { select: { id: true, profile: true } } },
        },
      },
    });
    writeLog(
      taskSBgColor,
      taskTextColor,
      `Get task for user ${userID} :`,
      tasks,
    );
    return tasks;
  }
  async getCreatedTasksByUser(userID: number) {
    const tasks = await this.prisma.task.findMany({
      where: { createdByID: userID },
      include: {
        usersAssigned: {
          select: { user: { select: { id: true, profile: true } } },
        },
        taskDescriptionFiles: { select: { file: true } },
        taskAnswerFiles: { select: { file: true } },
        createdBy: { select: { id: true, profile: true } },
      },
    });
    writeLog(
      taskSBgColor,
      taskTextColor,
      `Get task created by user : ${userID}`,
      tasks,
    );
    return tasks;
  }
  async getTasksByChat(chatID: string) {
    const tasks = this.prisma.task.findMany({
      where: { chatID },
      include: {
        createdBy: { select: { id: true, profile: true } },
        usersAssigned: { select: { user: true } },
        taskDescriptionFiles: { select: { file: true } },
        taskAnswerFiles: { select: { file: true } },
      },
    });
    writeLog(
      taskSBgColor,
      taskTextColor,
      `Get task by chatID : ${chatID}`,
      tasks,
    );
    return tasks;
  }
  async getTaskByID(taskID: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskID },
      include: { usersAssigned: { select: { userId: true } } },
    });
    return task;
  }
  async createTask(
    task: CreateTaskDTO,
    createdByID: number,
    files?: Express.Multer.File[],
  ) {
    const id = uuidv4();
    const { forUsersID, ...taskData } = task;
    writeLog(taskSBgColor, taskTextColor, 'task before create:', task);
    writeLog(taskSBgColor, taskTextColor, 'is files in task? :', files);
    const filesMetadata: fileDTO[] = [];
    if (files && files.length) {
      for (const file of files) {
        file.originalname = decodeURIComponent(file.originalname);
        const res = await this.storage.uploadFile({
          file,
          userID: createdByID,
          task: {
            id,
            IsDescription: true,
          },
          chatID: id,
        });
        filesMetadata.push(res);
      }
    }
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.task.create({
        data: {
          ...taskData,
          id,
          changedByID: createdByID,
          status: 'created',
          createdByID,
          answerText: '',
        },
      });
      const FileData = filesMetadata.map((file) => ({
        taskId: id,
        fileId: file.id,
      }));
      await tx.taskDescriptionFile.createMany({ data: FileData });
      const data = forUsersID.map((userID) => ({ taskId: id, userId: userID }));
      await tx.userTasks.createMany({ data });

      const task = await tx.task.findUnique({
        where: { id },
        include: {
          createdBy: { select: { id: true, profile: true } },
          usersAssigned: {
            select: {
              user: { select: { id: true, profile: true } },
            },
          },
          taskAnswerFiles: { select: { file: true } },
          taskDescriptionFiles: { select: { file: true } },
        },
      });
      console.log('TASK AFTER CREATION :', task);
      return task as TaskDTO;
    });
    return result;
  }
  async updateTask(
    taskID: string,
    updateByUserID: number,
    data: UpdateTaskDTO,
  ) {
    const TaskChangedInfo = await this.prisma.$transaction(async (tx) => {
      const lastChangedAt = new Date(Date.now());
      const res = await tx.task.update({
        where: { id: taskID },
        data: {
          changedByID: updateByUserID,
          lastChangedAt,
          taskText: data.taskText,
          answerText: data.answerText,
          status: data.status,
        },
      });
      if (data.taskDescriptionFiles.length > 0) {
        const descriptionFileUpdateData = data.taskDescriptionFiles.map(
          (file) => ({ taskId: taskID, fileId: file.file.id }),
        );
        await tx.taskDescriptionFile.createMany({
          data: descriptionFileUpdateData,
        });
      }
      if (data.taskAnswerFiles.length > 0) {
        const answerFileUpdateData = data.taskAnswerFiles.map((file) => ({
          taskId: taskID,
          fileId: file.file.id,
        }));
        await tx.taskAnswerFile.createMany({ data: answerFileUpdateData });
      }
      return res;
    });
    return TaskChangedInfo;
  }
}
