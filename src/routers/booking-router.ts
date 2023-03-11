import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, listBooking, changeBooking, getBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/:roomId', getBooking)
  .post('', bookingRoom)
  .put('/:bookingId', changeBooking);

export { bookingRouter };
