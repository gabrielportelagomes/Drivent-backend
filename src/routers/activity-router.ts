import { getActivities, getAmountInscriptions, getUserActivities, postActivity } from '@/controllers/activity-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { createActivitySchema } from '@/schemas';
import { Router } from 'express';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/', getActivities)
  .get('/user', getUserActivities)
  .get('/inscriptions/:activityTypeId', getAmountInscriptions)
  .post('/', validateBody(createActivitySchema), postActivity);

export { activityRouter };
