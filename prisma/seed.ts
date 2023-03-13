import { Hotel, Prisma, PrismaClient, Room, TicketType } from '@prisma/client';
import dayjs from 'dayjs';
import { createClient } from 'redis';
const prisma = new PrismaClient();
const redis = createClient({
  url: process.env.REDIS_URL,
});

async function initRedis(): Promise<void> {
  await redis.connect();
}

initRedis();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  const cachekey = 'event';
  redis.set(cachekey, JSON.stringify(event));

  let ticketType: TicketType[] | Prisma.BatchPayload = await prisma.ticketType.findMany();

  if (ticketType.length === 0) {
    ticketType = await prisma.ticketType.createMany({
      data: [
        { name: 'Online', price: 10000, isRemote: true, includesHotel: false },
        { name: 'Presencial Sem Hotel', price: 25000, isRemote: false, includesHotel: false },
        { name: 'Presencial Com Hotel', price: 60000, isRemote: false, includesHotel: true },
      ],
    });
  }

  let hotel: Hotel[] | Prisma.BatchPayload = await prisma.hotel.findMany();

  let drivenResort: Hotel, drivenPalace: Hotel, drivenWorld: Hotel;

  if (hotel.length === 0) {
    drivenResort = await prisma.hotel.create({
      data: {
        name: 'Driven Resort',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4K3laolx8HVedXm6eIwPwuo1gxdsLDIRrYg&usqp=CAU',
        Rooms: {
          createMany: {
            data: [
              { name: '101', capacity: 1 },
              { name: '102', capacity: 3 },
              { name: '103', capacity: 2 },
              { name: '104', capacity: 2 },
              { name: '105', capacity: 1 },
            ],
          },
        },
      },
    });

    drivenPalace = await prisma.hotel.create({
      data: {
        name: 'Driven Palace',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo4dAcXfPFiinjwuTOeScNgcu7fMWBnBPG7w&usqp=CAU',
        Rooms: {
          createMany: {
            data: [
              { name: '101', capacity: 2 },
              { name: '102', capacity: 1 },
              { name: '103', capacity: 2 },
            ],
          },
        },
      },
    });

    drivenWorld = await prisma.hotel.create({
      data: {
        name: 'Driven World',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtjAjb-JFAJXqcUvo0X8E2RpX--_lkjFcEEQ&usqp=CAU',
        Rooms: {
          createMany: {
            data: [
              { name: '101', capacity: 1 },
              { name: '102', capacity: 3 },
              { name: '103', capacity: 3 },
              { name: '104', capacity: 1 },
            ],
          },
        },
      },
    });

    hotel = [drivenResort, drivenPalace, drivenWorld];
  }

  console.log({ event, ticketType, hotel });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await redis.disconnect();
  });
