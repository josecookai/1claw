import { Module } from '@nestjs/common';
import { InstancesController } from './instances.controller';
import { HealthScheduler } from './health.scheduler';

@Module({
  controllers: [InstancesController],
  providers: [HealthScheduler],
})
export class InstancesModule {}
