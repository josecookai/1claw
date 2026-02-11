import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BindModule } from './modules/bind/bind.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ChatModule } from './modules/chat/chat.module';
import { InstancesModule } from './modules/instances/instances.module';
import { UsageModule } from './modules/usage/usage.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [PrismaModule, AuthModule, BindModule, OnboardingModule, ChatModule, InstancesModule, UsageModule, SubscriptionModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
