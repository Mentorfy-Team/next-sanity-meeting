import { NextApiResponse } from 'next';

import Cors from 'cors';
import { NextApiResponse } from 'next';
import { AxiomAPIRequest, withAxiom } from 'next-axiom';
import initMiddleware from '~/lib/init-middleware';

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

const handler = <TRequest, TResponse>({
  del,
  get,
  patch,
  post,
  put,
}: {
  del?: any;
  get?: any;
  patch?: any;
  post?: any;
  put?: any;
}) =>
  withAxiom(async (req: AxiomAPIRequest, res: NextApiResponse) => {
    await cors(req, res);
    if (req.method === 'GET' && get) await get(req, res);
    else if (req.method === 'POST' && post) await post(req, res);
    else if (req.method === 'PATCH' && patch) await patch(req, res);
    else if (req.method === 'PUT' && put) await put(req, res);
    else if (req.method === 'DELETE' && del) await del(req, res);
    else res.status(405).end();
  });

const get = async (req, res: NextApiResponse) => {
  res.status(200).json({ message: 'Hello world!' });
};

export default handler({ get });
