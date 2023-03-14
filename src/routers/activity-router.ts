import { getActivities } from '@/controllers/activity-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const activityRouter = Router();

activityRouter
.all("/*", authenticateToken)
.get('/', getActivities);

export { activityRouter };
