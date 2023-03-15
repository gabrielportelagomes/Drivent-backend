import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import activityRepository from '@/repositories/activity-repository';
import paymentService from '../payments-service';
import ticketService from '../tickets-service';

async function getActivities(userId: number) {
  const ticket = await ticketService.getRemoteTicketByUserId(userId);

  if (!ticket || !ticket.TicketType) throw notFoundError();

  if (ticket.TicketType.isRemote) throw forbiddenError();

  const payment = await paymentService.getPaymentTicketId(userId, ticket.id);

  if (!payment) throw forbiddenError();

  const activities = await activityRepository.findManyActiviTypes();

  if (!activities) throw notFoundError();

  return activities;
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
