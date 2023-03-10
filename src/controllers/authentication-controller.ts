import userRepository from '@/repositories/user-repository';
import authenticationService, { SignInParams } from '@/services/authentication-service';
import axios from 'axios';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function githubAuth(req: Request, res: Response) {
  const { code } = req.body;

  try {
    const token = await userRepository.exchangeCodeForAccessToken(code);
    const user = await userRepository.fetchUser(token);

    const email: string = user.email;

    const result = await authenticationService.githubAuth(email);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
