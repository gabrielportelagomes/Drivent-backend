import { forbiddenError } from '@/errors/forbidden-error';
import activityRepository from '@/repositories/activity-repository';
import paymentService from '../payments-service';
import ticketService from '../tickets-service';

async function getActivities(userId: number) {
  const ticket = await ticketService.getTicketByUserId(userId);

  const payment = await paymentService.getPaymentByTicketId(userId, ticket.id);

  if (ticket.TicketType.isRemote || !payment) {
    throw forbiddenError();
  }

  const activities = await activityRepository.findManyActiviTypes();

  return activities;

}

const activitiesService = {
  getActivities,
};

export default activitiesService;
