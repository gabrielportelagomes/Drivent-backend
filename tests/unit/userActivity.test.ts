import { forbiddenError, notFoundError } from '@/errors';
import activityRepository from '@/repositories/activity-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import activitiesService from '@/services/activity-service';
import faker from '@faker-js/faker';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('checkEnrollmentTicket', () => {
  it('should throw forbiddenError when user does not have enrollment ', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(() => undefined);

    await expect(activitiesService.checkEnrollmentTicket(userId)).rejects.toEqual(forbiddenError());
  });

  it('should throw forbiddenError when user does not have ticket ', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return {
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        cpf: faker.name.firstName(),
        birthday: faker.date.recent(),
        phone: faker.name.firstName(),
        userId: faker.datatype.number(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        Address: [
          {
            id: faker.datatype.number(),
            cep: faker.name.firstName(),
            street: faker.name.firstName(),
            city: faker.name.firstName(),
            state: faker.name.firstName(),
            number: faker.name.firstName(),
            neighborhood: faker.name.firstName(),
            addressDetail: faker.name.firstName(),
            enrollmentId: faker.datatype.number(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
          },
        ],
      };
    });

    jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce(() => undefined);

    await expect(activitiesService.checkEnrollmentTicket(userId)).rejects.toEqual(forbiddenError());
  });

  it('should throw forbiddenError when user does not have ticket paid ', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return {
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        cpf: faker.name.firstName(),
        birthday: faker.date.recent(),
        phone: faker.name.firstName(),
        userId: faker.datatype.number(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        Address: [
          {
            id: faker.datatype.number(),
            cep: faker.name.firstName(),
            street: faker.name.firstName(),
            city: faker.name.firstName(),
            state: faker.name.firstName(),
            number: faker.name.firstName(),
            neighborhood: faker.name.firstName(),
            addressDetail: faker.name.firstName(),
            enrollmentId: faker.datatype.number(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
          },
        ],
      };
    });

    jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return {
        id: faker.datatype.number(),
        ticketTypeId: faker.datatype.number(),
        enrollmentId: faker.datatype.number(),
        status: 'RESERVED',
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        TicketType: {
          id: faker.datatype.number(),
          name: faker.name.firstName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        },
      };
    });

    await expect(activitiesService.checkEnrollmentTicket(userId)).rejects.toEqual(forbiddenError());
  });

  it('should throw forbidden Error when user does have remote ticket ', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return {
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        cpf: faker.name.firstName(),
        birthday: faker.date.recent(),
        phone: faker.name.firstName(),
        userId: faker.datatype.number(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        Address: [
          {
            id: faker.datatype.number(),
            cep: faker.name.firstName(),
            street: faker.name.firstName(),
            city: faker.name.firstName(),
            state: faker.name.firstName(),
            number: faker.name.firstName(),
            neighborhood: faker.name.firstName(),
            addressDetail: faker.name.firstName(),
            enrollmentId: faker.datatype.number(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
          },
        ],
      };
    });

    jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return {
        id: faker.datatype.number(),
        ticketTypeId: faker.datatype.number(),
        enrollmentId: faker.datatype.number(),
        status: 'RESERVED',
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        TicketType: {
          id: faker.datatype.number(),
          name: faker.name.firstName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: true,
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        },
      };
    });

    await expect(activitiesService.checkEnrollmentTicket(userId)).rejects.toEqual(forbiddenError());
  });
});
