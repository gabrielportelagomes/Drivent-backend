import { AuthenticatedRequest } from '@/middlewares';
import { ActivityTypeId } from '@/protocols';
import activitiesService from '@/services/activity-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  try {
    const activitiesTypes = await activitiesService.getActivities(userId);

    return res.status(httpStatus.OK).send(activitiesTypes);
  } catch (error) {
    if (error.name === 'forbidenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send({});
    }
    return res.status(httpStatus.NO_CONTENT).send({});
  }
}

export async function getUserActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const activities = await activitiesService.findUserActivities(userId);

    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === 'forbidenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityTypeId } = req.body as ActivityTypeId;

  try {
    const activity = await activitiesService.createActivity(userId, activityTypeId);

    return res.status(httpStatus.CREATED).send(activity);
  } catch (error) {
    if (error.name === 'forbidenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === 'timeConflictError') {
      return res.status(httpStatus.CONFLICT).send({ message: error.message });
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getAmountInscriptions(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityTypeId } = req.params;

  try {
  const amountInscriptions = await activitiesService.findActivityInscription(userId, Number(activityTypeId));

  return res.status(httpStatus.OK).send(amountInscriptions);

  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}