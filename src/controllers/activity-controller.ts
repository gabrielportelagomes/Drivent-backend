import { AuthenticatedRequest } from '@/middlewares';
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
