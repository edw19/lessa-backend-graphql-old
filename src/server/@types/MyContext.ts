import { NextApiRequest, NextApiResponse } from "next";

export interface MyContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

export interface Request extends NextApiRequest {}
