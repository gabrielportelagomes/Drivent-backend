import { prisma } from '@/config';

async function findAllByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function findRoomByIdWithBookings(id: number) {
  return prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      _count: { select: { Booking: true } },
    },
  });
}

const roomRepository = {
  findAllByHotelId,
  findById,
  findRoomByIdWithBookings,
};

export default roomRepository;
