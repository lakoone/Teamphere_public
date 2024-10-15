import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationGateway } from '../websocket/notification/NotificationGateway.service';
import { SendRequestDTO } from './dto/send-request.dto';
import { FriendService } from './friend.service';
import { UserService } from './user.service';
import { UserData } from './dto/user-data.dto';
@Injectable()
export class FriendRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notificationGateway: NotificationGateway,
    private readonly friendService: FriendService,
  ) {}

  async getUserRequests(userIDs: number[]) {
    const results = await this.prisma.friendRequest.findMany({
      where: { toUserId: { in: userIDs } },
    });

    return results;
  }

  async sendFriendRequest(data: SendRequestDTO): Promise<void> {
    if (data.friendIds.includes(data.userId))
      throw new BadRequestException('You cannot send a request to yourself');
    const existingFriends = await this.prisma.friend.findMany({
      where: {
        OR: [
          { userId: data.userId, friendId: { in: data.friendIds } },
          { userId: { in: data.friendIds }, friendId: data.userId },
        ],
      },
    });
    const existingRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          { fromUserId: data.userId, toUserId: { in: data.friendIds } },
          { fromUserId: { in: data.friendIds }, toUserId: data.userId },
        ],
      },
    });

    const existingFriendIds = new Set<number>();

    existingFriends.forEach((friend) => {
      existingFriendIds.add(friend.friendId);
      existingFriendIds.add(friend.userId);
    });
    existingRequests.forEach((request) => {
      existingFriendIds.add(request.toUserId);
      existingFriendIds.add(request.fromUserId);
    });

    const newFriendsIDs = data.friendIds.filter(
      (id) => !existingFriendIds.has(id),
    );
    if (!newFriendsIDs.length) {
      throw new BadRequestException(
        'The request has already been sent or accepted.',
      );
    }
    const newFriendsData = newFriendsIDs.map((friendId) => ({
      fromUserId: data.userId,
      toUserId: friendId,
    }));

    await this.prisma.friendRequest.createMany({
      data: newFriendsData,
      skipDuplicates: true,
    });

    const requests = await this.getUserRequests(newFriendsIDs);
    await this.notificationGateway.sendFriendRequestNotification(
      data.userId,
      requests,
    );
    console.log(
      '-----friend-request.service------END------sendFriendRequest-----',
    );
  }

  async acceptFriendRequest(
    requests: {
      id: number;
      fromUserId: number;
      toUserId: number;
      status: string;
    }[],
  ): Promise<boolean> {
    console.log(
      '-----friend-request.service------START------acceptFriendRequest-----ARGUMENTS:',
      requests,
    );

    if (!requests) {
      throw new Error('Invalid or already processed request');
    }
    const addFriendsData = requests.map((request) => {
      return { userId: request.fromUserId, friendId: request.toUserId };
    });
    const chats = await this.friendService.addFriends(addFriendsData);
    const deleteRequestData = requests.map((request) => request.id);
    await this.prisma.friendRequest.deleteMany({
      where: { id: { in: deleteRequestData } },
    });
    const toIDs = requests.map((request) => request.fromUserId);
    const userWhoAccepted = await this.userService.findOne(
      requests[0].toUserId,
    );

    if (chats.length) this.notificationGateway.sendCreatedChats(chats);
    if (userWhoAccepted)
      await this.notificationGateway.sendAcceptRequestNotification(
        userWhoAccepted as UserData,
        toIDs,
      );
    return true;
  }

  async isRequestForUser(requestsID: number[], userID: number) {
    const result = await this.prisma.friendRequest.findMany({
      where: {
        id: { in: requestsID },
        toUserId: userID,
      },
    });

    if (requestsID.length === result.length) return result;
    else return false;
  }

  async rejectFriendRequests(
    requests: {
      id: number;
      fromUserId: number;
      toUserId: number;
      status: string;
    }[],
  ): Promise<void> {
    if (!requests) {
      throw new Error('Invalid or already processed request');
    }
    const requestIDs = requests.map((req) => req.id);
    await this.prisma.friendRequest.deleteMany({
      where: { id: { in: requestIDs } },
    });
  }
}
