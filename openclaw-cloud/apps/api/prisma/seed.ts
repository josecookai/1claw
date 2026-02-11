import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('test1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@openclaw.dev' },
    update: { password },
    create: {
      email: 'test@openclaw.dev',
      password,
    },
  });

  const renewAt = new Date();
  renewAt.setMonth(renewAt.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { id: 'seed-sub' },
    update: {},
    create: {
      id: 'seed-sub',
      plan: 'pro_40',
      status: 'ACTIVE',
      renewAt,
      provider: 'stripe',
      userId: user.id,
    },
  });

  console.log('Seeded: user', user.id, '+ pro_40 subscription');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
