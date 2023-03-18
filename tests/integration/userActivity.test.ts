import app, { init } from '@/app';
import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import e from 'express';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createActivityType,
} from '../factories';
import {
  createActivity,
  createActivityTypeWithFewVacancies,
  createConflictActivityType,
} from '../factories/userActivity-factory';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /activity/user', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activity/user');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 when user has not a enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has not a ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has not a payment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has a remote ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 when user has not an activity ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 when user has an activity ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const activityType = await createActivityType();
      const activity = await createActivity(activityType.id, enrollment.id);

      const response = await server.get('/activity/user').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: activity.id,
          activityTypeId: activity.activityTypeId,
          enrollmentId: activity.enrollmentId,
          createdAt: activity.createdAt.toISOString(),
          updatedAt: activity.updatedAt.toISOString(),
          ActivityType: {
            id: activityType.id,
            name: activityType.name,
            schedules: activityType.schedules,
            capacity: activityType.capacity,
            activityDate: activityType.activityDate,
            place: activityType.place,
            updatedAt: activityType.updatedAt.toISOString(),
            createdAt: activityType.createdAt.toISOString(),
          },
        },
      ]);
    });
  });
});

describe('POST /activity', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/activity');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 with a invalid body ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { activityTypeId: 'error' };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 403 when user has not a enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const activityType = await createActivityType();
      const body = {
        activityTypeId: activityType.id,
      };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has not a ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const activityType = await createActivityType();
      const body = {
        activityTypeId: activityType.id,
      };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has not a payment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const activityType = await createActivityType();
      const body = {
        activityTypeId: activityType.id,
      };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has a remote ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activityType = await createActivityType();
      const body = {
        activityTypeId: activityType.id,
      };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 when has a invalidy activityType ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { activityTypeId: 0 };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when given activityType has no capacity ', async () => {
      const fakeUser = await createUser();
      const fakeEnrollment = await createEnrollmentWithAddress(fakeUser);
      const fakeUser2 = await createUser();
      const fakeEnrollment2 = await createEnrollmentWithAddress(fakeUser2);
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activityType = await createActivityTypeWithFewVacancies();
      await createActivity(activityType.id, fakeEnrollment.id);
      await createActivity(activityType.id, fakeEnrollment2.id);
      const body = { activityTypeId: activityType.id };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 409 when given activityType is already registered ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activityType = await createActivityTypeWithFewVacancies();
      const activity = await createActivity(activityType.id, enrollment.id);
      const body = { activityTypeId: activityType.id };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it('should respond with status 409 when given activityType has time conflict ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activityType = await createActivityTypeWithFewVacancies();
      const activity = await createActivity(activityType.id, enrollment.id);
      const conflictActivityType = await createConflictActivityType(activityType.schedules, activityType.activityDate);
      const body = { activityTypeId: conflictActivityType.id };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it('should respond with status 201 with activity data ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activityType = await createActivityTypeWithFewVacancies();
      const body = { activityTypeId: activityType.id };

      const response = await server.post('/activity').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CREATED);
    });
  });
});
