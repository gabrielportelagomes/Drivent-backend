import { ApplicationError } from '@/protocols';

export function timeConflictError(): ApplicationError {
  return {
    name: 'timeConflictError',
    message: 'You are already enrolled in an activity that conflicts with this activity!',
  };
}
