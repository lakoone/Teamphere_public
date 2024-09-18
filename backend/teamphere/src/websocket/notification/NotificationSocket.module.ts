import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { NotificationGateway } from './NotificationGateway.service';

@Module({
  imports: [AuthModule],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationSocketModule {}
