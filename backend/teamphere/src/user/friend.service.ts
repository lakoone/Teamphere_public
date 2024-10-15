import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AddFriendDTO } from './dto/add-friend.dto';
import { ChatService } from '../chat/chat.service';
import { NotificationGateway } from '../websocket/notification/NotificationGateway.service';
@Injectable()
export class FriendService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async getFriends(id: number, skip: number, take: number, name?: string) {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
        AND: name
          ? {
              OR: [
                {
                  user: {
                    profile: { name: { contains: name, mode: 'insensitive' } },
                  },
                },
                {
                  friend: {
                    profile: { name: { contains: name, mode: 'insensitive' } },
                  },
                },
              ],
            }
          : {},
      },
      include: {
        user: { select: { id: true, profile: true } },
        friend: { select: { profile: true, id: true } },
      },
      take,
      skip,
    });

    return friends.map((friend) =>
      friend.friendId !== id ? friend.friend : friend.user,
    );
  }

  async addFriends(data: AddFriendDTO[]) {
    const createdChats = await this.prisma.$transaction(async (tx) => {
      const res = await tx.friend.createMany({
        data,
      });
      if (res) {
        const serializedData = data.map((requestIDs) => ({
          participants: [requestIDs.userId, requestIDs.friendId],
        }));
        return await this.chatService.createChats(serializedData);
      } else throw new BadRequestException('Friend creation failed');
    });
    return createdChats;
  }

  async deleteFriend(userId: number, friendId: number) {
    const deletedFriends = await this.prisma.friend.findMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    if (deletedFriends.length) {
      await this.prisma.friend.deleteMany({
        where: {
          OR: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
      this.notificationGateway.sendDeleteFriendNotification(deletedFriends);
    }
  }

  async isFriend(userId: number, friendId: number) {
    return this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
  }
}
