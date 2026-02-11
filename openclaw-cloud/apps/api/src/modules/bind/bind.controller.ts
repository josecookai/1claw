import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ERROR_CODES } from 'shared';

@Controller('v1')
export class BindController {
  constructor(private prisma: PrismaService) {}

  @Post('bind/complete')
  async complete(@Body() body: { bindCode: string; chatId: string }) {
    const { bindCode, chatId } = body;
    if (!bindCode || !chatId) {
      return { ok: false, error: ERROR_CODES.BIND_CODE_INVALID };
    }
    const binding = await this.prisma.telegramBinding.findUnique({
      where: { bindCode: bindCode.trim().toUpperCase() },
    });
    if (!binding || binding.chatId) {
      return { ok: false, error: ERROR_CODES.BIND_CODE_INVALID };
    }
    await this.prisma.telegramBinding.update({
      where: { id: binding.id },
      data: { chatId },
    });
    return { ok: true };
  }
}
