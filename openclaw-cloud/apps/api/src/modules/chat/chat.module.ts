import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatAuthGuard } from '../../common/guards/chat-auth.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
    BillingModule,
  ],
  controllers: [ChatController],
  providers: [ChatAuthGuard, RateLimitGuard],
})
export class ChatModule {}
