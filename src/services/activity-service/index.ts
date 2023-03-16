import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import activityRepository from '@/repositories/activity-repository';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
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

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw forbiddenError();
  }

  return enrollment;
}

async function createActivity(userId: number, activityTypeId: number) {
  const enrollment = await checkEnrollmentTicket(userId);

  const activity = await activityRepository.createActivity(activityTypeId, enrollment.id);

  return activity;
}

const activitiesService = {
  getActivities,
  createActivity,
};

export default activitiesService;
