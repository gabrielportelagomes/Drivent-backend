import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createActivity(activityTypeId: number, enrollmentId: number) {
  return prisma.activity.create({
    data: {
      activityTypeId,
      enrollmentId,
    },
  });
}

export async function createActivityTypeWithFewVacancies() {
  return prisma.activityType.create({
    data: {
      name: faker.name.findName(),
      schedules: `${faker.datatype.number({ min: 10, max: 15 })}:${faker.datatype.number({
        min: 10,
        max: 59,
      })}-${faker.datatype.number({ min: 16, max: 20 })}:${faker.datatype.number({ min: 10, max: 59 })}`,
      capacity: faker.datatype.number({ min: 2, max: 2 }),
      activityDate: `${faker.date.weekday()}, ${faker.datatype.number({ min: 10, max: 28 })}/${faker.datatype.number({
        min: 10,
        max: 12,
      })}`,
      place: faker.address.streetAddress(),
    },
  });
}

export async function createConflictActivityType(schedule: string, activityDate: string) {
  return prisma.activityType.create({
    data: {
      name: faker.name.findName(),
      schedules: schedule,
      capacity: faker.datatype.number({ min: 10, max: 20 }),
      activityDate: activityDate,
      place: faker.address.streetAddress(),
    },
  });
}
