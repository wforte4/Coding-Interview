import { Response, Request, Router } from 'express';
import { usersRouter } from './users';
import { authRouter } from './auth';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
// router.use('/images', require('./images'));

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hooray! welcome to our api!test',
  });
});

export default router;
