import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

async function findRoomsAndBooking(hotelId: number) {
  return prisma.room.findMany({
    where:{
      hotelId 
    },
    include: {
      Booking: true,
    }
  })
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomsAndBooking
};

export default hotelRepository;
