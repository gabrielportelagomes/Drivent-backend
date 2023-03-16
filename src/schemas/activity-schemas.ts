import { ActivityTypeId } from '@/protocols';
import Joi from 'joi';

export const createActivitySchema = Joi.object<ActivityTypeId>({
  activityTypeId: Joi.number().integer().required(),
});
