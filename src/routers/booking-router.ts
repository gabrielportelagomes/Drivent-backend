import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, listBooking, changeBooking, listBookingSumary, listBookingByRoomId } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/summary', listBookingSumary)
  .get('/:roomId', listBookingByRoomId)
  .post('', bookingRoom)
  .put('/:bookingId', changeBooking);

export { bookingRouter };
