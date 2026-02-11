import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ERROR_CODES } from 'shared';

@Controller('v1')
export class InstancesController {
  constructor(private prisma: PrismaService) {}

  @Post('instances')
  async create(@Body() body: { userId: string; region?: string }) {
    const { userId, region = 'cn-east' } = body;
    const instance = await this.prisma.instance.create({
      data: {
        userId,
        status: 'PROVISIONING',
        region,
      },
    });
    return { id: instance.id, status: instance.status, region: instance.region };
  }

  @Get('instances/:id')
  async status(@Param('id') id: string) {
    const instance = await this.prisma.instance.findUnique({
      where: { id },
    });
    if (!instance) {
      return { error: ERROR_CODES.INSTANCE_NOT_FOUND };
    }
    return {
      id: instance.id,
      status: instance.status,
      region: instance.region,
      createdAt: instance.createdAt,
    };
  }
}
