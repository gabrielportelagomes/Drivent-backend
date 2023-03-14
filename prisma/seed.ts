import { ActivityType, Hotel, Prisma, PrismaClient, Room, TicketType } from '@prisma/client';
//import { ActivityType } from "../src/protocols"
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

  let activityType: ActivityType[] | Prisma.BatchPayload = await prisma.activityType.findMany();
  if (activityType.length === 0) {
    activityType = await prisma.activityType.createMany({
      data: [
        {
          name: 'Minecraft: montando o PC ideal',
          schedules: '12:00-14:00',
          capacity: 20,
          activityDate: 'Terça, 23/03',
          place: 'Auditório Principal',
        },
        {
          name: 'LoL: montando o PC ideal',
          schedules: '10:00-13:00',
          capacity: 15,
          activityDate: 'Quarta, 22/03',
          place: 'Auditório Lateral',
        },
        {
          name: 'Coding Workshop',
          schedules: '18:00-20:00',
          capacity: 10,
          activityDate: 'Quinta, 21/03',
          place: 'Sala de Workshop',
        },
      ],
    });
  }

  console.log({ event, ticketType, hotel, activityType });
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
