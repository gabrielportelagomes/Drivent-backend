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

async function findActivitiesByEnrollmentId(enrollmentId: number) {
  return prisma.activity.findMany({
    where: {
      enrollmentId,
    },
  });
}

const activityRepository = {
  findManyActiviTypes,
  createActivity,
  findActivitiesByEnrollmentId,
};

export default activityRepository;
