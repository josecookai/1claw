import { Module } from '@nestjs/common';
import { BindController } from './bind.controller';

@Module({
  controllers: [BindController],
})
export class BindModule {}
