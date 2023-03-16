import { CreateTicketParams } from "@/protocols";
import Joi from "joi";

export const createTicketSchema = Joi.object<CreateTicketParams>({
  ticketTypeId: Joi.number().min(1).required(),
});
