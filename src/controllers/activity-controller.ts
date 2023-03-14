import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activity-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const  userId  = req.userId as number;
  try {
    const activies = await activitiesService.getActivities(userId);

    return res.status(httpStatus.OK).send(activies);
  } catch (error) {
    if(error.name === "forbidenError"){
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
