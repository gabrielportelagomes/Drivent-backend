import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import axios from 'axios';

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function exchangeCodeForAccessToken(code: string) {
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

  const body = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  const { data } = await axios.post(process.env.GITHUB_ACCESS_TOKEN_URL, body, {
    headers: {
      Content_type: 'application/json',
    },
  });

  const queryParams = new URLSearchParams(data);
  const accessToken = queryParams.get('access_token');

  return accessToken;
}

async function fetchUser(token: string) {
  const response = await axios.get(process.env.GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

const userRepository = {
  findByEmail,
  create,
  exchangeCodeForAccessToken,
  fetchUser,
};

export default userRepository;
