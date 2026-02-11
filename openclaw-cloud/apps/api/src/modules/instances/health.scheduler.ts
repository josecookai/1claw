import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { runInstanceHealthJob } from './health.job';

const INTERVAL_MS = 60_000;

@Injectable()
export class HealthScheduler implements OnModuleInit, OnModuleDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      runInstanceHealthJob(this.prisma).catch((e) =>
        console.error('[Health] Job error:', e),
      );
    }, INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
