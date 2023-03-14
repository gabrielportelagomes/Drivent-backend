import { forbiddenError } from '@/errors/forbidden-error';
import activityRepository from '@/repositories/activity-repository';
import paymentService from '../payments-service';
import ticketService from '../tickets-service';

async function getActivities(userId: number) {
  const ticket = await ticketService.getRemoteTicketByUserId(userId); //ticket NOT FOUND, e remote FORBBIDEN

  const payment = await paymentService.getPaymentTicketId(userId, ticket.id);

  const activities = await activityRepository.findManyActiviTypes();

  return activities;

}

const activitiesService = {
  getActivities,
};

export default activitiesService;
