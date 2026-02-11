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
import { LeadsModule } from './modules/leads/leads.module';
import { SkillsModule } from './modules/skills/skills.module';
import { BillingModule } from './modules/billing/billing.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule, BindModule, OnboardingModule, ChatModule, InstancesModule, UsageModule, SubscriptionModule, LeadsModule, SkillsModule, BillingModule, WebhooksModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
