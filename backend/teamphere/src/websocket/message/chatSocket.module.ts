import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { ChatModule } from '../../chat/chat.module';
import { ChatsGateway } from './chatGateway.service';
import { QueueModule } from '../../queue/queue.module';
import { NotificationSocketModule } from '../notification/NotificationSocket.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    QueueModule,
    forwardRef(() => NotificationSocketModule),
  ],
  providers: [ChatsGateway],
  exports: [ChatsGateway],
})
export class ChatSocketModule {}
