import { notFoundError, forbiddenError } from '@/errors';
import activitiesService from '@/services/activity-service';
import ticketService from '@/services/tickets-service';
import paymentService from '@/services/payments-service';
import activityRepository from '@/repositories/activity-repository';
import { Ticket, TicketType } from '@prisma/client';
import { getActivities } from '@/controllers/activity-controller';
jest.mock('@/services/tickets-service');
jest.mock('@/services/payments-service');
jest.mock('@/repositories/activity-repository');

describe('Activities service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getActivities', () => {
    const userId = 1;

    it('should throw not found error if ticket is not found', async () => {
      jest.spyOn(ticketService, 'getRemoteTicketByUserId').mockResolvedValueOnce(null);

      await expect(activitiesService.getActivities(userId)).rejects.toEqual(notFoundError());
    });

    it('should throw forbidden error if ticket is remote', async () => {
      jest.spyOn(ticketService, 'getRemoteTicketByUserId').mockImplementationOnce(async (userId: number) => {
        return {
          id: 1,
          ticketTypeId: 3,
          enrollmentId: 1,
          status: 'PAID',
          createdAt: new Date('2023-03-11T17:07:45.055Z'),
          updatedAt: new Date('2023-03-11T17:08:07.821Z'),
          TicketType: {
            id: 3,
            name: 'Presencial Com Hotel',
            price: 60000,
            isRemote: false,
            includesHotel: true,
            createdAt: new Date('2023-03-11T17:04:24.517Z'),
            updatedAt: new Date('2023-03-11T17:04:24.518Z'),
          },
        } as Ticket & { TicketType: TicketType };
      });

      await expect(activitiesService.getActivities(userId)).rejects.toEqual(forbiddenError());
    });

    it('should throw forbidden error if has no payment yet', async () => {
      jest.spyOn(ticketService, 'getRemoteTicketByUserId').mockImplementationOnce(async (userId: number) => {
        return {
          id: 1,
          ticketTypeId: 3,
          enrollmentId: 1,
          status: 'RESERVED',
          createdAt: new Date('2023-03-11T17:07:45.055Z'),
          updatedAt: new Date('2023-03-11T17:08:07.821Z'),
          TicketType: {
            id: 3,
            name: 'Online',
            price: 60000,
            isRemote: false,
            includesHotel: true,
            createdAt: new Date('2023-03-11T17:04:24.517Z'),
            updatedAt: new Date('2023-03-11T17:04:24.518Z'),
          },
        } as Ticket & { TicketType: TicketType };
      });

      jest.spyOn(paymentService, 'getPaymentTicketId').mockResolvedValueOnce(null);

      await expect(activitiesService.getActivities(userId)).rejects.toEqual(forbiddenError());
    });

    it('should throw not found error if has no activities', async () => {
      jest.spyOn(activityRepository, 'findManyActiviTypes').mockImplementationOnce(null);

      await expect(activitiesService.getActivities(userId)).rejects.toEqual(notFoundError());
    });
  });
});
