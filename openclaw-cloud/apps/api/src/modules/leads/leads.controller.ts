import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('v1/leads')
export class LeadsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(
    @Body()
    body: {
      email: string;
      name?: string;
      selection: { models: string[]; channels: string[]; plan: string; lang: string };
      intent: 'waitlist' | 'sales';
      source?: string;
    },
  ) {
    const { email, name, selection, intent, source = 'landing_v1' } = body;
    if (!email || !selection?.plan || !selection?.lang) {
      return { error: 'email, selection.plan, selection.lang required' };
    }
    const lead = await this.prisma.lead.create({
      data: {
        email,
        name: name ?? null,
        plan: selection.plan,
        models: JSON.stringify(selection.models ?? []),
        channels: JSON.stringify(selection.channels ?? []),
        lang: selection.lang,
        intent,
        source,
      },
    });
    return { id: lead.id, ok: true };
  }
}
