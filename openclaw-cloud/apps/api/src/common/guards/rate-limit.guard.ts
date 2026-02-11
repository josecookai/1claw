import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Request } from 'express';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis.module';

const RATE_WINDOW = 60; // seconds
const RATE_LIMIT = 60; // requests per window per userId

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(@Inject(REDIS_CLIENT) private redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = (req as Request & { userId?: string }).userId;
    if (!userId) return true;

    try {
      const key = `ratelimit:chat:${userId}`;
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - RATE_WINDOW;

      const multi = this.redis.multi();
      multi.zremrangebyscore(key, 0, windowStart);
      multi.zadd(key, now, `${now}-${Math.random()}`);
      multi.zcard(key);
      multi.expire(key, RATE_WINDOW + 1);

      const results = await multi.exec();
      const count = results?.[2]?.[1] as number | undefined;

      if (count !== undefined && count > RATE_LIMIT) {
        throw new HttpException(
          { error: 'ROUTER_RATE_LIMITED', message: 'Rate limit exceeded', retryable: true },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (e) {
      if (e instanceof HttpException) throw e;
      // Redis unavailable: allow request through
    }

    return true;
  }
}
