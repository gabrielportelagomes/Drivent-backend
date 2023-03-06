import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getPaymentByTicketId, paymentProcess } from '@/controllers';
import { createPaymentSchema } from '@/schemas/payments-schema';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentByTicketId)
  .post('/process', validateBody(createPaymentSchema), paymentProcess);

export { paymentsRouter };
