import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileType } from './dto/user-data.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { GetUsersDTO } from './dto/get-users-dto';
import { FriendService } from './friend.service';
import { FriendRequestService } from './friend-request.service';
import { ChatService } from '../chat/chat.service';
import { TaskService } from '../task/task.service';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from '../pipes/ParseJsonPipe';
import { StorageService } from '../storage/storage.service';
import { CookieService } from '../auth/cookies.service';

@Controller('/api/user')
export class UserController {
  constructor(
    private friendService: FriendService,
    private friendRequestService: FriendRequestService,
    private userService: UserService,
    private readonly auth: AuthService,
    private readonly tasks: TaskService,
    private readonly cookieService: CookieService,
    private readonly storage: StorageService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) {}
  @UseGuards(JwtAccessGuard)
  @Get('initialMetadata')
  async getInitialMetadata(
    @Req() request: Request & { user: { id: number } },
    @Res() res: Response,
  ) {
    const userData = await this.userService.findOne(request.user.id);
    const friends = await this.friendService.getFriends(request.user.id, 0, 20);
    const requests = await this.friendRequestService.getUserRequests([
      request.user.id,
    ]);
    const unreadChats = await this.chatService.getUnreadChatsIDs(
      request.user.id,
    );
    const tasksForMe = await this.tasks.getTasksforUser(request.user.id);
    const createdTasks = await this.tasks.getCreatedTasksByUser(
      request.user.id,
    );
    if (userData) {
      return res.send({
        userData,
        friends,
        requests,
        unreadChats,
        tasksForMe,
        createdTasks,
      });
    }
    throw Error('wrong userData');
  }
  @UseGuards(JwtAccessGuard)
  @Get()
  async get(
    @Req() request: Request & { user: { id: number } },
    @Res() res: Response,
  ) {
    const data = await this.userService.findOne(request.user.id);

    if (data) {
      return res.send({ data });
    } else throw Error('user not found');
  }
  @UseGuards(JwtAccessGuard)
  @Post('publicUsers')
  async getPublicUsersData(
    @Body() data: GetUsersDTO,
    @Req() req: Request & { user: { id: number } },
  ) {
    if (data.name === undefined && data.IDs === undefined)
      throw Error('Body data not provided');
    const res = await this.userService.findMany(data);

    return res.filter((user) => user.id !== req.user.id);
  }
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }]))
  @Patch()
  async update(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Req() req: Request & { user: { id: number } },
    @Body('data', ParseJsonPipe) body: Partial<UserProfileType>,
  ) {
    const newImg = files.files && files.files[0] ? files.files[0] : undefined;
    if (newImg) newImg.originalname = decodeURIComponent(newImg.originalname);
    return await this.userService.updateUser(body, req.user.id, newImg);
  }
  @UseGuards(JwtAccessGuard)
  @Get('myFriends')
  async getFriends(
    @Req() req: Request & { user: { id: number } },
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('name') name?: string,
  ) {
    return await this.friendService.getFriends(
      req.user.id,
      Number(skip),
      Number(take),
      name,
    );
  }
  @UseInterceptors(FileFieldsInterceptor([{ name: 'img', maxCount: 1 }]))
  @Post()
  async create(
    @Res() response: Response,
    @UploadedFiles() img: { img: Express.Multer.File[] },
    @Body('authData', ParseJsonPipe) authData: CreateUserDTO['authData'],
    @Body('userData', ParseJsonPipe)
    userData: Omit<CreateUserDTO['userData']['profile'], 'img'>,
  ) {
    try {
      const isImg = Array.isArray(img.img);
      const res = await this.userService.createUser(
        authData,
        userData,
        isImg ? img.img[0] : undefined,
      );
      const { accessToken } = await this.auth.refresh(res.user.id);
      this.cookieService.setRefreshToken(response, res.auth.refreshToken);
      this.cookieService.setAccessToken(response, accessToken);
      response.send({ message: 'success' });
    } catch (error) {}
  }
  @UseGuards(JwtAccessGuard)
  @Post('acceptRequest')
  async acceptRequest(
    @Body() data: { requestsID: number[] },
    @Req() req: Request & { user: { id: number } },
  ) {
    const validRequests = await this.friendRequestService.isRequestForUser(
      data.requestsID,
      req.user.id,
    );

    if (validRequests) {
      return await this.friendRequestService.acceptFriendRequest(validRequests);
    } else throw new UnauthorizedException('There is no access to the request');
  }
  @UseGuards(JwtAccessGuard)
  @Post('deleteFriend')
  async deleteFriend(
    @Body() data: { friendID: number },
    @Req() req: Request & { user: { id: number } },
  ) {
    await this.friendService.deleteFriend(req.user.id, data.friendID);
  }
  @UseGuards(JwtAccessGuard)
  @Post('rejectRequest')
  async rejectRequest(
    @Body() data: { requestsID: number[] },
    @Req() req: Request & { user: { id: number } },
  ) {
    const validate = await this.friendRequestService.isRequestForUser(
      data.requestsID,
      req.user.id,
    );
    if (validate) {
      await this.friendRequestService.rejectFriendRequests(validate);
    } else throw new UnauthorizedException('There is no access to the request');
  }
  @UseGuards(JwtAccessGuard)
  @Post('request')
  async sendRequest(
    @Body() data: { friendIDs: number[] },
    @Req() req: Request & { user: { id: number } },
  ) {
    try {
      await this.friendRequestService.sendFriendRequest({
        userId: req.user.id,
        friendIds: data.friendIDs,
      });

      return true;
    } catch (error: any) {
      console.error('ERROR:');
      console.error(error);
      throw error;
    }
  }
}
