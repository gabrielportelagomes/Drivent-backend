import { prisma } from '@/config';

export async function createActivity(activityTypeId: number, enrollmentId: number) {
  return prisma.activity.create({
    data: {
      activityTypeId,
      enrollmentId,
    },
  });
}
