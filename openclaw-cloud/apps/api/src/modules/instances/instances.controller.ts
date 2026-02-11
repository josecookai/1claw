import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ERROR_CODES } from 'shared';

@Controller('v1')
export class InstancesController {
  constructor(private prisma: PrismaService) {}

  @Get('instances')
  async list(@Query('userId') userId: string) {
    if (!userId) return { error: 'userId required', instances: [] };
    const instances = await this.prisma.instance.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return {
      instances: instances.map((i: { id: string; status: string; region: string; createdAt: Date }) => ({
        id: i.id,
        status: i.status,
        region: i.region,
        createdAt: i.createdAt,
      })),
    };
  }

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

  @Post('instances/:id/stop')
  async stop(@Param('id') id: string, @Body() body: { userId?: string }) {
    const instance = await this.prisma.instance.findUnique({
      where: { id },
    });
    if (!instance) {
      return { error: ERROR_CODES.INSTANCE_NOT_FOUND };
    }
    if (body.userId && instance.userId !== body.userId) {
      return { error: 'Forbidden' };
    }
    await this.prisma.instance.update({
      where: { id },
      data: { status: 'STOPPED' },
    });
    return { id: instance.id, status: 'STOPPED' };
  }
}
