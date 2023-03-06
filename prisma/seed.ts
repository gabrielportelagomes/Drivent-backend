import { Prisma, PrismaClient, TicketType } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

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

  let ticketType: TicketType[] | Prisma.BatchPayload = await prisma.ticketType.findMany();

  if (ticketType.length !== 0) {
    ticketType = await prisma.ticketType.deleteMany();
  }

  ticketType = await prisma.ticketType.createMany({
    data: [
      { name: 'Online', price: 10000, isRemote: true, includesHotel: false },
      { name: 'Presencial Sem Hotel', price: 25000, isRemote: false, includesHotel: false },
      { name: 'Presencial Com Hotel', price: 60000, isRemote: false, includesHotel: true },
    ],
  });

  console.log({ event, ticketType });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
