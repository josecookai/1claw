import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma.module';
import { BindModule } from './modules/bind/bind.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ChatModule } from './modules/chat/chat.module';
import { InstancesModule } from './modules/instances/instances.module';

@Module({
  imports: [PrismaModule, BindModule, OnboardingModule, ChatModule, InstancesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
