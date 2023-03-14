import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createActivityType() {
    return prisma.activityType.create({
      data: {
        name: faker.name.findName(),
        schedules: faker.name.jobTitle(),
        capacity: faker.datatype.number(),
        activityDate: faker.date.soon().toISOString(),
        place: faker.address.streetAddress()
      }
    });
  }
