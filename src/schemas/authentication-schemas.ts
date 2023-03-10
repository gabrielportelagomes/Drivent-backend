import { CodeSchema } from '@/protocols';
import { SignInParams } from '@/services';
import Joi from 'joi';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const codeSchema = Joi.object<CodeSchema>({
  code: Joi.string().required(),
});
