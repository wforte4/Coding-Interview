import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (req: Request, res: Response, error: any) => {
  // eslint-disable-next-line no-console
  console.log(error);
  res.status(500).json({ error: 'Internal Server Error' });
};
