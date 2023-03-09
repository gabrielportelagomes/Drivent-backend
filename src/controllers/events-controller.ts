import { redis } from '@/app';
import eventsService from '@/services/events-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getDefaultEvent(_req: Request, res: Response) {
  const cachekey = 'event';
  try {
    const cachedEvent = await redis.get(cachekey);

    if (cachedEvent) {
      return res.send(JSON.parse(cachedEvent));
    }

    const event = await eventsService.getFirstEvent();
    redis.set(cachekey, JSON.stringify(event));
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
