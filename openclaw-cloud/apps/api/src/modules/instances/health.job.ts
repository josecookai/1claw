import { PrismaService } from '../../prisma.service';

/**
 * Health job: every 60s, scan PROVISIONING instances and update to RUNNING (stub).
 * No real deployment - just simulates instance ready.
 */
export async function runInstanceHealthJob(prisma: PrismaService) {
  const updated = await prisma.instance.updateMany({
    where: { status: 'PROVISIONING' },
    data: { status: 'RUNNING' },
  });
  if (updated.count > 0) {
    console.log(`[Health] Updated ${updated.count} instance(s) to RUNNING`);
  }
}
