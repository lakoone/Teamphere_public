import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import * as chalk from 'chalk';
import { writeLog } from '../helpers/log';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from '../pipes/ParseJsonPipe';
import { NotificationGateway } from '../websocket/notification/NotificationGateway.service';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { StorageService } from '../storage/storage.service';
import { fileDTO } from '../chat/dto/init-message.dto';
const taskSBgColor = chalk.bgRgb(151, 252, 181).black;
const taskTextColor = chalk.bgRgb(151, 252, 181);
@Controller('/api/task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private notification: NotificationGateway,
    private storage: StorageService,
  ) {}
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  @Post()
  async createTask(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Req() request: Request & { user: { id: number } },
    @Body('data', ParseJsonPipe) data: CreateTaskDTO,
  ) {
    writeLog(
      taskSBgColor,
      taskTextColor,
      `creating task from ${request.user.id}`,
    );
    writeLog(taskSBgColor, taskTextColor, `data OBJECT :`, data);

    const task = await this.taskService.createTask(
      data,
      request.user.id,
      files.files,
    );
    await this.notification.sendTaskNotification(request.user.id, task);
  }
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'newDescriptionFiles', maxCount: 5 },
      { name: 'newAnswerFiles', maxCount: 5 },
    ]),
  )
  @Patch(':id')
  async updateTask(
    @UploadedFiles()
    files: {
      newDescriptionFiles?: Express.Multer.File[];
      newAnswerFiles?: Express.Multer.File[];
    },
    @Param('id') taskID: string,
    @Req() request: Request & { user: { id: number } },
    @Body('data', ParseJsonPipe)
    data: Omit<UpdateTaskDTO, 'taskDescriptionFiles' | 'taskAnswerFiles'>,
  ) {
    writeLog(taskSBgColor, taskTextColor, 'Got data: ', data);
    writeLog(taskSBgColor, taskTextColor, 'Got files: ', files);
    const task = await this.taskService.getTaskByID(taskID);
    const isAuthor = task.createdByID === request.user.id;
    const isAssigned = !!task.usersAssigned.find(
      (user) => user.userId === request.user.id,
    );

    if (!isAuthor && !isAssigned) {
      throw new BadRequestException('Invalid Data');
    }
    if (isAssigned) {
      if (task.status === 'sent' || data.status === 'verified') {
        throw new BadRequestException('Invalid Data');
      }
    }
    if (isAuthor) {
      if (task.status === 'verified')
        throw new BadRequestException('Invalid Data');
    }

    const uploadedDescriptionFiles: { file: fileDTO }[] = [];
    const uploadedAnswerFiles: { file: fileDTO }[] = [];

    if (files) {
      if (files.newDescriptionFiles && files.newDescriptionFiles.length > 0) {
        for (const file of files.newDescriptionFiles) {
          file.originalname = decodeURIComponent(file.originalname);
          const result = await this.storage.uploadFile({
            file,
            userID: request.user.id,
            task: { id: taskID, IsDescription: true },
          });
          if (result) {
            uploadedDescriptionFiles.push({ file: result });
          }
        }
      } else if (files.newAnswerFiles && files.newAnswerFiles.length > 0) {
        for (const file of files.newAnswerFiles) {
          file.originalname = decodeURIComponent(file.originalname);
          const result = await this.storage.uploadFile({
            file,
            userID: request.user.id,
            task: { id: taskID, IsDescription: true },
          });
          if (result) {
            uploadedAnswerFiles.push({ file: result });
          }
        }
      }
    }
    const updatedTask = await this.taskService.updateTask(
      taskID,
      request.user.id,
      {
        ...data,
        taskAnswerFiles: uploadedAnswerFiles,
        taskDescriptionFiles: uploadedDescriptionFiles,
      },
    );
    if (updatedTask) {
      this.notification.sendTaskUpdateNotification(
        updatedTask.title,
        taskID,
        task.createdByID,
        task.usersAssigned.map((user) => user.userId),
        {
          taskDescriptionFiles:
            uploadedDescriptionFiles.length > 0
              ? uploadedDescriptionFiles
              : undefined,
          taskAnswerFiles:
            uploadedAnswerFiles.length > 0 ? uploadedAnswerFiles : undefined,
          taskText: data.taskText,
          answerText: data.answerText,
          status: data.status,
          lastChangedAt: updatedTask.lastChangedAt,
          changedByID: request.user.id,
        },
      );
    }
  }
}
