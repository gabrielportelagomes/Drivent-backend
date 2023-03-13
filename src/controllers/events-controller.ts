import { conectRedis } from '@/config/redis';
import eventsService from '@/services/events-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getDefaultEvent(_req: Request, res: Response) {
  const cachekey = 'event';
  try {
    const cachedEvent = await conectRedis.get(cachekey);

    if (cachedEvent) {
      return res.send(JSON.parse(cachedEvent));
    }

    const event = await eventsService.getFirstEvent();
    conectRedis.set(cachekey, JSON.stringify(event));
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
