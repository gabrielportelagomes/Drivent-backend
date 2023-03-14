import { prisma } from '@/config';

async function findManyActiviTypes() {
    return prisma.activityType.findMany();
}

const activityRepository = {
    findManyActiviTypes
}

export default activityRepository;