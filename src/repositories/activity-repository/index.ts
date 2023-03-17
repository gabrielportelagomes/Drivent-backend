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
    include: {
      ActivityType: true,
    },
  });
}

async function findActivityTypeById(id: number) {
  return prisma.activityType.findUnique({
    where: {
      id,
    },
  });
}

async function findActivityReservations(activityTypeId: number) {
  return prisma.activity.count({
    where: {
      activityTypeId,
    },
  });
}

const activityRepository = {
  findManyActiviTypes,
  createActivity,
  findActivitiesByEnrollmentId,
  findActivityTypeById,
  findActivityReservations,
};

export default activityRepository;
