import { CreatePayment } from '@/protocols';
import Joi from 'joi';

export const createPaymentSchema = Joi.object<CreatePayment>({
  ticketId: Joi.number().min(1).integer().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().integer().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string()
      .regex(/^((0?[1-9]|1[0-2])\/((20)?[0-9]{2}|[0-9]{2}))$/)
      .required(),
    cvv: Joi.number().integer().required(),
  }).required(),
});
