import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('v1/skills')
export class SkillsController {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取技能库列表（支持筛选预装、分类）
   */
  @Get()
  async list(
    @Query('preinstalled') preinstalled?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string,
  ) {
    const where: { isPreinstalled?: boolean; category?: string } = {};
    if (preinstalled === 'true') where.isPreinstalled = true;
    if (preinstalled === 'false') where.isPreinstalled = false;
    if (category) where.category = category;

    const take = limit ? Math.min(parseInt(limit, 10) || 100, 200) : 100;

    const skills = await this.prisma.skill.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      take,
    });

    return {
      skills: skills.map((s) => ({
        id: s.id,
        slug: s.slug,
        nameZh: s.nameZh,
        nameEn: s.nameEn,
        descriptionZh: s.descriptionZh,
        descriptionEn: s.descriptionEn,
        category: s.category,
        isPreinstalled: s.isPreinstalled,
      })),
    };
  }

  /**
   * 获取预装技能（首发套餐默认）
   */
  @Get('preinstalled')
  async preinstalled() {
    const skills = await this.prisma.skill.findMany({
      where: { isPreinstalled: true },
      orderBy: { sortOrder: 'asc' },
    });
    return {
      skills: skills.map((s) => ({
        id: s.id,
        slug: s.slug,
        nameZh: s.nameZh,
        nameEn: s.nameEn,
        category: s.category,
      })),
    };
  }

  /**
   * 用户已选技能
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async mySkills(@Req() req: Request & { userId?: string }) {
    const userId = req.userId;
    if (!userId) return { skills: [] };

    const selections = await this.prisma.userSkillSelection.findMany({
      where: { userId },
      include: { skill: true },
    });

    return {
      skills: selections.map((s) => ({
        id: s.skill.id,
        slug: s.skill.slug,
        nameZh: s.skill.nameZh,
        nameEn: s.skill.nameEn,
        category: s.skill.category,
      })),
    };
  }

  /**
   * 用户选择/取消技能
   */
  @Post('select')
  @UseGuards(JwtAuthGuard)
  async select(
    @Req() req: Request & { userId?: string },
    @Body() body: { skillIds: string[]; action?: 'add' | 'remove' | 'replace' },
  ) {
    const userId = req.userId;
    if (!userId) throw new Error('No userId');

    const { skillIds = [], action = 'replace' } = body;

    if (action === 'replace') {
      await this.prisma.userSkillSelection.deleteMany({ where: { userId } });
      if (skillIds.length > 0) {
        await this.prisma.userSkillSelection.createMany({
          data: skillIds.map((skillId) => ({ userId, skillId })),
          skipDuplicates: true,
        });
      }
    } else if (action === 'add') {
      for (const skillId of skillIds) {
        await this.prisma.userSkillSelection.upsert({
          where: { userId_skillId: { userId, skillId } },
          create: { userId, skillId },
          update: {},
        });
      }
    } else if (action === 'remove') {
      await this.prisma.userSkillSelection.deleteMany({
        where: { userId, skillId: { in: skillIds } },
      });
    }

    const selections = await this.prisma.userSkillSelection.findMany({
      where: { userId },
      include: { skill: true },
    });

    return {
      skills: selections.map((s) => ({
        id: s.skill.id,
        slug: s.skill.slug,
        nameZh: s.skill.nameZh,
        nameEn: s.skill.nameEn,
      })),
    };
  }
}
