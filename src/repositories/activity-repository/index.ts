import { prisma } from '@/config';

async function findManyActiviTypes() {
  return prisma.activityType.findMany();
}

async function createActivity(activityTypeId: number, enrollmentId: number) {
  return prisma.activity.create({
    data: {
      activityTypeId,
      enrollmentId,
    },
  });
}

const activityRepository = {
  findManyActiviTypes,
  createActivity,
};

export default activityRepository;
