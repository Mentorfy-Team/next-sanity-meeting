import { createToken, maxTokenValidityInSeconds } from '@/utils/jwt';
import { TRPCError } from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';

export type CreateJwtTokenErrorResponse = {
  error: string;
};

export type CreateJwtTokenResponse = {
  userId: string;
  apiKey: string;
  token: string;
  error?: never;
};

export type CreateJwtTokenRequest = {
  user_id: string;
  environment?: any;
  /** @deprecated */
  api_key?: string;
  [key: string]: string | string[] | undefined;
};

const createJwtToken = async (userId: string, exp?: string, call_cids?: string[] | string) => {
  const secretKey = process.env.STREAM_SECRET_KEY!;
  const apiKey = process.env.STREAM_API_KEY!;

  if (!userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: 'user_id is a mandatory query parameter.'
    });
  }

  if (!exp) {
    exp = String(maxTokenValidityInSeconds);
  }

  // by default, we support repeated query params:
  // - ?call_cids=cid:1&call_cids=cid:2
  // but, we also support other formats:
  // - comma separated ?call_cids=cid:1,cid:2
  // - json encoded ?call_cids=["cid:1","cid:2"]
  if (typeof call_cids === 'string') {
    try {
      // support `?call_cids=["cid:1","cid:2"]` query param
      call_cids = JSON.parse(call_cids);
    } catch (e) {
      // support ?call_cids=cid:1,cid:2 query param
      call_cids = (call_cids as string)
        .split(',')
        .map((cid) => cid.trim());
    }
  }

  const token = createToken(
    userId,
    apiKey,
    secretKey,
    { call_cids: call_cids ?? [] },
  );
  console.log('userId', {
    userId,
    apiKey,
    token,
  });
  return {
    userId,
    apiKey,
    token,
  };
};

export default createJwtToken;

const error = (
  res: NextApiResponse,
  message: string,
  statusCode: number = 400,
) => {
  return res.status(statusCode).json({
    error: message,
  });
};
