import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma.service';

@Controller('v1')
export class OnboardingController {
  constructor(private prisma: PrismaService) {}

  @Post('onboarding/complete')
  async complete(@Body() body: { plan: string; policy: string }) {
    const { plan = 'pro_40', policy = 'BEST' } = body;
    const bindCode = 'OC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const password = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

    const user = await this.prisma.user.create({
      data: { email: `onboard-${Date.now()}@openclaw.dev`, password },
    });

    const renewAt = new Date();
    renewAt.setMonth(renewAt.getMonth() + 1);

    await this.prisma.subscription.create({
      data: {
        plan,
        status: 'ACTIVE',
        renewAt,
        provider: 'stripe',
        userId: user.id,
      },
    });

    await this.prisma.telegramBinding.create({
      data: { userId: user.id, bindCode, chatId: null },
    });

    return { bindCode, userId: user.id };
  }
}
