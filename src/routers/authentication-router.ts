import { githubAuth, singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { codeSchema, signInSchema } from '@/schemas';
import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.post('/github', validateBody(codeSchema), githubAuth);

export { authenticationRouter };
