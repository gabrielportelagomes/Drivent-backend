import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import activityRepository from '@/repositories/activity-repository';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentService from '../payments-service';
import ticketService from '../tickets-service';
import { timeConflictError } from '@/errors/time-conflict-error';

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

async function findUserActivities(userId: number) {
  const enrollment = await checkEnrollmentTicket(userId);

  const activity = await activityRepository.findActivitiesByEnrollmentId(enrollment.id);

  if (activity.length === 0) {
    throw notFoundError();
  }

  return activity;
}

async function createActivity(userId: number, activityTypeId: number) {
  const enrollment = await checkEnrollmentTicket(userId);

  const activityType = await activityRepository.findActivityTypeById(activityTypeId);

  if (!activityType) {
    throw notFoundError();
  }

  const reservations = await activityRepository.findActivityReservations(activityType.id);

  if (activityType.capacity <= reservations) {
    throw forbiddenError();
  }

  const schedule = activityType.schedules.split('-');
  const startTime = Number(schedule[0].split(':')[0]) + Number((Number(schedule[0].split(':')[1]) / 60).toFixed(4));
  const endTime = Number(schedule[1].split(':')[0]) + Number((Number(schedule[1].split(':')[1]) / 60).toFixed(4));

  const userActivities = await activityRepository.findActivitiesByEnrollmentId(enrollment.id);

  const repeatedActivity = userActivities.filter((activity) => activity.activityTypeId === activityType.id);

  if (repeatedActivity.length > 0) {
    throw timeConflictError();
  }

  let conflict = false;
  const activityTypeDate = activityType.activityDate.split(' ')[1];

  userActivities.forEach((activity) => {
    const activityDate = activity.ActivityType.activityDate.split(' ')[1];
    if (
      Number(activityDate.split('/')[0]) === Number(activityTypeDate.split('/')[0]) &&
      Number(activityDate.split('/')[1]) === Number(activityTypeDate.split('/')[1])
    ) {
      const schedule = activity.ActivityType.schedules.split('-');
      const newActivityStartTime =
        Number(schedule[0].split(':')[0]) + Number((Number(schedule[0].split(':')[1]) / 60).toFixed(4));
      const newActivityEndTime =
        Number(schedule[1].split(':')[0]) + Number((Number(schedule[1].split(':')[1]) / 60).toFixed(4));
      if (startTime >= newActivityStartTime && startTime <= newActivityEndTime) {
        conflict = true;
        return;
      } else if (endTime >= newActivityStartTime && endTime <= newActivityEndTime) {
        conflict = true;
        return;
      }
    }
  });

  if (conflict) {
    throw timeConflictError();
  }

  const activity = await activityRepository.createActivity(activityTypeId, enrollment.id);

  return activity;
}

const activitiesService = {
  getActivities,
  createActivity,
  findUserActivities,
};

export default activitiesService;
