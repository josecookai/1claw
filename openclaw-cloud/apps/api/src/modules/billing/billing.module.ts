import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [BillingController, CreditsController],
  providers: [BillingService, CreditsService, JwtAuthGuard],
  exports: [BillingService, CreditsService],
})
export class BillingModule {}
